import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function appUrl() {
  return String(process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')).replace(/\/$/, '');
}

function initFirebase() {
  if (admin.apps.length) return admin.app();
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      if (!serviceAccount.project_id && !serviceAccount.projectId) throw new Error('Firebase service account JSON has no project id');
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      const projectId = String(process.env.FIREBASE_PROJECT_ID || '').trim();
      const clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || '').trim();
      const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
      if (!projectId || !clientEmail || !privateKey) throw new Error('Firebase Admin environment variables are incomplete');
      admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
    }
  } catch (error) {
    throw new Error(`Firebase Admin configuration error: ${error.message}`);
  }
  return admin.app();
}

function limited(req, email) {
  const key = `${req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'}:${email}`;
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.startedAt > WINDOW_MS) {
    attempts.set(key, { startedAt: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function generic(res) {
  return res.status(200).json({ ok: true, message: 'إذا كان هذا البريد مرتبطًا بحساب، فسيصل إليه رابط آمن لإعادة تعيين كلمة المرور. تحقق من البريد ومجلد Spam.' });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

async function sendMail(email, link) {
  const sender = String(process.env.SMTP_USER || 'souq.aldeir@outlook.sa').trim();
  const appPassword = String(process.env.SMTP_APP_PASSWORD || '').trim();
  if (!appPassword) throw new Error('SMTP_APP_PASSWORD is missing');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: { user: sender, pass: appPassword },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: { minVersion: 'TLSv1.2' }
  });
  const safeLink = escapeHtml(link);
  await transporter.sendMail({
    from: `سوق دير الزور <${sender}>`,
    to: email,
    subject: 'إعادة تعيين كلمة المرور - سوق دير الزور',
    text: `يمكنك تغيير كلمة المرور من خلال الرابط التالي:\n${link}\n\nإذا لم تطلب ذلك، تجاهل هذه الرسالة.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8"><h2>إعادة تعيين كلمة المرور</h2><p>اضغط على الزر التالي لتعيين كلمة مرور جديدة:</p><p><a href="${safeLink}" style="display:inline-block;background:#1565c0;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">تغيير كلمة المرور</a></p><p style="color:#666;font-size:13px">إذا لم تطلب إعادة التعيين، تجاهل هذه الرسالة.</p></div>`
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.endsWith('@souq-aldeir.local') || limited(req, email)) return generic(res);
  try {
    const baseUrl = appUrl();
    if (!baseUrl) throw new Error('APP_URL or VERCEL_URL is required');
    initFirebase();
    const link = await admin.auth().generatePasswordResetLink(email, { url: baseUrl, handleCodeInApp: false });
    await sendMail(email, link);
  } catch (error) {
    // An unknown Firebase account keeps the same neutral response; infrastructure
    // failures return a generic service error so the UI does not claim success.
    if (error.code === 'auth/user-not-found') return generic(res);
    console.error('password-reset:', error.code || error.message);
    return res.status(503).json({ ok: false, error: 'reset_service_unavailable' });
  }
  return generic(res);
}

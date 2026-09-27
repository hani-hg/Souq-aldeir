import { admin, initFirebaseAdmin } from './_lib/firebase-admin.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function envValue(name) {
  return String(process.env[name] || '').trim().replace(/^['"]|['"]$/g, '');
}

function appUrl() {
  return (envValue('APP_URL') || (envValue('VERCEL_URL') ? `https://${envValue('VERCEL_URL')}` : '')).replace(/\/$/, '');
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
  return String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

async function sendResetEmail(email, resetLink) {
  const apiKey = envValue('RESEND_API_KEY');
  if (!apiKey) throw new Error('resend_configuration_missing');
  const safeLink = escapeHtml(resetLink);
  const safeEmail = escapeHtml(email);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'سوق دير الزور <noreply@souqaldeir.com>',
      to: [email],
      subject: 'إعادة تعيين كلمة المرور - سوق دير الزور',
      text: `مرحبًا،\n\nاضغط على الرابط التالي لتعيين كلمة مرور جديدة لحسابك:\n${resetLink}\n\nإذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8;color:#172033"><h2>إعادة تعيين كلمة المرور</h2><p>مرحبًا،</p><p>تلقينا طلبًا لتعيين كلمة مرور جديدة لحسابك في سوق دير الزور.</p><p><a href="${safeLink}" style="display:inline-block;background:#1565c0;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none">تعيين كلمة مرور جديدة</a></p><p>أو انسخ الرابط التالي إلى المتصفح:</p><p dir="ltr" style="word-break:break-all">${safeLink}</p><p>إذا لم تطلب إعادة التعيين، تجاهل هذه الرسالة. هذا الرابط مخصص للبريد ${safeEmail} وينتهي وفق إعدادات Firebase.</p></div>`
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error('resend_delivery_failed');
    error.resendStatus = response.status;
    error.resendName = data?.name;
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.endsWith('@souq-aldeir.local') || limited(req, email)) return generic(res);

  try {
    const baseUrl = appUrl();
    if (!baseUrl) throw new Error('APP_URL or VERCEL_URL is required');
    initFirebaseAdmin();
    const firebaseLink = await admin.auth().generatePasswordResetLink(email, {
      url: baseUrl,
      handleCodeInApp: false
    });
    const firebaseUrl = new URL(firebaseLink);
    const oobCode = firebaseUrl.searchParams.get('oobCode');
    if (!oobCode) throw new Error('firebase_reset_link_missing_code');
    const resetUrl = new URL('/reset-password.html', `${baseUrl}/`);
    resetUrl.searchParams.set('mode', 'resetPassword');
    resetUrl.searchParams.set('oobCode', oobCode);
    await sendResetEmail(email, resetUrl.toString());
  } catch (error) {
    if (error.code === 'auth/user-not-found') return generic(res);
    console.error('password-reset:', error.resendName || error.code || error.message);
    return res.status(503).json({ ok: false, error: 'reset_service_unavailable' });
  }
  return generic(res);
}

export const config = { api: { bodyParser: { sizeLimit: '10kb' } } };

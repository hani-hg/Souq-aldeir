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

function continueUrls() {
  const urls = [
    'https://souq-aldeir.firebaseapp.com',
    appUrl(),
    appUrl().replace('://www.', '://')
  ].filter(Boolean);
  return [...new Set(urls)];
}

async function generateResetLink(email) {
  try {
    return await admin.auth().generatePasswordResetLink(email);
  } catch (firstError) {
    const retryable = ['auth/unauthorized-continue-uri', 'auth/invalid-continue-uri'];
    if (!retryable.includes(firstError.code)) throw firstError;
  }
  let lastError;
  for (const url of continueUrls()) {
    try {
      return await admin.auth().generatePasswordResetLink(email, {
        url,
        handleCodeInApp: false
      });
    } catch (error) {
      lastError = error;
      if (error.code === 'auth/unauthorized-continue-uri' || error.code === 'auth/invalid-continue-uri') continue;
      throw error;
    }
  }
  throw lastError || new Error('reset_link_failed');
}

function publicResetLink(firebaseLink, baseUrl) {
  try {
    const firebaseUrl = new URL(firebaseLink);
    const oobCode = firebaseUrl.searchParams.get('oobCode');
    if (!oobCode || !baseUrl) return firebaseLink;
    const resetUrl = new URL('/reset-password.html', `${baseUrl}/`);
    resetUrl.searchParams.set('mode', 'resetPassword');
    resetUrl.searchParams.set('oobCode', oobCode);
    return resetUrl.toString();
  } catch {
    return firebaseLink;
  }
}

function mailFrom() {
  return envValue('MAIL_FROM') || envValue('RESEND_FROM') || 'سوق دير الزور <noreply@souqaldeir.com>';
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
      from: mailFrom(),
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
    initFirebaseAdmin();
    const firebaseLink = await generateResetLink(email);
    await sendResetEmail(email, publicResetLink(firebaseLink, appUrl()));
  } catch (error) {
    if (error.code === 'auth/user-not-found') return generic(res);
    console.error('password-reset:', JSON.stringify({
      stage: error.resendName ? 'resend' : (error.message?.includes('firebase_reset_link') ? 'firebase_link' : 'firebase_admin'),
      resendStatus: error.resendStatus || undefined,
      resendName: error.resendName || undefined,
      code: error.code || undefined
    }));
    return res.status(503).json({ ok: false, error: 'reset_service_unavailable' });
  }
  return generic(res);
}

export const config = { api: { bodyParser: { sizeLimit: '10kb' } } };

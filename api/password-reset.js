import emailjs from '@emailjs/nodejs';
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

function emailJsConfig() {
  const config = {
    serviceId: envValue('EMAILJS_SERVICE_ID'),
    templateId: envValue('EMAILJS_TEMPLATE_ID'),
    publicKey: envValue('EMAILJS_PUBLIC_KEY'),
    privateKey: envValue('EMAILJS_PRIVATE_KEY')
  };
  if (Object.values(config).some(value => !value)) throw new Error('emailjs_configuration_missing');
  return config;
}

async function sendResetEmail(email, resetLink) {
  const { serviceId, templateId, publicKey, privateKey } = emailJsConfig();
  await emailjs.send(serviceId, templateId, {
    reset_link: resetLink,
    to_email: email,
    email,
    user_email: email,
    recipient: email
  }, { publicKey, privateKey });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.endsWith('@souq-aldeir.local') || limited(req, email)) return generic(res);

  try {
    const baseUrl = appUrl();
    if (!baseUrl) throw new Error('APP_URL or VERCEL_URL is required');
    initFirebaseAdmin();
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: baseUrl,
      handleCodeInApp: false
    });
    await sendResetEmail(email, resetLink);
  } catch (error) {
    if (error.code === 'auth/user-not-found') return generic(res);
    console.error('password-reset:', error.code || error.message);
    return res.status(503).json({ ok: false, error: 'reset_service_unavailable' });
  }
  return generic(res);
}

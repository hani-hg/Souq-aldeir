import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4173);
const siteUrl = String(process.env.APP_URL || `http://localhost:${port}`).replace(/\/$/, '');
const sender = process.env.SMTP_USER || 'souq.aldeir@outlook.sa';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(v => v.trim()) : [siteUrl];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '12kb' }));

function initFirebase() {
  if (admin.apps.length) return admin.app();
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(serviceAccount)) });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
      })
    });
  }
  return admin.app();
}

function limiterKey(req, email) { return `${req.ip}:${email.toLowerCase()}`; }
function isRateLimited(req, email) {
  const key = limiterKey(req, email);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now - current.startedAt > WINDOW_MS) {
    attempts.set(key, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

function genericResponse(res) {
  return res.status(200).json({ ok: true, message: 'إذا كان البريد مرتبطًا بحساب، فسيصل إليه رابط آمن لإعادة تعيين كلمة المرور. تحقق من البريد ومجلد Spam.' });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

async function sendResetEmail(email, link) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: { user: sender, pass: process.env.SMTP_APP_PASSWORD }
  });
  const safeLink = escapeHtml(link);
  await transporter.sendMail({
    from: `سوق دير الزور <${sender}>`,
    to: email,
    subject: 'إعادة تعيين كلمة المرور - سوق دير الزور',
    text: `يمكنك تغيير كلمة المرور من خلال الرابط التالي:\n${link}\n\nإذا لم تطلب ذلك، تجاهل هذه الرسالة.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8"><h2>إعادة تعيين كلمة المرور</h2><p>اضغط على الزر التالي لتعيين كلمة مرور جديدة لحسابك في سوق دير الزور:</p><p><a href="${safeLink}" style="display:inline-block;background:#1565c0;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">تغيير كلمة المرور</a></p><p style="color:#666;font-size:13px">إذا لم تطلب إعادة التعيين، يمكنك تجاهل هذه الرسالة.</p></div>`
  });
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'password-reset' }));
app.post('/api/password-reset', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!emailPattern.test(email) || email.endsWith('@souq-aldeir.local') || isRateLimited(req, email)) return genericResponse(res);
  try {
    initFirebase();
    const link = await admin.auth().generatePasswordResetLink(email, { url: siteUrl, handleCodeInApp: false });
    await sendResetEmail(email, link);
  } catch (error) {
    // Keep account existence and SMTP failures private from the public endpoint.
    console.error('password-reset:', error.code || error.message);
  }
  return genericResponse(res);
});

app.use(express.static(path.resolve(__dirname, '..')));
app.listen(port, () => console.log(`Souq-aldeir server listening on ${port}`));

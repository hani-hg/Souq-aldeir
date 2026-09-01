import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

function present(name) {
  return Boolean(String(process.env[name] || '').trim());
}

function initFirebase() {
  if (admin.apps.length) return admin.app();
  if (present('FIREBASE_SERVICE_ACCOUNT_JSON')) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    const projectId = String(process.env.FIREBASE_PROJECT_ID || '').trim();
    const clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || '').trim();
    const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
    if (!projectId || !clientEmail || !privateKey) throw new Error('incomplete_firebase_admin_variables');
    admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  }
  return admin.app();
}

function safeError(error, kind) {
  const text = String(error?.code || error?.message || 'unknown').toLowerCase();
  if (kind === 'smtp') {
    if (text.includes('auth') || text.includes('535')) return 'smtp_auth_failed';
    if (text.includes('timeout') || text.includes('connection')) return 'smtp_connection_failed';
    return 'smtp_check_failed';
  }
  if (text.includes('json')) return 'invalid_service_account_json';
  if (text.includes('private key') || text.includes('credential')) return 'invalid_firebase_credentials';
  if (text.includes('incomplete')) return 'incomplete_firebase_admin_variables';
  if (text.includes('permission')) return 'firebase_permission_denied';
  return 'firebase_connection_failed';
}

async function verifySmtp() {
  const sender = String(process.env.SMTP_USER || 'souq.aldeir@outlook.sa').trim();
  const password = String(process.env.SMTP_APP_PASSWORD || '').trim();
  if (!password) throw new Error('SMTP_APP_PASSWORD is missing');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: { user: sender, pass: password },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: { minVersion: 'TLSv1.2' }
  });
  await transporter.verify();
}

export default async function handler(_req, res) {
  const status = {
    ok: false,
    service: 'souq-aldeir-backend',
    config: { firebaseAdmin: false, smtpConnection: false, cloudinarySigning: present('CLOUDINARY_CLOUD_NAME') && present('CLOUDINARY_API_KEY') && present('CLOUDINARY_API_SECRET'), appUrl: present('APP_URL') || present('VERCEL_URL') }
  };
  try {
    initFirebase();
    await admin.auth().listUsers(1);
    status.config.firebaseAdmin = true;
  } catch (error) {
    status.firebaseError = safeError(error, 'firebase');
  }
  try {
    await verifySmtp();
    status.config.smtpConnection = true;
  } catch (error) {
    status.smtpError = safeError(error, 'smtp');
  }
  status.ok = status.config.firebaseAdmin && status.config.smtpConnection && status.config.cloudinarySigning;
  return res.status(status.ok ? 200 : 503).json(status);
}

import nodemailer from 'nodemailer';
import { admin, initFirebaseAdmin, hasIdentityToolkitConfig, envValue } from './_lib/firebase-admin.js';

function present(name) {
  return Boolean(envValue(name));
}

function missing(names) {
  return names.filter(name => !present(name));
}

function serviceAccountProjectId() {
  const raw = envValue('FIREBASE_SERVICE_ACCOUNT_JSON') || envValue('FIREBASE_SERVICE_ACCOUNT');
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    const account = typeof value === 'string' ? JSON.parse(value) : value;
    return account?.project_id || account?.projectId || null;
  } catch {
    return null;
  }
}

function safeError(error, kind) {
  const code = String(error?.code || '').toLowerCase();
  const responseCode = String(error?.responseCode || '');
  const text = [code, responseCode, error?.message, error?.response].filter(Boolean).join(' ').toLowerCase();
  if (kind === 'smtp') {
    if (code === 'eauth' || text.includes('auth') || responseCode === '535' || text.includes('535')) return 'smtp_auth_failed';
    if (code === 'enotfound' || code === 'eai_again' || text.includes('enotfound') || text.includes('dns')) return 'smtp_dns_failed';
    if (code === 'etimedout' || text.includes('timeout')) return 'smtp_timeout';
    if (code === 'econnrefused' || code === 'econnreset' || text.includes('connection')) return 'smtp_connection_failed';
    if (text.includes('tls') || text.includes('certificate')) return 'smtp_tls_failed';
    return 'smtp_check_failed';
  }
  if (text.includes('json')) return 'invalid_service_account_json';
  if (text.includes('private key') || text.includes('credential') || text.includes('invalid_grant')) return 'invalid_firebase_credentials';
  if (text.includes('incomplete')) return 'incomplete_firebase_admin_variables';
  if (text.includes('permission')) return 'firebase_permission_denied';
  if (code === 'enotfound' || code === 'eai_again' || code === 'etimedout' || text.includes('network') || text.includes('timeout')) return 'firebase_connection_failed';
  return 'firebase_connection_failed';
}

async function verifySmtp() {
  const sender = envValue('SMTP_USER');
  const password = envValue('SMTP_APP_PASSWORD');
  const port = Number(envValue('SMTP_PORT') || 587);
  const secure = envValue('SMTP_SECURE').toLowerCase() === 'true' || port === 465;
  if (!sender) throw new Error('SMTP_USER is missing');
  if (!password) throw new Error('SMTP_APP_PASSWORD is missing');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('SMTP_PORT is invalid');
  const transporter = nodemailer.createTransport({
    host: envValue('SMTP_HOST') || 'smtp-mail.outlook.com',
    port,
    secure,
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
  const firebaseJson = present('FIREBASE_SERVICE_ACCOUNT_JSON') || present('FIREBASE_SERVICE_ACCOUNT');
  const firebaseSplit = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  const cloudinaryVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const status = {
    ok: false,
    service: 'souq-aldeir-backend',
    config: {
      firebaseAdmin: false,
      firebaseTokenVerification: hasIdentityToolkitConfig(),
      smtpConnection: false,
      cloudinarySigning: cloudinaryVars.every(present),
      appUrl: present('APP_URL') || present('VERCEL_URL')
    },
    diagnostics: {
      firebaseCredentialSource: firebaseJson ? 'json' : (firebaseSplit.every(present) ? 'split' : 'missing'),
      firebaseMissing: firebaseJson ? [] : missing(firebaseSplit),
      cloudinaryMissing: missing(cloudinaryVars),
      firebaseProjectId: present('FIREBASE_PROJECT_ID') ? envValue('FIREBASE_PROJECT_ID') : serviceAccountProjectId()
    }
  };
  try {
    initFirebaseAdmin();
    await admin.auth().listUsers(1);
    status.config.firebaseAdmin = true;
  } catch (error) {
    status.firebaseError = safeError(error, 'firebase');
    status.firebaseErrorCode = String(error?.code || error?.name || 'unknown');
  }
  try {
    await verifySmtp();
    status.config.smtpConnection = true;
  } catch (error) {
    status.smtpError = safeError(error, 'smtp');
  }
  status.uploadReady = status.config.firebaseTokenVerification && status.config.cloudinarySigning;
  status.passwordResetDelivery = 'firebase-client';
  status.passwordResetReady = status.config.firebaseTokenVerification;
  status.ok = status.passwordResetReady;
  return res.status(status.ok ? 200 : 503).json(status);
}

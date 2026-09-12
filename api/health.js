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

function safeError(error) {
  const text = String(error?.code || error?.message || 'unknown').toLowerCase();
  if (text.includes('json')) return 'invalid_service_account_json';
  if (text.includes('private key') || text.includes('credential') || text.includes('pem')) return 'invalid_firebase_credentials';
  if (text.includes('project') || text.includes('project_id')) return 'firebase_project_mismatch';
  if (text.includes('permission') || text.includes('unauthorized')) return 'firebase_permission_denied';
  if (text.includes('invalid_grant') || text.includes('jwt')) return 'firebase_service_account_auth_failed';
  if (text.includes('timeout') || text.includes('network') || text.includes('econn')) return 'firebase_network_failed';
  return 'firebase_connection_failed';
}

function safeErrorDetail(error) {
  const code = String(error?.code || '').slice(0, 120);
  const message = String(error?.message || '').replace(/[\r\n]+/g, ' ').replace(/(private_key|client_email|project_id|token|secret|password)\s*[:=][^,; ]+/gi, '$1=[redacted]').slice(0, 240);
  return { code: code || 'unknown', message: message || 'unknown' };
}

export default async function handler(_req, res) {
  const firebaseJson = present('FIREBASE_SERVICE_ACCOUNT_JSON') || present('FIREBASE_SERVICE_ACCOUNT');
  const firebaseSplit = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  const cloudinaryVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const emailJsVars = ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY', 'EMAILJS_PRIVATE_KEY'];
  const status = {
    ok: false,
    service: 'souq-aldeir-backend',
    config: {
      firebaseAdmin: false,
      firebaseTokenVerification: hasIdentityToolkitConfig(),
      emailjsConfigured: emailJsVars.every(present),
      cloudinarySigning: cloudinaryVars.every(present),
      appUrl: present('APP_URL') || present('VERCEL_URL')
    },
    diagnostics: {
      firebaseCredentialSource: firebaseJson ? 'json' : (firebaseSplit.every(present) ? 'split' : 'missing'),
      firebaseMissing: firebaseJson ? [] : missing(firebaseSplit),
      cloudinaryMissing: missing(cloudinaryVars),
      emailjsMissing: missing(emailJsVars),
      firebaseProjectId: present('FIREBASE_PROJECT_ID') ? envValue('FIREBASE_PROJECT_ID') : serviceAccountProjectId()
    }
  };
  try {
    initFirebaseAdmin();
    await admin.auth().listUsers(1);
    status.config.firebaseAdmin = true;
  } catch (error) {
    status.firebaseError = safeError(error);
    status.firebaseErrorCode = String(error?.code || 'unknown');
    status.firebaseErrorDetail = safeErrorDetail(error);
  }
  status.passwordResetReady = status.config.firebaseAdmin && status.config.emailjsConfigured && status.config.appUrl;
  status.uploadReady = status.config.firebaseTokenVerification && status.config.cloudinarySigning;
  status.ok = status.uploadReady && status.passwordResetReady;
  return res.status(status.ok ? 200 : 503).json(status);
}

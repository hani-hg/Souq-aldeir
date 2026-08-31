import admin from 'firebase-admin';

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

function safeError(error) {
  const text = String(error?.code || error?.message || 'unknown').toLowerCase();
  if (text.includes('json')) return 'invalid_service_account_json';
  if (text.includes('private key') || text.includes('credential')) return 'invalid_firebase_credentials';
  if (text.includes('incomplete')) return 'incomplete_firebase_admin_variables';
  if (text.includes('permission')) return 'firebase_permission_denied';
  return 'firebase_connection_failed';
}

export default async function handler(_req, res) {
  const status = {
    ok: false,
    service: 'password-reset',
    config: {
      firebaseAdmin: false,
      smtpPassword: present('SMTP_APP_PASSWORD'),
      smtpUser: present('SMTP_USER'),
      appUrl: present('APP_URL') || present('VERCEL_URL')
    }
  };
  try {
    initFirebase();
    await admin.auth().listUsers(1);
    status.config.firebaseAdmin = true;
  } catch (error) {
    status.error = safeError(error);
  }
  status.ok = status.config.firebaseAdmin && status.config.smtpPassword;
  return res.status(status.ok ? 200 : 503).json(status);
}

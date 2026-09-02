import admin from 'firebase-admin';

function readServiceAccount() {
  const raw = String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
  } catch (error) {
    throw new Error('invalid_service_account_json');
  }
}

export function initFirebaseAdmin() {
  if (admin.apps.length) return admin.app();
  const serviceAccount = readServiceAccount();
  if (serviceAccount) {
    if (!serviceAccount.project_id && !serviceAccount.projectId) throw new Error('invalid_service_account_json');
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    return admin.app();
  }
  const projectId = String(process.env.FIREBASE_PROJECT_ID || '').trim();
  const clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || '').trim();
  const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  if (!projectId || !clientEmail || !privateKey) throw new Error('incomplete_firebase_admin_variables');
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  return admin.app();
}

export { admin };
export default admin;

function hasServiceAccountEnv() {
  return Boolean(String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT || '').trim());
}

export { hasServiceAccountEnv };

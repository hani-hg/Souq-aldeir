import admin from 'firebase-admin';

function envValue(name) {
  const value = String(process.env[name] || '').trim();
  if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
    return value.slice(1, -1).trim();
  }
  return value;
}

function readServiceAccount() {
  const raw = envValue('FIREBASE_SERVICE_ACCOUNT_JSON') || envValue('FIREBASE_SERVICE_ACCOUNT');
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
  const projectId = envValue('FIREBASE_PROJECT_ID');
  const clientEmail = envValue('FIREBASE_CLIENT_EMAIL');
  const privateKey = envValue('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n').trim();
  if (!projectId || !clientEmail || !privateKey) throw new Error('incomplete_firebase_admin_variables');
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  return admin.app();
}

export { admin };
export default admin;

function hasServiceAccountEnv() {
  return Boolean(envValue('FIREBASE_SERVICE_ACCOUNT_JSON') || envValue('FIREBASE_SERVICE_ACCOUNT'));
}

export { hasServiceAccountEnv };

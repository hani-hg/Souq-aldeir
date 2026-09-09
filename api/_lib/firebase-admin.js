import admin from 'firebase-admin';

const DEFAULT_FIREBASE_WEB_API_KEY = 'AIzaSyAlFgTzlcbaS6NKKlqyOvrxYAnKmxXLTLQ';

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

export async function verifyFirebaseIdToken(idToken) {
  try {
    initFirebaseAdmin();
    return await admin.auth().verifyIdToken(idToken);
  } catch (adminError) {
    const apiKey = String(process.env.FIREBASE_WEB_API_KEY || DEFAULT_FIREBASE_WEB_API_KEY).trim();
    if (!apiKey) throw adminError;
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });
    if (!response.ok) {
      const error = new Error('firebase_token_invalid');
      error.code = 'auth/id-token-error';
      throw error;
    }
    const result = await response.json();
    const user = result.users?.[0];
    if (!user?.localId) {
      const error = new Error('firebase_token_invalid');
      error.code = 'auth/id-token-error';
      throw error;
    }
    return { uid: user.localId, email: user.email || null, email_verified: user.emailVerified === true };
  }
}

export { admin };
export default admin;

function hasServiceAccountEnv() {
  return Boolean(String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT || '').trim());
}

function hasIdentityToolkitConfig() {
  return Boolean(String(process.env.FIREBASE_WEB_API_KEY || DEFAULT_FIREBASE_WEB_API_KEY).trim());
}

export { hasServiceAccountEnv, hasIdentityToolkitConfig };

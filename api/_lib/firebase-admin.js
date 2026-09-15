import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const DEFAULT_FIREBASE_WEB_API_KEY = 'AIzaSyAlFgTzlcbaS6NKKlqyOvrxYAnKmxXLTLQ';

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
    const account = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    if (!account || typeof account !== 'object' || !account.project_id || !account.client_email || !account.private_key) {
      throw new Error('invalid_service_account_json_missing_fields');
    }
    return account;
  } catch (error) {
    throw new Error('invalid_service_account_json');
  }
}

export function initFirebaseAdmin() {
  if (getApps().length) return getApp();
  let jsonError = null;
  try {
    const serviceAccount = readServiceAccount();
    if (serviceAccount) {
      const normalizedAccount = {
        projectId: String(serviceAccount.project_id).trim(),
        clientEmail: String(serviceAccount.client_email).trim(),
        privateKey: String(serviceAccount.private_key).replace(/\\\\n/g, '\n').trim()
      };
      if (!normalizedAccount.projectId || !normalizedAccount.clientEmail || !normalizedAccount.privateKey) {
        throw new Error('invalid_service_account_json_missing_fields');
      }
      return initializeApp({ credential: cert(normalizedAccount) });
    }
  } catch (error) {
    jsonError = error;
  }

  const projectId = envValue('FIREBASE_PROJECT_ID');
  const clientEmail = envValue('FIREBASE_CLIENT_EMAIL');
  const privateKey = envValue('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n').trim();
  if (!projectId || !clientEmail || !privateKey) throw (jsonError || new Error('incomplete_firebase_admin_variables'));
  try {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } catch (splitError) {
    splitError.cause = jsonError || undefined;
    throw splitError;
  }
}

export function firebaseAuth() {
  return getAuth(initFirebaseAdmin());
}

export function firebaseFirestore() {
  return getFirestore(initFirebaseAdmin());
}

export function firebaseMessaging() {
  return getMessaging(initFirebaseAdmin());
}

export async function verifyFirebaseIdToken(idToken) {
  try {
    return await firebaseAuth().verifyIdToken(idToken);
  } catch (adminError) {
    const apiKey = envValue('FIREBASE_WEB_API_KEY') || DEFAULT_FIREBASE_WEB_API_KEY;
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

// Compatibility facade for existing API modules; all methods use the modular SDK above.
export const admin = {
  auth: firebaseAuth,
  firestore: firebaseFirestore,
  messaging: firebaseMessaging
};

export default admin;

function hasServiceAccountEnv() {
  return Boolean(envValue('FIREBASE_SERVICE_ACCOUNT_JSON') || envValue('FIREBASE_SERVICE_ACCOUNT'));
}

function hasIdentityToolkitConfig() {
  return Boolean(envValue('FIREBASE_WEB_API_KEY') || DEFAULT_FIREBASE_WEB_API_KEY);
}

export { hasServiceAccountEnv, hasIdentityToolkitConfig, envValue };

import fs from 'node:fs';
import process from 'node:process';
import admin from 'firebase-admin';

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node scripts/set-admin-claim.mjs FIREBASE_USER_UID');
  process.exit(1);
}

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.error('Set FIREBASE_SERVICE_ACCOUNT_JSON only in your local shell; never commit it.');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(raw);
} catch {
  console.error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert({
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKey: String(serviceAccount.private_key || '').replace(/\\n/g, '\n')
}) });

await admin.auth().setCustomUserClaims(uid, { admin: true });
console.log(`Admin claim set for ${uid}. The user must sign out/in again to refresh the token.`);

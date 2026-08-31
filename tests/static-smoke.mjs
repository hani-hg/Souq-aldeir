import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const requiredFiles = [
  'index.html',
  'css/style.css',
  'js/firebase-config.js',
  'js/utils.js',
  'js/ads.js',
  'js/auth.js',
  'js/chat.js',
  'js/share.js',
  'js/admin.js',
  'js/app.js',
  'server/index.js',
  'api/password-reset.js',
  'api/health.js',
  'package.json',
  '.env.example',
  'manifest.json',
  'sw.js',
  'firestore.rules',
  'firebase.json'
];

for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
const order = ['js/firebase-config.js', 'js/utils.js', 'js/ads.js', 'js/auth.js', 'js/chat.js', 'js/share.js', 'js/admin.js', 'js/app.js'];
const positions = order.map(file => scripts.indexOf(file));
if (positions.some(position => position < 0)) throw new Error('A required script is not loaded by index.html');
if (!positions.every((position, index) => index === 0 || position > positions[index - 1])) {
  throw new Error('Application scripts are loaded in an unsafe order');
}
if (!html.includes('lang="ar"') || !html.includes('dir="rtl"')) throw new Error('Arabic RTL document metadata is missing');
if (!html.includes('serviceWorker.register')) throw new Error('PWA service worker registration is missing');
if (!html.includes('id="siteShareBtn"') || !html.includes('qrcode.min.js')) throw new Error('QR sharing UI is missing');
if (!html.includes("selectPlan(this,'3 أيام')") || !html.includes("selectPlan(this,'7 أيام')") || !html.includes("selectPlan(this,'15 يومًا')") || !html.includes("selectPlan(this,'30 يومًا')")) throw new Error('Featured duration options are incomplete');
if (html.includes('id="adDuration"')) throw new Error('Ad duration selector should be removed');

const auth = readFileSync(join(root, 'js/auth.js'), 'utf8');
if (auth.includes('SOUQ2025ADMIN') || auth.includes('secretAdminTap')) {
  throw new Error('Client-side admin escalation path is still present');
}
if (!auth.includes('id="resetEmail"') && !html.includes('id="resetEmail"')) {
  throw new Error('Email reset field is missing');
}
if (!auth.includes("window.SOUQ_PASSWORD_RESET_ENDPOINT") || !auth.includes("fetch(endpoint")) {
  throw new Error('Password reset must use the secure SMTP backend endpoint');
}
if (!auth.includes('phoneIndexRef.set(')) throw new Error('Signup phone index must use Firebase Web SDK set');
if (!auth.includes("'permission-denied':") || !auth.includes("'unavailable':")) throw new Error('Signup Firebase error mapping is incomplete');
if (!auth.includes('reauthenticateWithCredential')) {
  throw new Error('Sensitive account changes must reauthenticate the user');
}
if (!auth.includes('phoneIndex')) {
  throw new Error('Phone uniqueness index is missing');
}
if (!auth.includes('signupConfirmPass') && !html.includes('id="signupConfirmPass"')) {
  throw new Error('Signup confirm-password field is missing');
}
if (!auth.includes('togglePassword')) {
  throw new Error('Password visibility toggle helper is missing');
}
if (!auth.includes('initAuthWiring')) {
  throw new Error('Auth keyboard/hint wiring is missing');
}
const usersSetIdx = auth.indexOf("collection('users').doc(cred.user.uid).set");
const phoneIdxCreateIdx = auth.indexOf('phoneIndexRef.set');
if (usersSetIdx < 0 || phoneIdxCreateIdx < 0 || usersSetIdx > phoneIdxCreateIdx) {
  throw new Error('Signup must create the users doc before phoneIndex (anti-squatting)');
}
const ads = readFileSync(join(root, 'js/ads.js'), 'utf8');
const admin = readFileSync(join(root, 'js/admin.js'), 'utf8');
const chat = readFileSync(join(root, 'js/chat.js'), 'utf8');
if (!ads.includes('const durationDays = 20')) throw new Error('Ad duration is not fixed at 20 days');
if (!admin.includes('function deleteUserAccount')) throw new Error('Admin user deletion is missing');
if (!admin.includes("fetch(endpoint") || !admin.includes("method: 'POST'")) throw new Error('Admin reset must use SMTP backend');
if (!admin.includes('function openAdminFeatureDuration') || !admin.includes('applyAdminFeatureDuration') || !admin.includes('[3, 7, 15, 30]')) throw new Error('Admin featured duration controls are missing');
if (!chat.includes('maxlength="1000"')) throw new Error('Chat message length guard is missing');

const rules = readFileSync(join(root, 'firestore.rules'), 'utf8');
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
if (!rules.includes("allow write: if isAdmin();")) throw new Error('Admin-only settings rule is missing');
if (!rules.includes('match /phoneIndex/{phoneId}')) throw new Error('Phone index rules are missing');
if (!rules.includes('get(/databases/$(database)/documents/users/$(request.auth.uid)).data.phoneNormalized == phoneId')) {
  throw new Error('Phone index create must match the claiming user profile (anti-squatting)');
}
if (!rules.includes("hasOnly(['name', 'email', 'phone', 'phoneNormalized'])")) throw new Error('User update fields are not restricted');
if (!rules.includes('match /recoveryRequests/{requestId}')) throw new Error('Recovery request rules are missing');
if (!sw.includes("souq-aldeir-v5") || !sw.includes("/js/share.js")) throw new Error('Service worker cache version is stale');
if (!rules.includes('request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants')) throw new Error('Chat participant rule is missing');
if (!admin.includes('featuredDurationDays:days')) throw new Error('Featured duration is not persisted');
const server = readFileSync(join(root, 'server/index.js'), 'utf8');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const vercelReset = readFileSync(join(root, 'api/password-reset.js'), 'utf8');
const vercelHealth = readFileSync(join(root, 'api/health.js'), 'utf8');
if (!server.includes('generatePasswordResetLink') || !server.includes('SMTP_APP_PASSWORD')) throw new Error('Local SMTP reset server is incomplete');
if (!vercelReset.includes('generatePasswordResetLink') || !vercelReset.includes('SMTP_APP_PASSWORD') || !vercelReset.includes('export default')) throw new Error('Vercel SMTP reset function is incomplete');
if (!vercelReset.includes('status(503)') || !vercelReset.includes("auth/user-not-found")) throw new Error('Vercel reset failure handling is incomplete');
if (!vercelHealth.includes('status.ok ? 200 : 503') || !vercelHealth.includes('firebaseAdmin')) throw new Error('Vercel health function is missing');
if (server.includes('process.env.SMTP_APP_PASSWORD') && !server.includes('requireTLS: true')) throw new Error('SMTP TLS is not enforced');
if (pkg.scripts?.start !== 'node server/index.js') throw new Error('Node server start script is missing');
const firebaseConfig = JSON.parse(readFileSync(join(root, 'firebase.json'), 'utf8'));
if (firebaseConfig.firestore?.rules !== 'firestore.rules') throw new Error('Firebase rules are not wired in firebase.json');

console.log(`Static smoke checks passed (${requiredFiles.length} required files, ${scripts.length} scripts).`);

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
  'js/admin.js',
  'js/app.js',
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
const order = ['js/firebase-config.js', 'js/utils.js', 'js/ads.js', 'js/auth.js', 'js/chat.js', 'js/admin.js', 'js/app.js'];
const positions = order.map(file => scripts.indexOf(file));
if (positions.some(position => position < 0)) throw new Error('A required script is not loaded by index.html');
if (!positions.every((position, index) => index === 0 || position > positions[index - 1])) {
  throw new Error('Application scripts are loaded in an unsafe order');
}
if (!html.includes('lang="ar"') || !html.includes('dir="rtl"')) throw new Error('Arabic RTL document metadata is missing');
if (!html.includes('serviceWorker.register')) throw new Error('PWA service worker registration is missing');

const auth = readFileSync(join(root, 'js/auth.js'), 'utf8');
if (auth.includes('SOUQ2025ADMIN') || auth.includes('secretAdminTap')) {
  throw new Error('Client-side admin escalation path is still present');
}
if (!auth.includes('id="resetEmail"') && !html.includes('id="resetEmail"')) {
  throw new Error('Email reset field is missing');
}
if (!auth.includes('sendPasswordResetEmail(email)')) {
  throw new Error('Password reset must use Firebase email reset');
}
if (!auth.includes('reauthenticateWithCredential')) {
  throw new Error('Sensitive account changes must reauthenticate the user');
}
if (!auth.includes('phoneIndex')) {
  throw new Error('Phone uniqueness index is missing');
}

const rules = readFileSync(join(root, 'firestore.rules'), 'utf8');
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
if (!rules.includes("allow write: if isAdmin();")) throw new Error('Admin-only settings rule is missing');
if (!rules.includes('match /phoneIndex/{phoneId}')) throw new Error('Phone index rules are missing');
if (!rules.includes("hasOnly(['name', 'email', 'phone', 'phoneNormalized'])")) throw new Error('User update fields are not restricted');
if (!rules.includes('match /recoveryRequests/{requestId}')) throw new Error('Recovery request rules are missing');
if (!sw.includes("souq-aldeir-v3")) throw new Error('Service worker cache version was not bumped');
const firebaseConfig = JSON.parse(readFileSync(join(root, 'firebase.json'), 'utf8'));
if (firebaseConfig.firestore?.rules !== 'firestore.rules') throw new Error('Firebase rules are not wired in firebase.json');

console.log(`Static smoke checks passed (${requiredFiles.length} required files, ${scripts.length} scripts).`);

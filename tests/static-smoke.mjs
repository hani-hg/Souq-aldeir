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

const rules = readFileSync(join(root, 'firestore.rules'), 'utf8');
if (!rules.includes("allow write: if isAdmin();")) throw new Error('Admin-only settings rule is missing');
const firebaseConfig = JSON.parse(readFileSync(join(root, 'firebase.json'), 'utf8'));
if (firebaseConfig.firestore?.rules !== 'firestore.rules') throw new Error('Firebase rules are not wired in firebase.json');

console.log(`Static smoke checks passed (${requiredFiles.length} required files, ${scripts.length} scripts).`);

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
  'api/cloudinary-sign.js',
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
if (!html.includes('طلب تمييز مجاني') || html.includes('plan-price') || html.includes('إتمام الدفع')) throw new Error('Paid featured flow must be disabled');
if (html.includes('id="adVideo"') || html.includes('videoHelp')) throw new Error('Video upload UI must be removed');
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
if (!ads.includes('escapeHtml(ad.description)') || !ads.includes('safeMediaUrl(images[0])')) throw new Error('Ad detail media/text sanitization is missing');
const adCreateStart = ads.indexOf("db.collection('ads').add({");
const adCreateBlock = adCreateStart >= 0 ? ads.slice(adCreateStart, adCreateStart + 1400) : '';
if (adCreateBlock.includes('userEmail')) throw new Error('Public ad must not store user email');
if (ads.includes('upload_preset') || !ads.includes('getSignedUpload')) throw new Error('Uploads must use authenticated signed upload');
if (ads.includes('videoUrl') || ads.includes('adVideo')) throw new Error('Video support must be removed from ad logic');
if (!ads.includes("moderationStatus: 'pending'")) throw new Error('New ads must enter moderation');
if (!ads.includes('isPublicAd')) throw new Error('Public ad visibility filter is missing');
if (!admin.includes('adminSetAdModerationStatus')) throw new Error('Admin moderation controls are missing');
if (ads.includes("doc(id).update({ views:") || ads.includes('countVisitOnce();')) throw new Error('Client-side view/visit counters must not write directly');
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
if (!sw.includes("souq-aldeir-v9-manus-icon") || !sw.includes("/js/share.js") || !sw.includes("/icons/icon-192.png")) throw new Error('Service worker cache version is stale');
if (!rules.includes('request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants')) throw new Error('Chat participant rule is missing');
if (rules.includes("affectedKeys().hasOnly(['views'])")) throw new Error('Anonymous view mutation rule must be removed');
if (!rules.includes("hasAny(['userEmail', 'role', 'banned', 'views', 'videoUrl'])")) throw new Error('Ad create fields are not restricted');
if (!rules.includes("request.resource.data.moderationStatus == 'pending'")) throw new Error('Firestore must block direct ad publication');
if (!admin.includes('featuredDurationDays:days')) throw new Error('Featured duration is not persisted');
const server = readFileSync(join(root, 'server/index.js'), 'utf8');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const vercelReset = readFileSync(join(root, 'api/password-reset.js'), 'utf8');
const cloudinarySign = readFileSync(join(root, 'api/cloudinary-sign.js'), 'utf8');
const vercelHealth = readFileSync(join(root, 'api/health.js'), 'utf8');
if (!server.includes('generatePasswordResetLink') || !server.includes('SMTP_APP_PASSWORD')) throw new Error('Local SMTP reset server is incomplete');
if (!vercelReset.includes('generatePasswordResetLink') || !vercelReset.includes('SMTP_APP_PASSWORD') || !vercelReset.includes('export default') || !vercelReset.includes("from 'nodemailer'")) throw new Error('Vercel SMTP reset function is incomplete');
if (!vercelReset.includes('status(503)') || !vercelReset.includes("auth/user-not-found")) throw new Error('Vercel reset failure handling is incomplete');
if (!vercelHealth.includes('status.ok ? 200 : 503') || !vercelHealth.includes('firebaseAdmin') || !vercelHealth.includes("from 'nodemailer'")) throw new Error('Vercel health function is missing');
if (!cloudinarySign.includes('verifyIdToken') || !cloudinarySign.includes('createHash') || !cloudinarySign.includes('CLOUDINARY_API_SECRET')) throw new Error('Signed Cloudinary endpoint is incomplete');
if (server.includes('process.env.SMTP_APP_PASSWORD') && !server.includes('requireTLS: true')) throw new Error('SMTP TLS is not enforced');
if (pkg.scripts?.start !== 'node server/index.js') throw new Error('Node server start script is missing');
const firebaseConfig = JSON.parse(readFileSync(join(root, 'firebase.json'), 'utf8'));
if (firebaseConfig.firestore?.rules !== 'firestore.rules') throw new Error('Firebase rules are not wired in firebase.json');

console.log(`Static smoke checks passed (${requiredFiles.length} required files, ${scripts.length} scripts).`);

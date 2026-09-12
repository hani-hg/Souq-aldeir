import { admin, initFirebaseAdmin, verifyFirebaseIdToken } from './_lib/firebase-admin.js';

const attempts = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 20;

function limited(uid) {
  const now = Date.now();
  const item = attempts.get(uid);
  if (!item || now - item.startedAt > WINDOW_MS) {
    attempts.set(uid, { startedAt: now, count: 1 });
    return false;
  }
  item.count += 1;
  return item.count > MAX_ATTEMPTS;
}

function text(value, max) {
  return String(value || '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const bearer = String(req.headers.authorization || '');
  const idToken = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
  if (!idToken) return res.status(401).json({ error: 'Authentication required' });

  try {
    const actor = await verifyFirebaseIdToken(idToken);
    if (limited(actor.uid)) return res.status(429).json({ error: 'Too many notifications' });
    const targetUserId = text(req.body?.targetUserId, 128);
    const kind = text(req.body?.kind, 32);
    const title = text(req.body?.title, 120) || 'إشعار جديد - سوق دير الزور';
    const body = text(req.body?.body, 240);
    const link = text(req.body?.link, 500) || '/';
    if (!targetUserId || !body) return res.status(400).json({ error: 'Missing notification fields' });

    initFirebaseAdmin();
    const firestore = admin.firestore();
    if (kind === 'chat') {
      const chatId = text(req.body?.chatId, 256);
      const chat = await firestore.collection('chats').doc(chatId).get();
      if (!chat.exists || !(chat.data().participants || []).includes(actor.uid) || !(chat.data().participants || []).includes(targetUserId)) {
        return res.status(403).json({ error: 'Not a chat participant' });
      }
    } else if (actor.admin !== true) {
      const tokenUser = await admin.auth().getUser(actor.uid);
      if (tokenUser.customClaims?.admin !== true) return res.status(403).json({ error: 'Admin claim required' });
    }

    const user = await firestore.collection('users').doc(targetUserId).get();
    const tokens = Array.isArray(user.data()?.fcmTokens) ? user.data().fcmTokens.filter(t => typeof t === 'string' && t.length > 20).slice(0, 500) : [];
    if (!tokens.length) return res.status(200).json({ ok: true, sent: 0 });
    const result = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      webpush: { fcmOptions: { link }, notification: { icon: '/icons/icon-192.png' } },
      data: { kind, link }
    });
    return res.status(200).json({ ok: true, sent: result.successCount, failed: result.failureCount });
  } catch (error) {
    console.error('send-notification:', error?.code || error?.message || error);
    return res.status(503).json({ ok: false, error: 'notification_service_unavailable' });
  }
}

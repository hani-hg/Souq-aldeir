import { firebaseFirestore, verifyFirebaseIdToken } from './_lib/firebase-admin.js';

const DAY_MS = 86400000;
const RENEWAL_WINDOW_MS = 2 * DAY_MS;
const RENEWAL_DAYS = 20;

function text(value, max) {
  return String(value || '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const bearer = String(req.headers.authorization || '');
  if (!bearer.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  const adId = text(req.body?.adId, 128);
  if (!adId) return res.status(400).json({ error: 'Missing adId' });

  try {
    const actor = await verifyFirebaseIdToken(bearer.slice(7));
    const firestore = firebaseFirestore();
    const ref = firestore.collection('ads').doc(adId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'ad_not_found' });
    const ad = snap.data() || {};
    if (ad.userId !== actor.uid) return res.status(403).json({ error: 'Not the ad owner' });

    const expiresMs = ad.expiresAt?.toMillis?.() || (Number(ad.expiresAt?.seconds || 0) * 1000);
    const remaining = expiresMs - Date.now();
    if (!expiresMs || remaining <= 0 || remaining > RENEWAL_WINDOW_MS) {
      return res.status(400).json({ error: 'renewal_available_only_in_last_two_days' });
    }

    const nextExpiry = new Date(expiresMs + RENEWAL_DAYS * DAY_MS);
    await ref.update({
      expiresAt: nextExpiry,
      durationDays: RENEWAL_DAYS,
      renewedAt: new Date()
    });
    return res.status(200).json({ ok: true, expiresAt: nextExpiry.toDate().toISOString() });
  } catch (error) {
    console.error('renew-ad:', error?.code || error?.message || error);
    const status = error?.code === 'auth/id-token-error' || error?.code === 'auth/argument-error' ? 401 : 503;
    return res.status(status).json({ error: status === 401 ? 'Invalid authentication' : 'renewal_service_unavailable' });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '10kb' } } };

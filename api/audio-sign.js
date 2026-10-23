import crypto from 'node:crypto';
import { verifyFirebaseIdToken, initFirebaseAdmin, admin } from './_lib/firebase-admin.js';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['audio/mpeg']);

function fail(res, status, error) {
  return res.status(status).json({ error });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed');
  const authHeader = String(req.headers.authorization || '');
  if (!authHeader.startsWith('Bearer ')) return fail(res, 401, 'Authentication required');

  try {
    const decoded = await verifyFirebaseIdToken(authHeader.slice(7));
    initFirebaseAdmin();
    const user = await admin.auth().getUser(decoded.uid);
    if (user.customClaims?.admin !== true) return fail(res, 403, 'Admin access required');

    const fileName = String(req.body?.fileName || '').trim().slice(0, 160);
    const contentType = String(req.body?.contentType || '').trim().toLowerCase();
    const bytes = Number(req.body?.bytes || 0);
    if (!fileName || !/\.mp3$/i.test(fileName)) return fail(res, 400, 'Only MP3 files are allowed');
    if (!ALLOWED_TYPES.has(contentType)) return fail(res, 400, 'Invalid audio type');
    if (!Number.isInteger(bytes) || bytes < 1 || bytes > MAX_BYTES) return fail(res, 400, 'Audio file exceeds 2 MB limit');

    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = String(process.env.CLOUDINARY_API_KEY || '').trim();
    const apiSecret = String(process.env.CLOUDINARY_API_SECRET || '').trim();
    if (!cloudName || !apiKey || !apiSecret) return fail(res, 503, 'Audio storage is unavailable');

    const folder = 'souq_audio';
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash('sha1')
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
    return res.status(200).json({ cloudName, apiKey, timestamp, folder, signature, resourceType: 'video' });
  } catch (error) {
    console.error('audio-sign:', error.code || error.message);
    return fail(res, error.code === 'auth/argument-error' || error.code === 'auth/id-token-error' ? 401 : 503, 'Audio upload unavailable');
  }
}

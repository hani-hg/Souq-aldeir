import crypto from 'node:crypto';
import { verifyFirebaseIdToken, initFirebaseAdmin, admin } from './_lib/firebase-admin.js';

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

    const publicId = String(req.body?.publicId || '').trim();
    if (!/^souq_audio\/[^/\\]{1,140}$/.test(publicId)) return fail(res, 400, 'Invalid audio asset');

    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = String(process.env.CLOUDINARY_API_KEY || '').trim();
    const apiSecret = String(process.env.CLOUDINARY_API_SECRET || '').trim();
    if (!cloudName || !apiKey || !apiSecret) return fail(res, 503, 'Audio storage is unavailable');

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');
    const body = new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), api_key: apiKey, signature });
    const cloudinary = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/video/destroy`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body
    });
    const result = await cloudinary.json().catch(() => ({}));
    if (!cloudinary.ok || !['ok', 'not found'].includes(result.result)) {
      console.error('audio-delete cloudinary:', result.result || cloudinary.status);
      return fail(res, 502, 'Audio deletion failed');
    }
    return res.status(200).json({ ok: true, result: result.result });
  } catch (error) {
    console.error('audio-delete:', error.code || error.message);
    return fail(res, error.code === 'auth/argument-error' || error.code === 'auth/id-token-error' ? 401 : 503, 'Audio deletion unavailable');
  }
}

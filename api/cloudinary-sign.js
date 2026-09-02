import crypto from 'node:crypto';
import { admin, initFirebaseAdmin } from './_lib/firebase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const authHeader = String(req.headers.authorization || '');
  if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = String(process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = String(process.env.CLOUDINARY_API_SECRET || '').trim();
  if (!cloudName || !apiKey || !apiSecret) return res.status(503).json({ error: 'upload_service_unavailable' });
  try {
    initFirebaseAdmin();
    await admin.auth().verifyIdToken(authHeader.slice(7));
    if (req.body?.resourceType && req.body.resourceType !== 'image') return res.status(400).json({ error: 'video_uploads_disabled' });
    const resourceType = 'image';
    const folder = 'souq_ads';
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex');
    return res.status(200).json({ cloudName, apiKey, timestamp, folder, signature, resourceType });
  } catch (error) {
    console.error('cloudinary-sign:', error.code || error.message);
    return res.status(error.code === 'auth/argument-error' || error.code === 'auth/id-token-error' ? 401 : 503).json({ error: 'upload_service_unavailable' });
  }
}

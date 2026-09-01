import crypto from 'node:crypto';
import admin from 'firebase-admin';

function initFirebase() {
  if (admin.apps.length) return admin.app();
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) });
  } else {
    const projectId = String(process.env.FIREBASE_PROJECT_ID || '').trim();
    const clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || '').trim();
    const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
    if (!projectId || !clientEmail || !privateKey) throw new Error('Firebase Admin configuration is incomplete');
    admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  }
  return admin.app();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const authHeader = String(req.headers.authorization || '');
  if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const apiKey = String(process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = String(process.env.CLOUDINARY_API_SECRET || '').trim();
  if (!cloudName || !apiKey || !apiSecret) return res.status(503).json({ error: 'upload_service_unavailable' });
  try {
    initFirebase();
    await admin.auth().verifyIdToken(authHeader.slice(7));
    const resourceType = req.body?.resourceType === 'video' ? 'video' : 'image';
    const folder = resourceType === 'video' ? 'souq_ads_video' : 'souq_ads';
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex');
    return res.status(200).json({ cloudName, apiKey, timestamp, folder, signature, resourceType });
  } catch (error) {
    console.error('cloudinary-sign:', error.code || error.message);
    return res.status(error.code === 'auth/argument-error' || error.code === 'auth/id-token-error' ? 401 : 503).json({ error: 'upload_service_unavailable' });
  }
}

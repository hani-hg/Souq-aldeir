import crypto from 'node:crypto';
import { firebaseFirestore } from './_lib/firebase-admin.js';

const MAX_ADS_PER_RUN = 50;

function envValue(name) {
  const value = String(process.env[name] || '').trim();
  return value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    ? value.slice(1, -1).trim() : value;
}

function authorized(req) {
  const secret = envValue('CRON_SECRET');
  const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  return Boolean(secret && supplied && supplied.length === secret.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(secret)));
}

function publicIdFromUrl(value) {
  try {
    const url = new URL(String(value || ''));
    const marker = '/upload/';
    const index = url.pathname.indexOf(marker);
    if (index < 0) return '';
    let path = url.pathname.slice(index + marker.length).replace(/^v\d+\//, '');
    path = decodeURIComponent(path).replace(/\.[a-z0-9]+$/i, '');
    return path;
  } catch (_) {
    return '';
  }
}

function assetsForAd(ad) {
  const assets = Array.isArray(ad.imageAssets) ? ad.imageAssets : [];
  const result = assets
    .map(asset => ({
      publicId: String(asset?.publicId || asset?.public_id || '').trim(),
      resourceType: String(asset?.resourceType || 'image').trim() || 'image',
      type: String(asset?.type || 'upload').trim() || 'upload'
    }))
    .filter(asset => asset.publicId && asset.resourceType === 'image');
  if (result.length) return result;
  const urls = Array.isArray(ad.images) ? ad.images : (ad.imageUrl ? [ad.imageUrl] : []);
  return urls.map(url => ({ publicId: publicIdFromUrl(url), resourceType: 'image', type: 'upload' })).filter(asset => asset.publicId);
}

async function deleteCloudinaryAsset(asset) {
  const cloudName = envValue('CLOUDINARY_CLOUD_NAME');
  const apiKey = envValue('CLOUDINARY_API_KEY');
  const apiSecret = envValue('CLOUDINARY_API_SECRET');
  if (!cloudName || !apiKey || !apiSecret) throw new Error('cloudinary_delete_config_missing');
  const timestamp = Math.floor(Date.now() / 1000);
  const invalidate = 'true';
  const signature = crypto.createHash('sha1')
    .update(`invalidate=${invalidate}&public_id=${asset.publicId}&timestamp=${timestamp}&type=${asset.type}${apiSecret}`)
    .digest('hex');
  const form = new URLSearchParams({
    public_id: asset.publicId,
    timestamp: String(timestamp),
    type: asset.type,
    invalidate,
    api_key: apiKey,
    signature
  });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${asset.resourceType}/destroy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !['ok', 'not found'].includes(String(data.result || '').toLowerCase())) {
    throw new Error(`cloudinary_delete_failed:${data.error?.message || data.result || response.status}`);
  }
  return data.result || 'ok';
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const firestore = firebaseFirestore();
    const now = new Date();
    const snapshot = await firestore.collection('ads')
      .where('expiresAt', '<=', now)
      .limit(MAX_ADS_PER_RUN)
      .get();
    const results = [];
    for (const doc of snapshot.docs) {
      const ad = doc.data() || {};
      if (ad.mediaDeletedAt) {
        results.push({ id: doc.id, status: 'already_cleaned' });
        continue;
      }
      const assets = assetsForAd(ad);
      const failed = [];
      for (const asset of assets) {
        try { await deleteCloudinaryAsset(asset); }
        catch (error) { failed.push({ ...asset, error: error.message }); }
      }
      const deletedIds = assets.filter(asset => !failed.some(item => item.publicId === asset.publicId)).map(asset => asset.publicId);
      const remainingAssets = failed.map(({ error, ...asset }) => asset);
      const update = {
        imageAssets: remainingAssets,
        images: [],
        imageUrl: null,
        mediaCleanupAttemptedAt: now
      };
      if (!failed.length) update.mediaDeletedAt = now;
      else update.mediaCleanupError = failed.map(item => item.error).join('; ').slice(0, 500);
      await doc.ref.update(update);
      results.push({ id: doc.id, status: failed.length ? 'partial_failure' : 'cleaned', deleted: deletedIds.length, failed: failed.length });
    }
    return res.status(200).json({ ok: true, scanned: snapshot.size, results });
  } catch (error) {
    console.error('cleanup-expired:', error?.message || error);
    return res.status(503).json({ ok: false, error: 'cleanup_service_unavailable' });
  }
}

export const config = { api: { bodyParser: false } };

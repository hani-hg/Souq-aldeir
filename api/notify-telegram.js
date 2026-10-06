import { firebaseFirestore, verifyFirebaseIdToken } from './_lib/firebase-admin.js';

const APP_URL = String(process.env.APP_URL || process.env.VERCEL_URL || 'https://www.souqaldeir.com')
  .trim()
  .replace(/\/$/, '')
  .replace(/^https?:\/\/(?!https?:\/\/)/, (value) => value);

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

function getBearer(req) {
  const value = String(req.headers.authorization || '');
  return value.startsWith('Bearer ') ? value.slice(7).trim() : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const botToken = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = String(process.env.TELEGRAM_CHAT_ID || '').trim();
  if (!botToken || !chatId) {
    // Telegram is an optional operational notification; never block ad creation.
    return res.status(200).json({ ok: true, configured: false, sent: false });
  }

  const idToken = getBearer(req);
  const adId = clean(req.body?.adId, 128);
  if (!idToken || !adId) return res.status(400).json({ error: 'Missing authentication or ad id' });

  try {
    const actor = await verifyFirebaseIdToken(idToken);
    const snap = await firebaseFirestore().collection('ads').doc(adId).get();
    if (!snap.exists) return res.status(404).json({ error: 'Ad not found' });

    const ad = snap.data() || {};
    if (ad.userId !== actor.uid) return res.status(403).json({ error: 'Not the ad owner' });

    const title = clean(ad.title, 180) || 'بدون عنوان';
    const user = clean(ad.userName, 120) || clean(actor.email, 120) || 'مستخدم';
    const url = `${APP_URL}/?ad=${encodeURIComponent(adId)}`;
    const text = `إعلان جديد في سوق دير الزور\nالعنوان: ${title}\nالناشر: ${user}\nالحالة: قيد المراجعة\nالرابط: ${url}`;
    const telegramResponse = await fetch(`https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false })
    });
    const telegramData = await telegramResponse.json().catch(() => ({}));
    if (!telegramResponse.ok || telegramData.ok !== true) {
      console.error('telegram notification failed:', telegramData.description || telegramResponse.status);
      return res.status(502).json({ ok: false, error: 'telegram_delivery_failed' });
    }
    return res.status(200).json({ ok: true, configured: true, sent: true });
  } catch (error) {
    console.error('notify-telegram:', error?.code || error?.message || error);
    return res.status(503).json({ ok: false, error: 'telegram_notification_unavailable' });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '10kb' } } };

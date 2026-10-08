/* ============================================================
   utils.js
   Small stateless helper functions shared across modules.
   ============================================================ */

function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'الآن';
  if (s < 3600) return Math.floor(s / 60) + ' د';
  if (s < 86400) return Math.floor(s / 3600) + ' س';
  return Math.floor(s / 86400) + ' يوم';
}

/* Formats an ad's price with the right currency symbol.
   Ads created before the currency field existed default to USD. */
function formatPrice(ad) {
  if (!ad.price) return 'مجاني';
  const amount = Number(ad.price).toLocaleString();
  return ad.currency === 'SYP' ? amount + ' ل.س' : amount + ' $';
}




function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

// Only render media from HTTPS origins. This prevents javascript:/data: URLs
// from becoming executable markup when legacy or malicious records are read.
function safeMediaUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    return url.protocol === 'https:' ? url.href : '';
  } catch (_) {
    return '';
  }
}

// Serve responsive, modern Cloudinary variants without changing the stored
// original URL/public ID used by cleanup and renewal.
function optimizedMediaUrl(value, width = 800, height = 0) {
  const safe = safeMediaUrl(value);
  if (!safe) return '';
  try {
    const url = new URL(safe);
    if (!url.hostname.endsWith('res.cloudinary.com') || !url.pathname.includes('/image/upload/')) return safe;
    const transform = height
      ? `f_auto,q_auto:good,w_${Math.round(width)},h_${Math.round(height)},c_fill,g_auto`
      : `f_auto,q_auto:good,w_${Math.round(width)},c_limit`;
    return safe.replace('/image/upload/', `/image/upload/${transform}/`);
  } catch (_) { return safe; }
}

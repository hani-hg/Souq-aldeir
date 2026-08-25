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




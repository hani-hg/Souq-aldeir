export function formatPrice(price, currency) {
  if (currency === 'SYP') {
    return `${Number(price).toLocaleString('ar-SY')} ل.س`;
  }
  return `$${Number(price).toLocaleString('en-US')}`;
}

export function timeAgo(ts) {
  if (!ts || ts > Date.now()) return 'حديثاً';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يوم`;
  const months = Math.floor(days / 30);
  if (months < 12) return `منذ ${months} شهر`;
  return `منذ ${Math.floor(months / 12)} سنة`;
}

export function daysLeft(expiresAt) {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 86400000));
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function validatePhone(p) {
  return /^[0-9+]{8,15}$/.test(String(p || '').trim());
}

export function compressImage(file, maxDim = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      const ratio = Math.min(1, maxDim / Math.max(width, height));
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('تعذر ضغط الصورة'));
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp') || 'image.webp', { type: 'image/webp' }));
        },
        'image/webp',
        quality
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

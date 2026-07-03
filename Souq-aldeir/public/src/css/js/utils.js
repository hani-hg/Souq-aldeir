/* ============================================================
   UTILS
   دوال مساعدة عامة تُستخدم في أكثر من صفحة
============================================================ */

/** يحسب منذ متى تم النشر (مثال: "5 د") */
function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'الآن';
  if (s < 3600) return Math.floor(s / 60) + ' د';
  if (s < 86400) return Math.floor(s / 3600) + ' س';
  return Math.floor(s / 86400) + ' يوم';
}

/** يرفع صورة إلى Cloudinary ويرجع رابطها */
async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
  fd.append('folder', 'souq_ads');
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: fd }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error('فشل رفع الصورة');
  return data.secure_url;
}

/** قائمة الفئات المستخدمة في كل الموقع */
const CATEGORIES = [
  { n: 'الكل', i: 'fa-th-large' },
  { n: 'سيارات', i: 'fa-car' },
  { n: 'عقارات', i: 'fa-home' },
  { n: 'إلكترونيات', i: 'fa-mobile-alt' },
  { n: 'ملابس', i: 'fa-tshirt' },
  { n: 'أثاث', i: 'fa-couch' },
  { n: 'وظائف', i: 'fa-briefcase' },
  { n: 'خدمات', i: 'fa-tools' },
  { n: 'حيوانات', i: 'fa-paw' },
  { n: 'رياضة', i: 'fa-futbol' },
  { n: 'طعام', i: 'fa-utensils' },
  { n: 'أخرى', i: 'fa-box' }
];

/** ملء عنصر select بالفئات */
function fillCategorySelect(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;
  const opts = CATEGORIES.filter(c => c.n !== 'الكل')
    .map(c => `<option value="${c.n}">${c.n}</option>`).join('');
  el.innerHTML = '<option value="">اختر الفئة...</option>' + opts;
}

/** ترجمة رموز أخطاء Firebase لرسائل عربية مفهومة */
function translateAuthError(code) {
  const m = {
    'auth/user-not-found': 'الحساب غير موجود',
    'auth/wrong-password': 'كلمة المرور خاطئة',
    'auth/invalid-email': 'بيانات غير صحيحة',
    'auth/invalid-credential': 'البيانات غير صحيحة',
    'auth/email-already-in-use': 'هذا الهاتف أو البريد مسجل مسبقاً',
    'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل)',
    'auth/too-many-requests': 'محاولات كثيرة، انتظر قليلاً'
  };
  return m[code] || 'حدث خطأ، حاول مجدداً';
}

/** تنسيق السعر */
function formatPrice(price) {
  return price ? Number(price).toLocaleString() + ' $' : 'مجاني';
}

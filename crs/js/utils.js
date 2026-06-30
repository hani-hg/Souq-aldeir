// src/js/utils.js
import { db } from './firebase.js';

// ===== دوال مساعدة =====
export function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.className = 'toast', 3000);
}

export function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'الآن';
  if (s < 3600) return Math.floor(s / 60) + ' د';
  if (s < 86400) return Math.floor(s / 3600) + ' س';
  return Math.floor(s / 86400) + ' يوم';
}

export const CLOUDINARY_CLOUD = 'dzjy5tubx';
export const CLOUDINARY_PRESET = 'souq_ads';
export const WHATSAPP_NUMBER = '963XXXXXXXXX';

// ===== دوال المودال =====
export function openModal(id) {
  document.getElementById(id).classList.add('active');
}
export function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// ===== إعداد المودالات (مستمعات) =====
export function initModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        m.classList.remove('active');
        if (window.chatUnsub && m.id === 'msgModal') {
          window.chatUnsub();
          window.chatUnsub = null;
        }
      }
    });
  });
  document.querySelectorAll('.x-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
        if (window.chatUnsub && modal.id === 'msgModal') {
          window.chatUnsub();
          window.chatUnsub = null;
        }
      }
    });
  });
}

// ===== دوال التنقل السفلي =====
export function setBnav(k) {
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('bnav-' + k);
  if (el) el.classList.add('active');
}

// ===== الفئات =====
export const CATS = [
  { n: 'الكل', i: 'fa-th-large' }, { n: 'سيارات', i: 'fa-car' }, { n: 'عقارات', i: 'fa-home' },
  { n: 'إلكترونيات', i: 'fa-mobile-alt' }, { n: 'ملابس', i: 'fa-tshirt' }, { n: 'أثاث', i: 'fa-couch' },
  { n: 'وظائف', i: 'fa-briefcase' }, { n: 'خدمات', i: 'fa-tools' }, { n: 'حيوانات', i: 'fa-paw' },
  { n: 'رياضة', i: 'fa-futbol' }, { n: 'طعام', i: 'fa-utensils' }, { n: 'أخرى', i: 'fa-box' }
];

export function renderCats(activeCat) {
  const el = document.getElementById('catsScroll');
  if (!el) return;
  el.innerHTML = CATS.map(c => `
    <div class="cat-chip ${(activeCat === c.n) || (activeCat === null && c.n === 'الكل') ? 'active' : ''}"
         onclick="window.filterCat('${c.n}')">
      <i class="fa ${c.i}"></i><span>${c.n}</span>
    </div>`).join('');
  const opts = CATS.filter(c => c.n !== 'الكل').map(c => `<option value="${c.n}">${c.n}</option>`).join('');
  ['adCat', 'editCat'].forEach(id => {
    const el2 = document.getElementById(id);
    if (el2) el2.innerHTML = '<option value="">اختر الفئة...</option>' + opts;
  });
}

export function filterCat(n, applyFilterFn) {
  const activeCat = n === 'الكل' ? null : n;
  renderCats(activeCat);
  if (applyFilterFn) applyFilterFn();
  return activeCat;
}

// ===== تحميل الأخبار =====
export function loadNews() {
  db.collection('settings').doc('news').get().then(doc => {
    let items = ['مرحباً بكم في سوق دير الزور المفتوح 🛒', 'أول سوق إلكتروني في دير الزور', 'النشر مجاني للجميع', 'للإعلانات المميزة تواصل مع الإدارة'];
    if (doc.exists && doc.data().items) items = doc.data().items;
    const ticker = document.getElementById('newsTicker');
    if (ticker) ticker.innerHTML = items.map(i => `<span>📌 ${i}</span>`).join('');
  }).catch(() => {
    const ticker = document.getElementById('newsTicker');
    if (ticker) ticker.innerHTML = '<span>📌 مرحباً بكم في سوق دير الزور المفتوح 🛒</span><span>📌 النشر مجاني للجميع</span>';
  });
}

// جعل بعض الدوال عامة للاستخدام في onclick
window.openModal = openModal;
window.closeModal = closeModal;
window.setBnav = setBnav;
window.filterCat = (n) => { window.filterCatExternal(n); }; // سيتم ربطها في app.js
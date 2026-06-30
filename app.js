// src/js/app.js
import { auth, db } from './firebase.js';
import { showToast, openModal, closeModal, initModals, setBnav, renderCats, loadNews, CATS } from '../components/modal.js'; // modal.js يعيد تصديرها
import { buildSlider, goSlide, slideMove, startSlider, stopSlider } from '../components/slider.js';
import { getCurrentUser, getIsAdmin, onAuthStateChanged, updateUserBtn, checkAdminNotifs } from './auth.js';
import { loadAds, applyFilter, toggleFav, showFavorites, openDetail, doAddAd, doEditAd, confirmDelete, populateFeaturedSelect, openFeaturedModal, selectPlan, requestFeatured, loadFavorites, getAds } from './ads.js';
import { openMessages, startChat, openChat, sendMsg } from './chat.js';
import { openAdminPanel, approveFeature, rejectFeature, adminDeleteAd, adminToggleFeatured, saveNews } from './admin.js';

// ربط الدوال العامة للنافذة
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.setBnav = setBnav;
window.buildSlider = buildSlider;
window.goSlide = goSlide;
window.slideMove = slideMove;
window.startSlider = startSlider;
window.stopSlider = stopSlider;
window.getCurrentUser = getCurrentUser;
window.getIsAdmin = getIsAdmin;
window.updateUserBtn = updateUserBtn;
window.checkAdminNotifs = checkAdminNotifs;
window.loadAds = loadAds;
window.applyFilter = applyFilter;
window.toggleFav = toggleFav;
window.showFavorites = showFavorites;
window.openDetail = openDetail;
window.doAddAd = doAddAd;
window.doEditAd = doEditAd;
window.confirmDelete = confirmDelete;
window.populateFeaturedSelect = populateFeaturedSelect;
window.openFeaturedModal = openFeaturedModal;
window.selectPlan = selectPlan;
window.requestFeatured = requestFeatured;
window.openMessages = openMessages;
window.startChat = startChat;
window.openChat = openChat;
window.sendMsg = sendMsg;
window.openAdminPanel = openAdminPanel;
window.approveFeature = approveFeature;
window.rejectFeature = rejectFeature;
window.adminDeleteAd = adminDeleteAd;
window.adminToggleFeatured = adminToggleFeatured;
window.saveNews = saveNews;

// متغيرات عامة
window.allAds = [];
window.favorites = new Set();
window.activeCat = null;
window.selectedPlan = '3 أيام - 1$';
window.slideIdx = 0;
window.featuredAds = [];
window.chatUnsub = null;

// تحميل المفضلة
loadFavorites();

// ===== لوحة التحكم (Dashboard) =====
export async function openDashboard() {
  const currentUser = getCurrentUser();
  if (!currentUser) { openModal('authModal'); return; }
  const content = document.getElementById('dashContent');
  if (!content) return;
  content.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('dashModal');
  const myAds = getAds().filter(a => a.userId === currentUser.uid);
  let userDoc = { name: currentUser.displayName || 'مستخدم', phone: '', email: '' };
  try {
    const doc = await db.collection('users').doc(currentUser.uid).get();
    if (doc.exists) userDoc = { ...userDoc, ...doc.data() };
  } catch (e) {}
  content.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="width:52px;height:52px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.4em;font-weight:800">${(userDoc.name || 'U').charAt(0).toUpperCase()}</div>
      <div>
        <div style="font-weight:800;font-size:1.05em">${userDoc.name}</div>
        <div style="font-size:.78em;color:var(--gray)">${userDoc.phone || ''}</div>
        <div style="font-size:.75em;color:var(--gray)">${userDoc.email || currentUser.email || ''}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="dash-card" style="text-align:center"><div class="dash-stat">${myAds.length}</div><div style="font-size:.72em;color:var(--gray)">إعلاناتي</div></div>
      <div class="dash-card" style="text-align:center"><div class="dash-stat" style="color:var(--gold)">${myAds.filter(a => a.featured).length}</div><div style="font-size:.72em;color:var(--gray)">مميزة</div></div>
      <div class="dash-card" style="text-align:center"><div class="dash-stat" style="color:var(--green)">${window.favorites.size}</div><div style="font-size:.72em;color:var(--gray)">مفضلة</div></div>
    </div>
    <div class="section-label">إعلاناتي</div>
    ${myAds.length ? myAds.map(ad => `
      <div class="my-ad-row">
        <div class="my-ad-img">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
        <div class="my-ad-info">
          <div class="my-ad-title">${ad.title || ''}</div>
          <div class="my-ad-price">${ad.price ? ad.price + ' $' : 'مجاني'}</div>
          <div class="my-ad-status">${ad.featured ? '⭐ مميز · ' : ''} ${ad.area || 'دير الزور'}</div>
        </div>
        <div class="my-ad-actions">
          <button class="icon-btn edit" onclick="closeModal('dashModal');window.openEdit('${ad.id}')"><i class="fa fa-edit"></i></button>
          <button class="icon-btn del" onclick="window.confirmDelete('${ad.id}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')
    : '<div style="text-align:center;padding:20px;color:var(--gray)">لا توجد إعلانات بعد</div>'}
    <hr class="divider">
    <button class="btn btn-gold" style="margin-top:4px" onclick="openModal('featuredModal')"><i class="fa fa-star"></i> إبراز إعلان</button>
    <button class="btn btn-outline" style="margin-top:8px;border-color:var(--gray);color:var(--gray);font-size:.8em" onclick="window.makeAdmin()"><i class="fa fa-shield-alt"></i> إعداد المدير (أول مرة فقط)</button>
    <button class="btn btn-red" style="margin-top:8px" onclick="window.doLogout()"><i class="fa fa-sign-out-alt"></i> تسجيل الخروج</button>
    ${getIsAdmin() ? `<button class="btn btn-blue" style="margin-top:8px;background:#1a237e" onclick="closeModal('dashModal');openAdminPanel()"><i class="fa fa-shield-alt"></i> لوحة تحكم المدير 🛡️</button>` : ''}
    <p style="text-align:center;font-size:.7em;color:var(--border);margin-top:16px" onclick="window.secretAdminTap()">v2.0</p>
  `;
}
window.openDashboard = openDashboard;

// وظيفة منح صلاحية المدير (سرية)
let adminTapCount = 0;
window.secretAdminTap = function() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  adminTapCount++;
  if (adminTapCount >= 5) {
    adminTapCount = 0;
    if (confirm('هل أنت مطور الموقع؟ هل تريد جعل هذا الحساب مديراً؟')) {
      db.collection('users').doc(currentUser.uid).update({ role: 'admin' }).then(() => {
        window.isAdmin = true;
        document.getElementById('adminNavBtn').style.display = 'flex';
        showToast('تم منحك صلاحيات المدير ✅', 'ok');
        openDashboard();
      }).catch(() => showToast('حدث خطأ', 'bad'));
    }
  }
};

// ربط أحداث المصادقة
onAuthStateChanged((user, isAdmin) => {
  // تحديث زر المدير
  const adminBtn = document.getElementById('adminNavBtn');
  if (adminBtn) {
    adminBtn.style.display = isAdmin ? 'flex' : 'none';
  }
  updateUserBtn();
  if (isAdmin) checkAdminNotifs();
});

// ===== تهيئة الصفحة =====
document.addEventListener('DOMContentLoaded', () => {
  // تهيئة المودالات
  initModals();

  // عرض الفئات
  renderCats(null);

  // تحميل الأخبار
  loadNews();

  // تحميل الإعلانات
  loadAds();

  // أحداث البحث والفرز
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', applyFilter);
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.addEventListener('change', applyFilter);

  // زر الإضافة
  const fabBtn = document.getElementById('fabBtn');
  if (fabBtn) {
    fabBtn.onclick = function() {
      if (!getCurrentUser()) { openModal('authModal'); showToast('سجل دخولك أولاً', 'bad'); return; }
      const errEl = document.getElementById('addErr');
      if (errEl) errEl.className = 'err';
      openModal('addModal');
    };
  }

  // رفع الصورة
  const adImg = document.getElementById('adImg');
  if (adImg) {
    adImg.onchange = function() {
      const f = this.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = e => {
        const preview = document.getElementById('imgPreview');
        if (preview) preview.innerHTML = `<img src="${e.target.result}">`;
      };
      r.readAsDataURL(f);
    };
  }

  // إرسال النماذج
  const addSubmit = document.getElementById('addSubmit');
  if (addSubmit) addSubmit.onclick = doAddAd;
  const editSubmit = document.getElementById('editSubmit');
  if (editSubmit) editSubmit.onclick = doEditAd;
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) loginBtn.onclick = window.doLogin;
  const signupBtn = document.getElementById('signupBtn');
  if (signupBtn) signupBtn.onclick = window.doSignup;
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.onclick = window.doResetStep1;
  const resetBtn2 = document.getElementById('resetBtn2');
  if (resetBtn2) resetBtn2.onclick = window.doResetStep2;

  // أزرار التنقل السفلية
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    btn.onclick = function() {
      const id = this.id.replace('bnav-', '');
      setBnav(id);
      if (id === 'fav') showFavorites();
      else if (id === 'add') {
        const fab = document.getElementById('fabBtn');
        if (fab) fab.click();
      } else if (id === 'msg') openMessages();
      else if (id === 'me') openDashboard();
    };
  });

  // زر المدير
  const adminNavBtn = document.getElementById('adminNavBtn');
  if (adminNavBtn) adminNavBtn.onclick = openAdminPanel;

  // زر المستخدم
  const userNavBtn = document.getElementById('userNavBtn');
  if (userNavBtn) {
    userNavBtn.onclick = function() {
      if (getCurrentUser()) openDashboard();
      else openModal('authModal');
    };
  }

  // التحقق من بارامترات URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === 'true') {
    setTimeout(() => openAdminPanel(), 300);
  }
  if (urlParams.get('login') === 'true') {
    setTimeout(() => openModal('authModal'), 300);
  }

  // تحديث زر المدير عند التحميل
  if (getIsAdmin()) {
    const adminBtn = document.getElementById('adminNavBtn');
    if (adminBtn) adminBtn.style.display = 'flex';
  }
});
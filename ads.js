// src/js/ads.js
import { db } from './firebase.js';
import { showToast, timeAgo, openModal, closeModal, CLOUDINARY_CLOUD, CLOUDINARY_PRESET, renderCats, filterCat } from '../js/utils.js';
import { getCurrentUser, getIsAdmin } from './auth.js';

let allAds = [];
let favorites = new Set();
let activeCat = null;

export function getAds() { return allAds; }
export function getFavorites() { return favorites; }

export function loadAds() {
  const g = document.getElementById('adsGrid');
  if (!g) return;
  g.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  db.collection('ads').orderBy('createdAt', 'desc').get()
    .then(snap => {
      allAds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const fAds = allAds.filter(a => a.featured);
      if (window.buildSlider) window.buildSlider(fAds);
      applyFilter();
      populateFeaturedSelect();
    })
    .catch(() => {
      g.innerHTML = '<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>تعذر التحميل</p></div>';
    });
}

export function applyFilter() {
  const q = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
  const sort = document.getElementById('sortSelect')?.value || 'new';
  let list = [...allAds];
  if (activeCat) list = list.filter(a => a.category === activeCat);
  if (q) list = list.filter(a => (a.title || '').toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q));
  if (sort === 'price_asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === 'price_desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
  list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  renderAds(list);
}

function renderAds(list) {
  const g = document.getElementById('adsGrid');
  const count = document.getElementById('adsCount');
  if (count) count.textContent = list.length + ' إعلان';
  if (!g) return;
  if (!list.length) { g.innerHTML = '<div class="empty-state"><i class="fa fa-search"></i><p>لا توجد نتائج</p></div>'; return; }
  g.innerHTML = list.map(ad => `
    <div class="ad-card ${ad.featured ? 'featured' : ''}" onclick="window.openDetail('${ad.id}')">
      ${ad.featured ? '<div class="featured-badge">⭐ مميز</div>' : ''}
      <div style="position:relative">
        ${ad.imageUrl ? `<img class="ad-img" src="${ad.imageUrl}" alt="${ad.title || ''}" loading="lazy">` : `<div class="ad-no-img"><i class="fa fa-image"></i></div>`}
        <button class="ad-fav ${favorites.has(ad.id) ? 'liked' : ''}" onclick="event.stopPropagation();window.toggleFav('${ad.id}',this)"><i class="fa fa-heart"></i></button>
        ${ad.category ? `<span class="ad-cat-badge">${ad.category}</span>` : ''}
      </div>
      <div class="ad-body">
        <div class="ad-price">${ad.price ? Number(ad.price).toLocaleString() + ' $' : 'مجاني'}</div>
        <div class="ad-title">${ad.title || ''}</div>
        <div class="ad-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
        <div class="ad-time">${timeAgo(ad.createdAt)}</div>
      </div>
    </div>`).join('');
}

export function toggleFav(id, btn) {
  if (favorites.has(id)) { favorites.delete(id); btn.classList.remove('liked'); showToast('حذف من المفضلة'); }
  else { favorites.add(id); btn.classList.add('liked'); showToast('أضيف للمفضلة ❤️', 'ok'); }
  localStorage.setItem('souq_favs', JSON.stringify([...favorites]));
}

export function loadFavorites() {
  try { favorites = new Set(JSON.parse(localStorage.getItem('souq_favs') || '[]')); } catch (e) {}
}

export function showFavorites() {
  const favAds = allAds.filter(a => favorites.has(a.id));
  const c = document.getElementById('favContent');
  if (!c) return;
  c.innerHTML = favAds.length ? favAds.map(ad => `
    <div class="my-ad-row" onclick="closeModal('favModal');window.openDetail('${ad.id}')">
      <div class="my-ad-img">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
      <div class="my-ad-info"><div class="my-ad-title">${ad.title || ''}</div><div class="my-ad-price">${ad.price ? ad.price + ' $' : 'مجاني'}</div></div>
      <i class="fa fa-chevron-left" style="color:var(--gray);font-size:.8em"></i>
    </div>`).join('')
    : '<div class="empty-state"><i class="fa fa-heart"></i><p>لا توجد إعلانات في المفضلة</p></div>';
  openModal('favModal');
}

export function openDetail(id) {
  const ad = allAds.find(a => a.id === id);
  if (!ad) return;
  const currentUser = getCurrentUser();
  const isOwner = currentUser && currentUser.uid === ad.userId;
  const canAdmin = getIsAdmin();
  const detailContent = document.getElementById('detailContent');
  if (!detailContent) return;
  detailContent.innerHTML = `
    ${ad.imageUrl ? `<img class="detail-img" src="${ad.imageUrl}" alt="${ad.title}">` : ''}
    ${ad.featured ? '<div style="color:var(--gold);font-weight:800;margin-bottom:6px">⭐ إعلان مميز</div>' : ''}
    <span style="background:var(--blue-light);color:var(--blue);padding:3px 10px;border-radius:20px;font-size:.78em;font-weight:700">${ad.category || ''}</span>
    <h3 style="font-size:1.1em;font-weight:800;margin:10px 0 4px">${ad.title || ''}</h3>
    <div class="detail-price">${ad.price ? Number(ad.price).toLocaleString() + ' $' : 'مجاني'}</div>
    <p class="detail-desc">${(ad.description || '').replace(/\n/g, '<br>')}</p>
    <div class="info-box">
      ${ad.phone ? `<div class="info-row"><i class="fa fa-phone"></i><span>${ad.phone}</span></div>` : ''}
      <div class="info-row"><i class="fa fa-map-marker-alt"></i><span>${ad.area || 'دير الزور'}</span></div>
      <div class="info-row"><i class="fa fa-clock"></i><span>${timeAgo(ad.createdAt)}</span></div>
    </div>
    ${ad.phone ? `
      <a href="tel:${ad.phone}" class="call-btn"><i class="fa fa-phone-alt"></i> اتصل بالبائع</a>
      <a href="https://wa.me/${ad.phone.replace(/\D/g, '')}" target="_blank" class="whatsapp-btn"><i class="fa fa-comment"></i> تواصل عبر واتساب</a>` : ''}
    ${!isOwner && currentUser ? `<div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="window.startChat('${ad.id}','${ad.userId}','${(ad.title || '').replace(/'/g, '')}')"><i class="fa fa-comment-dots"></i> راسل البائع</button></div>` : ''}
    ${isOwner ? `<div class="action-btns"><button class="btn btn-blue btn-sm" onclick="closeModal('detailModal');window.openEdit('${ad.id}')"><i class="fa fa-edit"></i> تعديل</button><button class="btn btn-red btn-sm" onclick="window.confirmDelete('${ad.id}')"><i class="fa fa-trash"></i> حذف</button></div>` : ''}
    ${canAdmin && !isOwner ? `<div class="action-btns" style="margin-top:6px"><button class="btn btn-red btn-sm" onclick="window.adminDeleteAd('${ad.id}')"><i class="fa fa-trash"></i> حذف (مدير)</button><button class="btn btn-outline btn-sm" onclick="window.adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured ? 'إلغاء التمييز' : '⭐ تمييز'}</button></div>` : ''}
  `;
  openModal('detailModal');
}

export async function doAddAd() {
  const title = document.getElementById('adTitle')?.value.trim() || '';
  const desc = document.getElementById('adDesc')?.value.trim() || '';
  const price = document.getElementById('adPrice')?.value || '';
  const phone = document.getElementById('adPhone')?.value.trim() || '';
  const cat = document.getElementById('adCat')?.value || '';
  const area = document.getElementById('adArea')?.value || '';
  const errEl = document.getElementById('addErr');
  if (!errEl) return;
  if (!title || !desc || !price || !phone || !cat) { errEl.textContent = 'يرجى ملء جميع الحقول المطلوبة *'; errEl.className = 'err show'; return; }
  errEl.className = 'err';
  const btn = document.getElementById('addSubmit');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري النشر...';
  try {
    let imgUrl = null;
    const f = document.getElementById('adImg')?.files[0];
    if (f) {
      const fd = new FormData();
      fd.append('file', f);
      fd.append('upload_preset', CLOUDINARY_PRESET);
      fd.append('folder', 'souq_ads');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.secure_url) throw new Error('فشل رفع الصورة');
      imgUrl = data.secure_url;
    }
    const currentUser = getCurrentUser();
    await db.collection('ads').add({
      title, description: desc, price: parseFloat(price) || 0, phone, category: cat, area,
      imageUrl: imgUrl, featured: false,
      userId: currentUser.uid, userEmail: currentUser.email,
      userName: currentUser.displayName || 'مستخدم',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeModal('addModal');
    ['adTitle', 'adDesc', 'adPrice', 'adPhone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const catEl = document.getElementById('adCat');
    if (catEl) catEl.value = '';
    const preview = document.getElementById('imgPreview');
    if (preview) preview.innerHTML = '';
    showToast('تم نشر إعلانك بنجاح! 🎉', 'ok');
    loadAds();
  } catch (ex) {
    errEl.textContent = ex.message || 'حدث خطأ أثناء النشر';
    errEl.className = 'err show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-paper-plane"></i> نشر الإعلان';
  }
}

export function openEdit(id) {
  const ad = allAds.find(a => a.id === id);
  if (!ad) return;
  const editId = document.getElementById('editAdId');
  const titleEl = document.getElementById('editTitle');
  const descEl = document.getElementById('editDesc');
  const priceEl = document.getElementById('editPrice');
  const phoneEl = document.getElementById('editPhone');
  const catEl = document.getElementById('editCat');
  if (!editId || !titleEl || !descEl || !priceEl || !phoneEl || !catEl) return;
  editId.value = id;
  titleEl.value = ad.title || '';
  descEl.value = ad.description || '';
  priceEl.value = ad.price || '';
  phoneEl.value = ad.phone || '';
  const opts = CATS.filter(c => c.n !== 'الكل').map(c => `<option value="${c.n}">${c.n}</option>`).join('');
  catEl.innerHTML = '<option value="">اختر الفئة...</option>' + opts;
  catEl.value = ad.category || '';
  const errEl = document.getElementById('editErr');
  if (errEl) errEl.className = 'err';
  openModal('editModal');
}

export async function doEditAd() {
  const id = document.getElementById('editAdId')?.value || '';
  const title = document.getElementById('editTitle')?.value.trim() || '';
  const desc = document.getElementById('editDesc')?.value.trim() || '';
  const price = document.getElementById('editPrice')?.value || '';
  const phone = document.getElementById('editPhone')?.value.trim() || '';
  const cat = document.getElementById('editCat')?.value || '';
  const errEl = document.getElementById('editErr');
  if (!errEl) return;
  if (!title || !desc) { errEl.textContent = 'العنوان والوصف مطلوبان'; errEl.className = 'err show'; return; }
  errEl.className = 'err';
  const btn = document.getElementById('editSubmit');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    await db.collection('ads').doc(id).update({ title, description: desc, price: parseFloat(price) || 0, phone, category: cat });
    closeModal('editModal');
    showToast('تم حفظ التعديلات ✅', 'ok');
    loadAds();
  } catch (e) {
    errEl.textContent = 'حدث خطأ';
    errEl.className = 'err show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-save"></i> حفظ التعديلات';
  }
}

export function confirmDelete(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
  db.collection('ads').doc(id).delete().then(() => {
    closeModal('detailModal');
    showToast('تم حذف الإعلان', 'ok');
    loadAds();
  }).catch(() => showToast('خطأ أثناء الحذف', 'bad'));
}

export function populateFeaturedSelect() {
  const sel = document.getElementById('featuredAdSel');
  if (!sel || !getCurrentUser()) return;
  const myAds = allAds.filter(a => a.userId === getCurrentUser().uid);
  sel.innerHTML = '<option value="">-- اختر إعلانك --</option>' + myAds.map(a => `<option value="${a.id}">${a.title || 'إعلان'}</option>`).join('');
}

export function openFeaturedModal() {
  if (!getCurrentUser()) { openModal('authModal'); showToast('سجل دخولك أولاً', 'bad'); return; }
  populateFeaturedSelect();
  openModal('featuredModal');
}

export function selectPlan(el, plan) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  window.selectedPlan = plan;
}

export async function requestFeatured() {
  const adId = document.getElementById('featuredAdSel')?.value;
  if (!adId) { showToast('اختر إعلاناً أولاً', 'bad'); return; }
  const ad = allAds.find(a => a.id === adId);
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  await db.collection('featuredRequests').add({
    adId, adTitle: ad ? ad.title : '', userId: currentUser.uid,
    userEmail: currentUser.email || '', plan: window.selectedPlan || '3 أيام - 1$',
    status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(() => {});
  const msg = `طلب تمييز إعلان%0Aالإعلان: ${ad ? ad.title : ''}%0Aالخطة: ${window.selectedPlan || '3 أيام - 1$'}%0Aالبريد: ${currentUser.email || ''}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  closeModal('featuredModal');
  showToast('تم إرسال طلبك! سيتم التواصل قريباً ✅', 'ok');
}

// جعل الدوال عامة
window.loadAds = loadAds;
window.applyFilter = applyFilter;
window.toggleFav = toggleFav;
window.showFavorites = showFavorites;
window.openDetail = openDetail;
window.doAddAd = doAddAd;
window.openEdit = openEdit;
window.doEditAd = doEditAd;
window.confirmDelete = confirmDelete;
window.populateFeaturedSelect = populateFeaturedSelect;
window.openFeaturedModal = openFeaturedModal;
window.selectPlan = selectPlan;
window.requestFeatured = requestFeatured;
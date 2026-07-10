/* ============================================================
   ads.js
   Categories, home feed (load/filter/render), favorites,
   ad detail view, add/edit/delete ad, "featured ad" request flow.
   ============================================================ */

/* ============ CATEGORIES ============ */
const CATS = [
  { n: 'الكل', i: 'fa-th-large' }, { n: 'سيارات', i: 'fa-car' }, { n: 'عقارات', i: 'fa-home' },
  { n: 'إلكترونيات', i: 'fa-mobile-alt' }, { n: 'ملابس', i: 'fa-tshirt' }, { n: 'أثاث', i: 'fa-couch' },
  { n: 'وظائف', i: 'fa-briefcase' }, { n: 'خدمات', i: 'fa-tools' }, { n: 'حيوانات', i: 'fa-paw' },
  { n: 'رياضة', i: 'fa-futbol' }, { n: 'طعام', i: 'fa-utensils' }, { n: 'أخرى', i: 'fa-box' }
];

function renderCats() {
  document.getElementById('catsScroll').innerHTML = CATS.map(c => `
    <div class="cat-chip ${(activeCat === c.n) || (activeCat === null && c.n === 'الكل') ? 'active' : ''}"
         onclick="filterCat('${c.n}')">
      <i class="fa ${c.i}"></i><span>${c.n}</span>
    </div>`).join('');
  const opts = CATS.filter(c => c.n !== 'الكل').map(c => `<option value="${c.n}">${c.n}</option>`).join('');
  ['adCat', 'editCat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<option value="">اختر الفئة...</option>' + opts;
  });
}

function filterCat(n) {
  activeCat = n === 'الكل' ? null : n;
  renderCats();
  applyFilter();
}

/* ============ NEWS TICKER ============ */
function loadNews() {
  db.collection('settings').doc('news').get().then(doc => {
    let items = ['مرحباً بكم في سوق دير الزور المفتوح 🛒', 'أول سوق إلكتروني في دير الزور', 'النشر مجاني للجميع', 'للإعلانات المميزة تواصل مع الإدارة'];
    if (doc.exists && doc.data().items) items = doc.data().items;
    document.getElementById('newsTicker').innerHTML = items.map(i => `<span>📌 ${i}</span>`).join('');
  }).catch(() => {
    document.getElementById('newsTicker').innerHTML = '<span>📌 مرحباً بكم في سوق دير الزور المفتوح 🛒</span><span>📌 النشر مجاني للجميع</span>';
  });
}

/* ============ LOAD ADS ============ */
function loadAds() {
  const g = document.getElementById('adsGrid');
  g.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  db.collection('ads').orderBy('createdAt', 'desc').get()
    .then(snap => {
      allAds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const fAds = allAds.filter(a => a.featured);
      buildSlider(fAds);
      applyFilter();
      populateFeaturedSelect();
    })
    .catch(() => { g.innerHTML = '<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>تعذر التحميل</p></div>'; });
}

function applyFilter() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const sort = document.getElementById('sortSelect').value;
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
  document.getElementById('adsCount').textContent = list.length + ' إعلان';
  if (!list.length) { g.innerHTML = '<div class="empty-state"><i class="fa fa-search"></i><p>لا توجد نتائج</p></div>'; return; }
  g.innerHTML = list.map(ad => `
    <div class="ad-card ${ad.featured ? 'featured' : ''}" onclick="openDetail('${ad.id}')">
      ${ad.featured ? '<div class="featured-badge">⭐ مميز</div>' : ''}
      <div style="position:relative">
        ${ad.imageUrl ? `<img class="ad-img" src="${ad.imageUrl}" alt="${ad.title || ''}" loading="lazy">` : `<div class="ad-no-img"><i class="fa fa-image"></i></div>`}
        <button class="ad-fav ${favorites.has(ad.id) ? 'liked' : ''}" onclick="event.stopPropagation();toggleFav('${ad.id}',this)"><i class="fa fa-heart"></i></button>
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

/* ============ FAVORITES ============ */
function toggleFav(id, btn) {
  if (favorites.has(id)) { favorites.delete(id); btn.classList.remove('liked'); showToast('حذف من المفضلة'); }
  else { favorites.add(id); btn.classList.add('liked'); showToast('أضيف للمفضلة ❤️', 'ok'); }
  localStorage.setItem('souq_favs', JSON.stringify([...favorites]));
}

function loadFavorites() {
  try { favorites = new Set(JSON.parse(localStorage.getItem('souq_favs') || '[]')); } catch (e) {}
}

function showFavorites() {
  const favAds = allAds.filter(a => favorites.has(a.id));
  const c = document.getElementById('favContent');
  c.innerHTML = favAds.length ? favAds.map(ad => `
    <div class="my-ad-row" onclick="closeModal('favModal');openDetail('${ad.id}')">
      <div class="my-ad-img">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
      <div class="my-ad-info"><div class="my-ad-title">${ad.title || ''}</div><div class="my-ad-price">${ad.price ? ad.price + ' $' : 'مجاني'}</div></div>
      <i class="fa fa-chevron-left" style="color:var(--gray);font-size:.8em"></i>
    </div>`).join('')
    : '<div class="empty-state"><i class="fa fa-heart"></i><p>لا توجد إعلانات في المفضلة</p></div>';
  openModal('favModal');
}

/* ============ AD DETAIL ============ */
function openDetail(id) {
  const ad = allAds.find(a => a.id === id); if (!ad) return;
  const isOwner = currentUser && currentUser.uid === ad.userId;
  const canAdmin = isAdmin;
  document.getElementById('detailContent').innerHTML = `
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
    ${!isOwner && currentUser ? `<div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="startChat('${ad.id}','${ad.userId}','${(ad.title || '').replace(/'/g, '')}')"><i class="fa fa-comment-dots"></i> راسل البائع</button></div>` : ''}
    ${isOwner ? `<div class="action-btns"><button class="btn btn-blue btn-sm" onclick="closeModal('detailModal');openEdit('${ad.id}')"><i class="fa fa-edit"></i> تعديل</button><button class="btn btn-red btn-sm" onclick="confirmDelete('${ad.id}')"><i class="fa fa-trash"></i> حذف</button></div>` : ''}
    ${canAdmin && !isOwner ? `<div class="action-btns" style="margin-top:6px"><button class="btn btn-red btn-sm" onclick="adminDeleteAd('${ad.id}')"><i class="fa fa-trash"></i> حذف (مدير)</button><button class="btn btn-outline btn-sm" onclick="adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured ? 'إلغاء التمييز' : '⭐ تمييز'}</button></div>` : ''}
  `;
  openModal('detailModal');
}

/* ============ ADD AD ============ */
function initAddAdForm() {
  document.getElementById('fabBtn').onclick = function () {
    if (!currentUser) { openModal('authModal'); showToast('سجل دخولك أولاً', 'bad'); return; }
    document.getElementById('addErr').className = 'err';
    openModal('addModal');
  };
  document.getElementById('adImg').onchange = function () {
    const f = this.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => document.getElementById('imgPreview').innerHTML = `<img src="${e.target.result}">`;
    r.readAsDataURL(f);
  };
}

async function doAddAd() {
  const title = document.getElementById('adTitle').value.trim();
  const desc = document.getElementById('adDesc').value.trim();
  const price = document.getElementById('adPrice').value;
  const phone = document.getElementById('adPhone').value.trim();
  const cat = document.getElementById('adCat').value;
  const area = document.getElementById('adArea').value;
  const errEl = document.getElementById('addErr');
  if (!title || !desc || !price || !phone || !cat) { errEl.textContent = 'يرجى ملء جميع الحقول المطلوبة *'; errEl.className = 'err show'; return; }
  errEl.className = 'err';
  const btn = document.getElementById('addSubmit');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري النشر...';
  try {
    let imgUrl = null;
    const f = document.getElementById('adImg').files[0];
    if (f) {
      const fd = new FormData();
      fd.append('file', f); fd.append('upload_preset', CLOUDINARY_PRESET); fd.append('folder', 'souq_ads');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.secure_url) throw new Error('فشل رفع الصورة');
      imgUrl = data.secure_url;
    }
    await db.collection('ads').add({
      title, description: desc, price: parseFloat(price) || 0, phone, category: cat, area,
      imageUrl: imgUrl, featured: false,
      userId: currentUser.uid, userEmail: currentUser.email,
      userName: currentUser.displayName || 'مستخدم',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeModal('addModal');
    ['adTitle', 'adDesc', 'adPrice', 'adPhone'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('adCat').value = '';
    document.getElementById('imgPreview').innerHTML = '';
    showToast('تم نشر إعلانك بنجاح! 🎉', 'ok');
    loadAds();
  } catch (ex) {
    errEl.textContent = ex.message || 'حدث خطأ أثناء النشر';
    errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-paper-plane"></i> نشر الإعلان'; }
}

/* ============ EDIT AD ============ */
function openEdit(id) {
  const ad = allAds.find(a => a.id === id); if (!ad) return;
  document.getElementById('editAdId').value = id;
  document.getElementById('editTitle').value = ad.title || '';
  document.getElementById('editDesc').value = ad.description || '';
  document.getElementById('editPrice').value = ad.price || '';
  document.getElementById('editPhone').value = ad.phone || '';
  const opts = CATS.filter(c => c.n !== 'الكل').map(c => `<option value="${c.n}">${c.n}</option>`).join('');
  document.getElementById('editCat').innerHTML = '<option value="">اختر الفئة...</option>' + opts;
  document.getElementById('editCat').value = ad.category || '';
  document.getElementById('editErr').className = 'err';
  openModal('editModal');
}

async function doEditAd() {
  const id = document.getElementById('editAdId').value;
  const title = document.getElementById('editTitle').value.trim();
  const desc = document.getElementById('editDesc').value.trim();
  const price = document.getElementById('editPrice').value;
  const phone = document.getElementById('editPhone').value.trim();
  const cat = document.getElementById('editCat').value;
  const errEl = document.getElementById('editErr');
  if (!title || !desc) { errEl.textContent = 'العنوان والوصف مطلوبان'; errEl.className = 'err show'; return; }
  errEl.className = 'err';
  const btn = document.getElementById('editSubmit');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    await db.collection('ads').doc(id).update({ title, description: desc, price: parseFloat(price) || 0, phone, category: cat });
    closeModal('editModal'); showToast('تم حفظ التعديلات ✅', 'ok'); loadAds();
  } catch (e) { errEl.textContent = 'حدث خطأ'; errEl.className = 'err show'; }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> حفظ التعديلات'; }
}

/* ============ DELETE AD ============ */
function confirmDelete(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
  db.collection('ads').doc(id).delete().then(() => { closeModal('detailModal'); showToast('تم حذف الإعلان', 'ok'); loadAds(); })
    .catch(() => showToast('خطأ أثناء الحذف', 'bad'));
}

/* ============ FEATURED AD REQUEST (user-facing) ============ */
function openFeaturedModal() {
  if (!currentUser) { openModal('authModal'); showToast('سجل دخولك أولاً', 'bad'); return; }
  populateFeaturedSelect(); openModal('featuredModal');
}

function populateFeaturedSelect() {
  const sel = document.getElementById('featuredAdSel'); if (!sel || !currentUser) return;
  const myAds = allAds.filter(a => a.userId === currentUser.uid);
  sel.innerHTML = '<option value="">-- اختر إعلانك --</option>' + myAds.map(a => `<option value="${a.id}">${a.title || 'إعلان'}</option>`).join('');
}

function selectPlan(el, plan) {
  selectedPlan = plan;
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

async function requestFeatured() {
  const adId = document.getElementById('featuredAdSel').value;
  if (!adId) { showToast('اختر إعلاناً أولاً', 'bad'); return; }
  const ad = allAds.find(a => a.id === adId);
  await db.collection('featuredRequests').add({
    adId, adTitle: ad ? ad.title : '', userId: currentUser.uid,
    userEmail: currentUser.email || '', plan: selectedPlan,
    status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(() => {});
  const msg = `طلب تمييز إعلان%0Aالإعلان: ${ad ? ad.title : ''}%0Aالخطة: ${selectedPlan}%0Aالبريد: ${currentUser.email || ''}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  closeModal('featuredModal');
  showToast('تم إرسال طلبك! سيتم التواصل قريباً ✅', 'ok');
}

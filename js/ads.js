/* ============================================================
   ads.js
   Categories, home feed (load/filter/render), favorites,
   ad detail view, add/edit/delete ad, "featured ad" request flow.
   ============================================================ */

/* ============ CATEGORIES ============ */
const CATS = [
  { n: 'الكل', i: 'fa-th-large' }, { n: 'سيارات', i: 'fa-car' }, { n: 'عقارات', i: 'fa-home' },
  { n: 'إلكترونيات', i: 'fa-mobile-alt' }, { n: 'أدوات كهربائية', i: 'fa-plug' }, { n: 'ملابس', i: 'fa-tshirt' },
  { n: 'إكسسوارات', i: 'fa-gem' }, { n: 'أثاث', i: 'fa-couch' },
  { n: 'وظائف', i: 'fa-briefcase' }, { n: 'خدمات', i: 'fa-tools' }, { n: 'حيوانات', i: 'fa-paw' },
  { n: 'رياضة', i: 'fa-futbol' }, { n: 'طعام', i: 'fa-utensils' }, { n: 'أخرى', i: 'fa-box' }
];

function renderCats() {
  document.getElementById('catsScroll').innerHTML = CATS.map(c => `
    <div class="cat-chip ${(activeCat === c.n) || (activeCat === null && c.n === 'الكل') ? 'active' : ''}"
         role="button" tabindex="0" aria-pressed="${activeCat === c.n || (activeCat === null && c.n === 'الكل')}"
         onclick="filterCat('${c.n}')"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();filterCat('${c.n}');}">
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
let adsLoadSeq = 0;
function isPublicAd(ad) {
  return ad.moderationStatus !== 'pending' && ad.moderationStatus !== 'rejected' && ad.moderationStatus !== 'hidden';
}

async function loadAds() {
  const g = document.getElementById('adsGrid');
  if (!g) return;
  const loadSeq = ++adsLoadSeq;
  g.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري تحميل الإعلانات...</p></div>';

  try {
    const snap = await Promise.race([
      db.collection('ads').orderBy('createdAt', 'desc').limit(40).get(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    if (loadSeq !== adsLoadSeq) return;

    allAds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const now = Date.now();
    const expiredIds = allAds
      .filter(a => a.featured && a.featuredUntil && a.featuredUntil.toMillis && a.featuredUntil.toMillis() < now)
      .map(a => a.id);
    expiredIds.forEach(id => {
      db.collection('ads').doc(id).update({ featured: false }).catch(() => {});
      const ad = allAds.find(a => a.id === id);
      if (ad) ad.featured = false;
    });
    allAds = allAds.filter(a => {
      if (!a.expiresAt) return true;
      const ms = a.expiresAt.toMillis ? a.expiresAt.toMillis() : (a.expiresAt.seconds * 1000);
      return ms > now;
    });
    buildSlider(allAds.filter(a => a.featured && isPublicAd(a)));
    applyFilter();
    populateFeaturedSelect();
    openSharedAdIfAny();
  } catch (error) {
    if (loadSeq !== adsLoadSeq) return;
    g.innerHTML = `<div class="empty-state load-error">
      <i class="fa fa-wifi"></i><p>تعذر تحميل الإعلانات حالياً</p>
      <small>تحقق من الاتصال ثم حاول مرة أخرى</small>
      <button class="btn btn-outline btn-sm" onclick="loadAds()">إعادة المحاولة</button>
    </div>`;
  }
}

/* Opens the ad referenced by ?ad=ID in the URL (from shareAd()'s link), once. */
let sharedAdOpened = false;
function openSharedAdIfAny() {
  if (sharedAdOpened) return;
  const adId = new URLSearchParams(location.search).get('ad');
  if (!adId) return;
  if (allAds.find(a => a.id === adId && isPublicAd(a))) {
    sharedAdOpened = true;
    openDetail(adId);
  }
}

function applyFilter() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const sort = document.getElementById('sortSelect').value;
  let list = allAds.filter(isPublicAd);
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
  g.innerHTML = list.map(ad => {
    const cover = (ad.images && ad.images.length) ? ad.images[0] : ad.imageUrl;
    const photoCount = (ad.images && ad.images.length) ? ad.images.length : (ad.imageUrl ? 1 : 0);
    return `
    <div class="ad-card ${ad.featured ? 'featured' : ''}" onclick="openDetail('${ad.id}')">
      ${ad.featured ? '<div class="featured-badge">⭐ مميز</div>' : ''}
      <div style="position:relative">
        ${cover ? `<img class="ad-img" src="${escapeHtml(cover)}" alt="${escapeHtml(ad.title)}" loading="lazy">` : `<div class="ad-no-img"><i class="fa fa-image"></i></div>`}
        <button class="ad-fav ${favorites.has(ad.id) ? 'liked' : ''}" onclick="event.stopPropagation();toggleFav('${ad.id}',this)"><i class="fa fa-heart"></i></button>
        ${ad.category ? `<span class="ad-cat-badge">${escapeHtml(ad.category)}</span>` : ''}
        ${photoCount > 1 ? `<span style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,.6);color:#fff;font-size:.62em;font-weight:700;padding:2px 7px;border-radius:20px">${photoCount}</span>` : ''}
      </div>
      <div class="ad-body">
        <div class="ad-price">${formatPrice(ad)}</div>
        <div class="ad-title">${escapeHtml(ad.title)}</div>
        <div class="ad-loc"><i class="fa fa-map-marker-alt"></i> ${escapeHtml(ad.area || 'دير الزور')}</div>
        <div class="ad-time">${timeAgo(ad.createdAt)}</div>
      </div>
    </div>`;
  }).join('');
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
      <div class="my-ad-info"><div class="my-ad-title">${escapeHtml(ad.title)}</div><div class="my-ad-price">${formatPrice(ad)}</div></div>
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
  const images = (ad.images && ad.images.length) ? ad.images : (ad.imageUrl ? [ad.imageUrl] : []);
  document.getElementById('detailContent').innerHTML = `
    ${images.length > 1
      ? `<div style="display:flex;gap:8px;overflow-x:auto;margin-bottom:12px;scroll-snap-type:x mandatory">${images.map(url => `${safeMediaUrl(url) ? `<img src="${escapeHtml(safeMediaUrl(url))}" style="width:85%;flex-shrink:0;height:220px;object-fit:cover;border-radius:14px;scroll-snap-align:start" alt="${escapeHtml(ad.title)}">` : ''}`).join('')}</div>`
      : (images.length === 1 ? `${safeMediaUrl(images[0]) ? `<img class="detail-img" src="${escapeHtml(safeMediaUrl(images[0]))}" alt="${escapeHtml(ad.title)}">` : ''}` : '')}
    ${ad.featured ? '<div style="color:var(--gold);font-weight:800;margin-bottom:6px">⭐ إعلان مميز</div>' : ''}
    <span style="background:var(--blue-light);color:var(--blue);padding:3px 10px;border-radius:20px;font-size:.78em;font-weight:700">${escapeHtml(ad.category)}</span>
    <h3 style="font-size:1.1em;font-weight:800;margin:10px 0 4px">${escapeHtml(ad.title)}</h3>
    <div class="detail-price">${formatPrice(ad)}</div>
    <p class="detail-desc">${escapeHtml(ad.description).replace(/\n/g, '<br>')}</p>
    <div class="info-box">
      ${ad.phone ? `<div class="info-row"><i class="fa fa-phone"></i><span>${escapeHtml(ad.phone)}</span></div>` : ''}
      <div class="info-row"><i class="fa fa-map-marker-alt"></i><span>${escapeHtml(ad.area || 'دير الزور')}</span></div>
      <div class="info-row"><i class="fa fa-clock"></i><span>${timeAgo(ad.createdAt)}</span></div>
      <div class="info-row"><i class="fa fa-eye"></i><span>${(ad.views || 0) + 1} مشاهدة</span></div>
    </div>
    ${ad.phone ? `
      <a href="tel:${escapeHtml(String(ad.phone || '').replace(/[^+\d\s()-]/g, ''))}" class="call-btn"><i class="fa fa-phone-alt"></i> اتصل بالبائع</a>
` : ''}
    <div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="shareAd('${escapeHtml(ad.id)}')"><i class="fa fa-share-nodes"></i> مشاركة الإعلان</button></div>
    ${!isOwner && currentUser ? `<div style="margin-top:10px;display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="startChat('${escapeHtml(ad.id)}','${escapeHtml(ad.userId)}')"><i class="fa fa-comment-dots"></i> راسل البائع</button><button class="btn btn-outline btn-sm" style="border-color:var(--red);color:var(--red)" onclick="reportAd('${escapeHtml(ad.id)}')"><i class="fa fa-flag"></i> إبلاغ</button></div>` : ''}
    ${isOwner ? `<div class="action-btns"><button class="btn btn-blue btn-sm" onclick="closeModal('detailModal');openEdit('${ad.id}')"><i class="fa fa-edit"></i> تعديل</button><button class="btn btn-red btn-sm" onclick="confirmDelete('${ad.id}')"><i class="fa fa-trash"></i> حذف</button></div>` : ''}
    ${canAdmin && !isOwner ? `<div class="action-btns" style="margin-top:6px"><button class="btn btn-red btn-sm" onclick="adminDeleteAd('${ad.id}')"><i class="fa fa-trash"></i> حذف (مدير)</button><button class="btn btn-outline btn-sm" onclick="adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured ? 'إلغاء التمييز' : '⭐ تمييز'}</button></div>` : ''}
    ${renderSellerOtherAdsHtml(ad)}
  `;
  openModal('detailModal');
}

/* Surfaces a seller's other active listings — helps buyers browse
   more from a seller they already trust/like, the way OpenSooq does. */
function renderSellerOtherAdsHtml(ad) {
  if (!ad.userId) return '';
  const others = allAds.filter(a => isPublicAd(a) && a.userId === ad.userId && a.id !== ad.id).slice(0, 6);
  if (!others.length) return '';
  return `
    <div class="section-label">📦 إعلانات أخرى لنفس البائع</div>
    <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px">
      ${others.map(o => {
        const cover = (o.images && o.images.length) ? o.images[0] : o.imageUrl;
        return `<div onclick="openDetail('${o.id}')" style="flex-shrink:0;width:110px;cursor:pointer">
          ${safeMediaUrl(cover) ? `<img src="${escapeHtml(safeMediaUrl(cover))}" style="width:110px;height:90px;object-fit:cover;border-radius:10px">` : `<div style="width:110px;height:90px;border-radius:10px;background:var(--bg);display:flex;align-items:center;justify-content:center;color:#aab"><i class="fa fa-image"></i></div>`}
          <div style="font-size:.72em;font-weight:700;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(o.title)}</div>
          <div style="font-size:.7em;color:var(--green);font-weight:700">${formatPrice(o)}</div>
        </div>`;
      }).join('')}
    </div>`;
}

/* Shareable per-ad link: ?ad=ID auto-opens that ad's detail on load (see app.js) */
function shareAd(adId, adTitle) {
  const knownAd = allAds.find(a => a.id === adId);
  adTitle = adTitle || knownAd?.title || 'إعلان';
  const url = `${location.origin}${location.pathname}?ad=${encodeURIComponent(adId)}`;
  if (navigator.share) {
    navigator.share({ title: adTitle || 'إعلان', text: 'شاهد هذا الإعلان في سوق دير الزور', url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('تم نسخ رابط الإعلان 🔗', 'ok'))
      .catch(() => showToast(url, ''));
  }
}

/* ============ ADD AD ============ */
function initAddAdForm() {
  document.getElementById('fabBtn').onclick = function () {
    if (!currentUser) { openModal('authModal'); showToast('سجل دخولك أولاً', 'bad'); return; }
    document.getElementById('addErr').className = 'err';
    openModal('addModal');
  };
  document.getElementById('adImg').onchange = function () {
    const files = Array.from(this.files || []).slice(0, 5);
    const preview = document.getElementById('imgPreview');
    preview.innerHTML = '';
    if (this.files.length > 5) showToast('حد أقصى 5 صور، تم أخذ أول 5 فقط', 'bad');
    files.forEach(f => {
      const r = new FileReader();
      r.onload = e => { const img = document.createElement('img'); img.src = e.target.result; preview.appendChild(img); };
      r.readAsDataURL(f);
    });
  };
}

async function getSignedUpload(resourceType) {
  if (!currentUser) throw new Error('يجب تسجيل الدخول قبل رفع الملفات');
  const token = await currentUser.getIdToken();
  const response = await fetch(window.SOUQ_CLOUDINARY_SIGN_ENDPOINT || '/api/cloudinary-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ resourceType })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.signature) throw new Error('خدمة رفع الملفات غير متاحة حاليًا');
  return data;
}

async function uploadToCloudinary(file, resourceType, signed) {
  const endpointType = 'image';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', signed.apiKey);
  fd.append('timestamp', String(signed.timestamp));
  fd.append('folder', signed.folder);
  fd.append('signature', signed.signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${endpointType}/upload`, { method: 'POST', body: fd });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'فشل رفع الملف');
  return data.secure_url;
}

async function doAddAd() {
  const title = document.getElementById('adTitle').value.trim();
  const desc = document.getElementById('adDesc').value.trim();
  const price = document.getElementById('adPrice').value;
  const currency = document.getElementById('adCurrency').value;
  const phone = document.getElementById('adPhone').value.trim();
  const cat = document.getElementById('adCat').value;
  const areaSel = document.getElementById('adArea').value;
  const areaOther = document.getElementById('adAreaOther').value.trim();
  const area = (areaSel === 'أخرى' && areaOther) ? areaOther : areaSel;
  const agreed = document.getElementById('adAgreeTerms').checked;
  const errEl = document.getElementById('addErr');
  if (!title || !desc || !price || !phone || !cat) { errEl.textContent = 'يرجى ملء جميع الحقول المطلوبة *'; errEl.className = 'err show'; return; }
  if (areaSel === 'أخرى' && !areaOther) { errEl.textContent = 'يرجى كتابة اسم القرية/المنطقة'; errEl.className = 'err show'; return; }
  if (!agreed) { errEl.textContent = 'يجب الموافقة على شروط استخدام السوق أولاً'; errEl.className = 'err show'; return; }
  errEl.className = 'err';
  const btn = document.getElementById('addSubmit');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري النشر...';
  try {
    const imgFiles = Array.from(document.getElementById('adImg').files || []).slice(0, 5);
    const invalidImage = imgFiles.find(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024);
    if (invalidImage) throw new Error('كل صورة يجب أن تكون JPG أو PNG أو WebP وحجمها أقل من 5MB');
    const images = [];
    let imageUploadWarning = false;
    if (imgFiles.length) {
      try {
        const imageSignature = await getSignedUpload('image');
        for (const f of imgFiles) images.push(await uploadToCloudinary(f, 'image', imageSignature));
      } catch (uploadError) {
        imageUploadWarning = true;
        console.warn('Image upload skipped:', uploadError?.message || uploadError);
      }
    }

    const durationDays = 20;
    const expiresAt = new Date(Date.now() + durationDays * 86400000);
    await db.collection('ads').add({
      title, description: desc, price: parseFloat(price) || 0, currency, phone, category: cat, area,
      images, imageUrl: images[0] || null, featured: false,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'مستخدم',
      moderationStatus: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      expiresAt: firebase.firestore.Timestamp.fromDate(expiresAt),
      durationDays: 20
    });
    closeModal('addModal');
    ['adTitle', 'adDesc', 'adPrice', 'adPhone', 'adAreaOther'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('adCat').value = '';
    document.getElementById('adAreaOther').style.display = 'none';
    document.getElementById('adAgreeTerms').checked = false;
    document.getElementById('imgPreview').innerHTML = '';
    document.getElementById('adImg').value = '';
    showToast(imageUploadWarning ? 'تم إرسال الإعلان بدون صور، وسيظهر بعد موافقة الإدارة ✅' : 'تم إرسال إعلانك للمراجعة، وسيظهر بعد موافقة الإدارة ✅', 'ok');
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
    await db.collection('ads').doc(id).update({ title, description: desc, price: parseFloat(price) || 0, phone, category: cat, moderationStatus: 'pending' });
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
  sel.innerHTML = '<option value="">-- اختر إعلانك --</option>' + myAds.map(a => `<option value="${escapeHtml(a.id)}">${escapeHtml(a.title || 'إعلان')}</option>`).join('');
}

async function requestFeatured() {
  const adId = document.getElementById('featuredAdSel').value;
  if (!adId) { showToast('اختر إعلاناً أولاً', 'bad'); return; }
  const ad = allAds.find(a => a.id === adId);
  try {
    await db.collection('featuredRequests').add({
      adId, adTitle: ad ? ad.title : '', userId: currentUser.uid,
      userEmail: currentUser.email || '', plan: 'مجاني',
      durationDays: 0,
      status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeModal('featuredModal');
    showToast('تم إرسال طلبك، ستتواصل معك الإدارة هاتفياً ✅', 'ok');
  } catch (error) {
    showToast('تعذر إرسال الطلب، حاول مرة أخرى', 'bad');
  }
}

/* ============ REPORT AD ============ */
async function reportAd(adId, adTitle) {
  adTitle = adTitle || allAds.find(a => a.id === adId)?.title || '';
  const reason = prompt('لماذا تُبلغ عن هذا الإعلان؟ (مثال: احتيال، سلعة مخالفة، إعلان مكرر...)');
  if (reason === null) return; // cancelled
  try {
    await db.collection('reports').add({
      adId, adTitle,
      reporterId: currentUser.uid,
      reason: (reason || '').trim() || 'بدون سبب محدد',
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    showToast('تم إرسال البلاغ للإدارة، شكراً لك ✅', 'ok');
  } catch (e) { showToast('تعذر إرسال البلاغ', 'bad'); }
}

/* ============ ABOUT / CONTACT ADMIN (site stats) ============ */
function loadContactSettings() {
  db.collection('settings').doc('contact').get().then(doc => {
    if (doc.exists) contactSettings = { ...contactSettings, ...doc.data() };
  }).catch(() => {});
}

async function openAboutModal() {
  document.getElementById('aboutEmail').textContent = contactSettings.email;
  document.getElementById('aboutPhone').textContent = contactSettings.phone;
  const phoneLink = document.getElementById('aboutPhoneLink');
  if (phoneLink) phoneLink.href = `tel:${contactSettings.phone || ''}`;
  document.getElementById('statAds').textContent = allAds.length;
  openModal('aboutModal');

  db.collection('settings').doc('stats').get().then(doc => {
    const stats = doc.exists ? doc.data() : {};
    document.getElementById('statUsers').textContent = Number(stats.userCount || 0).toLocaleString();
    document.getElementById('statVisits').textContent = Number(stats.totalVisits || 0).toLocaleString();
  }).catch(() => {
    document.getElementById('statUsers').textContent = '—';
    document.getElementById('statVisits').textContent = '—';
  });
}

/* Counts a visit once per browser tab/session (not on every reload within
   the same session), via a simple atomic Firestore increment. Lightweight
   by design: no continuous polling, just one write per new session. */
function countVisitOnce() {
  if (sessionStorage.getItem('souq_visit_counted')) return;
  sessionStorage.setItem('souq_visit_counted', '1');
  db.collection('settings').doc('stats').set({
    totalVisits: firebase.firestore.FieldValue.increment(1)
  }, { merge: true }).catch(() => {});
}



/* ============================================================
   ads.js
   Categories, home feed (load/filter/render), favorites,
   ad detail view, add/edit/delete ad. النشر مجاني بالكامل — كل إعلان
   يُميَّز تلقائياً بدون أي رسوم.
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
    let items = ['مرحباً بكم في سوق دير الزور المفتوح 🛒', 'أول سوق إلكتروني في دير الزور', 'النشر مجاني بالكامل للجميع ✅', 'جميع الإعلانات تُنشر مميزة تلقائياً بدون أي رسوم'];
    if (doc.exists && doc.data().items) items = doc.data().items;
    document.getElementById('newsTicker').innerHTML = items.map(i => `<span>📌 ${i}</span>`).join('');
  }).catch(() => {
    document.getElementById('newsTicker').innerHTML = '<span>📌 مرحباً بكم في سوق دير الزور المفتوح 🛒</span><span>📌 النشر مجاني للجميع</span>';
  });
}

/* ============ LOAD ADS ============ */
let adsLastDoc = null;
let adsHasMore = false;
let adsLoading = false;
const ADS_PAGE_SIZE = 30;

function loadAds(reset = true) {
  const g = document.getElementById('adsGrid');
  if (adsLoading) return;
  adsLoading = true;
  if (reset) {
    adsLastDoc = null;
    adsHasMore = false;
    g.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  }
  let query = db.collection('ads').orderBy('createdAt', 'desc').limit(ADS_PAGE_SIZE);
  if (!reset && adsLastDoc) query = query.startAfter(adsLastDoc);
  query.get()
    .then(snap => {
      const pageAds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      allAds = reset ? pageAds : [...allAds, ...pageAds];
      adsLastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : adsLastDoc;
      adsHasMore = snap.size === ADS_PAGE_SIZE;
      // auto-expire: remove featured flag for past-due ads
      const now = Date.now();
      const expiredIds = allAds
        .filter(a => a.featured && a.featuredUntil && a.featuredUntil.toMillis && a.featuredUntil.toMillis() < now)
        .map(a => a.id);
      expiredIds.forEach(id => {
        db.collection('ads').doc(id).update({ featured: false }).catch(() => {});
        const ad = allAds.find(a => a.id === id);
        if (ad) ad.featured = false;
      });
      // hide expired regular ads + hide pending/rejected ads from public feed
      allAds = allAds.filter(a => {
        if (a.status && a.status !== 'approved') return false;
        if (!a.expiresAt) return true;
        const ms = a.expiresAt.toMillis ? a.expiresAt.toMillis() : (a.expiresAt.seconds * 1000);
        return ms > now;
      });
      const fAds = allAds.filter(a => a.featured);
      buildSlider(fAds.slice(0, 10));
      applyFilter();
      populateFeaturedSelect();
      openSharedAdIfAny();
    })
    .catch(() => { if (reset) g.innerHTML = '<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>تعذر التحميل</p></div>'; })
    .finally(() => { adsLoading = false; });
}

function loadMoreAds() {
  loadAds(false);
}

/* Opens the ad referenced by ?ad=ID in the URL (from shareAd()'s link), once. */
let sharedAdOpened = false;
function openSharedAdIfAny() {
  if (sharedAdOpened) return;
  const adId = new URLSearchParams(location.search).get('ad');
  if (!adId) return;
  if (allAds.find(a => a.id === adId)) {
    sharedAdOpened = true;
    openDetail(adId);
    return;
  }
  /* الروابط القديمة قد تشير إلى إعلان خارج الدفعة الأولى */
  db.collection('ads').doc(adId).get().then(doc => {
    if (!doc.exists) return;
    const ad = { id: doc.id, ...doc.data() };
    if (ad.status && ad.status !== 'approved') return;
    allAds.push(ad);
    sharedAdOpened = true;
    openDetail(adId);
  }).catch(() => {});
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
  g.innerHTML = list.map(ad => {
    const cover = (ad.images && ad.images.length) ? ad.images[0] : ad.imageUrl;
    const photoCount = (ad.images && ad.images.length) ? ad.images.length : (ad.imageUrl ? 1 : 0);
    return `
    <div class="ad-card ${ad.featured ? 'featured' : ''}" onclick="openDetail('${ad.id}')">
      ${ad.featured ? '<div class="featured-badge">⭐ مميز</div>' : ''}
      <div style="position:relative">
        ${cover ? `<img class="ad-img" src="${cover}" alt="${ad.title || ''}" loading="lazy">` : `<div class="ad-no-img"><i class="fa fa-image"></i></div>`}
        <button class="ad-fav ${favorites.has(ad.id) ? 'liked' : ''}" onclick="event.stopPropagation();toggleFav('${ad.id}',this)"><i class="fa fa-heart"></i></button>
        ${ad.category ? `<span class="ad-cat-badge">${ad.category}</span>` : ''}
        ${(photoCount > 1 || ad.videoUrl) ? `<span style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,.6);color:#fff;font-size:.62em;font-weight:700;padding:2px 7px;border-radius:20px">${ad.videoUrl ? '<i class="fa fa-video"></i>' : ''} ${photoCount > 1 ? photoCount : ''}</span>` : ''}
      </div>
      <div class="ad-body">
        <div class="ad-price">${formatPrice(ad)}</div>
        <div class="ad-title">${ad.title || ''}</div>
        <div class="ad-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
        <div class="ad-time">${timeAgo(ad.createdAt)}</div>
      </div>
    </div>`;
  }).join('') + (adsHasMore ? `
    <button class="btn btn-outline load-more-btn" onclick="loadMoreAds()">
      <i class="fa fa-plus"></i> تحميل المزيد
    </button>` : '');
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
      <div class="my-ad-info"><div class="my-ad-title">${ad.title || ''}</div><div class="my-ad-price">${formatPrice(ad)}</div></div>
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
      ? `<div style="display:flex;gap:8px;overflow-x:auto;margin-bottom:12px;scroll-snap-type:x mandatory">${images.map(url => `<img src="${url}" style="width:85%;flex-shrink:0;height:220px;object-fit:cover;border-radius:14px;scroll-snap-align:start" alt="${ad.title}">`).join('')}</div>`
      : (images.length === 1 ? `<img class="detail-img" src="${images[0]}" alt="${ad.title}">` : '')}
    ${ad.videoUrl ? `<video controls style="width:100%;border-radius:14px;margin-bottom:12px;background:#000"><source src="${ad.videoUrl}">متصفحك لا يدعم تشغيل الفيديو</video>` : ''}
    ${ad.featured ? '<div style="color:var(--gold);font-weight:800;margin-bottom:6px">⭐ إعلان مميز</div>' : ''}
    <span style="background:var(--blue-light);color:var(--blue);padding:3px 10px;border-radius:20px;font-size:.78em;font-weight:700">${ad.category || ''}</span>
    <h3 style="font-size:1.1em;font-weight:800;margin:10px 0 4px">${ad.title || ''}</h3>
    <div class="detail-price">${formatPrice(ad)}</div>
    <p class="detail-desc">${(ad.description || '').replace(/\n/g, '<br>')}</p>
    <div class="info-box">
      ${ad.phone ? `<div class="info-row"><i class="fa fa-phone"></i><span>${ad.phone}</span></div>` : ''}
      <div class="info-row"><i class="fa fa-map-marker-alt"></i><span>${ad.area || 'دير الزور'}</span></div>
      <div class="info-row"><i class="fa fa-clock"></i><span>${timeAgo(ad.createdAt)}</span></div>
      <div class="info-row"><i class="fa fa-eye"></i><span>${(ad.views || 0) + 1} مشاهدة</span></div>
    </div>
    ${ad.phone ? `
      <a href="tel:${ad.phone}" class="call-btn"><i class="fa fa-phone-alt"></i> اتصل بالبائع</a>
      <a href="https://wa.me/${ad.phone.replace(/\D/g, '')}" target="_blank" class="whatsapp-btn"><i class="fa fa-comment"></i> تواصل عبر واتساب</a>` : ''}
    <div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="shareAd('${ad.id}','${(ad.title || '').replace(/'/g, '')}')"><i class="fa fa-share-nodes"></i> مشاركة الإعلان</button></div>
    ${!isOwner && currentUser ? `<div style="margin-top:10px;display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="startChat('${ad.id}','${ad.userId}','${(ad.title || '').replace(/'/g, '')}')"><i class="fa fa-comment-dots"></i> راسل البائع</button><button class="btn btn-outline btn-sm" style="border-color:var(--red);color:var(--red)" onclick="reportAd('${ad.id}','${(ad.title || '').replace(/'/g, '')}')"><i class="fa fa-flag"></i> إبلاغ</button></div>` : ''}
    ${isOwner ? `<div class="action-btns"><button class="btn btn-blue btn-sm" onclick="closeModal('detailModal');openEdit('${ad.id}')"><i class="fa fa-edit"></i> تعديل</button><button class="btn btn-red btn-sm" onclick="confirmDelete('${ad.id}')"><i class="fa fa-trash"></i> حذف</button></div>` : ''}
    ${canAdmin && !isOwner ? `<div class="action-btns" style="margin-top:6px"><button class="btn btn-red btn-sm" onclick="adminDeleteAd('${ad.id}')"><i class="fa fa-trash"></i> حذف (مدير)</button><button class="btn btn-outline btn-sm" onclick="adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured ? 'إلغاء التمييز' : '⭐ تمييز'}</button></div>` : ''}
    ${renderSellerOtherAdsHtml(ad)}
  `;
  openModal('detailModal');
  db.collection('ads').doc(id).update({ views: firebase.firestore.FieldValue.increment(1) }).catch(() => {});
}

/* Surfaces a seller's other active listings — helps buyers browse
   more from a seller they already trust/like, the way OpenSooq does. */
function renderSellerOtherAdsHtml(ad) {
  if (!ad.userId) return '';
  const others = allAds.filter(a => a.userId === ad.userId && a.id !== ad.id).slice(0, 6);
  if (!others.length) return '';
  return `
    <div class="section-label">📦 إعلانات أخرى لنفس البائع</div>
    <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px">
      ${others.map(o => {
        const cover = (o.images && o.images.length) ? o.images[0] : o.imageUrl;
        return `<div onclick="openDetail('${o.id}')" style="flex-shrink:0;width:110px;cursor:pointer">
          ${cover ? `<img src="${cover}" style="width:110px;height:90px;object-fit:cover;border-radius:10px">` : `<div style="width:110px;height:90px;border-radius:10px;background:var(--bg);display:flex;align-items:center;justify-content:center;color:#aab"><i class="fa fa-image"></i></div>`}
          <div style="font-size:.72em;font-weight:700;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.title || ''}</div>
          <div style="font-size:.7em;color:var(--green);font-weight:700">${formatPrice(o)}</div>
        </div>`;
      }).join('')}
    </div>`;
}

/* Shareable per-ad link: ?ad=ID auto-opens that ad's detail on load (see app.js) */
function shareAd(adId, adTitle) {
  const url = `${location.origin}${location.pathname}?ad=${adId}`;
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
  document.getElementById('adVideo').onchange = function () {
    const f = this.files[0];
    document.getElementById('videoPreview').textContent = f ? `🎬 ${f.name}` : '';
  };
}

function getLocalDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function assertCanPublishToday() {
  const snap = await db.collection('users').doc(currentUser.uid).get();
  if (snap.exists && snap.data().lastAdPostDay === getLocalDayKey()) {
    throw new Error('يمكنك نشر إعلان واحد فقط كل يوم. حاول غداً.');
  }
}

function optimizeImage(file) {
  if (!file || !file.type.startsWith('image/')) return Promise.resolve(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة الصورة'));
    reader.onload = event => {
      const image = new Image();
      image.onerror = () => reject(new Error('ملف الصورة غير صالح'));
      image.onload = () => {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('تعذر ضغط الصورة'));
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', .82);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
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
    await assertCanPublishToday();
    const imgFiles = Array.from(document.getElementById('adImg').files || []).slice(0, 5);
    const images = [];
    for (const originalFile of imgFiles) {
      if (originalFile.size > 10 * 1024 * 1024) throw new Error('حجم كل صورة يجب ألا يتجاوز 10 ميغابايت');
      const f = await optimizeImage(originalFile);
      const fd = new FormData();
      fd.append('file', f); fd.append('upload_preset', CLOUDINARY_PRESET); fd.append('folder', 'souq_ads');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.secure_url) throw new Error(data.error?.message ? `فشل رفع صورة: ${data.error.message}` : 'فشل رفع إحدى الصور');
      images.push(data.secure_url);
    }

    let videoUrl = null;
    const videoFile = document.getElementById('adVideo').files[0];
    if (videoFile) {
      if (videoFile.size > 30 * 1024 * 1024) throw new Error('حجم الفيديو يجب ألا يتجاوز 30 ميغابايت');
      const fd = new FormData();
      fd.append('file', videoFile); fd.append('upload_preset', CLOUDINARY_PRESET); fd.append('folder', 'souq_ads_video');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.secure_url) throw new Error(data.error?.message ? `فشل رفع الفيديو: ${data.error.message}` : 'فشل رفع الفيديو');
      videoUrl = data.secure_url;
    }

    const durationDays = 30;
    const expiresAt = new Date(Date.now() + durationDays * 86400000);
    const adData = {
      title, description: desc, price: parseFloat(price) || 0, currency, phone, category: cat, area,
      images, imageUrl: images[0] || null, videoUrl, featured: false, views: 0,
      userId: currentUser.uid, userEmail: currentUser.email,
      userName: currentUser.displayName || 'مستخدم',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      expiresAt: firebase.firestore.Timestamp.fromDate(expiresAt),
      durationDays,
      status: 'pending'
    };
    const userRef = db.collection('users').doc(currentUser.uid);
    const adRef = db.collection('ads').doc();
    await db.runTransaction(async transaction => {
      const userSnap = await transaction.get(userRef);
      if (userSnap.exists && userSnap.data().lastAdPostDay === getLocalDayKey()) {
        throw new Error('يمكنك نشر إعلان واحد فقط كل يوم. حاول غداً.');
      }
      transaction.set(userRef, {
        lastAdPostDay: getLocalDayKey(),
        lastAdPostAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      transaction.set(adRef, adData);
    });
    /* إشعار المدير بإعلان جديد */
    db.collection('adminNotifications').add({
      type: 'new_ad',
      adId: adRef.id,
      adTitle: title,
      userName: currentUser.displayName || 'مستخدم',
      userId: currentUser.uid,
      userEmail: currentUser.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      read: false
    }).catch(()=>{});
    closeModal('addModal');
    ['adTitle', 'adDesc', 'adPrice', 'adPhone', 'adAreaOther'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('adCat').value = '';
    document.getElementById('adAreaOther').style.display = 'none';
    document.getElementById('adAgreeTerms').checked = false;
    document.getElementById('imgPreview').innerHTML = '';
    document.getElementById('videoPreview').innerHTML = '';
    document.getElementById('adImg').value = '';
    document.getElementById('adVideo').value = '';
    showToast('تم إرسال إعلانك وهو قيد المراجعة ⏳ سيظهر بعد موافقة الإدارة', 'ok');
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
    const ad = allAds.find(a => a.id === id);
    const changes = { title, description: desc, price: parseFloat(price) || 0, phone, category: cat };
    /* أي تعديل على إعلان منشور يعود للمراجعة حتى لا يتجاوز المحتوى الجديد الإدارة */
    if (!ad || ad.status !== 'pending') {
      changes.status = 'pending';
      changes.reviewedAt = firebase.firestore.FieldValue.delete();
      changes.rejectionReason = firebase.firestore.FieldValue.delete();
    }
    await db.collection('ads').doc(id).update(changes);
    if (changes.status === 'pending') {
      db.collection('adminNotifications').add({
        type: 'updated_ad',
        adId: id,
        adTitle: title,
        userName: currentUser.displayName || 'مستخدم',
        userId: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        read: false
      }).catch(() => {});
    }
    closeModal('editModal');
    showToast(changes.status === 'pending' ? 'تم حفظ التعديل وهو قيد المراجعة ⏳' : 'تم حفظ التعديلات ✅', 'ok');
    loadAds();
  } catch (e) { errEl.textContent = e.message || 'حدث خطأ'; errEl.className = 'err show'; }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> حفظ التعديلات'; }
}

/* ============ DELETE AD ============ */
function confirmDelete(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
  db.collection('ads').doc(id).delete().then(() => { closeModal('detailModal'); showToast('تم حذف الإعلان', 'ok'); loadAds(); })
    .catch(() => showToast('خطأ أثناء الحذف', 'bad'));
}

/* ============ REPORT AD ============ */
async function reportAd(adId, adTitle) {
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
  document.getElementById('aboutWhatsapp').href = `https://wa.me/${contactSettings.whatsapp}`;
  document.getElementById('statAds').textContent = allAds.length;
  openModal('aboutModal');

  db.collection('users').get().then(s => { document.getElementById('statUsers').textContent = s.size; }).catch(() => {});
  db.collection('settings').doc('stats').get().then(doc => {
    document.getElementById('statVisits').textContent = (doc.exists && doc.data().totalVisits) ? doc.data().totalVisits.toLocaleString() : '0';
  }).catch(() => { document.getElementById('statVisits').textContent = '—'; });
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



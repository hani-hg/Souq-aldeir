// ===== js/ads.js — إدارة الإعلانات (تحميل، عرض، إضافة، تعديل، حذف، مفضلة) =====
import { auth, db } from './firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { toast, openM, closeM, setBnav } from './app.js';
import { getCurrentUser, getIsAdmin } from './auth.js';

let allAds = [];
let favs = new Set();
let activeCat = null;
let curSlide = 0;
let slideAds = [];
let slideTimer = null;
let chosenPlan = '3 أيام - 1$';

// ===== تحميل المفضلة من localStorage =====
try { favs = new Set(JSON.parse(localStorage.getItem('sq_favs') || '[]')); } catch (e) {}

// ===== تحميل الإعلانات =====
export function loadAds() {
  const grid = document.getElementById('adsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  getDocs(query(collection(db, 'ads'), orderBy('createdAt', 'desc')))
    .then(snap => {
      allAds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      buildSlider(allAds.filter(a => a.featured));
      applyFilter();
      fillFeatSel();
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = '<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>تعذّر التحميل</p></div>';
    });
}

// ===== عرض الإعلانات مع التصفية =====
export function applyFilter() {
  const q = document.getElementById('searchQ')?.value.trim().toLowerCase() || '';
  const sort = document.getElementById('sortEl')?.value || 'new';
  let list = [...allAds];
  if (activeCat) list = list.filter(a => a.category === activeCat);
  if (q) list = list.filter(a => (a.title || '').toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q));
  if (sort === 'asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === 'desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
  list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  renderAds(list);
}

function renderAds(list) {
  const grid = document.getElementById('adsGrid');
  const countEl = document.getElementById('adsCountEl');
  if (countEl) countEl.textContent = list.length + ' إعلان';
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state"><i class="fa fa-search"></i><p>لا توجد نتائج</p></div>';
    return;
  }
  grid.innerHTML = list.map(ad => `
    <div class="ad-card${ad.featured ? ' featured' : ''}" onclick="window.openDetail('${ad.id}')">
      ${ad.featured ? '<div class="feat-badge">⭐ مميز</div>' : ''}
      <div style="position:relative">
        ${ad.imageUrl ? `<img class="ad-img" src="${ad.imageUrl}" alt="" loading="lazy">` : `<div class="ad-noimg"><i class="fa fa-image"></i></div>`}
        <button class="ad-fav${favs.has(ad.id) ? ' liked' : ''}" onclick="event.stopPropagation();window.toggleFav('${ad.id}',this)"><i class="fa fa-heart"></i></button>
        ${ad.category ? `<span class="ad-catbadge">${ad.category}</span>` : ''}
      </div>
      <div class="ad-body">
        <div class="ad-price">${ad.price ? Number(ad.price).toLocaleString() + ' $' : 'مجاني'}</div>
        <div class="ad-title">${ad.title || ''}</div>
        <div class="ad-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
        <div class="ad-time">${ago(ad.createdAt)}</div>
      </div>
    </div>`).join('');
}

function ago(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'الآن';
  if (s < 3600) return Math.floor(s / 60) + ' د';
  if (s < 86400) return Math.floor(s / 3600) + ' س';
  return Math.floor(s / 86400) + ' يوم';
}

// ===== الفئات =====
const CATS = [
  { n: 'الكل', i: 'fa-th-large' }, { n: 'سيارات', i: 'fa-car' }, { n: 'عقارات', i: 'fa-home' },
  { n: 'إلكترونيات', i: 'fa-mobile-alt' }, { n: 'ملابس', i: 'fa-tshirt' }, { n: 'أثاث', i: 'fa-couch' },
  { n: 'وظائف', i: 'fa-briefcase' }, { n: 'خدمات', i: 'fa-tools' }, { n: 'حيوانات', i: 'fa-paw' },
  { n: 'رياضة', i: 'fa-futbol' }, { n: 'طعام', i: 'fa-utensils' }, { n: 'أخرى', i: 'fa-box' }
];

export function buildCats() {
  const el = document.getElementById('catsEl');
  if (!el) return;
  el.innerHTML = CATS.map(c => `
    <div class="cat-chip ${(!activeCat && c.n === 'الكل') || (activeCat === c.n) ? 'active' : ''}" onclick="window.pickCat('${c.n}')">
      <i class="fa ${c.i}"></i><span>${c.n}</span>
    </div>`).join('');
  const opts = CATS.filter(c => c.n !== 'الكل').map(c => `<option value="${c.n}">${c.n}</option>`).join('');
  ['adCat', 'edCat'].forEach(id => {
    const el2 = document.getElementById(id);
    if (el2) el2.innerHTML = '<option value="">اختر...</option>' + opts;
  });
}

// ===== السلايدر =====
export function buildSlider(ads) {
  slideAds = ads || [];
  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');
  if (!track || !dots) return;
  if (!slideAds.length) {
    track.innerHTML = `<div class="slide" onclick="window.openFeatured()">
      <div class="slide-noimg">⭐</div>
      <div class="slide-info">
        <div class="slide-badge">إعلانات مميزة</div>
        <div class="slide-title">إعلانك هنا أمام آلاف المشترين</div>
        <div class="slide-price">ابدأ من 1$ فقط</div>
        <div class="slide-loc">اضغط لمعرفة التفاصيل</div>
      </div></div>`;
    dots.innerHTML = '';
    return;
  }
  track.innerHTML = slideAds.map(ad => `
    <div class="slide" onclick="window.openDetail('${ad.id}')">
      ${ad.imageUrl ? `<img class="slide-img" src="${ad.imageUrl}" loading="lazy">` : `<div class="slide-noimg"><i class="fa fa-image"></i></div>`}
      <div class="slide-info">
        <div class="slide-badge">⭐ مميز</div>
        <div class="slide-title">${ad.title || ''}</div>
        <div class="slide-price">${ad.price ? Number(ad.price).toLocaleString() + ' $' : 'مجاني'}</div>
        <div class="slide-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
      </div></div>`).join('');
  dots.innerHTML = slideAds.map((_, i) => `<span class="sdot ${i === 0 ? 'on' : ''}" onclick="window.slideTo(${i})"></span>`).join('');
  slideTo(0);
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => slideTo((curSlide + 1) % slideAds.length), 5000);
}

export function slideTo(i) {
  if (!slideAds.length) return;
  curSlide = (i + slideAds.length) % slideAds.length;
  const track = document.getElementById('sliderTrack');
  if (track) track.style.transform = `translateX(${curSlide * 100}%)`;
  document.querySelectorAll('.sdot').forEach((d, j) => d.className = 'sdot' + (j === curSlide ? ' on' : ''));
}

// ===== المفضلة =====
export function toggleFav(id, btn) {
  if (favs.has(id)) { favs.delete(id); btn.classList.remove('liked'); toast('حذف من المفضلة'); }
  else { favs.add(id); btn.classList.add('liked'); toast('أضيف للمفضلة ❤️', 'ok'); }
  try { localStorage.setItem('sq_favs', JSON.stringify([...favs])); } catch (e) {}
}

export function openFavs() {
  const list = allAds.filter(a => favs.has(a.id));
  const body = document.getElementById('favBody');
  if (!body) return;
  body.innerHTML = list.length ? list.map(ad => `
    <div class="myadrow" onclick="closeM('favModal');window.openDetail('${ad.id}')">
      <div class="myadimg">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
      <div class="myadinfo"><div class="myadtitle">${ad.title || ''}</div><div class="myadprice">${ad.price ? ad.price + ' $' : 'مجاني'}</div></div>
      <i class="fa fa-chevron-left" style="color:var(--gray);font-size:.8em"></i>
    </div>`).join('')
    : '<div class="empty-state"><i class="fa fa-heart"></i><p>لا توجد إعلانات في المفضلة</p></div>';
  openM('favModal');
}

// ===== تفاصيل الإعلان =====
export function openDetail(id) {
  const ad = allAds.find(a => a.id === id);
  if (!ad) return;
  const CU = getCurrentUser();
  const own = CU && CU.uid === ad.userId;
  const admin = getIsAdmin();
  const body = document.getElementById('detailBody');
  if (!body) return;
  body.innerHTML = `
    ${ad.imageUrl ? `<img class="det-img" src="${ad.imageUrl}" alt="">` : ''}
    ${ad.featured ? '<div style="color:var(--gold);font-weight:800;margin-bottom:6px">⭐ إعلان مميز</div>' : ''}
    <span style="background:var(--blue-light);color:var(--blue);padding:3px 10px;border-radius:20px;font-size:.78em;font-weight:700">${ad.category || ''}</span>
    <h3 style="font-size:1.1em;font-weight:800;margin:10px 0 4px">${ad.title || ''}</h3>
    <div class="det-price">${ad.price ? Number(ad.price).toLocaleString() + ' $' : 'مجاني'}</div>
    <p class="det-desc">${(ad.description || '').replace(/\n/g, '<br>')}</p>
    <div class="infobox">
      ${ad.phone ? `<div class="inforow"><i class="fa fa-phone"></i><span>${ad.phone}</span></div>` : ''}
      <div class="inforow"><i class="fa fa-map-marker-alt"></i><span>${ad.area || 'دير الزور'}</span></div>
      <div class="inforow"><i class="fa fa-clock"></i><span>${ago(ad.createdAt)}</span></div>
    </div>
    ${ad.phone ? `
      <a href="tel:${ad.phone}" class="callbtn"><i class="fa fa-phone-alt"></i> اتصل بالبائع</a>
      <a href="https://wa.me/${ad.phone.replace(/\D/g, '')}" target="_blank" class="wabtn"><i class="fa fa-comment"></i> تواصل عبر واتساب</a>` : ''}
    ${!own && CU ? `<div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="window.startChat('${ad.id}','${ad.userId}','${(ad.title || '').replace(/'/g, '')}','${(ad.userName || 'البائع').replace(/'/g, '')}')"><i class="fa fa-comment-dots"></i> راسل البائع</button></div>` : ''}
    ${own ? `<div class="actbtns"><button class="btn btn-blue btn-sm" onclick="closeM('detailModal');window.openEdit('${ad.id}')"><i class="fa fa-edit"></i> تعديل</button><button class="btn btn-red btn-sm" onclick="window.delAd('${ad.id}')"><i class="fa fa-trash"></i> حذف</button></div>` : ''}
    ${admin && !own ? `<div class="actbtns" style="margin-top:6px"><button class="btn btn-red btn-sm" onclick="window.adminDel('${ad.id}')"><i class="fa fa-trash"></i> حذف (مدير)</button><button class="btn btn-gold btn-sm" onclick="window.adminToggleFeat('${ad.id}',${!!ad.featured})">${ad.featured ? 'إلغاء التمييز' : '⭐ تمييز'}</button></div>` : ''}
  `;
  openM('detailModal');
}

// ===== إضافة إعلان =====
export async function doAddAd() {
  const t = document.getElementById('adT').value.trim();
  const d = document.getElementById('adD').value.trim();
  const pr = document.getElementById('adPr').value;
  const ph = document.getElementById('adPh').value.trim();
  const cat = document.getElementById('adCat').value;
  const area = document.getElementById('adArea').value;
  const errEl = document.getElementById('addErr');
  if (!t || !d || !pr || !ph || !cat) {
    errEl.textContent = 'يرجى ملء جميع الحقول المطلوبة *';
    errEl.className = 'errmsg show';
    return;
  }
  errEl.className = 'errmsg';
  const btn = document.getElementById('addBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري النشر...';
  try {
    let imgUrl = null;
    const f = document.getElementById('adImg').files[0];
    if (f) {
      const fd = new FormData();
      fd.append('file', f);
      fd.append('upload_preset', 'souq_ads');
      fd.append('folder', 'souq_ads');
      const res = await fetch('https://api.cloudinary.com/v1_1/dzjy5tubx/image/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.secure_url) throw new Error('فشل رفع الصورة');
      imgUrl = data.secure_url;
    }
    const CU = getCurrentUser();
    await addDoc(collection(db, 'ads'), {
      title: t,
      description: d,
      price: parseFloat(pr) || 0,
      phone: ph,
      category: cat,
      area,
      imageUrl: imgUrl,
      featured: false,
      userId: CU.uid,
      userEmail: CU.email || '',
      userName: CU.displayName || 'مستخدم',
      createdAt: serverTimestamp()
    });
    closeM('addModal');
    ['adT', 'adD', 'adPr', 'adPh'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('adCat').value = '';
    document.getElementById('imgPrev').innerHTML = '';
    toast('تم نشر إعلانك بنجاح! 🎉', 'ok');
    loadAds();
  } catch (ex) {
    errEl.textContent = ex.message || 'حدث خطأ أثناء النشر';
    errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-paper-plane"></i> نشر الإعلان';
  }
}

// ===== تعديل إعلان =====
export function openEdit(id) {
  const ad = allAds.find(a => a.id === id);
  if (!ad) return;
  document.getElementById('edId').value = id;
  document.getElementById('edT').value = ad.title || '';
  document.getElementById('edD').value = ad.description || '';
  document.getElementById('edPr').value = ad.price || '';
  document.getElementById('edPh').value = ad.phone || '';
  const opts = CATS.filter(c => c.n !== 'الكل').map(c => `<option value="${c.n}">${c.n}</option>`).join('');
  document.getElementById('edCat').innerHTML = '<option value="">اختر...</option>' + opts;
  document.getElementById('edCat').value = ad.category || '';
  document.getElementById('editErr').className = 'errmsg';
  openM('editModal');
}

export async function doEditAd() {
  const id = document.getElementById('edId').value;
  const t = document.getElementById('edT').value.trim();
  const d = document.getElementById('edD').value.trim();
  const pr = document.getElementById('edPr').value;
  const ph = document.getElementById('edPh').value.trim();
  const cat = document.getElementById('edCat').value;
  const errEl = document.getElementById('editErr');
  if (!t || !d) {
    errEl.textContent = 'العنوان والوصف مطلوبان';
    errEl.className = 'errmsg show';
    return;
  }
  errEl.className = 'errmsg';
  const btn = document.getElementById('editBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    await updateDoc(doc(db, 'ads', id), {
      title: t,
      description: d,
      price: parseFloat(pr) || 0,
      phone: ph,
      category: cat
    });
    closeM('editModal');
    toast('تم حفظ التعديلات ✅', 'ok');
    loadAds();
  } catch (e) {
    errEl.textContent = 'حدث خطأ';
    errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-save"></i> حفظ التعديلات';
  }
}

// ===== حذف إعلان =====
export function delAd(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
  deleteDoc(doc(db, 'ads', id))
    .then(() => {
      closeM('detailModal');
      toast('تم الحذف', 'ok');
      loadAds();
    })
    .catch(() => toast('خطأ في الحذف', 'bad'));
}

// ===== لوحة التحكم (الحساب) =====
export async function openDash() {
  const CU = getCurrentUser();
  if (!CU) { openM('authModal'); return; }
  const body = document.getElementById('dashBody');
  if (!body) return;
  body.innerHTML = '<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openM('dashModal');
  const myAds = allAds.filter(a => a.userId === CU.uid);
  let ud = { name: CU.displayName || 'مستخدم', phone: '', email: '' };
  try {
    const docSnap = await getDoc(doc(db, 'users', CU.uid));
    if (docSnap.exists()) ud = { ...ud, ...docSnap.data() };
  } catch (e) {}
  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="width:52px;height:52px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.4em;font-weight:800">${(ud.name || 'U').charAt(0).toUpperCase()}</div>
      <div>
        <div style="font-weight:800;font-size:1.05em">${ud.name}</div>
        <div style="font-size:.78em;color:var(--gray)">${ud.phone || ''}</div>
        <div style="font-size:.75em;color:var(--gray)">${ud.email || ''}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="dcard" style="text-align:center"><div class="dstat">${myAds.length}</div><div style="font-size:.72em;color:var(--gray)">إعلاناتي</div></div>
      <div class="dcard" style="text-align:center"><div class="dstat" style="color:var(--gold)">${myAds.filter(a => a.featured).length}</div><div style="font-size:.72em;color:var(--gray)">مميزة</div></div>
      <div class="dcard" style="text-align:center"><div class="dstat" style="color:var(--green)">${favs.size}</div><div style="font-size:.72em;color:var(--gray)">مفضلة</div></div>
    </div>
    <span class="slabel">إعلاناتي</span>
    ${myAds.length ? myAds.map(ad => `
      <div class="myadrow">
        <div class="myadimg">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
        <div class="myadinfo">
          <div class="myadtitle">${ad.title || ''}</div>
          <div class="myadprice">${ad.price ? ad.price + ' $' : 'مجاني'}</div>
          <div class="myadstatus">${ad.featured ? '⭐ مميز · ' : ''} ${ad.area || 'دير الزور'}</div>
        </div>
        <div class="myadbtns">
          <button class="icobtn ed" onclick="closeM('dashModal');window.openEdit('${ad.id}')"><i class="fa fa-edit"></i></button>
          <button class="icobtn dl" onclick="window.delAd('${ad.id}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')
    : '<p style="text-align:center;padding:20px;color:var(--gray);font-size:.9em">لا توجد إعلانات بعد</p>'}
    <hr class="div">
    <button class="btn btn-gold" style="margin-top:4px" onclick="window.openFeatured()"><i class="fa fa-star"></i> إبراز إعلان</button>
    <button class="btn btn-outline" style="margin-top:8px;font-size:.82em;color:var(--gray);border-color:var(--gray)" onclick="window.setupAdmin()"><i class="fa fa-shield-alt"></i> إعداد صلاحية المدير (أول مرة)</button>
    <button class="btn btn-red" style="margin-top:8px" onclick="window.doLogout()"><i class="fa fa-sign-out-alt"></i> تسجيل الخروج</button>
  `;
}

// ===== الإعلانات المميزة =====
export function fillFeatSel() {
  const sel = document.getElementById('featAdSel');
  if (!sel || !getCurrentUser()) return;
  const myAds = allAds.filter(a => a.userId === getCurrentUser().uid);
  sel.innerHTML = '<option value="">-- اختر إعلانك --</option>' + myAds.map(a => `<option value="${a.id}">${a.title || 'إعلان'}</option>`).join('');
}

export async function reqFeatured() {
  const adId = document.getElementById('featAdSel').value;
  if (!adId) { toast('اختر إعلاناً أولاً', 'bad'); return; }
  const ad = allAds.find(a => a.id === adId);
  const CU = getCurrentUser();
  await addDoc(collection(db, 'featuredRequests'), {
    adId,
    adTitle: ad ? ad.title : '',
    userId: CU.uid,
    userEmail: CU.email || '',
    plan: chosenPlan,
    status: 'pending',
    createdAt: serverTimestamp()
  }).catch(() => {});
  const msg = `طلب تمييز إعلان%0Aالإعلان: ${ad ? ad.title : ''}%0Aالخطة: ${chosenPlan}%0Aالبريد: ${CU.email || ''}`;
  window.open(`https://wa.me/963XXXXXXXXX?text=${msg}`, '_blank');
  closeM('featModal');
  toast('تم إرسال طلبك! سيتم التواصل معك قريباً ✅', 'ok');
  if (window.checkAdminBadge) window.checkAdminBadge();
}

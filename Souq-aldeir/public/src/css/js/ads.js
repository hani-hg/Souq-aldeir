/* ============================================================
   ADS
   تحميل / عرض / بحث / إضافة / تعديل / حذف / مفضلة الإعلانات
============================================================ */

let allAds = [];
let favs = new Set();
let activeCat = null;

try { favs = new Set(JSON.parse(localStorage.getItem('sq_favs') || '[]')); } catch (e) {}

/* -------- الفئات -------- */
function buildCats() {
  const el = document.getElementById('catsEl');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => `
    <div class="cat-chip ${(!activeCat && c.n === 'الكل') || (activeCat === c.n) ? 'active' : ''}" onclick="pickCat('${c.n}')">
      <i class="fa ${c.i}"></i><span>${c.n}</span>
    </div>`).join('');
  fillCategorySelect('adCat');
  fillCategorySelect('edCat');
}
function pickCat(n) { activeCat = (n === 'الكل') ? null : n; buildCats(); applyFilter(); }

/* -------- تحميل الإعلانات -------- */
function loadAds() {
  const grid = document.getElementById('adsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';

  db.collection('ads').orderBy('createdAt', 'desc').get()
    .then(snap => {
      allAds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      buildSlider(allAds.filter(a => a.featured));
      applyFilter();
      if (typeof fillFeatSel === 'function') fillFeatSel();
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = `<div class="empty-state"><i class="fa fa-exclamation-circle"></i><p>تعذّر التحميل<br><small>${err.message}</small></p></div>`;
    });
}

function applyFilter() {
  const q = (document.getElementById('searchQ')?.value || '').trim().toLowerCase();
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
    <div class="ad-card${ad.featured ? ' featured' : ''}" onclick="openDetail('${ad.id}')">
      ${ad.featured ? '<div class="feat-badge">⭐ مميز</div>' : ''}
      <div style="position:relative">
        ${ad.imageUrl ? `<img class="ad-img" src="${ad.imageUrl}" alt="" loading="lazy">` : `<div class="ad-noimg"><i class="fa fa-image"></i></div>`}
        <button class="ad-fav${favs.has(ad.id) ? ' liked' : ''}" onclick="event.stopPropagation();toggleFav('${ad.id}',this)"><i class="fa fa-heart"></i></button>
        ${ad.category ? `<span class="ad-catbadge">${ad.category}</span>` : ''}
      </div>
      <div class="ad-body">
        <div class="ad-price">${formatPrice(ad.price)}</div>
        <div class="ad-title">${ad.title || ''}</div>
        <div class="ad-loc"><i class="fa fa-map-marker-alt"></i> ${ad.area || 'دير الزور'}</div>
        <div class="ad-time">${timeAgo(ad.createdAt)}</div>
      </div>
    </div>`).join('');
}

/* -------- المفضلة -------- */
function toggleFav(id, btn) {
  if (favs.has(id)) { favs.delete(id); btn.classList.remove('liked'); toast('حذف من المفضلة'); }
  else { favs.add(id); btn.classList.add('liked'); toast('أضيف للمفضلة ❤️', 'ok'); }
  try { localStorage.setItem('sq_favs', JSON.stringify([...favs])); } catch (e) {}
}

function openFavs() {
  const list = allAds.filter(a => favs.has(a.id));
  const body = document.getElementById('favBody');
  if (!body) return;
  body.innerHTML = list.length ? list.map(ad => `
    <div class="myadrow" onclick="closeM('favModal');openDetail('${ad.id}')">
      <div class="myadimg">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
      <div class="myadinfo"><div class="myadtitle">${ad.title || ''}</div><div class="myadprice">${formatPrice(ad.price)}</div></div>
      <i class="fa fa-chevron-left" style="color:var(--gray);font-size:.8em"></i>
    </div>`).join('') : '<div class="empty-state"><i class="fa fa-heart"></i><p>لا توجد إعلانات في المفضلة</p></div>';
  openM('favModal');
}

/* -------- تفاصيل الإعلان -------- */
function openDetail(id) {
  const ad = allAds.find(a => a.id === id); if (!ad) return;
  const own = CU && CU.uid === ad.userId;
  document.getElementById('detailBody').innerHTML = `
    ${ad.imageUrl ? `<img class="det-img" src="${ad.imageUrl}" alt="">` : ''}
    ${ad.featured ? '<div style="color:var(--gold);font-weight:800;margin-bottom:6px">⭐ إعلان مميز</div>' : ''}
    <span style="background:var(--blue-light);color:var(--blue);padding:3px 10px;border-radius:20px;font-size:.78em;font-weight:700">${ad.category || ''}</span>
    <h3 style="font-size:1.1em;font-weight:800;margin:10px 0 4px">${ad.title || ''}</h3>
    <div class="det-price">${formatPrice(ad.price)}</div>
    <p class="det-desc">${(ad.description || '').replace(/\n/g, '<br>')}</p>
    <div class="infobox">
      ${ad.phone ? `<div class="inforow"><i class="fa fa-phone"></i><span>${ad.phone}</span></div>` : ''}
      <div class="inforow"><i class="fa fa-map-marker-alt"></i><span>${ad.area || 'دير الزور'}</span></div>
      <div class="inforow"><i class="fa fa-clock"></i><span>${timeAgo(ad.createdAt)}</span></div>
    </div>
    ${ad.phone ? `
      <a href="tel:${ad.phone}" class="callbtn"><i class="fa fa-phone-alt"></i> اتصل بالبائع</a>
      <a href="https://wa.me/${ad.phone.replace(/\D/g, '')}" target="_blank" class="wabtn"><i class="fa fa-comment"></i> تواصل عبر واتساب</a>` : ''}
    ${(!own && CU) ? `<div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="startChat('${ad.id}','${ad.userId}','${(ad.title || '').replace(/'/g, '')}','${(ad.userName || 'البائع').replace(/'/g, '')}')"><i class="fa fa-comment-dots"></i> راسل البائع</button></div>` : ''}
    ${own ? `<div class="actbtns"><button class="btn btn-blue btn-sm" onclick="closeM('detailModal');openEdit('${ad.id}')"><i class="fa fa-edit"></i> تعديل</button><button class="btn btn-red btn-sm" onclick="delAd('${ad.id}')"><i class="fa fa-trash"></i> حذف</button></div>` : ''}
    ${(isAdmin && !own) ? `<div class="actbtns" style="margin-top:6px"><button class="btn btn-red btn-sm" onclick="adminDel('${ad.id}')"><i class="fa fa-trash"></i> حذف (مدير)</button><button class="btn btn-gold btn-sm" onclick="adminToggleFeat('${ad.id}',${!!ad.featured})">${ad.featured ? 'إلغاء التمييز' : '⭐ تمييز'}</button></div>` : ''}
  `;
  openM('detailModal');
}

/* -------- إضافة إعلان -------- */
function initAddAdForm() {
  const fab = document.getElementById('fabBtn');
  if (fab) fab.onclick = function () {
    if (!CU) { openM('authModal'); toast('سجل دخولك أولاً', 'bad'); return; }
    document.getElementById('addErr').className = 'errmsg';
    openM('addModal');
  };
  const imgInput = document.getElementById('adImg');
  if (imgInput) imgInput.onchange = function () {
    const f = this.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => document.getElementById('imgPrev').innerHTML = `<img src="${e.target.result}">`;
    r.readAsDataURL(f);
  };
}

async function doAddAd() {
  const t = document.getElementById('adT').value.trim(), d = document.getElementById('adD').value.trim();
  const pr = document.getElementById('adPr').value, ph = document.getElementById('adPh').value.trim();
  const cat = document.getElementById('adCat').value, area = document.getElementById('adArea').value;
  const errEl = document.getElementById('addErr');
  if (!t || !d || !pr || !ph || !cat) { errEl.textContent = 'يرجى ملء جميع الحقول *'; errEl.className = 'errmsg show'; return; }
  errEl.className = 'errmsg';

  const btn = document.getElementById('addBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري النشر...';
  try {
    let imgUrl = null;
    const f = document.getElementById('adImg').files[0];
    if (f) imgUrl = await uploadImage(f);

    await db.collection('ads').add({
      title: t, description: d, price: parseFloat(pr) || 0, phone: ph, category: cat, area,
      imageUrl: imgUrl, featured: false,
      userId: CU.uid, userEmail: CU.email || '', userName: CU.displayName || 'مستخدم',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    closeM('addModal');
    ['adT', 'adD', 'adPr', 'adPh'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('adCat').value = '';
    document.getElementById('imgPrev').innerHTML = '';
    toast('تم نشر إعلانك بنجاح! 🎉', 'ok');
    loadAds();
  } catch (ex) {
    errEl.textContent = ex.message || 'حدث خطأ'; errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-paper-plane"></i> نشر الإعلان';
  }
}

/* -------- تعديل إعلان -------- */
function openEdit(id) {
  const ad = allAds.find(a => a.id === id); if (!ad) return;
  document.getElementById('edId').value = id;
  document.getElementById('edT').value = ad.title || '';
  document.getElementById('edD').value = ad.description || '';
  document.getElementById('edPr').value = ad.price || '';
  document.getElementById('edPh').value = ad.phone || '';
  fillCategorySelect('edCat');
  document.getElementById('edCat').value = ad.category || '';
  document.getElementById('editErr').className = 'errmsg';
  openM('editModal');
}

async function doEditAd() {
  const id = document.getElementById('edId').value;
  const t = document.getElementById('edT').value.trim(), d = document.getElementById('edD').value.trim();
  const pr = document.getElementById('edPr').value, ph = document.getElementById('edPh').value.trim();
  const cat = document.getElementById('edCat').value;
  const errEl = document.getElementById('editErr');
  if (!t || !d) { errEl.textContent = 'العنوان والوصف مطلوبان'; errEl.className = 'errmsg show'; return; }
  errEl.className = 'errmsg';

  const btn = document.getElementById('editBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    await db.collection('ads').doc(id).update({ title: t, description: d, price: parseFloat(pr) || 0, phone: ph, category: cat });
    closeM('editModal'); toast('تم حفظ التعديلات ✅', 'ok'); loadAds();
  } catch (e) {
    errEl.textContent = 'حدث خطأ'; errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-save"></i> حفظ التعديلات';
  }
}

/* -------- حذف إعلان (صاحبه) -------- */
function delAd(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
  db.collection('ads').doc(id).delete()
    .then(() => { closeM('detailModal'); toast('تم الحذف', 'ok'); loadAds(); })
    .catch(() => toast('خطأ في الحذف', 'bad'));
}

/* -------- تشغيل البحث الفوري + الفرز -------- */
function initAdsSearchSort() {
  const s = document.getElementById('searchQ');
  if (s) s.addEventListener('input', applyFilter);
  const so = document.getElementById('sortEl');
  if (so) so.addEventListener('change', applyFilter);
}

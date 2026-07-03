/* ============================================================
   APP
   منطق الصفحة الرئيسية: لوحة الحساب، الإعلانات المميزة، الشريط الإخباري
   يُحمَّل فقط في index.html
============================================================ */

let chosenPlan = '3 أيام - 1$';

/* -------- الشريط الإخباري -------- */
function loadNews() {
  const el = document.getElementById('newsInner');
  if (!el) return;
  db.collection('settings').doc('news').get().then(doc => {
    const items = (doc.exists && doc.data().items) || [
      'مرحباً بكم في سوق دير الزور 🛒', 'النشر مجاني للجميع', 'للإعلانات المميزة تواصل مع الإدارة ⭐'
    ];
    el.innerHTML = items.map(t => `<span>📌 ${t}</span>`).join('');
  }).catch(() => {});
}

/* -------- لوحة حسابي -------- */
async function openDash() {
  if (!CU) { openM('authModal'); return; }
  document.getElementById('dashBody').innerHTML = '<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openM('dashModal');

  const myAds = allAds.filter(a => a.userId === CU.uid);
  let ud = { name: CU.displayName || 'مستخدم', phone: '', email: '' };
  try {
    const doc = await db.collection('users').doc(CU.uid).get();
    if (doc.exists) ud = { ...ud, ...doc.data() };
  } catch (e) {}

  document.getElementById('dashBody').innerHTML = `
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
          <div class="myadprice">${formatPrice(ad.price)}</div>
          <div class="myadstatus">${ad.featured ? '⭐ مميز · ' : ''} ${ad.area || 'دير الزور'}</div>
        </div>
        <div class="myadbtns">
          <button class="icobtn ed" onclick="closeM('dashModal');openEdit('${ad.id}')"><i class="fa fa-edit"></i></button>
          <button class="icobtn dl" onclick="delAd('${ad.id}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('') : '<p style="text-align:center;padding:20px;color:var(--gray);font-size:.9em">لا توجد إعلانات بعد</p>'}
    <hr class="div">
    <button class="btn btn-gold" style="margin-top:4px" onclick="openFeatured()"><i class="fa fa-star"></i> إبراز إعلان</button>
    <button class="btn btn-outline" style="margin-top:8px;font-size:.82em;color:var(--gray);border-color:var(--gray)" onclick="setupAdmin()"><i class="fa fa-shield-alt"></i> إعداد صلاحية المدير (أول مرة)</button>
    <button class="btn btn-red" style="margin-top:8px" onclick="doLogout()"><i class="fa fa-sign-out-alt"></i> تسجيل الخروج</button>
  `;
}

/* -------- الإعلانات المميزة (طلب تمييز) -------- */
function openFeatured() {
  if (!CU) { openM('authModal'); toast('سجل دخولك أولاً', 'bad'); return; }
  fillFeatSel(); openM('featModal');
}

function fillFeatSel() {
  const sel = document.getElementById('featAdSel'); if (!sel || !CU) return;
  const myAds = allAds.filter(a => a.userId === CU.uid);
  sel.innerHTML = '<option value="">-- اختر إعلانك --</option>' + myAds.map(a => `<option value="${a.id}">${a.title || 'إعلان'}</option>`).join('');
}

function pickPlan(el, plan) {
  chosenPlan = plan;
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
}

async function reqFeatured() {
  const adId = document.getElementById('featAdSel').value;
  if (!adId) { toast('اختر إعلاناً أولاً', 'bad'); return; }
  const ad = allAds.find(a => a.id === adId);

  await db.collection('featuredRequests').add({
    adId, adTitle: ad ? ad.title : '', userId: CU.uid, userEmail: CU.email || '',
    plan: chosenPlan, status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(() => {});

  const msg = `طلب تمييز إعلان%0Aالإعلان: ${ad ? ad.title : ''}%0Aالخطة: ${chosenPlan}%0Aالبريد: ${CU.email || ''}`;
  window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  closeM('featModal'); toast('تم إرسال طلبك! سيتم التواصل معك قريباً ✅', 'ok');
  if (typeof checkAdminBadge === 'function') checkAdminBadge();
}

/* -------- تهيئة الصفحة الرئيسية -------- */
document.addEventListener('DOMContentLoaded', () => {
  buildCats();
  loadNews();
  initAddAdForm();
  initAdsSearchSort();
});

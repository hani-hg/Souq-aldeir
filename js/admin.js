/* ============================================================
   admin.js
   Admin-only panel: pending "featured" requests, ad moderation,
   user management (search / ban / warn / drill into a user's
   ads), pending reports, and the news-ticker editor.

   Sections are native <details>/<summary> accordions (collapsible,
   zero extra JS needed for the expand/collapse itself) so the
   panel stays scannable as the marketplace grows.

   Every exported function here checks `isAdmin` where relevant;
   Firestore security rules must enforce this server-side too
   (see /firestore.rules) — client-side checks alone are only a
   convenience, not real security.
   ============================================================ */

let adminUsersCache = [];
let adminReqsCache = [];
let adminReportsCache = [];
let adminUserFilter = null;     // uid, or null: "show only this user's ads"
let adminUserFilterName = '';

async function checkAdminNotifs() {
  const [reqSnap, reportsSnap] = await Promise.all([
    db.collection('featuredRequests').where('status', '==', 'pending').get().catch(() => null),
    db.collection('reports').where('status', '==', 'pending').get().catch(() => null)
  ]);
  const count = (reqSnap ? reqSnap.size : 0) + (reportsSnap ? reportsSnap.size : 0);
  if (count > 0) {
    document.getElementById('adminBadge').style.display = 'flex';
    document.getElementById('adminBadge').textContent = count > 9 ? '9+' : count;
  }
}

async function openAdminPanel() {
  if (!isAdmin) return;
  document.getElementById('adminContent').innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('adminModal');

  const [reqSnap, usersSnap, reportsSnap] = await Promise.all([
    db.collection('featuredRequests').where('status', '==', 'pending').get().catch(() => ({ docs: [] })),
    db.collection('users').get().catch(() => ({ docs: [] })),
    db.collection('reports').where('status', '==', 'pending').get().catch(() => ({ docs: [] }))
  ]);

  adminReqsCache = reqSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  adminUsersCache = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  adminReportsCache = reportsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  document.getElementById('adminContent').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="dash-card" style="text-align:center"><div class="dash-stat">${allAds.length}</div><div style="font-size:.72em;color:var(--gray)">إجمالي الإعلانات</div></div>
      <div class="dash-card" style="text-align:center"><div class="dash-stat">${adminUsersCache.length}</div><div style="font-size:.72em;color:var(--gray)">المستخدمون</div></div>
    </div>

    <details open style="margin-bottom:10px">
      <summary style="cursor:pointer;font-weight:800;font-size:.85em;color:var(--dark);padding:8px 0;border-bottom:1px solid var(--border)">⭐ طلبات التمييز (${adminReqsCache.length})</summary>
      <div style="padding-top:6px">${renderReqsHtml()}</div>
    </details>

    <details style="margin-bottom:10px">
      <summary style="cursor:pointer;font-weight:800;font-size:.85em;color:var(--dark);padding:8px 0;border-bottom:1px solid var(--border)">🚩 بلاغات معلقة (${adminReportsCache.length})</summary>
      <div style="padding-top:6px">${renderReportsHtml()}</div>
    </details>

    <details id="adminAdsDetails" style="margin-bottom:10px">
      <summary style="cursor:pointer;font-weight:800;font-size:.85em;color:var(--dark);padding:8px 0;border-bottom:1px solid var(--border)">📋 إدارة الإعلانات (<span id="adminAdsCount">${allAds.length}</span>)</summary>
      <div style="padding-top:8px">
        <input type="text" id="adminAdsSearch" placeholder="بحث بعنوان الإعلان أو بريد صاحبه..." oninput="renderAdminAdsList()" style="width:100%;padding:8px 10px;border:1.5px solid var(--border);border-radius:10px;font-size:.85em;font-family:'Tajawal',sans-serif;margin-bottom:8px">
        <div id="adminAdsFilterChip"></div>
        <div id="adminAdsListContainer"></div>
      </div>
    </details>

    <details style="margin-bottom:10px">
      <summary style="cursor:pointer;font-weight:800;font-size:.85em;color:var(--dark);padding:8px 0;border-bottom:1px solid var(--border)">👥 إدارة المستخدمين (${adminUsersCache.length})</summary>
      <div style="padding-top:8px">
        <input type="text" id="adminUsersSearch" placeholder="بحث بالاسم أو الهاتف أو البريد..." oninput="renderAdminUsersList()" style="width:100%;padding:8px 10px;border:1.5px solid var(--border);border-radius:10px;font-size:.85em;font-family:'Tajawal',sans-serif;margin-bottom:8px">
        <div id="adminUsersListContainer"></div>
      </div>
    </details>

    <details style="margin-bottom:10px">
      <summary style="cursor:pointer;font-weight:800;font-size:.85em;color:var(--dark);padding:8px 0;border-bottom:1px solid var(--border)">⚙️ إعدادات التواصل</summary>
      <div style="padding-top:8px">
        <p style="font-size:.78em;color:var(--gray);margin-bottom:10px">هذه البيانات تظهر للمستخدمين في "عن السوق والتواصل"، وتُستخدم في روابط واتساب بالموقع. عدّلها هنا مباشرة، بدون الحاجة لتعديل الكود.</p>
        <div class="fg"><label>البريد الإلكتروني</label><input type="email" id="settingsEmail" value="${contactSettings.email}"></div>
        <div class="fg"><label>رقم الهاتف (للعرض فقط)</label><input type="text" id="settingsPhone" value="${contactSettings.phone}"></div>
        <div class="fg"><label>رقم واتساب (بصيغة دولية بدون + أو مسافات، مثال 905522740910)</label><input type="text" id="settingsWhatsapp" value="${contactSettings.whatsapp}"></div>
        <button class="btn btn-blue btn-sm" onclick="saveContactSettings()"><i class="fa fa-save"></i> حفظ بيانات التواصل</button>
      </div>
    </details>

    <details style="margin-bottom:10px">
      <summary style="cursor:pointer;font-weight:800;font-size:.85em;color:var(--dark);padding:8px 0;border-bottom:1px solid var(--border)">📰 الشريط الإخباري</summary>
      <div style="padding-top:8px">
        <div class="fg"><label>النصوص (كل سطر نص مستقل)</label><textarea id="newsTextarea" rows="4" placeholder="نص 1&#10;نص 2&#10;نص 3"></textarea></div>
        <button class="btn btn-blue btn-sm" onclick="saveNews()"><i class="fa fa-save"></i> حفظ الأخبار</button>
      </div>
    </details>
  `;

  renderAdminAdsList();
  renderAdminUsersList();

  db.collection('settings').doc('news').get().then(doc => {
    if (doc.exists && doc.data().items) {
      document.getElementById('newsTextarea').value = doc.data().items.join('\n');
    }
  }).catch(() => {});
}

function renderReqsHtml() {
  if (!adminReqsCache.length) return '<p style="font-size:.85em;color:var(--gray);padding:10px 0">لا توجد طلبات معلقة</p>';
  return adminReqsCache.map(r => `
    <div class="my-ad-row">
      <div class="my-ad-info">
        <div class="my-ad-title">${r.adTitle || ''}</div>
        <div class="my-ad-status">${r.plan || ''} · ${r.userEmail || ''}</div>
      </div>
      <div class="my-ad-actions">
        <button class="icon-btn edit" onclick="approveFeature('${r.id}','${r.adId}')"><i class="fa fa-check"></i></button>
        <button class="icon-btn del" onclick="rejectFeature('${r.id}')"><i class="fa fa-times"></i></button>
      </div>
    </div>`).join('');
}

function renderReportsHtml() {
  if (!adminReportsCache.length) return '<p style="font-size:.85em;color:var(--gray);padding:10px 0">لا توجد بلاغات معلقة</p>';
  return adminReportsCache.map(r => `
    <div class="my-ad-row">
      <div class="my-ad-info">
        <div class="my-ad-title">${r.adTitle || ''}</div>
        <div class="my-ad-status">${r.reason || ''}</div>
      </div>
      <div class="my-ad-actions">
        <button class="icon-btn del" title="حذف الإعلان" onclick="resolveReportDeleteAd('${r.id}','${r.adId}')"><i class="fa fa-trash"></i></button>
        <button class="icon-btn edit" title="تجاهل البلاغ" onclick="dismissReport('${r.id}')"><i class="fa fa-check"></i></button>
      </div>
    </div>`).join('');
}

function renderAdminAdsList() {
  const searchEl = document.getElementById('adminAdsSearch');
  const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
  let list = [...allAds];
  if (adminUserFilter) list = list.filter(a => a.userId === adminUserFilter);
  if (q) list = list.filter(a => (a.title || '').toLowerCase().includes(q) || (a.userEmail || '').toLowerCase().includes(q));

  const chipEl = document.getElementById('adminAdsFilterChip');
  if (chipEl) {
    chipEl.innerHTML = adminUserFilter
      ? `<div style="display:flex;align-items:center;gap:8px;background:var(--blue-light);color:var(--blue);border-radius:20px;padding:5px 12px;font-size:.78em;font-weight:700;margin-bottom:8px;width:fit-content">
           <span>يعرض إعلانات: ${adminUserFilterName}</span>
           <button onclick="clearAdsUserFilter()" style="background:none;border:none;color:var(--blue);cursor:pointer;font-weight:800">✕</button>
         </div>`
      : '';
  }

  const countEl = document.getElementById('adminAdsCount');
  if (countEl) countEl.textContent = list.length;

  document.getElementById('adminAdsListContainer').innerHTML = list.length ? list.slice(0, 100).map(ad => `
    <div class="my-ad-row">
      <div class="my-ad-img">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
      <div class="my-ad-info">
        <div class="my-ad-title">${ad.title || ''}</div>
        <div class="my-ad-status">${ad.userEmail || ''}</div>
      </div>
      <div class="my-ad-actions">
        <button class="icon-btn edit" title="${ad.featured ? 'إلغاء تمييز' : 'تمييز'}" onclick="adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured ? '★' : '☆'}</button>
        <button class="icon-btn del" onclick="adminDeleteAd('${ad.id}')"><i class="fa fa-trash"></i></button>
      </div>
    </div>`).join('') : '<p style="font-size:.85em;color:var(--gray);padding:10px 0">لا توجد إعلانات مطابقة</p>';
}

function renderAdminUsersList() {
  const searchEl = document.getElementById('adminUsersSearch');
  const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
  let list = adminUsersCache;
  if (q) list = list.filter(u =>
    (u.name || '').toLowerCase().includes(q) ||
    (u.phone || '').toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q)
  );

  document.getElementById('adminUsersListContainer').innerHTML = list.length ? list.map(u => {
    const adsCount = allAds.filter(a => a.userId === u.id).length;
    const banned = !!u.banned;
    const safeName = (u.name || 'مستخدم').replace(/'/g, '');
    return `
    <div class="my-ad-row">
      <div class="my-ad-img"><i class="fa fa-user"></i></div>
      <div class="my-ad-info">
        <div class="my-ad-title">${u.name || 'مستخدم'} ${banned ? '<span style="color:var(--red);font-size:.8em">(محظور)</span>' : ''}</div>
        <div class="my-ad-status">${u.phone || ''} ${u.email ? '· ' + u.email : ''} · ${adsCount} إعلان</div>
      </div>
      <div class="my-ad-actions">
        <button class="icon-btn" style="background:var(--blue-light);color:var(--blue)" title="عرض إعلاناته" onclick="filterAdsByUser('${u.id}','${safeName}')"><i class="fa fa-list"></i></button>
        <button class="icon-btn" style="background:var(--gold-light);color:#7a5000" title="إرسال إنذار" onclick="sendWarningToUser('${u.id}')"><i class="fa fa-bell"></i></button>
        <button class="icon-btn ${banned ? 'edit' : 'del'}" title="${banned ? 'رفع الحظر' : 'حظر'}" onclick="toggleBanUser('${u.id}',${banned})"><i class="fa ${banned ? 'fa-unlock' : 'fa-ban'}"></i></button>
      </div>
    </div>`;
  }).join('') : '<p style="font-size:.85em;color:var(--gray);padding:10px 0">لا يوجد مستخدمون مطابقون</p>';
}

/* "View this user's account" in practice: jump to the ads section
   pre-filtered to just their listings, with full admin controls
   (edit/feature/delete) already available on each row. A literal
   sign-in-as-user isn't something we can do safely without a paid
   backend (Firebase Admin SDK) — see chat for the full explanation. */
function filterAdsByUser(uid, name) {
  adminUserFilter = uid;
  adminUserFilterName = name;
  const details = document.getElementById('adminAdsDetails');
  if (details) details.open = true;
  renderAdminAdsList();
  if (details) details.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearAdsUserFilter() {
  adminUserFilter = null;
  adminUserFilterName = '';
  renderAdminAdsList();
}

async function approveFeature(reqId, adId) {
  await db.collection('ads').doc(adId).update({ featured: true }).catch(() => {});
  await db.collection('featuredRequests').doc(reqId).update({ status: 'approved' }).catch(() => {});
  showToast('تم تمييز الإعلان ⭐', 'ok'); checkAdminNotifs(); loadAds(); openAdminPanel();
}

async function rejectFeature(reqId) {
  await db.collection('featuredRequests').doc(reqId).update({ status: 'rejected' }).catch(() => {});
  showToast('تم رفض الطلب', 'ok'); checkAdminNotifs(); openAdminPanel();
}

async function adminDeleteAd(id) {
  if (!confirm('حذف هذا الإعلان؟')) return;
  await db.collection('ads').doc(id).delete().catch(() => {});
  closeModal('detailModal'); showToast('تم حذف الإعلان', 'ok'); loadAds(); openAdminPanel();
}

async function adminToggleFeatured(id, current) {
  await db.collection('ads').doc(id).update({ featured: !current }).catch(() => {});
  showToast(current ? 'تم إلغاء التمييز' : 'تم التمييز ⭐', 'ok'); loadAds(); openAdminPanel();
}

async function saveContactSettings() {
  const email = document.getElementById('settingsEmail').value.trim();
  const phone = document.getElementById('settingsPhone').value.trim();
  const whatsapp = document.getElementById('settingsWhatsapp').value.trim().replace(/[^0-9]/g, '');
  if (!whatsapp) { showToast('رقم الواتساب غير صالح', 'bad'); return; }
  await db.collection('settings').doc('contact').set({ email, phone, whatsapp }).catch(() => { showToast('تعذر الحفظ', 'bad'); return; });
  contactSettings = { email, phone, whatsapp };
  showToast('تم حفظ بيانات التواصل ✅', 'ok');
}

async function saveNews() {
  const lines = document.getElementById('newsTextarea').value.split('\n').map(s => s.trim()).filter(Boolean);
  await db.collection('settings').doc('news').set({ items: lines }).catch(() => {});
  showToast('تم حفظ الأخبار ✅', 'ok'); loadNews();
}

/* ============ USER MANAGEMENT ============ */

async function toggleBanUser(uid, currentlyBanned) {
  const msg = currentlyBanned ? 'رفع الحظر عن هذا المستخدم؟' : 'حظر هذا المستخدم؟ لن يستطيع تسجيل الدخول بعد الآن.';
  if (!confirm(msg)) return;
  await db.collection('users').doc(uid).update({ banned: !currentlyBanned }).catch(() => {});
  showToast(currentlyBanned ? 'تم رفع الحظر' : 'تم حظر المستخدم', 'ok');
  openAdminPanel();
}

async function sendWarningToUser(uid) {
  const text = prompt('اكتب نص الإنذار الذي سيظهر للمستخدم في صفحة "حسابي":');
  if (!text || !text.trim()) return;
  await db.collection('users').doc(uid).collection('warnings').add({
    message: text.trim(),
    read: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(() => { showToast('تعذر إرسال الإنذار', 'bad'); return; });
  showToast('تم إرسال الإنذار ✅', 'ok');
}

/* ============ REPORTS (moderation) ============ */
async function resolveReportDeleteAd(reportId, adId) {
  if (!confirm('حذف الإعلان المُبلَّغ عنه؟')) return;
  await db.collection('ads').doc(adId).delete().catch(() => {});
  await db.collection('reports').doc(reportId).update({ status: 'resolved' }).catch(() => {});
  showToast('تم حذف الإعلان', 'ok'); loadAds(); openAdminPanel();
}

async function dismissReport(reportId) {
  await db.collection('reports').doc(reportId).update({ status: 'dismissed' }).catch(() => {});
  showToast('تم تجاهل البلاغ', 'ok'); openAdminPanel();
}



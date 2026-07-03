/* ============================================================
   ADMIN
   منطق لوحة تحكم المدير (يُستخدم في admin.html وفي نافذة المدير بالرئيسية)
============================================================ */

/* -------- شارة الإشعارات في الأعلى -------- */
async function checkAdminBadge() {
  const badge = document.getElementById('adminBadge');
  if (!badge) return;
  const snap = await db.collection('featuredRequests').where('status', '==', 'pending').get().catch(() => null);
  if (snap && snap.size > 0) { badge.style.display = 'flex'; badge.textContent = snap.size; }
  else badge.style.display = 'none';
}

/* -------- فتح لوحة المدير (من نافذة منبثقة في الرئيسية) -------- */
async function openAdmin() {
  if (!isAdmin) return;
  document.getElementById('adminBody').innerHTML = '<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openM('adminModal');
  await renderAdminBody('adminBody');
}

/* -------- توليد محتوى لوحة المدير (يُستخدم في admin.html أيضاً) -------- */
async function renderAdminBody(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const [reqSnap, usersSnap] = await Promise.all([
    db.collection('featuredRequests').where('status', '==', 'pending').get().catch(() => ({ docs: [] })),
    db.collection('users').get().catch(() => ({ size: 0 }))
  ]);
  const reqs = reqSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  let newsVal = '';
  try {
    const ndoc = await db.collection('settings').doc('news').get();
    if (ndoc.exists && ndoc.data().items) newsVal = ndoc.data().items.join('\n');
  } catch (e) {}

  target.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="dcard" style="text-align:center"><div class="dstat">${allAds.length}</div><div style="font-size:.72em;color:var(--gray)">إجمالي الإعلانات</div></div>
      <div class="dcard" style="text-align:center"><div class="dstat">${usersSnap.size || 0}</div><div style="font-size:.72em;color:var(--gray)">المستخدمون</div></div>
    </div>

    <span class="slabel">⭐ طلبات التمييز (${reqs.length})</span>
    ${reqs.length ? reqs.map(r => `
      <div class="admin-req">
        <div style="flex:1">
          <div style="font-weight:700;font-size:.88em">${r.adTitle || 'إعلان'}</div>
          <div style="font-size:.75em;color:var(--gray)">${r.plan || ''} · ${r.userEmail || ''}</div>
        </div>
        <button class="btn btn-green btn-sm" onclick="approveReq('${r.id}','${r.adId}')">✓ قبول</button>
        <button class="btn btn-red btn-sm" onclick="rejectReq('${r.id}')">✕ رفض</button>
      </div>`).join('') : '<p style="font-size:.85em;color:var(--gray);padding:8px 0">لا توجد طلبات معلقة ✅</p>'}

    <span class="slabel">📋 آخر الإعلانات</span>
    ${allAds.slice(0, 15).map(ad => `
      <div class="myadrow">
        <div class="myadimg">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
        <div class="myadinfo">
          <div class="myadtitle">${ad.title || ''}</div>
          <div class="myadstatus">${ad.userEmail || ''}</div>
        </div>
        <div class="myadbtns">
          <button class="icobtn ed" title="${ad.featured ? 'إلغاء تمييز' : 'تمييز'}" onclick="adminToggleFeat('${ad.id}',${!!ad.featured})" style="font-size:.75em">${ad.featured ? '★' : '☆'}</button>
          <button class="icobtn dl" onclick="adminDel('${ad.id}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')}

    <span class="slabel">👥 إدارة المستخدمين</span>
    <div id="adminUsersList"><button class="btn btn-outline btn-sm" onclick="loadAdminUsers()">عرض قائمة المستخدمين</button></div>

    <span class="slabel">📰 الشريط الإخباري</span>
    <div class="fg"><label>النصوص (كل سطر نص مستقل)</label><textarea id="newsTA" rows="4" placeholder="نص 1&#10;نص 2&#10;نص 3">${newsVal}</textarea></div>
    <button class="btn btn-blue btn-sm" onclick="saveNews()"><i class="fa fa-save"></i> حفظ الأخبار</button>
  `;
}

/* -------- إجراءات طلبات التمييز -------- */
async function approveReq(reqId, adId) {
  await db.collection('ads').doc(adId).update({ featured: true }).catch(() => {});
  await db.collection('featuredRequests').doc(reqId).update({ status: 'approved' }).catch(() => {});
  toast('تم تمييز الإعلان ⭐', 'ok');
  checkAdminBadge(); loadAds(); refreshAdminView();
}
async function rejectReq(reqId) {
  await db.collection('featuredRequests').doc(reqId).update({ status: 'rejected' }).catch(() => {});
  toast('تم رفض الطلب', 'ok');
  checkAdminBadge(); refreshAdminView();
}

/* -------- حذف/تمييز إعلان (صلاحية المدير) -------- */
async function adminDel(id) {
  if (!confirm('حذف هذا الإعلان؟')) return;
  await db.collection('ads').doc(id).delete().catch(() => {});
  closeM('detailModal'); toast('تم الحذف', 'ok');
  loadAds(); refreshAdminView();
}
async function adminToggleFeat(id, cur) {
  await db.collection('ads').doc(id).update({ featured: !cur }).catch(() => {});
  toast(cur ? 'تم إلغاء التمييز' : 'تم التمييز ⭐', 'ok');
  loadAds(); refreshAdminView();
}

/* -------- إدارة المستخدمين: عرض + حظر/فك حظر -------- */
async function loadAdminUsers() {
  const el = document.getElementById('adminUsersList');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:10px"><i class="fa fa-spinner fa-spin"></i></div>';
  const snap = await db.collection('users').orderBy('createdAt', 'desc').limit(50).get().catch(() => ({ docs: [] }));
  const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  el.innerHTML = users.map(u => `
    <div class="myadrow">
      <div class="myadimg" style="background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800">${(u.name || 'U').charAt(0).toUpperCase()}</div>
      <div class="myadinfo">
        <div class="myadtitle">${u.name || ''} ${u.role === 'admin' ? '🛡️' : ''}</div>
        <div class="myadstatus">${u.phone || ''} ${u.banned ? '· محظور 🚫' : ''}</div>
      </div>
      <button class="btn ${u.banned ? 'btn-green' : 'btn-red'} btn-sm" onclick="toggleBan('${u.id}',${!!u.banned})">${u.banned ? 'فك الحظر' : 'حظر'}</button>
    </div>`).join('') || '<p style="font-size:.85em;color:var(--gray)">لا يوجد مستخدمون</p>';
}

async function toggleBan(uid, cur) {
  if (!confirm(cur ? 'فك الحظر عن هذا المستخدم؟' : 'حظر هذا المستخدم؟ لن يستطيع الدخول بعد الآن.')) return;
  await db.collection('users').doc(uid).update({ banned: !cur }).catch(() => {});
  toast(cur ? 'تم فك الحظر' : 'تم حظر المستخدم', 'ok');
  loadAdminUsers();
}

/* -------- الشريط الإخباري -------- */
async function saveNews() {
  const lines = document.getElementById('newsTA').value.split('\n').map(s => s.trim()).filter(Boolean);
  await db.collection('settings').doc('news').set({ items: lines }).catch(() => {});
  toast('تم حفظ الأخبار ✅', 'ok');
  if (typeof loadNews === 'function') loadNews();
}

/* -------- إعادة تحديث اللوحة بعد أي إجراء -------- */
function refreshAdminView() {
  const modalBody = document.getElementById('adminBody');
  const pageBody = document.getElementById('adminPageBody');
  if (modalBody && document.getElementById('adminModal')?.classList.contains('show')) renderAdminBody('adminBody');
  if (pageBody) renderAdminBody('adminPageBody');
}

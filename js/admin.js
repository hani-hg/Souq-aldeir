/* ============================================================
   admin.js  –  v2  (tab-based, no browser confirm/prompt)
   Sections: Featured requests | Reports | Ads | Users | Settings
   ============================================================ */

let adminUsersCache  = [];
let adminReqsCache   = [];
let adminReportsCache = [];
let adminUserFilter  = null;
let adminUserFilterName = '';
let currentAdminTab  = 'featured';

/* ── Avatar color helper (OpenSooq-style coloured initials) ── */
function getAvatarColor(name) {
  const palette = ['#1565C0','#00695C','#6A1B9A','#C62828','#E65100',
                   '#2E7D32','#0277BD','#880E4F','#37474F','#558B2F'];
  let h = 0;
  for (let i = 0; i < (name||'').length; i++)
    h = (name||'').charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

/* ── Inline confirm (replaces browser confirm()) ── */
function adminConfirm(msg, onYes, danger = true) {
  const el = document.createElement('div');
  el.className = 'admin-overlay';
  el.innerHTML = `
    <div class="admin-dialog">
      <p class="admin-dialog-msg">${msg}</p>
      <div class="admin-dialog-btns">
        <button class="btn btn-outline btn-sm" onclick="this.closest('.admin-overlay').remove()">إلغاء</button>
        <button class="btn ${danger ? 'btn-red' : 'btn-blue'} btn-sm" id="aConfirmYes">تأكيد</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.querySelector('#aConfirmYes').onclick = () => { el.remove(); onYes(); };
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}

/* ── Inline text input (replaces browser prompt()) ── */
function adminInput(title, placeholder, onSubmit) {
  const el = document.createElement('div');
  el.className = 'admin-overlay';
  el.innerHTML = `
    <div class="admin-dialog">
      <p class="admin-dialog-msg" style="font-weight:800;font-size:1em">${title}</p>
      <textarea id="aInputVal" rows="3" placeholder="${placeholder}"
        style="width:100%;border:1.5px solid var(--border);border-radius:10px;
               padding:9px 12px;font-family:'Tajawal',sans-serif;font-size:.9em;
               margin:10px 0;resize:vertical"></textarea>
      <div class="admin-dialog-btns">
        <button class="btn btn-outline btn-sm" onclick="this.closest('.admin-overlay').remove()">إلغاء</button>
        <button class="btn btn-blue btn-sm" id="aInputSend">إرسال</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.querySelector('#aInputSend').onclick = () => {
    const val = el.querySelector('#aInputVal').value.trim();
    if (!val) { showToast('يرجى كتابة نص', 'bad'); return; }
    el.remove(); onSubmit(val);
  };
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  setTimeout(() => el.querySelector('textarea').focus(), 80);
}

/* ── Notification badge ── */
async function checkAdminNotifs() {
  const [rSnap, pSnap] = await Promise.all([
    db.collection('featuredRequests').where('status','==','pending').get().catch(()=>null),
    db.collection('reports').where('status','==','pending').get().catch(()=>null)
  ]);
  const count = (rSnap ? rSnap.size : 0) + (pSnap ? pSnap.size : 0);
  const badge = document.getElementById('adminBadge');
  if (badge) { badge.style.display = count > 0 ? 'flex' : 'none'; badge.textContent = count > 9 ? '9+' : count; }
}

/* ── Open admin panel ── */
async function openAdminPanel() {
  if (!isAdmin) return;
  document.getElementById('adminContent').innerHTML =
    '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('adminModal');

  const [rSnap, uSnap, pSnap] = await Promise.all([
    db.collection('featuredRequests').where('status','==','pending').get().catch(()=>({docs:[]})),
    db.collection('users').get().catch(()=>({docs:[]})),
    db.collection('reports').where('status','==','pending').get().catch(()=>({docs:[]}))
  ]);

  adminReqsCache    = rSnap.docs.map(d => ({id:d.id,...d.data()}));
  adminUsersCache   = uSnap.docs.map(d => ({id:d.id,...d.data()}));
  adminReportsCache = pSnap.docs.map(d => ({id:d.id,...d.data()}));

  const featuredCount = allAds.filter(a => a.featured).length;
  const pendingAll    = adminReqsCache.length + adminReportsCache.length;
  const bannedCount   = adminUsersCache.filter(u => u.banned).length;

  document.getElementById('adminContent').innerHTML = `

    <!-- ── Stats row ── -->
    <div class="adm-stats">
      <div class="adm-stat-card">
        <div class="adm-stat-icon" style="background:#e3f2fd;color:#1565C0"><i class="fa fa-bullhorn"></i></div>
        <div class="adm-stat-val">${allAds.length}</div>
        <div class="adm-stat-lbl">إعلان</div>
      </div>
      <div class="adm-stat-card">
        <div class="adm-stat-icon" style="background:#f3e5f5;color:#7b1fa2"><i class="fa fa-users"></i></div>
        <div class="adm-stat-val">${adminUsersCache.length}</div>
        <div class="adm-stat-lbl">مستخدم</div>
      </div>
      <div class="adm-stat-card">
        <div class="adm-stat-icon" style="background:#fff8e1;color:#f57f17"><i class="fa fa-star"></i></div>
        <div class="adm-stat-val">${featuredCount}</div>
        <div class="adm-stat-lbl">مميز</div>
      </div>
      <div class="adm-stat-card ${pendingAll > 0 ? 'adm-alert' : ''}">
        <div class="adm-stat-icon" style="background:#fce4ec;color:#c62828"><i class="fa fa-bell"></i></div>
        <div class="adm-stat-val">${pendingAll}</div>
        <div class="adm-stat-lbl">معلق</div>
      </div>
    </div>

    <!-- ── Tab bar ── -->
    <div class="adm-tabs">
      <button class="adm-tab ${currentAdminTab==='featured'?'active':''}" data-tab="featured" onclick="switchAdminTab('featured')">
        ⭐ تمييز ${adminReqsCache.length ? `<span class="adm-tab-badge">${adminReqsCache.length}</span>` : ''}
      </button>
      <button class="adm-tab ${currentAdminTab==='reports'?'active':''}" data-tab="reports" onclick="switchAdminTab('reports')">
        🚩 بلاغات ${adminReportsCache.length ? `<span class="adm-tab-badge">${adminReportsCache.length}</span>` : ''}
      </button>
      <button class="adm-tab ${currentAdminTab==='ads'?'active':''}" data-tab="ads" onclick="switchAdminTab('ads')">📋 إعلانات</button>
      <button class="adm-tab ${currentAdminTab==='users'?'active':''}" data-tab="users" onclick="switchAdminTab('users')">👥 مستخدمون</button>
      <button class="adm-tab ${currentAdminTab==='settings'?'active':''}" data-tab="settings" onclick="switchAdminTab('settings')">⚙️ إعدادات</button>
    </div>

    <!-- ── Tab content ── -->
    <div id="adminTabContent" style="padding-top:12px"></div>
  `;

  switchAdminTab(currentAdminTab);
}

/* ── Switch tab ── */
function switchAdminTab(tab) {
  currentAdminTab = tab;
  document.querySelectorAll('.adm-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));

  const ct = document.getElementById('adminTabContent');
  if (!ct) return;

  switch (tab) {
    case 'featured':
      ct.innerHTML = renderReqsHtml();
      break;

    case 'reports':
      ct.innerHTML = renderReportsHtml();
      break;

    case 'ads':
      ct.innerHTML = `
        <input type="text" id="adminAdsSearch" class="adm-search"
          placeholder="🔍 بحث بعنوان الإعلان أو بريد صاحبه..." oninput="renderAdminAdsList()">
        <div id="adminAdsFilterChip"></div>
        <div id="adminAdsListContainer"></div>`;
      renderAdminAdsList();
      break;

    case 'users':
      ct.innerHTML = `
        <input type="text" id="adminUsersSearch" class="adm-search"
          placeholder="🔍 بحث بالاسم أو الهاتف أو البريد..." oninput="renderAdminUsersList()">
        <div id="adminUsersListContainer"></div>`;
      renderAdminUsersList();
      break;

    case 'settings':
      ct.innerHTML = `
        <div class="section-label">⚙️ بيانات التواصل</div>
        <p style="font-size:.78em;color:var(--gray);margin-bottom:10px">تظهر في "عن السوق" وروابط واتساب</p>
        <div class="fg"><label>البريد الإلكتروني</label>
          <input type="email" id="settingsEmail" value="${contactSettings.email}"></div>
        <div class="fg"><label>رقم الهاتف (للعرض)</label>
          <input type="text" id="settingsPhone" value="${contactSettings.phone}"></div>
        <div class="fg"><label>رقم واتساب (صيغة دولية · مثال: 905522740910)</label>
          <input type="text" id="settingsWhatsapp" value="${contactSettings.whatsapp}"></div>
        <button class="btn btn-blue btn-sm" onclick="saveContactSettings()">
          <i class="fa fa-save"></i> حفظ بيانات التواصل</button>

        <div class="section-label" style="margin-top:20px">📰 الشريط الإخباري</div>
        <div class="fg"><label>نص لكل سطر مستقل</label>
          <textarea id="newsTextarea" rows="5"
            placeholder="نص 1&#10;نص 2&#10;نص 3"></textarea></div>
        <button class="btn btn-blue btn-sm" onclick="saveNews()">
          <i class="fa fa-save"></i> حفظ الأخبار</button>`;

      db.collection('settings').doc('news').get().then(doc => {
        const ta = document.getElementById('newsTextarea');
        if (ta && doc.exists && doc.data().items) ta.value = doc.data().items.join('\n');
      }).catch(() => {});
      break;
  }
}

/* ── Featured requests list ── */
function renderReqsHtml() {
  if (!adminReqsCache.length)
    return '<div class="empty-state"><i class="fa fa-star-half-alt"></i><p>لا توجد طلبات تمييز معلقة</p></div>';
  return adminReqsCache.map(r => `
    <div class="adm-req-card">
      <div class="adm-req-body">
        <div class="adm-req-title">${r.adTitle || 'إعلان'}</div>
        <div class="adm-req-sub">${r.userEmail || ''}</div>
        <span class="plan-tag">${r.plan || ''}</span>
      </div>
      <div class="adm-req-actions">
        <button class="btn btn-green btn-sm" onclick="approveFeature('${r.id}','${r.adId}')">
          <i class="fa fa-check"></i> قبول</button>
        <button class="btn btn-red btn-sm" onclick="rejectFeature('${r.id}')">
          <i class="fa fa-times"></i> رفض</button>
      </div>
    </div>`).join('');
}

/* ── Reports list ── */
function renderReportsHtml() {
  if (!adminReportsCache.length)
    return '<div class="empty-state"><i class="fa fa-flag"></i><p>لا توجد بلاغات معلقة</p></div>';
  return adminReportsCache.map(r => `
    <div class="adm-req-card">
      <div class="adm-req-body">
        <div class="adm-req-title">${r.adTitle || 'إعلان'}</div>
        <div class="adm-req-sub" style="color:var(--red)">${r.reason || ''}</div>
      </div>
      <div class="adm-req-actions">
        <button class="btn btn-red btn-sm" onclick="resolveReportDeleteAd('${r.id}','${r.adId}')">
          <i class="fa fa-trash"></i> حذف</button>
        <button class="btn btn-outline btn-sm" onclick="dismissReport('${r.id}')">
          <i class="fa fa-ban"></i> تجاهل</button>
      </div>
    </div>`).join('');
}

/* ── Ads list (admin) ── */
function renderAdminAdsList() {
  const q = (document.getElementById('adminAdsSearch')?.value || '').trim().toLowerCase();
  let list = [...allAds];
  if (adminUserFilter) list = list.filter(a => a.userId === adminUserFilter);
  if (q) list = list.filter(a =>
    (a.title||'').toLowerCase().includes(q) || (a.userEmail||'').toLowerCase().includes(q));

  const chip = document.getElementById('adminAdsFilterChip');
  if (chip) chip.innerHTML = adminUserFilter ? `
    <div class="filter-chip">
      <span>إعلانات: ${adminUserFilterName}</span>
      <button onclick="clearAdsUserFilter()" class="chip-x">✕</button>
    </div>` : '';

  const cover = ad => (ad.images && ad.images[0]) || ad.imageUrl || '';

  document.getElementById('adminAdsListContainer').innerHTML = list.length
    ? list.slice(0, 100).map(ad => `
      <div class="my-ad-row">
        <div class="my-ad-img">
          ${cover(ad) ? `<img src="${cover(ad)}" loading="lazy" onerror="this.style.display='none'">` : '<i class="fa fa-image"></i>'}
        </div>
        <div class="my-ad-info">
          <div class="my-ad-title">${ad.title || ''}</div>
          <div class="my-ad-status">${ad.userEmail || ''}</div>
          ${ad.featured ? '<span class="featured-mini-tag">⭐ مميز</span>' : ''}
        </div>
        <div class="my-ad-actions">
          <button class="icon-btn ${ad.featured ? '' : 'edit'}"
            style="${ad.featured ? 'background:var(--gold-light);color:#7a5000' : ''}"
            title="${ad.featured ? 'إلغاء التمييز' : 'تمييز'}"
            onclick="adminToggleFeatured('${ad.id}',${!!ad.featured})">
            ${ad.featured ? '★' : '☆'}
          </button>
          <button class="icon-btn del" onclick="adminDeleteAdConfirm('${ad.id}')">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>`).join('')
    : '<div class="empty-state" style="padding:24px 0"><i class="fa fa-search"></i><p>لا توجد إعلانات مطابقة</p></div>';
}

/* ── Users list (OpenSooq-style cards) ── */
function renderAdminUsersList() {
  const q = (document.getElementById('adminUsersSearch')?.value || '').trim().toLowerCase();
  let list = adminUsersCache;
  if (q) list = list.filter(u =>
    (u.name||'').toLowerCase().includes(q) ||
    (u.phone||'').toLowerCase().includes(q) ||
    (u.email||'').toLowerCase().includes(q));

  document.getElementById('adminUsersListContainer').innerHTML = list.length
    ? list.map(u => {
        const adsCount  = allAds.filter(a => a.userId === u.id).length;
        const banned    = !!u.banned;
        const isAdminU  = u.role === 'admin';
        const initial   = (u.name || 'م').charAt(0);
        const color     = getAvatarColor(u.name || '');
        const safeName  = (u.name || 'مستخدم').replace(/'/g, '&#39;');
        return `
        <div class="user-card">
          <div class="user-avatar" style="background:${color}">${initial}</div>
          <div class="user-card-info">
            <div class="user-card-name">
              ${u.name || 'مستخدم'}
              ${isAdminU ? '<span class="role-tag admin-tag">مدير</span>' : ''}
              ${banned   ? '<span class="role-tag banned-tag">محظور</span>' : ''}
            </div>
            <div class="user-card-meta"><i class="fa fa-phone" style="color:var(--blue);font-size:.75em"></i> ${u.phone || '—'}</div>
            <div class="user-card-meta"><i class="fa fa-bullhorn" style="color:var(--green);font-size:.75em"></i> ${adsCount} إعلان</div>
          </div>
          <div class="user-card-actions">
            <button class="icon-btn" style="background:var(--blue-light);color:var(--blue)"
              title="عرض إعلاناته"
              onclick="filterAdsByUser('${u.id}','${safeName}');switchAdminTab('ads')">
              <i class="fa fa-list"></i>
            </button>
            <button class="icon-btn" style="background:var(--gold-light);color:#7a5000"
              title="إرسال إنذار"
              onclick="sendWarningToUser('${u.id}')">
              <i class="fa fa-bell"></i>
            </button>
            <button class="icon-btn ${banned ? 'edit' : 'del'}"
              title="${banned ? 'رفع الحظر' : 'حظر المستخدم'}"
              onclick="toggleBanUser('${u.id}',${banned})">
              <i class="fa ${banned ? 'fa-unlock' : 'fa-ban'}"></i>
            </button>
          </div>
        </div>`;
      }).join('')
    : '<div class="empty-state" style="padding:24px 0"><i class="fa fa-users"></i><p>لا يوجد مستخدمون مطابقون</p></div>';
}

/* ── Filter helpers ── */
function filterAdsByUser(uid, name) {
  adminUserFilter     = uid;
  adminUserFilterName = name;
  renderAdminAdsList();
}
function clearAdsUserFilter() {
  adminUserFilter     = null;
  adminUserFilterName = '';
  renderAdminAdsList();
}

/* ── Featured request actions ── */
async function approveFeature(reqId, adId) {
  await db.collection('ads').doc(adId).update({ featured: true }).catch(() => {});
  await db.collection('featuredRequests').doc(reqId).update({ status: 'approved' }).catch(() => {});
  showToast('تم تمييز الإعلان ⭐', 'ok');
  checkAdminNotifs(); loadAds(); openAdminPanel();
}
async function rejectFeature(reqId) {
  await db.collection('featuredRequests').doc(reqId).update({ status: 'rejected' }).catch(() => {});
  showToast('تم رفض الطلب', 'ok');
  checkAdminNotifs(); openAdminPanel();
}

/* ── Ad actions ── */
function adminDeleteAdConfirm(id) {
  adminConfirm('هل تريد حذف هذا الإعلان نهائياً؟', () => adminDeleteAd(id));
}
async function adminDeleteAd(id) {
  await db.collection('ads').doc(id).delete().catch(() => {});
  closeModal('detailModal'); showToast('تم حذف الإعلان', 'ok'); loadAds(); openAdminPanel();
}
async function adminToggleFeatured(id, current) {
  await db.collection('ads').doc(id).update({ featured: !current }).catch(() => {});
  showToast(current ? 'تم إلغاء التمييز' : 'تم التمييز ⭐', 'ok');
  loadAds(); openAdminPanel();
}

/* ── Settings ── */
async function saveContactSettings() {
  const email    = document.getElementById('settingsEmail').value.trim();
  const phone    = document.getElementById('settingsPhone').value.trim();
  const whatsapp = document.getElementById('settingsWhatsapp').value.trim().replace(/[^0-9]/g, '');
  if (!whatsapp) { showToast('رقم الواتساب غير صالح', 'bad'); return; }
  await db.collection('settings').doc('contact').set({ email, phone, whatsapp })
    .catch(() => { showToast('تعذر الحفظ', 'bad'); return; });
  contactSettings = { email, phone, whatsapp };
  showToast('تم حفظ بيانات التواصل ✅', 'ok');
}
async function saveNews() {
  const lines = document.getElementById('newsTextarea').value
    .split('\n').map(s => s.trim()).filter(Boolean);
  await db.collection('settings').doc('news').set({ items: lines }).catch(() => {});
  showToast('تم حفظ الأخبار ✅', 'ok'); loadNews();
}

/* ── User management ── */
async function toggleBanUser(uid, currentlyBanned) {
  adminConfirm(
    currentlyBanned ? 'هل تريد رفع الحظر عن هذا المستخدم؟'
                    : 'هل تريد حظر هذا المستخدم؟ لن يستطيع الدخول بعد الآن.',
    async () => {
      await db.collection('users').doc(uid).update({ banned: !currentlyBanned }).catch(() => {});
      showToast(currentlyBanned ? 'تم رفع الحظر' : 'تم حظر المستخدم', 'ok');
      openAdminPanel();
    }
  );
}

async function sendWarningToUser(uid) {
  adminInput('إرسال إنذار للمستخدم', 'اكتب نص الإنذار الذي سيظهر للمستخدم في لوحة حسابه...', async text => {
    await db.collection('users').doc(uid).collection('warnings').add({
      message: text, read: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => { showToast('تعذر إرسال الإنذار', 'bad'); return; });
    showToast('تم إرسال الإنذار ✅', 'ok');
  });
}

/* ── Reports ── */
async function resolveReportDeleteAd(reportId, adId) {
  adminConfirm('هل تريد حذف الإعلان المُبلَّغ عنه نهائياً؟', async () => {
    await db.collection('ads').doc(adId).delete().catch(() => {});
    await db.collection('reports').doc(reportId).update({ status: 'resolved' }).catch(() => {});
    showToast('تم حذف الإعلان', 'ok'); loadAds(); openAdminPanel();
  });
}
async function dismissReport(reportId) {
  await db.collection('reports').doc(reportId).update({ status: 'dismissed' }).catch(() => {});
  showToast('تم تجاهل البلاغ', 'ok'); openAdminPanel();
}

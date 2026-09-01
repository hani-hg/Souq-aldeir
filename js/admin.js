/* ============================================================
   admin.js  –  v3  (لوحة التحكم الشاملة)
   Tabs: Dashboard | Ads | Users | Reports | Settings
   ============================================================ */

let adminUsersCache   = [];
let adminReqsCache    = [];
let adminReportsCache = [];
let adminRecoveryCache = [];
let adminAdsAllCache  = [];
let adminUserFilter   = null;
let adminUserFilterName = '';
let currentAdminTab   = 'dashboard';

/* ── وقت آخر نشاط ── */
function lastActive(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  const diff = Date.now() - d.getTime();
  if (diff < 60000)  return 'الآن';
  if (diff < 3600000) return `${Math.floor(diff/60000)} د`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)} س`;
  return d.toLocaleDateString('ar-EG');
}

/* ── لون الأفاتار ── */
function getAvatarColor(name) {
  const palette = ['#1565C0','#00695C','#6A1B9A','#C62828','#E65100',
                   '#2E7D32','#0277BD','#880E4F','#37474F','#558B2F'];
  let h = 0;
  for (let i = 0; i < (name||'').length; i++)
    h = (name||'').charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

/* ── تأكيد داخلي ── */
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

/* ── إدخال نصي داخلي ── */
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

/* ── شارة الإشعارات ── */
async function checkAdminNotifs() {
  const [rSnap, pSnap, recoverySnap, pendingAdsSnap] = await Promise.all([
    db.collection('featuredRequests').where('status','==','pending').get().catch(()=>null),
    db.collection('reports').where('status','==','pending').get().catch(()=>null),
    db.collection('recoveryRequests').where('status','==','pending').get().catch(()=>null),
    db.collection('ads').where('moderationStatus','==','pending').get().catch(()=>null)
  ]);
  const count = (rSnap ? rSnap.size : 0) + (pSnap ? pSnap.size : 0) + (recoverySnap ? recoverySnap.size : 0) + (pendingAdsSnap ? pendingAdsSnap.size : 0);
  const badge = document.getElementById('adminBadge');
  if (badge) { badge.style.display = count > 0 ? 'flex' : 'none'; badge.textContent = count > 9 ? '9+' : count; }
}

/* ══════════════════════════════════════════
   فتح لوحة التحكم
══════════════════════════════════════════ */
async function openAdminPanel() {
  if (!isAdmin) return;
  document.getElementById('adminContent').innerHTML =
    '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('adminModal');

  const [rSnap, uSnap, pSnap, recoverySnap, adsSnap] = await Promise.all([
    db.collection('featuredRequests').where('status','==','pending').get().catch(()=>({docs:[]})),
    db.collection('users').get().catch(()=>({docs:[]})),
    db.collection('reports').where('status','==','pending').get().catch(()=>({docs:[]})),
    db.collection('recoveryRequests').where('status','==','pending').get().catch(()=>({docs:[]})),
    db.collection('ads').orderBy('createdAt','desc').get().catch(()=>({docs:[]}))
  ]);

  adminReqsCache    = rSnap.docs.map(d=>({id:d.id,...d.data()}));
  adminUsersCache   = uSnap.docs.map(d=>({id:d.id,...d.data()}));
  adminReportsCache = pSnap.docs.map(d=>({id:d.id,...d.data()}));
  adminRecoveryCache = recoverySnap.docs.map(d=>({id:d.id,...d.data()}));
  adminAdsAllCache  = adsSnap.docs.map(d=>({id:d.id,...d.data()}));

  const pendingAll = adminReqsCache.length + adminReportsCache.length + adminRecoveryCache.length;
  const pendingAdsCount = adminAdsAllCache.filter(a => a.moderationStatus === 'pending').length;

  document.getElementById('adminContent').innerHTML = `
    <!-- ── شريط التبويبات ── -->
    <div class="adm-tabs" id="admTabsBar">
      <button class="adm-tab" data-tab="dashboard" onclick="switchAdminTab('dashboard')">📊 نظرة عامة</button>
      <button class="adm-tab" data-tab="ads"       onclick="switchAdminTab('ads')">📋 الإعلانات ${pendingAdsCount ? `<span class="adm-tab-badge">${pendingAdsCount}</span>` : ''}</button>
      <button class="adm-tab" data-tab="users"     onclick="switchAdminTab('users')">👥 المستخدمون</button>
      <button class="adm-tab" data-tab="recovery"  onclick="switchAdminTab('recovery')">🔐 استعادة الحساب ${adminRecoveryCache.length ? `<span class="adm-tab-badge">${adminRecoveryCache.length}</span>` : ''}</button>
      <button class="adm-tab" data-tab="reports"   onclick="switchAdminTab('reports')">
        🚩 البلاغات ${pendingAll ? `<span class="adm-tab-badge">${pendingAll}</span>` : ''}
      </button>
      <button class="adm-tab" data-tab="settings"  onclick="switchAdminTab('settings')">⚙️ الإعدادات</button>
    </div>
    <div id="adminTabContent" style="padding-top:14px"></div>`;

  switchAdminTab(currentAdminTab);
}

/* ── التبديل بين التبويبات ── */
function switchAdminTab(tab) {
  currentAdminTab = tab;
  document.querySelectorAll('.adm-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));
  const ct = document.getElementById('adminTabContent');
  if (!ct) return;
  switch (tab) {
    case 'dashboard': renderDashboard(ct); break;
    case 'ads':       renderAdsTab(ct);    break;
    case 'users':     renderUsersTab(ct);  break;
    case 'recovery':  renderRecoveryTab(ct); break;
    case 'reports':   renderReportsTab(ct);break;
    case 'settings':  renderSettingsTab(ct);break;
  }
}

/* ══════════════════════════════════════════
   تبويب 1: نظرة عامة (Dashboard)
══════════════════════════════════════════ */
function renderDashboard(ct) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const totalAds    = adminAdsAllCache.length;
  const totalUsers  = adminUsersCache.length;
  const todayAds    = adminAdsAllCache.filter(a => {
    if (!a.createdAt) return false;
    const ms = a.createdAt.toMillis ? a.createdAt.toMillis() : (a.createdAt.seconds||0)*1000;
    return ms >= today;
  }).length;
  const pendingAds  = adminReqsCache.length + adminReportsCache.length;
  const featuredAdsCount = adminAdsAllCache.filter(a=>a.featured).length;
  const bannedCount = adminUsersCache.filter(u=>u.banned).length;
  const recoveryReady = adminUsersCache.filter(u => u.email && !String(u.email).includes('@souq-aldeir.local')).length;
  const phoneOnlyCount = Math.max(0, totalUsers - recoveryReady);

  /* إعلانات آخر 6 شهور */
  const months6 = [];
  const monthLabels = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months6.push({ y: d.getFullYear(), m: d.getMonth() });
    monthLabels.push(d.toLocaleDateString('ar-EG',{month:'short'}));
  }
  const monthCounts = months6.map(({y,m}) =>
    adminAdsAllCache.filter(a => {
      if (!a.createdAt) return false;
      const ms = a.createdAt.toMillis ? a.createdAt.toMillis() : (a.createdAt.seconds||0)*1000;
      const d  = new Date(ms);
      return d.getFullYear()===y && d.getMonth()===m;
    }).length
  );

  /* توزيع الفئات */
  const catCount = {};
  adminAdsAllCache.forEach(a => {
    if (a.category) catCount[a.category] = (catCount[a.category]||0)+1;
  });
  const topCats = Object.entries(catCount).sort((a,b)=>b[1]-a[1]).slice(0,6);

  ct.innerHTML = `
    <section class="admin-hero">
      <div>
        <div class="admin-eyebrow">مركز إدارة سوق دير الزور</div>
        <h2>مرحبًا بك في لوحة التحكم</h2>
        <p>تابع المستخدمين والإعلانات وطلبات الدعم من مكان واحد.</p>
      </div>
      <div class="admin-hero-actions">
        <button class="btn btn-light btn-sm" onclick="switchAdminTab('users')"><i class="fa fa-users"></i> المستخدمون</button>
        <button class="btn btn-gold btn-sm" onclick="switchAdminTab('recovery')"><i class="fa fa-key"></i> طلبات الاستعادة${adminRecoveryCache.length ? ` (${adminRecoveryCache.length})` : ''}</button>
      </div>
    </section>
    <div class="admin-insight-strip">
      <div><span class="insight-dot green"></span><strong>${recoveryReady}</strong> حسابًا لديه بريد استرداد</div>
      <div><span class="insight-dot orange"></span><strong>${phoneOnlyCount}</strong> حسابًا يحتاج إضافة بريد</div>
      <div><span class="insight-dot red"></span><strong>${adminRecoveryCache.length}</strong> طلب استعادة معلق</div>
    </div>
    <!-- إحصائيات سريعة -->
    <div class="adm-kpi-grid">
      <div class="adm-kpi" style="--kc:#1565c0">
        <i class="fa fa-bullhorn"></i>
        <div class="adm-kpi-val">${totalAds}</div>
        <div class="adm-kpi-lbl">إجمالي الإعلانات</div>
      </div>
      <div class="adm-kpi" style="--kc:#7b1fa2">
        <i class="fa fa-users"></i>
        <div class="adm-kpi-val">${totalUsers}</div>
        <div class="adm-kpi-lbl">إجمالي المستخدمين</div>
      </div>
      <div class="adm-kpi" style="--kc:#2e7d32">
        <i class="fa fa-calendar-day"></i>
        <div class="adm-kpi-val">${todayAds}</div>
        <div class="adm-kpi-lbl">إعلانات اليوم</div>
      </div>
      <div class="adm-kpi ${pendingAds?'adm-kpi-alert':''}" style="--kc:#c62828">
        <i class="fa fa-bell"></i>
        <div class="adm-kpi-val">${pendingAds}</div>
        <div class="adm-kpi-lbl">قيد المراجعة</div>
      </div>
      <div class="adm-kpi" style="--kc:#f57c00">
        <i class="fa fa-star"></i>
        <div class="adm-kpi-val">${featuredAdsCount}</div>
        <div class="adm-kpi-lbl">إعلانات مميزة</div>
      </div>
      <div class="adm-kpi" style="--kc:#37474f">
        <i class="fa fa-ban"></i>
        <div class="adm-kpi-val">${bannedCount}</div>
        <div class="adm-kpi-lbl">محظورون</div>
      </div>
      <div class="adm-kpi ${adminRecoveryCache.length ? 'adm-kpi-alert' : ''}" style="--kc:#00897b">
        <i class="fa fa-key"></i>
        <div class="adm-kpi-val">${adminRecoveryCache.length}</div>
        <div class="adm-kpi-lbl">طلبات استعادة</div>
      </div>
    </div>

    <!-- طلبات التمييز المعلقة -->
    ${adminReqsCache.length ? `
    <div class="adm-section-card" style="border-color:#f9a825">
      <div class="adm-section-head"><i class="fa fa-star" style="color:#f9a825"></i> طلبات التمييز (${adminReqsCache.length})</div>
      ${adminReqsCache.map(r=>`
        <div class="adm-req-card">
          <div class="adm-req-body">
            <div class="adm-req-title">${r.adTitle||'إعلان'}</div>
            <div class="adm-req-sub">${r.userEmail||''} · <span class="plan-tag">${r.plan||''}</span></div>
          </div>
          <div class="adm-req-actions">
            <button class="btn btn-green btn-sm" onclick="approveFeature('${r.id}','${r.adId}')"><i class="fa fa-check"></i> قبول</button>
            <button class="btn btn-red btn-sm" onclick="rejectFeature('${r.id}')"><i class="fa fa-times"></i> رفض</button>
          </div>
        </div>`).join('')}
    </div>` : ''}

    <!-- الرسوم البيانية -->
    <div class="adm-section-card">
      <div class="adm-section-head"><i class="fa fa-chart-bar" style="color:var(--blue)"></i> الإعلانات حسب الشهر</div>
      <canvas id="chartMonths" height="140"></canvas>
    </div>
    <div class="adm-section-card">
      <div class="adm-section-head"><i class="fa fa-chart-pie" style="color:var(--orange)"></i> توزيع حسب الفئة</div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <canvas id="chartCats" style="max-width:150px;max-height:150px"></canvas>
        <div id="catLegend" style="flex:1;min-width:100px"></div>
      </div>
    </div>`;

  /* رسم المخططات */
  requestAnimationFrame(() => drawDashboardCharts(monthLabels, monthCounts, topCats));
}

function drawDashboardCharts(monthLabels, monthCounts, topCats) {
  /* مخطط الأعمدة */
  const ctx1 = document.getElementById('chartMonths');
  if (ctx1 && window.Chart) {
    if (ctx1._chart) ctx1._chart.destroy();
    ctx1._chart = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [{ label:'إعلانات', data: monthCounts,
          backgroundColor:'rgba(21,101,192,.75)',
          borderRadius: 8, borderSkipped: false }]
      },
      options: {
        responsive: true, plugins: { legend:{display:false} },
        scales: {
          y: { beginAtZero:true, ticks:{precision:0,font:{family:'Tajawal'}} },
          x: { ticks:{font:{family:'Tajawal'}} }
        }
      }
    });
  }

  /* مخطط الدونات */
  const ctx2 = document.getElementById('chartCats');
  const colors = ['#1565c0','#7b1fa2','#2e7d32','#f57c00','#c62828','#0277bd'];
  if (ctx2 && topCats.length && window.Chart) {
    if (ctx2._chart) ctx2._chart.destroy();
    ctx2._chart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: topCats.map(c=>c[0]),
        datasets: [{ data: topCats.map(c=>c[1]),
          backgroundColor: colors, borderWidth: 2 }]
      },
      options: { responsive:true, plugins:{legend:{display:false}} }
    });
    const leg = document.getElementById('catLegend');
    if (leg) leg.innerHTML = topCats.map((c,i)=>`
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;font-size:.76em">
        <span style="width:10px;height:10px;border-radius:3px;background:${colors[i]};flex-shrink:0"></span>
        <span>${c[0]} (${c[1]})</span>
      </div>`).join('');
  }
}

/* ══════════════════════════════════════════
   تبويب 2: إدارة الإعلانات
══════════════════════════════════════════ */
function renderAdsTab(ct) {
  /* جمع الفئات والمدن الموجودة */
  const cats  = [...new Set(adminAdsAllCache.map(a=>a.category).filter(Boolean))].sort();
  const cities= [...new Set(adminAdsAllCache.map(a=>a.city||a.location).filter(Boolean))].sort();

  ct.innerHTML = `
    <!-- شريط الفلاتر -->
    <div class="adm-filters-bar">
      <input type="text" id="adsSearch" class="adm-search" style="margin:0;flex:1;min-width:120px"
        placeholder="🔍 بحث بالعنوان أو الهاتف..." oninput="applyAdsFilter()">
      <select id="adsFilterStatus" class="adm-filter-sel" onchange="applyAdsFilter()">
        <option value="">الحالة: الكل</option>
        <option value="featured">مميز ⭐</option>
        <option value="pending">قيد المراجعة</option>
        <option value="active">نشط</option>
        <option value="expired">منتهي</option>
      </select>
      <select id="adsFilterCat" class="adm-filter-sel" onchange="applyAdsFilter()">
        <option value="">الفئة: الكل</option>
        ${cats.map(c=>`<option value="${c}">${c}</option>`).join('')}
      </select>
      <select id="adsFilterCity" class="adm-filter-sel" onchange="applyAdsFilter()">
        <option value="">المنطقة: الكل</option>
        ${cities.map(c=>`<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px">
      <span id="adsFilterCount" style="font-size:.78em;color:var(--gray)"></span>
      <button class="btn btn-outline btn-sm" onclick="exportAdsCSV()">
        <i class="fa fa-file-excel" style="color:#217346"></i> تصدير Excel
      </button>
    </div>
    <!-- جدول الإعلانات -->
    <div id="adsTableWrap"></div>`;

  applyAdsFilter();
}

function applyAdsFilter() {
  const q      = (document.getElementById('adsSearch')?.value||'').trim().toLowerCase();
  const status = document.getElementById('adsFilterStatus')?.value||'';
  const cat    = document.getElementById('adsFilterCat')?.value||'';
  const city   = document.getElementById('adsFilterCity')?.value||'';
  const now    = Date.now();

  let list = adminAdsAllCache;
  if (adminUserFilter) list = list.filter(a=>a.userId===adminUserFilter);
  if (q) list = list.filter(a=>
    (a.title||'').toLowerCase().includes(q) ||
    (a.phone||'').toLowerCase().includes(q) ||
    (a.userEmail||'').toLowerCase().includes(q));
  if (status==='featured') list = list.filter(a=>a.featured);
  if (status==='pending') list = list.filter(a=>a.moderationStatus === 'pending');
  if (status==='expired')  list = list.filter(a=>
    a.expiresAt && (a.expiresAt.toMillis?a.expiresAt.toMillis():(a.expiresAt.seconds||0)*1000) < now);
  if (status==='active')   list = list.filter(a=>!a.featured &&
    (!a.expiresAt || (a.expiresAt.toMillis?a.expiresAt.toMillis():(a.expiresAt.seconds||0)*1000) >= now));
  if (cat)  list = list.filter(a=>a.category===cat);
  if (city) list = list.filter(a=>(a.city||a.location)===city);

  const el = document.getElementById('adsFilterCount');
  if (el) el.textContent = `${list.length} إعلان`;

  const wrap = document.getElementById('adsTableWrap');
  if (!wrap) return;

  if (!list.length) {
    wrap.innerHTML = '<div class="empty-state"><i class="fa fa-search"></i><p>لا توجد إعلانات مطابقة</p></div>';
    return;
  }

  /* جدول متكيف مع الشاشات الصغيرة */
  wrap.innerHTML = `
    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead>
          <tr>
            <th>الإعلان</th>
            <th>المعلن</th>
            <th>الفئة</th>
            <th>المنطقة</th>
            <th>التاريخ</th>
            <th>الحالة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${list.slice(0,200).map(ad => {
            const img   = (ad.images&&ad.images[0])||ad.imageUrl||'';
            const price = ad.price ? ad.price.toLocaleString('ar-EG')+'$' : '—';
            const date  = ad.createdAt ? new Date((ad.createdAt.toMillis?ad.createdAt.toMillis():(ad.createdAt.seconds||0)*1000)).toLocaleDateString('ar-EG') : '—';
            const now   = Date.now();
            const expired = ad.expiresAt && (ad.expiresAt.toMillis?ad.expiresAt.toMillis():(ad.expiresAt.seconds||0)*1000) < now;
            const moderation = ad.moderationStatus || 'approved';
            return `<tr>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:40px;height:40px;border-radius:8px;overflow:hidden;flex-shrink:0;background:var(--bg)">
                    ${img?`<img src="${img}" style="width:100%;height:100%;object-fit:cover" loading="lazy">`:'<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#bbb"><i class="fa fa-image"></i></div>'}
                  </div>
                  <div>
                    <div style="font-size:.82em;font-weight:700;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ad.title||'—'}</div>
                    <div style="font-size:.7em;color:var(--green);font-weight:700">${price}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:.78em;max-width:100px;overflow:hidden;text-overflow:ellipsis">${ad.userName||ad.userEmail||'—'}</td>
              <td style="font-size:.78em">${ad.category||'—'}</td>
              <td style="font-size:.78em">${ad.city||ad.location||'—'}</td>
              <td style="font-size:.72em;color:var(--gray)">${date}</td>
              <td>
                ${moderation === 'pending' ? '<span class="adm-status-tag" style="background:#fff3e0;color:#e65100">قيد المراجعة</span>' :
                  moderation === 'rejected' ? '<span class="adm-status-tag expired">مرفوض</span>' :
                  moderation === 'hidden' ? '<span class="adm-status-tag expired">مخفي</span>' :
                  ad.featured ? '<span class="adm-status-tag feat">⭐ مميز</span>' :
                  expired ? '<span class="adm-status-tag expired">منتهي</span>' :
                  '<span class="adm-status-tag active">نشط</span>'}
              </td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="icon-btn" title="عرض" onclick="openDetail('${ad.id}')"
                    style="background:#e3f2fd;color:var(--blue)"><i class="fa fa-eye"></i></button>
                  ${moderation === 'pending' ? `<button class="icon-btn" title="موافقة" style="background:#e8f5e9;color:#2e7d32" onclick="adminSetAdModerationStatus('${ad.id}','approved')"><i class="fa fa-check"></i></button><button class="icon-btn" title="رفض" style="background:#ffebee;color:#c62828" onclick="adminSetAdModerationStatus('${ad.id}','rejected')"><i class="fa fa-ban"></i></button>` : `<button class="icon-btn ${ad.featured?'':'edit'}" title="${ad.featured?'إلغاء التمييز':'تمييز'}" style="${ad.featured?'background:var(--gold-light);color:#7a5000':''}" onclick="adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured?'★':'☆'}</button>`}
                  <button class="icon-btn del" title="حذف" onclick="adminDeleteAdConfirm('${ad.id}')">
                    <i class="fa fa-trash"></i></button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;

  /* ربط filteredAdsForExport للتصدير */
  window._filteredAdsForExport = list;
}

/* تصدير CSV */
function exportAdsCSV() {
  const list = window._filteredAdsForExport || adminAdsAllCache;
  const rows = [['العنوان','الفئة','السعر','المنطقة','المعلن','الهاتف','البريد','التاريخ','الحالة']];
  list.forEach(a=>{
    const date = a.createdAt
      ? new Date((a.createdAt.toMillis?a.createdAt.toMillis():(a.createdAt.seconds||0)*1000)).toLocaleDateString('ar-EG')
      : '';
    const now  = Date.now();
    const expired = a.expiresAt && (a.expiresAt.toMillis?a.expiresAt.toMillis():(a.expiresAt.seconds||0)*1000) < now;
    rows.push([
      a.title||'',a.category||'',a.price||'',a.city||a.location||'',
      a.userName||'',a.phone||'',a.userEmail||'',date,
      a.featured?'مميز':expired?'منتهي':'نشط'
    ]);
  });
  const bom = '\uFEFF';
  const csv = bom + rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a   = document.createElement('a');
  a.href    = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download= 'ads_export_' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
  showToast('تم تصدير الإعلانات ✅', 'ok');
}

/* ══════════════════════════════════════════
   تبويب 3: إدارة المستخدمين
══════════════════════════════════════════ */
function renderUsersTab(ct) {
  const total = adminUsersCache.length;
  const active = adminUsersCache.filter(u => !u.banned).length;
  const banned = adminUsersCache.filter(u => u.banned).length;
  const noRecovery = adminUsersCache.filter(u => !u.email || String(u.email).includes('@souq-aldeir.local')).length;
  ct.innerHTML = `
    <div class="admin-section-heading">
      <div><div class="admin-eyebrow">إدارة الحسابات</div><h3>المستخدمون</h3></div>
      <button class="btn btn-blue btn-sm" onclick="openRecoveryRequestForUser()"><i class="fa fa-plus"></i> طلب استعادة يدوي</button>
    </div>
    <div class="user-summary-grid">
      <button class="user-summary-card" onclick="filterUsersByStatus('')"><strong>${total}</strong><span>كل الحسابات</span></button>
      <button class="user-summary-card green" onclick="filterUsersByStatus('active')"><strong>${active}</strong><span>نشطون</span></button>
      <button class="user-summary-card red" onclick="filterUsersByStatus('banned')"><strong>${banned}</strong><span>محظورون</span></button>
      <button class="user-summary-card orange" onclick="filterUsersWithoutRecovery()"><strong>${noRecovery}</strong><span>بلا بريد استرداد</span></button>
    </div>
    <div class="adm-filters-bar">
      <input type="text" id="usersSearch" class="adm-search" style="margin:0;flex:1;min-width:140px"
        placeholder="🔍 بحث بالاسم أو الهاتف أو البريد..." oninput="applyUsersFilter()">
      <select id="usersFilterStatus" class="adm-filter-sel" onchange="applyUsersFilter()">
        <option value="">الكل</option>
        <option value="active">نشطون</option>
        <option value="banned">محظورون</option>
        <option value="no-recovery">بلا بريد استرداد</option>
      </select>
    </div>
    <div id="usersTableWrap"></div>`;
  applyUsersFilter();
}

function filterUsersByStatus(status) {
  const select = document.getElementById('usersFilterStatus');
  if (select) select.value = status;
  const search = document.getElementById('usersSearch');
  if (search) search.value = '';
  applyUsersFilter();
}

function filterUsersWithoutRecovery() {
  const select = document.getElementById('usersFilterStatus');
  if (select) select.value = 'no-recovery';
  applyUsersFilter();
}

function applyUsersFilter() {
  const q      = (document.getElementById('usersSearch')?.value||'').trim().toLowerCase();
  const status = document.getElementById('usersFilterStatus')?.value||'';

  let list = adminUsersCache;
  if (q)            list = list.filter(u=>(u.name||'').toLowerCase().includes(q)||(u.phone||'').toLowerCase().includes(q)||(u.email||'').toLowerCase().includes(q));
  if (status==='active') list = list.filter(u=>!u.banned);
  if (status==='banned') list = list.filter(u=>!!u.banned);
  if (status==='no-recovery') list = list.filter(u=>!u.email || String(u.email).includes('@souq-aldeir.local'));

  const wrap = document.getElementById('usersTableWrap');
  if (!wrap) return;

  if (!list.length) {
    wrap.innerHTML = '<div class="empty-state"><i class="fa fa-users"></i><p>لا يوجد مستخدمون</p></div>';
    return;
  }

  wrap.innerHTML = list.map(u => {
    const adsCount = adminAdsAllCache.filter(a=>a.userId===u.id).length;
    const joinDate = u.createdAt ? new Date((u.createdAt.toMillis?u.createdAt.toMillis():(u.createdAt.seconds||0)*1000)).toLocaleDateString('ar-EG') : '—';
    const lastAct  = (() => {
      const userAds = adminAdsAllCache.filter(a=>a.userId===u.id);
      if (!userAds.length) return '—';
      const latest  = userAds.reduce((mx,a)=>{
        const ms = a.createdAt?(a.createdAt.toMillis?a.createdAt.toMillis():(a.createdAt.seconds||0)*1000):0;
        return ms>mx?ms:mx;
      },0);
      return latest ? new Date(latest).toLocaleDateString('ar-EG') : '—';
    })();
    const color   = getAvatarColor(u.name||'');
    const initial = escapeHtml((u.name||'م').charAt(0));
    const safeName = escapeHtml(u.name || 'مستخدم');
    const safePhone = escapeHtml(u.phone || '—');
    const banned  = !!u.banned;
    const isAdminU= u.role==='admin';
    return `
    <div class="user-card">
        <div class="user-avatar" style="background:${color};cursor:pointer" onclick="showUserProfile('${u.id}')">${initial}</div>
      <div class="user-card-info" style="cursor:pointer;flex:1;min-width:0" onclick="showUserProfile('${u.id}')">
        <div class="user-card-name">
          ${safeName}
          ${isAdminU?'<span class="role-tag admin-tag">مدير</span>':''}
          ${banned  ?'<span class="role-tag banned-tag">محظور</span>':''}
        </div>
        <div class="user-card-meta"><i class="fa fa-phone" style="color:var(--blue)"></i>${safePhone}</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div class="user-card-meta"><i class="fa fa-bullhorn" style="color:var(--green)"></i>${adsCount} إعلان</div>
          <div class="user-card-meta"><i class="fa fa-calendar" style="color:var(--gray)"></i>انضم: ${joinDate}</div>
          <div class="user-card-meta"><i class="fa fa-clock" style="color:var(--orange)"></i>آخر نشاط: ${lastAct}</div>
        </div>
      </div>
      <div class="user-card-actions">
        <button class="icon-btn" style="background:#e0f2f1;color:#00796b"
          title="إدارة استعادة الحساب" onclick="openRecoveryRequestForUser('${u.id}')">
          <i class="fa fa-key"></i>
        </button>
        <button class="icon-btn" style="background:var(--gold-light);color:#7a5000"
          title="إرسال إنذار" onclick="sendWarningToUser('${u.id}')">
          <i class="fa fa-bell"></i>
        </button>
        <button class="icon-btn ${banned?'edit':'del'}"
          title="${banned?'رفع الحظر':'حظر المستخدم'}"
          onclick="toggleBanUser('${u.id}',${banned})">
          <i class="fa ${banned?'fa-unlock':'fa-ban'}"></i>
        </button>
        <button class="icon-btn edit" title="عرض إعلاناته"
          onclick="adminShowUserAds('${u.id}','${(u.name||'').replace(/'/g,"\\'")}')">
          <i class="fa fa-list"></i>
        </button>
        <button class="icon-btn del" title="حذف وإيقاف الحساب" onclick="deleteUserAccount('${u.id}')">
          <i class="fa fa-user-xmark"></i>
        </button>
      </div>
    </div>`;
  }).join('');
}

function adminShowUserAds(uid, name) {
  adminUserFilter     = uid;
  adminUserFilterName = name;
  switchAdminTab('ads');
}

/* ══════════════════════════════════════════
   تبويب استعادة الحساب
══════════════════════════════════════════ */
function recoveryEmailForUser(user) {
  const email = String(user?.email || '').trim();
  return email && !email.includes('@souq-aldeir.local') ? email : '';
}

function recoveryDate(ts) {
  if (!ts) return 'الآن';
  const ms = ts.toMillis ? ts.toMillis() : (ts.seconds || 0) * 1000;
  return new Date(ms).toLocaleString('ar-EG');
}

function renderRecoveryTab(ct) {
  const pending = adminRecoveryCache.filter(r => r.status === 'pending');
  ct.innerHTML = `
    <div class="admin-section-heading">
      <div><div class="admin-eyebrow">مركز الدعم</div><h3>استعادة الحساب</h3></div>
      <button class="btn btn-outline btn-sm" onclick="openRecoveryRequestForUser()"><i class="fa fa-plus"></i> إنشاء طلب</button>
    </div>
    <div class="recovery-explainer">
      <i class="fa fa-circle-info"></i>
      <div><strong>كيف نتعامل مع الطلب؟</strong><p>الحساب الذي لديه بريد حقيقي يستلم رابط Firebase مباشرة. الحساب المسجل برقم الهاتف فقط لا يمكن إرسال رابط بريد إليه؛ نرسل له تعليمات إضافة بريد استرداد أو نتواصل معه يدويًا.</p></div>
    </div>
    <div class="recovery-toolbar"><span><strong>${pending.length}</strong> طلبات معلقة</span><span class="recovery-free-badge"><i class="fa fa-wallet"></i> بدون SMS أو خدمة مدفوعة</span></div>
    <div id="recoveryRequestsList">
      ${pending.length ? pending.map(renderRecoveryCard).join('') : '<div class="empty-state"><i class="fa fa-check-circle"></i><p>لا توجد طلبات استعادة معلقة</p></div>'}
    </div>`;
}

function renderRecoveryCard(request) {
  const user = adminUsersCache.find(u => u.id === request.userId) || request;
  const email = recoveryEmailForUser(user) || recoveryEmailForUser(request);
  const hasEmail = !!email;
  return `<article class="recovery-card ${hasEmail ? 'has-email' : 'phone-only'}">
    <div class="recovery-icon"><i class="fa ${hasEmail ? 'fa-envelope' : 'fa-mobile-screen-button'}"></i></div>
    <div class="recovery-body">
      <div class="recovery-title">${escapeHtml(user.name || request.userName || 'مستخدم')}</div>
      <div class="recovery-meta"><i class="fa fa-phone"></i> ${escapeHtml(user.phone || request.phone || '—')}</div>
      <div class="recovery-meta"><i class="fa fa-envelope"></i> ${hasEmail ? escapeHtml(email) : 'لا يوجد بريد استرداد'}</div>
      <div class="recovery-meta muted">طلب في ${recoveryDate(request.createdAt)}</div>
    </div>
    <div class="recovery-actions">
      ${hasEmail ? `<button class="btn btn-green btn-sm" onclick="sendResetLinkForRequest('${request.id}','${request.userId}')"><i class="fa fa-paper-plane"></i> إرسال الرابط</button>` : `<button class="btn btn-gold btn-sm" onclick="sendPhoneRecoveryGuidance('${request.id}','${request.userId}')"><i class="fa fa-message"></i> إرسال التعليمات</button>`}
      <button class="btn btn-outline btn-sm" onclick="closeRecoveryRequest('${request.id}')"><i class="fa fa-check"></i> إغلاق</button>
    </div>
  </article>`;
}

async function sendResetLinkForRequest(requestId, uid) {
  const user = adminUsersCache.find(u => u.id === uid);
  const request = adminRecoveryCache.find(r => r.id === requestId);
  const email = recoveryEmailForUser(user) || recoveryEmailForUser(request);
  if (!email) return;
  adminConfirm(`سيتم إرسال رابط تغيير كلمة المرور إلى ${escapeHtml(email)}. هل تريد المتابعة؟`, async () => {
    try {
      const endpoint = window.SOUQ_PASSWORD_RESET_ENDPOINT || '/api/password-reset';
      const response = await fetch(endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email })
      });
      let method = 'email-smtp';
      if (!response.ok) {
        await auth.sendPasswordResetEmail(email);
        method = 'email-firebase-fallback';
      }
      await db.collection('recoveryRequests').doc(requestId).update({ status: 'resolved', method, handledAt: firebase.firestore.FieldValue.serverTimestamp() });
      adminRecoveryCache = adminRecoveryCache.filter(r => r.id !== requestId);
      showToast('تم إرسال رابط تغيير كلمة المرور', 'ok');
      checkAdminNotifs(); switchAdminTab('recovery');
    } catch (error) {
      showToast(error.code === 'auth/user-not-found' ? 'البريد غير مرتبط بحساب Firebase' : 'تعذر إرسال الرابط؛ تحقق من إعدادات البريد', 'bad');
    }
  }, false);
}

async function sendPhoneRecoveryGuidance(requestId, uid) {
  const user = adminUsersCache.find(u => u.id === uid);
  if (!user) return;
  adminConfirm('سيصل المستخدم تنبيه يطلب منه إضافة بريد استرداد من صفحة حسابه. هل تريد الإرسال؟', async () => {
    try {
      await db.collection('users').doc(uid).collection('warnings').add({
        message: 'لا يمكن إرسال رابط تغيير كلمة المرور إلى رقم الهاتف مباشرة. افتح حسابك، اختر «إضافة بريد الآن»، ثم أدخل بريدًا حقيقيًا مع كلمة المرور الحالية. بعد ذلك ستتمكن من استعادة كلمة المرور عبر البريد.',
        read: false, type: 'recovery_guidance', createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection('recoveryRequests').doc(requestId).update({ status: 'waiting_user', method: 'add_recovery_email', handledAt: firebase.firestore.FieldValue.serverTimestamp() });
      adminRecoveryCache = adminRecoveryCache.filter(r => r.id !== requestId);
      showToast('تم إرسال التعليمات للمستخدم', 'ok');
      checkAdminNotifs(); switchAdminTab('recovery');
    } catch (error) { showToast('تعذر إرسال التعليمات', 'bad'); }
  }, false);
}

async function closeRecoveryRequest(requestId) {
  await db.collection('recoveryRequests').doc(requestId).update({ status: 'closed', handledAt: firebase.firestore.FieldValue.serverTimestamp() }).catch(() => {});
  adminRecoveryCache = adminRecoveryCache.filter(r => r.id !== requestId);
  showToast('تم إغلاق الطلب', 'ok'); checkAdminNotifs(); switchAdminTab('recovery');
}

function openRecoveryRequestForUser(uid) {
  if (uid) {
    const user = adminUsersCache.find(u => u.id === uid);
    if (!user) return;
    adminConfirm(`إنشاء طلب استعادة للحساب «${escapeHtml(user.name || 'مستخدم')}»؟`, async () => {
      const existing = adminRecoveryCache.some(r => r.userId === uid && r.status === 'pending');
      if (existing) { showToast('يوجد طلب معلق لهذا الحساب', 'bad'); return; }
      await db.collection('recoveryRequests').add({ userId: uid, userName: user.name || '', phone: user.phone || '', currentEmail: user.email || '', status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      showToast('تم إنشاء الطلب', 'ok'); openAdminPanel();
    }, false);
    return;
  }
  showRecoveryUserPicker();
}

function showRecoveryUserPicker() {
  const el = document.createElement('div'); el.className = 'admin-overlay';
  el.innerHTML = `<div class="admin-dialog recovery-picker"><div class="admin-section-heading"><div><div class="admin-eyebrow">اختيار الحساب</div><h3>إنشاء طلب استعادة</h3></div><button class="icon-btn" onclick="this.closest('.admin-overlay').remove()">✕</button></div><input class="adm-search" id="recoveryPickerSearch" placeholder="ابحث بالاسم أو الهاتف أو البريد"><div id="recoveryPickerList"></div></div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  const render = () => {
    const q = (el.querySelector('#recoveryPickerSearch').value || '').toLowerCase();
    const list = adminUsersCache.filter(u => `${u.name || ''} ${u.phone || ''} ${u.email || ''}`.toLowerCase().includes(q)).slice(0, 30);
    el.querySelector('#recoveryPickerList').innerHTML = list.map(u => `<button class="recovery-picker-row" onclick="this.closest('.admin-overlay').remove();openRecoveryRequestForUser('${u.id}')"><span class="user-avatar" style="background:${getAvatarColor(u.name || '')}">${escapeHtml((u.name || 'م').charAt(0))}</span><span><strong>${escapeHtml(u.name || 'مستخدم')}</strong><small>${escapeHtml(u.phone || u.email || '—')}</small></span><i class="fa fa-chevron-left"></i></button>`).join('') || '<div class="empty-state"><p>لا توجد نتائج</p></div>';
  };
  el.querySelector('#recoveryPickerSearch').addEventListener('input', render); render();
}

/* ══════════════════════════════════════════
   تبويب 4: البلاغات
══════════════════════════════════════════ */
function renderReportsTab(ct) {
  ct.innerHTML = `
    <div class="adm-tabs" id="repTabBar" style="margin-bottom:12px">
      <button class="adm-tab active" data-rtab="pending"  onclick="switchRepTab('pending')">
        ⏳ معلقة <span class="adm-tab-badge">${adminReportsCache.length}</span>
      </button>
      <button class="adm-tab" data-rtab="featurereqs" onclick="switchRepTab('featurereqs')">
        ⭐ طلبات تمييز <span class="adm-tab-badge">${adminReqsCache.length}</span>
      </button>
      <button class="adm-tab" data-rtab="resolved"  onclick="switchRepTab('resolved')">✅ محلولة</button>
    </div>
    <div id="repTabContent"></div>`;
  switchRepTab('pending');
}

function switchRepTab(tab) {
  document.querySelectorAll('#repTabBar .adm-tab').forEach(b=>
    b.classList.toggle('active',b.dataset.rtab===tab));
  const ct = document.getElementById('repTabContent');
  if (!ct) return;

  if (tab==='featurereqs') {
    ct.innerHTML = !adminReqsCache.length
      ? '<div class="empty-state"><i class="fa fa-star-half-alt"></i><p>لا توجد طلبات تمييز معلقة</p></div>'
      : adminReqsCache.map(r=>`
        <div class="adm-report-card">
          <div class="adm-report-icon" style="background:#fff8e1;color:#f9a825"><i class="fa fa-star"></i></div>
          <div class="adm-report-body">
            <div class="adm-report-title">${r.adTitle||'إعلان'}</div>
            <div class="adm-report-sub">${r.userEmail||''}</div>
            <span class="plan-tag">${r.plan||''}</span>
          </div>
          <div class="adm-req-actions">
            <button class="btn btn-green btn-sm" onclick="approveFeature('${r.id}','${r.adId}')"><i class="fa fa-check"></i> قبول</button>
            <button class="btn btn-red btn-sm" onclick="rejectFeature('${r.id}')"><i class="fa fa-times"></i> رفض</button>
          </div>
        </div>`).join('');
    return;
  }

  if (tab==='pending') {
    ct.innerHTML = !adminReportsCache.length
      ? '<div class="empty-state"><i class="fa fa-flag"></i><p>لا توجد بلاغات معلقة</p></div>'
      : adminReportsCache.map(r=>`
        <div class="adm-report-card">
          <div class="adm-report-icon" style="background:var(--red-light);color:var(--red)"><i class="fa fa-flag"></i></div>
          <div class="adm-report-body">
            <div class="adm-report-title">${r.adTitle||'إعلان مُبلَّغ عنه'}</div>
            <div class="adm-report-sub" style="color:var(--red)">السبب: ${r.reason||'—'}</div>
            <div class="adm-report-sub">المُبلِّغ: ${r.reporterEmail||r.reporterName||'مجهول'}</div>
            <div class="adm-report-sub" style="color:var(--gray)">
              ${r.createdAt ? new Date((r.createdAt.toMillis?r.createdAt.toMillis():(r.createdAt.seconds||0)*1000)).toLocaleString('ar-EG') : ''}
            </div>
          </div>
          <div class="adm-req-actions">
            <button class="btn btn-blue btn-sm" onclick="openDetail('${r.adId}')"><i class="fa fa-eye"></i> الإعلان</button>
            <button class="btn btn-red btn-sm" onclick="resolveReportDeleteAd('${r.id}','${r.adId}')"><i class="fa fa-trash"></i> حذف</button>
            <button class="btn btn-outline btn-sm" onclick="dismissReport('${r.id}')"><i class="fa fa-ban"></i> تجاهل</button>
          </div>
        </div>`).join('');
    return;
  }

  /* محلولة — جلب من Firebase */
  ct.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  db.collection('reports').where('status','in',['resolved','dismissed']).orderBy('createdAt','desc').limit(50).get()
    .then(snap => {
      const docs = snap.docs.map(d=>({id:d.id,...d.data()}));
      ct.innerHTML = !docs.length
        ? '<div class="empty-state"><i class="fa fa-check-circle"></i><p>لا توجد بلاغات محلولة</p></div>'
        : docs.map(r=>`
          <div class="adm-report-card">
            <div class="adm-report-icon" style="background:var(--green-light);color:var(--green)">
              <i class="fa ${r.status==='dismissed'?'fa-ban':'fa-check'}"></i>
            </div>
            <div class="adm-report-body">
              <div class="adm-report-title">${r.adTitle||'إعلان'}</div>
              <div class="adm-report-sub">السبب: ${r.reason||'—'}</div>
              <div class="adm-report-sub">الحالة: ${r.status==='dismissed'?'تم التجاهل':'تم الحل'}</div>
            </div>
          </div>`).join('');
    }).catch(()=>{ ct.innerHTML='<div class="empty-state"><i class="fa fa-exclamation"></i><p>تعذر التحميل</p></div>'; });
}

/* ══════════════════════════════════════════
   تبويب 5: الإعدادات
══════════════════════════════════════════ */
function renderSettingsTab(ct) {
  ct.innerHTML = `
    <div class="adm-stabs">
      <button class="adm-stab active" data-stab="contact"     onclick="switchSettingsTab('contact')">التواصل</button>
      <button class="adm-stab" data-stab="cats"       onclick="switchSettingsTab('cats')">الفئات</button>
      <button class="adm-stab" data-stab="cities"     onclick="switchSettingsTab('cities')">المناطق</button>
      <button class="adm-stab" data-stab="about"      onclick="switchSettingsTab('about')">من نحن</button>
      <button class="adm-stab" data-stab="terms"      onclick="switchSettingsTab('terms')">الشروط</button>
      <button class="adm-stab" data-stab="seo"        onclick="switchSettingsTab('seo')">SEO</button>
      <button class="adm-stab" data-stab="news"       onclick="switchSettingsTab('news')">الأخبار</button>
    </div>
    <div id="settingsTabContent" style="padding-top:14px"></div>`;
  switchSettingsTab('contact');
}

function switchSettingsTab(stab) {
  document.querySelectorAll('.adm-stab').forEach(b=>b.classList.toggle('active',b.dataset.stab===stab));
  const ct = document.getElementById('settingsTabContent');
  if (!ct) return;

  switch(stab) {
    /* ── بيانات التواصل ── */
    case 'contact':
      ct.innerHTML = `
        <div class="section-label">📞 بيانات التواصل</div>
        <div class="fg"><label>البريد الإلكتروني</label><input type="email" id="settingsEmail" value="${contactSettings.email||''}"></div>
        <div class="fg"><label>رقم الهاتف</label><input type="text" id="settingsPhone" value="${contactSettings.phone||''}"></div>
        <button class="btn btn-blue btn-sm" onclick="saveContactSettings()"><i class="fa fa-save"></i> حفظ</button>`;
      break;

    /* ── الفئات ── */
    case 'cats':
      const currentCats = (window.CATS||[]).filter(c=>c.n!=='الكل');
      ct.innerHTML = `
        <div class="section-label">🗂️ إدارة الفئات</div>
        <div id="catsEditList">
          ${currentCats.map((c,i)=>`
            <div class="adm-edit-row" id="catRow_${i}">
              <i class="fa ${c.i}" style="color:var(--blue);width:20px;text-align:center"></i>
              <span style="flex:1;font-size:.88em">${c.n}</span>
              <button class="icon-btn del" onclick="deleteCatItem(${i})"><i class="fa fa-trash"></i></button>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <input type="text" id="newCatName" class="adm-search" style="margin:0;flex:1" placeholder="اسم الفئة الجديدة">
          <input type="text" id="newCatIcon" class="adm-search" style="margin:0;width:130px" placeholder="fa-box (Font Awesome)">
        </div>
        <button class="btn btn-blue btn-sm" style="margin-top:8px" onclick="addNewCat()">
          <i class="fa fa-plus"></i> إضافة فئة</button>
        <p style="font-size:.72em;color:var(--gray);margin-top:6px">الفئات تُحفظ في Firestore وتنعكس فوراً على التطبيق</p>`;
      break;

    /* ── المناطق ── */
    case 'cities':
      ct.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
      db.collection('settings').doc('cities').get().then(doc=>{
        const cities = (doc.exists && doc.data().list) || [];
        ct.innerHTML = `
          <div class="section-label">📍 إدارة المناطق / المدن</div>
          <div id="citiesEditList">
            ${cities.map((c,i)=>`
              <div class="adm-edit-row" id="cityRow_${i}">
                <i class="fa fa-map-marker-alt" style="color:var(--red);width:20px"></i>
                <span style="flex:1;font-size:.88em">${c}</span>
                <button class="icon-btn del" onclick="deleteCityItem(${i})"><i class="fa fa-trash"></i></button>
              </div>`).join('')}
          </div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <input type="text" id="newCityName" class="adm-search" style="margin:0;flex:1" placeholder="اسم المنطقة / المدينة">
            <button class="btn btn-blue btn-sm" onclick="addNewCity()"><i class="fa fa-plus"></i> إضافة</button>
          </div>`;
        window._citiesEditList = cities;
      }).catch(()=>{
        ct.innerHTML = '<div class="empty-state"><p>تعذر التحميل</p></div>';
      });
      break;

    /* ── من نحن ── */
    case 'about':
      ct.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
      db.collection('settings').doc('about').get().then(doc=>{
        const text = (doc.exists && doc.data().content)||'';
        ct.innerHTML = `
          <div class="section-label">ℹ️ صفحة "من نحن"</div>
          <div class="fg"><label>المحتوى (HTML أو نص عادي)</label>
            <textarea id="aboutContent" rows="10" style="min-height:180px">${text}</textarea></div>
          <button class="btn btn-blue btn-sm" onclick="saveSettingsDoc('about','content','aboutContent','تم حفظ من نحن ✅')">
            <i class="fa fa-save"></i> حفظ</button>`;
      }).catch(()=>{ ct.innerHTML='<div class="empty-state"><p>تعذر التحميل</p></div>'; });
      break;

    /* ── الشروط والأحكام ── */
    case 'terms':
      ct.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
      db.collection('settings').doc('terms').get().then(doc=>{
        const text = (doc.exists && doc.data().content)||'';
        ct.innerHTML = `
          <div class="section-label">📜 الشروط والأحكام</div>
          <div class="fg"><label>المحتوى</label>
            <textarea id="termsContent" rows="10" style="min-height:180px">${text}</textarea></div>
          <button class="btn btn-blue btn-sm" onclick="saveSettingsDoc('terms','content','termsContent','تم حفظ الشروط ✅')">
            <i class="fa fa-save"></i> حفظ</button>`;
      }).catch(()=>{ ct.innerHTML='<div class="empty-state"><p>تعذر التحميل</p></div>'; });
      break;

    /* ── SEO ── */
    case 'seo':
      ct.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
      db.collection('settings').doc('seo').get().then(doc=>{
        const d = (doc.exists&&doc.data())||{};
        ct.innerHTML = `
          <div class="section-label">🔍 إعدادات SEO</div>
          <div class="fg"><label>عنوان الموقع (Title)</label><input type="text" id="seoTitle" value="${d.title||'سوق دير الزور المفتوح'}"></div>
          <div class="fg"><label>وصف الموقع (Meta Description)</label>
            <textarea id="seoDesc" rows="3">${d.description||''}</textarea></div>
          <div class="fg"><label>الكلمات المفتاحية (Keywords) — مفصولة بفاصلة</label>
            <input type="text" id="seoKeywords" value="${d.keywords||''}"></div>
          <button class="btn btn-blue btn-sm" onclick="saveSeoSettings()">
            <i class="fa fa-save"></i> حفظ وتطبيق</button>`;
      }).catch(()=>{ ct.innerHTML='<div class="empty-state"><p>تعذر التحميل</p></div>'; });
      break;

    /* ── الأخبار ── */
    case 'news':
      ct.innerHTML = `
        <div class="section-label">📰 الشريط الإخباري</div>
        <div class="fg"><label>نص لكل سطر مستقل</label>
          <textarea id="newsTextarea" rows="6" placeholder="نص 1&#10;نص 2&#10;نص 3"></textarea></div>
        <button class="btn btn-blue btn-sm" onclick="saveNews()"><i class="fa fa-save"></i> حفظ الأخبار</button>`;
      db.collection('settings').doc('news').get().then(doc=>{
        const ta = document.getElementById('newsTextarea');
        if (ta && doc.exists && doc.data().items) ta.value = doc.data().items.join('\n');
      }).catch(()=>{});
      break;
  }
}

/* ── إجراءات الإعدادات ── */
async function saveSettingsDoc(docId, field, inputId, msg) {
  const val = document.getElementById(inputId)?.value || '';
  await db.collection('settings').doc(docId).set({[field]: val}, {merge:true})
    .catch(()=>{ showToast('تعذر الحفظ', 'bad'); return; });
  showToast(msg, 'ok');
}

async function saveSeoSettings() {
  const title    = document.getElementById('seoTitle')?.value||'';
  const desc     = document.getElementById('seoDesc')?.value||'';
  const keywords = document.getElementById('seoKeywords')?.value||'';
  await db.collection('settings').doc('seo').set({title, description:desc, keywords}).catch(()=>{});
  /* تطبيق فوري */
  if (title) document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = desc;
  showToast('تم حفظ إعدادات SEO ✅', 'ok');
}

/* ── إدارة الفئات ── */
function deleteCatItem(i) {
  if (!window.CATS) return;
  const idx = i + 1; // +1 because "الكل" is at index 0
  adminConfirm(`هل تريد حذف فئة "${window.CATS[idx]?.n}"؟`, () => {
    window.CATS.splice(idx, 1);
    renderCats && renderCats();
    switchSettingsTab('cats');
    saveCatsToFirestore();
  });
}

function addNewCat() {
  const name = document.getElementById('newCatName')?.value.trim();
  const icon = document.getElementById('newCatIcon')?.value.trim() || 'fa-box';
  if (!name) { showToast('أدخل اسم الفئة', 'bad'); return; }
  if (!window.CATS) return;
  window.CATS.push({ n: name, i: icon });
  renderCats && renderCats();
  switchSettingsTab('cats');
  saveCatsToFirestore();
}

async function saveCatsToFirestore() {
  const list = (window.CATS||[]).filter(c=>c.n!=='الكل');
  await db.collection('settings').doc('categories').set({ list }).catch(()=>{});
  showToast('تم حفظ الفئات ✅', 'ok');
}

/* ── إدارة المناطق ── */
function deleteCityItem(i) {
  if (!window._citiesEditList) return;
  adminConfirm(`هل تريد حذف "${window._citiesEditList[i]}"؟`, async () => {
    window._citiesEditList.splice(i, 1);
    await db.collection('settings').doc('cities').set({ list: window._citiesEditList });
    showToast('تم الحذف', 'ok');
    switchSettingsTab('cities');
  });
}

async function addNewCity() {
  const name = document.getElementById('newCityName')?.value.trim();
  if (!name) { showToast('أدخل اسم المنطقة', 'bad'); return; }
  if (!window._citiesEditList) window._citiesEditList = [];
  window._citiesEditList.push(name);
  await db.collection('settings').doc('cities').set({ list: window._citiesEditList });
  showToast('تمت الإضافة ✅', 'ok');
  switchSettingsTab('cities');
}

/* ══════════════════════════════════════════
   بروفايل المستخدم (Overlay)
══════════════════════════════════════════ */
function showUserProfile(uid) {
  const u = adminUsersCache.find(x=>x.id===uid);
  if (!u) return;
  const adsCount = adminAdsAllCache.filter(a=>a.userId===uid).length;
  const color    = getAvatarColor(u.name||'');
  const initial  = escapeHtml((u.name||'م').charAt(0));
  const safeName = escapeHtml(u.name || 'مستخدم');
  const safePhone = escapeHtml(u.phone || '—');
  const safeEmail = escapeHtml(u.email || '—');
  const joinDate = u.createdAt ? new Date((u.createdAt.toMillis?u.createdAt.toMillis():(u.createdAt.seconds||0)*1000)).toLocaleDateString('ar-EG') : '—';
  const el = document.createElement('div');
  el.className = 'admin-overlay';
  el.innerHTML = `
    <div class="admin-dialog" style="max-width:380px">
      <div style="text-align:center;margin-bottom:14px">
        <div style="width:64px;height:64px;border-radius:50%;background:${color};color:#fff;
          font-size:1.8em;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 10px">${initial}</div>
        <div style="font-size:1.05em;font-weight:800;color:var(--dark)">${safeName}</div>
        ${u.role==='admin'?'<span class="role-tag admin-tag">مدير النظام</span>':''}
        ${u.banned      ?'<span class="role-tag banned-tag">محظور</span>':''}
      </div>
      <div style="background:var(--bg);border-radius:12px;padding:12px;margin-bottom:12px">
        <div class="info-row"><i class="fa fa-phone" style="color:var(--blue)"></i><span>${safePhone}</span></div>
        <div class="info-row"><i class="fa fa-envelope" style="color:var(--blue)"></i><span>${safeEmail}</span></div>
        <div class="info-row"><i class="fa fa-calendar" style="color:var(--blue)"></i><span>انضم: ${joinDate}</span></div>
        <div class="info-row" style="border-bottom:none">
          <i class="fa fa-bullhorn" style="color:var(--green)"></i>
          <span>${adsCount} إعلان منشور</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" style="flex:1" onclick="this.closest('.admin-overlay').remove()">إغلاق</button>
        <button class="btn btn-blue btn-sm" style="flex:1"
          onclick="this.closest('.admin-overlay').remove();adminShowUserAds('${uid}','${(u.name||'').replace(/'/g,"\\'")}')">
          <i class="fa fa-list"></i> إعلاناته
        </button>
        <button class="btn ${u.banned?'btn-green':'btn-red'} btn-sm" style="flex:1"
          onclick="this.closest('.admin-overlay').remove();toggleBanUser('${uid}',${!!u.banned})">
          <i class="fa ${u.banned?'fa-unlock':'fa-ban'}"></i> ${u.banned?'رفع الحظر':'حظر'}
        </button>
        <button class="btn btn-red btn-sm" style="flex:1" onclick="this.closest('.admin-overlay').remove();deleteUserAccount('${uid}')">
          <i class="fa fa-user-xmark"></i> حذف الحساب
        </button>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e=>{ if(e.target===el) el.remove(); });
}

/* ══════════════════════════════════════════
   إجراءات الإعلانات
══════════════════════════════════════════ */
function adminDeleteAdConfirm(id) {
  adminConfirm('هل تريد حذف هذا الإعلان نهائياً؟', ()=>adminDeleteAd(id));
}
async function adminDeleteAd(id) {
  await db.collection('ads').doc(id).delete().catch(()=>{});
  adminAdsAllCache = adminAdsAllCache.filter(a=>a.id!==id);
  closeModal('detailModal');
  showToast('تم حذف الإعلان', 'ok');
  loadAds();
  applyAdsFilter();
}
async function adminSetAdModerationStatus(id, status) {
  if (!['approved', 'rejected', 'hidden'].includes(status)) return;
  const labels = { approved: 'الموافقة على الإعلان؟', rejected: 'رفض الإعلان وإخفاؤه؟', hidden: 'إخفاء الإعلان؟' };
  const note = status === 'rejected' ? (prompt('اكتب سبب رفض الإعلان (اختياري):') || 'لم يستوفِ شروط النشر').trim() : '';
  adminConfirm(labels[status], async () => {
    await db.collection('ads').doc(id).update({ moderationStatus: status, moderationNote: note, moderationUpdatedAt: firebase.firestore.FieldValue.serverTimestamp() }).catch(() => {});
    const ad = adminAdsAllCache.find(a => a.id === id);
    if (ad) ad.moderationStatus = status;
    showToast(status === 'approved' ? 'تمت الموافقة على الإعلان' : status === 'rejected' ? 'تم رفض الإعلان' : 'تم إخفاء الإعلان', 'ok');
    loadAds(); applyAdsFilter(); checkAdminNotifs();
  });
}

async function adminToggleFeatured(id, current) {
  if (current) {
    await db.collection('ads').doc(id).update({featured:false, featuredUntil:null, featuredDurationDays:null}).catch(()=>{});
    const ad = adminAdsAllCache.find(a => a.id===id);
    if (ad) { ad.featured = false; ad.featuredUntil = null; ad.featuredDurationDays = null; }
    showToast('تم إلغاء التمييز','ok'); loadAds(); applyAdsFilter(); return;
  }
  openAdminFeatureDuration(id);
}

function openAdminFeatureDuration(adId) {
  const ad = adminAdsAllCache.find(a => a.id === adId) || allAds.find(a => a.id === adId);
  if (!ad) return;
  const el = document.createElement('div');
  el.className = 'admin-overlay';
  el.innerHTML = `<div class="admin-dialog admin-feature-duration" role="dialog" aria-modal="true" aria-labelledby="featureDurationTitle">
    <button class="share-close" onclick="this.closest('.admin-overlay').remove()" aria-label="إغلاق">✕</button>
    <div class="share-icon"><i class="fa fa-star"></i></div>
    <h3 id="featureDurationTitle">تمييز الإعلان</h3>
    <p class="field-help">${escapeHtml(ad.title || 'إعلان')}<br>اختر مدة ظهور الإعلان في أعلى النتائج.</p>
    <div class="admin-duration-options">
      <button class="btn btn-outline" onclick="applyAdminFeatureDuration('${adId}',3)"><strong>3 أيام</strong><small>تمييز قصير</small></button>
      <button class="btn btn-outline" onclick="applyAdminFeatureDuration('${adId}',7)"><strong>7 أيام</strong><small>خيار شائع</small></button>
      <button class="btn btn-outline" onclick="applyAdminFeatureDuration('${adId}',15)"><strong>15 يومًا</strong><small>ظهور ممتد</small></button>
      <button class="btn btn-gold" onclick="applyAdminFeatureDuration('${adId}',30)"><strong>شهر واحد</strong><small>30 يومًا</small></button>
    </div>
  </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}

async function applyAdminFeatureDuration(adId, days) {
  if (![3, 7, 15, 30].includes(days)) return;
  const until = firebase.firestore.Timestamp.fromDate(new Date(Date.now() + days * 86400000));
  try {
    await db.collection('ads').doc(adId).update({featured:true, featuredUntil:until, featuredDurationDays:days});
    const ad = adminAdsAllCache.find(a => a.id === adId);
    if (ad) { ad.featured = true; ad.featuredUntil = until; ad.featuredDurationDays = days; }
    document.querySelector('.admin-feature-duration')?.closest('.admin-overlay')?.remove();
    showToast(`تم تمييز الإعلان لمدة ${days === 30 ? 'شهر' : days + ' أيام'} ⭐`, 'ok');
    loadAds(); applyAdsFilter();
  } catch (error) { showToast('تعذر تمييز الإعلان، حاول مرة أخرى', 'bad'); }
}

/* ══════════════════════════════════════════
   إجراءات طلبات التمييز
══════════════════════════════════════════ */
const PLAN_DAYS = {'3 أيام':3,'7 أيام':7,'15 يومًا':15,'30 يومًا':30,'30 يوماً':30,'15 يوم':15,'مجاني':7};
async function approveFeature(reqId, adId) {
  const req  = adminReqsCache.find(r=>r.id===reqId);
  const plan = req ? req.plan : '';
  const days = Number(req?.durationDays) || PLAN_DAYS[plan] || 7;
  const featuredUntil = firebase.firestore.Timestamp.fromDate(new Date(Date.now()+days*86400000));
  await db.collection('ads').doc(adId).update({featured:true, featuredUntil, featuredDurationDays:days}).catch(()=>{});
  await db.collection('featuredRequests').doc(reqId).update({status:'approved'}).catch(()=>{});
  adminReqsCache = adminReqsCache.filter(r=>r.id!==reqId);
  showToast(`تم التمييز لمدة ${days} أيام ⭐`, 'ok');
  checkAdminNotifs(); loadAds(); openAdminPanel();
}
async function rejectFeature(reqId) {
  await db.collection('featuredRequests').doc(reqId).update({status:'rejected'}).catch(()=>{});
  adminReqsCache = adminReqsCache.filter(r=>r.id!==reqId);
  showToast('تم رفض الطلب', 'ok');
  checkAdminNotifs(); openAdminPanel();
}

/* ══════════════════════════════════════════
   إجراءات البلاغات
══════════════════════════════════════════ */
async function resolveReportDeleteAd(reportId, adId) {
  adminConfirm('هل تريد حذف الإعلان المُبلَّغ عنه نهائياً؟', async()=>{
    await db.collection('ads').doc(adId).delete().catch(()=>{});
    await db.collection('reports').doc(reportId).update({status:'resolved'}).catch(()=>{});
    /* إشعار المُبلِّغ */
    const rep = adminReportsCache.find(r=>r.id===reportId);
    if (rep && rep.reporterId) {
      db.collection('users').doc(rep.reporterId).collection('warnings').add({
        message: `بلاغك بشأن الإعلان "${rep.adTitle||''}" تمت مراجعته وحذف الإعلان.`,
        read: false, type: 'report_resolved',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(()=>{});
    }
    adminReportsCache = adminReportsCache.filter(r=>r.id!==reportId);
    adminAdsAllCache  = adminAdsAllCache.filter(a=>a.id!==adId);
    showToast('تم حذف الإعلان', 'ok'); loadAds(); openAdminPanel();
  });
}
async function dismissReport(reportId) {
  await db.collection('reports').doc(reportId).update({status:'dismissed'}).catch(()=>{});
  /* إشعار المُبلِّغ */
  const rep = adminReportsCache.find(r=>r.id===reportId);
  if (rep && rep.reporterId) {
    db.collection('users').doc(rep.reporterId).collection('warnings').add({
      message: `تمت مراجعة بلاغك بشأن الإعلان "${rep.adTitle||''}" ولم نجد مخالفة.`,
      read: false, type: 'report_dismissed',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(()=>{});
  }
  adminReportsCache = adminReportsCache.filter(r=>r.id!==reportId);
  showToast('تم تجاهل البلاغ', 'ok'); openAdminPanel();
}

/* ══════════════════════════════════════════
   إدارة المستخدمين
══════════════════════════════════════════ */
async function deleteUserAccount(uid) {
  if (!isAdmin || !uid || (currentUser && currentUser.uid === uid)) {
    showToast('لا يمكنك حذف حساب المدير الحالي', 'bad'); return;
  }
  const user = adminUsersCache.find(u => u.id === uid);
  if (!user) return;
  adminConfirm(`سيؤدي ذلك إلى إيقاف الحساب وحذف ملفه الشخصي وإعلاناته ومحادثاته. لا يمكن التراجع عن هذا الإجراء. هل تريد المتابعة؟`, async () => {
    try {
      const [adsSnap, chatsSnap] = await Promise.all([
        db.collection('ads').where('userId', '==', uid).get(),
        db.collection('chats').where('participants', 'array-contains', uid).get()
      ]);
      const refs = adsSnap.docs.map(d => d.ref);
      const chatDocs = chatsSnap.docs;
      const messageSnaps = await Promise.all(chatDocs.map(chat => chat.ref.collection('messages').get().catch(() => ({ docs: [] }))));
      chatDocs.forEach((chat, i) => {
        messageSnaps[i].docs.forEach(message => refs.push(message.ref));
        refs.push(chat.ref);
      });
      if (user.phoneNormalized) refs.push(db.collection('phoneIndex').doc(user.phoneNormalized));
      for (let i = 0; i < refs.length; i += 450) {
        const batch = db.batch();
        refs.slice(i, i + 450).forEach(ref => batch.delete(ref));
        await batch.commit();
      }
      await db.collection('users').doc(uid).update({
        name: 'حساب محذوف', email: '', phone: '', phoneNormalized: '',
        banned: true, deleted: true, deletedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      adminUsersCache = adminUsersCache.filter(u => u.id !== uid);
      adminAdsAllCache = adminAdsAllCache.filter(a => a.userId !== uid);
      adminRecoveryCache = adminRecoveryCache.filter(r => r.userId !== uid);
      showToast('تم حذف وإيقاف حساب المستخدم وبياناته', 'ok');
      checkAdminNotifs(); applyUsersFilter();
    } catch (error) {
      showToast('تعذر حذف الحساب بالكامل، تحقق من الصلاحيات', 'bad');
    }
  });
}

async function toggleBanUser(uid, currentlyBanned) {
  adminConfirm(
    currentlyBanned ? 'هل تريد رفع الحظر عن هذا المستخدم؟'
                    : 'هل تريد حظر هذا المستخدم؟ لن يستطيع الدخول بعد الآن.',
    async()=>{
      await db.collection('users').doc(uid).update({banned:!currentlyBanned}).catch(()=>{});
      const u = adminUsersCache.find(x=>x.id===uid);
      if (u) u.banned = !currentlyBanned;
      showToast(currentlyBanned?'تم رفع الحظر':'تم حظر المستخدم','ok');
      applyUsersFilter();
    }
  );
}

async function sendWarningToUser(uid) {
  adminInput('إرسال إنذار للمستخدم', 'اكتب نص الإنذار...', async text=>{
    await db.collection('users').doc(uid).collection('warnings').add({
      message: text, read: false, type: 'warning',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(()=>{ showToast('تعذر إرسال الإنذار','bad'); return; });
    showToast('تم إرسال الإنذار ✅','ok');
  });
}

/* ══════════════════════════════════════════
   الإعدادات العامة
══════════════════════════════════════════ */
async function saveContactSettings() {
  const email = document.getElementById('settingsEmail')?.value.trim() || '';
  const phone = document.getElementById('settingsPhone')?.value.trim() || '';
  if (!email && !phone) { showToast('أدخل البريد الإلكتروني أو رقم الهاتف', 'bad'); return; }
  try {
    await db.collection('settings').doc('contact').set({ email, phone }, { merge: true });
    contactSettings = { ...contactSettings, email, phone };
    showToast('تم حفظ بيانات التواصل ✅', 'ok');
  } catch (error) {
    showToast('تعذر حفظ بيانات التواصل', 'bad');
  }
}

async function saveNews() {
  const lines = document.getElementById('newsTextarea')?.value
    .split('\n').map(s=>s.trim()).filter(Boolean)||[];
  await db.collection('settings').doc('news').set({items:lines}).catch(()=>{});
  showToast('تم حفظ الأخبار ✅','ok'); loadNews();
}

/* ══════════════════════════════════════════
   مساعد: adRowHtml + toggleAccordion (للتوافق)
══════════════════════════════════════════ */
function adRowHtml(ad, cover) {
  return `
    <div class="my-ad-row">
      <div class="my-ad-img">
        ${cover(ad)?`<img src="${cover(ad)}" loading="lazy" onerror="this.style.display='none'">`:'<i class="fa fa-image"></i>'}
      </div>
      <div class="my-ad-info">
        <div class="my-ad-title">${ad.title||''}</div>
        <div class="my-ad-status">${ad.userEmail||''}</div>
        ${ad.featured?'<span class="featured-mini-tag">⭐ مميز</span>':''}
      </div>
      <div class="my-ad-actions">
        <button class="icon-btn ${ad.featured?'':'edit'}"
          style="${ad.featured?'background:var(--gold-light);color:#7a5000':''}"
          onclick="adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured?'★':'☆'}</button>
        <button class="icon-btn del" onclick="adminDeleteAdConfirm('${ad.id}')">
          <i class="fa fa-trash"></i></button>
      </div>
    </div>`;
}

function filterAdsByUser(uid, name) {
  adminUserFilter     = uid;
  adminUserFilterName = name;
  switchAdminTab('ads');
}
function clearAdsUserFilter() {
  adminUserFilter     = null;
  adminUserFilterName = '';
  applyAdsFilter();
}

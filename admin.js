// src/js/admin.js
import { db } from './firebase.js';
import { showToast, openModal, closeModal } from '../components/modal.js';
import { getCurrentUser, getIsAdmin, checkAdminNotifs } from './auth.js';
import { loadAds, getAds } from './ads.js';
import { loadNews } from './utils.js';

export async function openAdminPanel() {
  if (!getIsAdmin()) return;
  const content = document.getElementById('adminContent');
  if (!content) return;
  content.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('adminModal');

  const [reqSnap, usersSnap] = await Promise.all([
    db.collection('featuredRequests').where('status', '==', 'pending').get().catch(() => ({ docs: [] })),
    db.collection('users').get().catch(() => ({ size: 0 }))
  ]);

  const reqs = reqSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const allAds = getAds();

  let html = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="dash-card" style="text-align:center"><div class="dash-stat">${allAds.length}</div><div style="font-size:.72em;color:var(--gray)">إجمالي الإعلانات</div></div>
      <div class="dash-card" style="text-align:center"><div class="dash-stat">${usersSnap.size || 0}</div><div style="font-size:.72em;color:var(--gray)">المستخدمون</div></div>
    </div>

    <div class="section-label">⭐ طلبات التمييز (${reqs.length})</div>
    ${reqs.length ? reqs.map(r => `
      <div class="my-ad-row">
        <div class="my-ad-info">
          <div class="my-ad-title">${r.adTitle || ''}</div>
          <div class="my-ad-status">${r.plan || ''} · ${r.userEmail || ''}</div>
        </div>
        <div class="my-ad-actions">
          <button class="icon-btn edit" onclick="window.approveFeature('${r.id}','${r.adId}')"><i class="fa fa-check"></i></button>
          <button class="icon-btn del" onclick="window.rejectFeature('${r.id}')"><i class="fa fa-times"></i></button>
        </div>
      </div>`).join('')
    : '<p style="font-size:.85em;color:var(--gray);padding:10px 0">لا توجد طلبات معلقة</p>'}

    <div class="section-label">📋 إدارة الإعلانات</div>
    ${allAds.slice(0, 20).map(ad => `
      <div class="my-ad-row">
        <div class="my-ad-img">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
        <div class="my-ad-info">
          <div class="my-ad-title">${ad.title || ''}</div>
          <div class="my-ad-status">${ad.userEmail || ''}</div>
        </div>
        <div class="my-ad-actions">
          <button class="icon-btn edit" title="${ad.featured ? 'إلغاء تمييز' : 'تمييز'}" onclick="window.adminToggleFeatured('${ad.id}',${!!ad.featured})">${ad.featured ? '★' : '☆'}</button>
          <button class="icon-btn del" onclick="window.adminDeleteAd('${ad.id}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')}

    <div class="section-label">📰 الشريط الإخباري</div>
    <div class="fg"><label>النصوص (كل سطر نص مستقل)</label><textarea id="newsTextarea" rows="4" placeholder="نص 1&#10;نص 2&#10;نص 3"></textarea></div>
    <button class="btn btn-blue btn-sm" onclick="window.saveNews()"><i class="fa fa-save"></i> حفظ الأخبار</button>
  `;

  // تحميل الأخبار الحالية
  db.collection('settings').doc('news').get().then(doc => {
    const ta = document.getElementById('newsTextarea');
    if (ta && doc.exists && doc.data().items) {
      ta.value = doc.data().items.join('\n');
    }
  }).catch(() => {});

  content.innerHTML = html;
}

export async function approveFeature(reqId, adId) {
  await db.collection('ads').doc(adId).update({ featured: true }).catch(() => {});
  await db.collection('featuredRequests').doc(reqId).update({ status: 'approved' }).catch(() => {});
  showToast('تم تمييز الإعلان ⭐', 'ok');
  if (checkAdminNotifs) checkAdminNotifs();
  loadAds();
  openAdminPanel();
}

export async function rejectFeature(reqId) {
  await db.collection('featuredRequests').doc(reqId).update({ status: 'rejected' }).catch(() => {});
  showToast('تم رفض الطلب', 'ok');
  if (checkAdminNotifs) checkAdminNotifs();
  openAdminPanel();
}

export async function adminDeleteAd(id) {
  if (!confirm('حذف هذا الإعلان؟')) return;
  await db.collection('ads').doc(id).delete().catch(() => {});
  closeModal('detailModal');
  showToast('تم حذف الإعلان', 'ok');
  loadAds();
  openAdminPanel();
}

export async function adminToggleFeatured(id, current) {
  await db.collection('ads').doc(id).update({ featured: !current }).catch(() => {});
  showToast(current ? 'تم إلغاء التمييز' : 'تم التمييز ⭐', 'ok');
  loadAds();
  openAdminPanel();
}

export async function saveNews() {
  const ta = document.getElementById('newsTextarea');
  if (!ta) return;
  const lines = ta.value.split('\n').map(s => s.trim()).filter(Boolean);
  await db.collection('settings').doc('news').set({ items: lines }).catch(() => {});
  showToast('تم حفظ الأخبار ✅', 'ok');
  loadNews();
}

// جعل الدوال عامة
window.openAdminPanel = openAdminPanel;
window.approveFeature = approveFeature;
window.rejectFeature = rejectFeature;
window.adminDeleteAd = adminDeleteAd;
window.adminToggleFeatured = adminToggleFeatured;
window.saveNews = saveNews;
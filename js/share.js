/* ============================================================
   Site sharing — QR + Web Share / clipboard fallback
   ============================================================ */
function siteUrl() {
  return `${location.origin}${location.pathname}`;
}

function openSiteShare() {
  const url = siteUrl();
  const el = document.createElement('div');
  el.className = 'admin-overlay site-share-overlay';
  el.innerHTML = `
    <div class="admin-dialog site-share-dialog" role="dialog" aria-modal="true" aria-labelledby="siteShareTitle">
      <button class="share-close" onclick="this.closest('.site-share-overlay').remove()" aria-label="إغلاق">✕</button>
      <div class="share-icon"><i class="fa fa-qrcode"></i></div>
      <h3 id="siteShareTitle">شارك سوق دير الزور</h3>
      <p>امسح الرمز لفتح الموقع أو شارك الرابط مع أصدقائك.</p>
      <div id="siteQrCode" class="site-qr-code" aria-label="رمز QR لرابط الموقع"></div>
      <div class="site-share-url">${escapeHtml(url)}</div>
      <div class="site-share-actions">
        <button class="btn btn-blue btn-sm" onclick="shareSiteLink()"><i class="fa fa-share-nodes"></i> مشاركة الرابط</button>
        <button class="btn btn-outline btn-sm" onclick="copySiteLink()"><i class="fa fa-copy"></i> نسخ الرابط</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  if (window.QRCode) new QRCode(el.querySelector('#siteQrCode'), { text: url, width: 180, height: 180, colorDark: '#1565c0', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
  else el.querySelector('#siteQrCode').innerHTML = '<p class="field-help">تعذر تحميل رمز QR، استخدم نسخ الرابط.</p>';
}

function copySiteLink() {
  const url = siteUrl();
  const done = () => showToast('تم نسخ رابط الموقع', 'ok');
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done).catch(() => showToast(url));
  else showToast(url);
}

function shareSiteLink() {
  const url = siteUrl();
  if (navigator.share) navigator.share({ title: 'سوق دير الزور', text: 'زوروا سوق دير الزور المفتوح', url }).catch(() => {});
  else copySiteLink();
}

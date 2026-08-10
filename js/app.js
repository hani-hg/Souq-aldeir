/* ============================================================
   app.js
   Main entry point: bottom-nav state, search wiring, and the
   boot sequence. Load this file LAST, after every other
   src/js and src/components script.
   ============================================================ */

function setBnav(k) {
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('bnav-' + k); if (el) el.classList.add('active');
}

function initSearch() {
  document.getElementById('searchInput').addEventListener('input', applyFilter);
}

/* ============ QR SHARE ============ */
function initQrCode() {
  const img = document.getElementById('qrCodeImg');
  if (!img) return;
  const url = location.origin + location.pathname;
  img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
}

function copySiteLink() {
  const url = location.origin + location.pathname;
  navigator.clipboard.writeText(url).then(
    () => showToast('تم نسخ الرابط ✅', 'ok'),
    () => showToast('تعذر نسخ الرابط', 'bad')
  );
}

/* ============ BOOT ============ */
function initApp() {
  renderCats();
  loadNews();
  loadContactSettings();
  initModals();
  initAddAdForm();
  initSearch();
  initQrCode();
  loadChatSeenMap();
  initAuthListener();  // also triggers the first loadAds() and initChatsListener()
  loadFavorites();
  countVisitOnce();
}

document.addEventListener('DOMContentLoaded', initApp);


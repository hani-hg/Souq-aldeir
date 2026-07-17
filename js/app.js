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

/* ============ BOOT ============ */
function initApp() {
  renderCats();
  loadNews();
  loadContactSettings();
  initModals();
  initAddAdForm();
  initSearch();
  loadChatSeenMap();
  initAuthListener();  // also triggers the first loadAds() and initChatsListener()
  loadFavorites();
  countVisitOnce();
}

document.addEventListener('DOMContentLoaded', initApp);


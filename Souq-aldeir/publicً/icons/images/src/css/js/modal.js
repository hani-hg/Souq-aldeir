/* ============================================================
   MODAL COMPONENT
   فتح / إغلاق النوافذ المنبثقة (Bottom Sheets)
============================================================ */

function openM(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function closeM(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

/* إغلاق تلقائي عند الضغط خارج الصندوق */
function initModalBackdropClose() {
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        m.classList.remove('show');
        if (m.id === 'msgModal' && typeof stopChat === 'function') stopChat();
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', initModalBackdropClose);

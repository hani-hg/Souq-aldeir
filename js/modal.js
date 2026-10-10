/* ============================================================
   components/modal.js
   Generic bottom-sheet modal open/close + backdrop click-to-close.
   ============================================================ */

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  if (id === 'msgModal' && typeof stopObservedOnlinePresence === 'function') stopObservedOnlinePresence();
}

function initModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        m.classList.remove('active');
        if (chatUnsub && m.id === 'msgModal') {
          chatUnsub();
          chatUnsub = null;
        }
        if (m.id === 'msgModal' && typeof stopObservedOnlinePresence === 'function') stopObservedOnlinePresence();
      }
    });
  });
}


// src/components/modal.js
import { openModal, closeModal } from '../js/utils.js';

// إضافة مستمعين لإغلاق المودالات عند النقر خارجها
export function initModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) {
        m.classList.remove('active');
        if (window.chatUnsub && m.id === 'msgModal') {
          window.chatUnsub();
          window.chatUnsub = null;
        }
      }
    });
  });

  document.querySelectorAll('.x-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('active');
        if (window.chatUnsub && modal.id === 'msgModal') {
          window.chatUnsub();
          window.chatUnsub = null;
        }
      }
    });
  });
}

export { openModal, closeModal };
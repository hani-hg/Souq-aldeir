/* ============================================================
   components/toast.js
   Small bottom "toast" notification component.
   ============================================================ */

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => (t.className = 'toast'), 3000);
}



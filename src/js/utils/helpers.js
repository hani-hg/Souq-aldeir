// helpers.js
window.showToast = function(msg, dur = 3000) {
  const el = document.getElementById('toastEl');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => el.classList.remove('show'), dur);
};
window.closeM = function(id) { document.getElementById(id).classList.remove('active'); };
window.openM = function(id) { document.getElementById(id).classList.add('active'); };
window.formatDate = function(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
};
window.truncate = function(str, n = 30) {
  return str?.length > n ? str.slice(0, n) + '…' : str;
};

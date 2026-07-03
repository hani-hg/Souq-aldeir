/* ============================================================
   TOAST COMPONENT
   رسائل تنبيه صغيرة تظهر أسفل الشاشة
   الاستخدام: toast('تم الحفظ بنجاح', 'ok')  |  toast('حدث خطأ', 'bad')
============================================================ */

function toast(msg, type = '') {
  let el = document.getElementById('toastEl');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toastEl';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'toast ' + type + ' show';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = 'toast'; }, 3000);
}

// cart.js
window.toggleFav = function(id) {
  window.showToast('❤️ تمت الإضافة للمفضلة');
};
window.openFavs = function() {
  document.getElementById('favBody').innerHTML = '<p>قائمة المفضلة فارغة حالياً</p>';
  window.openM('favModal');
};
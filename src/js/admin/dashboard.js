// dashboard.js
window.openAdmin = function() {
  if (!auth.currentUser || auth.currentUser.email !== 'admin@example.com') return window.showToast('غير مصرح');
  document.getElementById('adminBody').innerHTML = `
    <div style="display:flex;gap:12px;margin-bottom:16px;">
      <button onclick="window.adminUsers()" class="btn btn-blue">👥 المستخدمين</button>
      <button onclick="window.adminAds()" class="btn btn-orange">📢 الإعلانات</button>
    </div>
    <div id="adminContent"></div>
  `;
  window.openM('adminModal');
  window.adminUsers();
};

window.adminUsers = function() {
  db.collection('users').get().then(snap => {
    document.getElementById('adminContent').innerHTML = snap.docs.map(d => `<p>${d.data().name} - ${d.data().email}</p>`).join('');
  });
};

window.adminAds = function() {
  db.collection('ads').get().then(snap => {
    document.getElementById('adminContent').innerHTML = snap.docs.map(d => `<p>${d.data().title} - ${d.data().ownerId}</p>`).join('');
  });
};

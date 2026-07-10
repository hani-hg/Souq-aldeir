// ads.js
let allAds = [];
let currentFilter = 'new';

window.loadAds = function(cat = '') {
  const grid = document.getElementById('adsGrid');
  grid.innerHTML = `<div class="loading-state"><i class="fa fa-spinner fa-spin"></i><p>جاري...</p></div>`;
  let query = db.collection('ads').orderBy('createdAt', 'desc');
  if (cat) query = query.where('category', '==', cat);
  query.get().then(snap => {
    allAds = [];
    snap.forEach(doc => { const d = doc.data(); d.id = doc.id; allAds.push(d); });
    window.renderAds(currentFilter);
    document.getElementById('adsCountEl').textContent = `📢 ${allAds.length} إعلان`;
  });
};

window.renderAds = function(filter = 'new') {
  currentFilter = filter;
  let list = [...allAds];
  if (filter === 'asc') list.sort((a,b) => (a.price||0) - (b.price||0));
  else if (filter === 'desc') list.sort((a,b) => (b.price||0) - (a.price||0));
  else list.sort((a,b) => (b.createdAt?.toMillis?.()||0) - (a.createdAt?.toMillis?.()||0));
  const grid = document.getElementById('adsGrid');
  if (!list.length) { grid.innerHTML = `<div class="loading-state">لا توجد إعلانات</div>`; return; }
  grid.innerHTML = list.map(ad => `
    <div class="ad-card" onclick="window.showDetail('${ad.id}')">
      <img src="${ad.imageURL || 'https://via.placeholder.com/300x200?text=سوق+دير+الزور'}" alt="${ad.title}">
      <div class="ad-body">
        <h3>${ad.title}</h3>
        <div class="price">${ad.price ? ad.price + '$' : 'غير محدد'}</div>
        <div class="meta"><span>${ad.area || 'دير الزور'}</span><span>${window.formatDate(ad.createdAt)}</span></div>
        <div class="ad-actions">
          <button onclick="event.stopPropagation();window.toggleFav('${ad.id}')"><i class="fa fa-heart"></i></button>
          <button onclick="event.stopPropagation();window.openChat('${ad.ownerId}','${ad.id}')"><i class="fa fa-comment"></i></button>
          ${ad.ownerId === auth.currentUser?.uid ? `<button onclick="event.stopPropagation();window.editAd('${ad.id}')"><i class="fa fa-edit"></i></button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
};

window.doAddAd = function() {
  if (!auth.currentUser) return window.onUserBtn();
  const title = document.getElementById('adT').value;
  const desc = document.getElementById('adD').value;
  const price = parseFloat(document.getElementById('adPr').value);
  const phone = document.getElementById('adPh').value;
  const cat = document.getElementById('adCat').value;
  const area = document.getElementById('adArea').value;
  if (!title || !desc || !price || !phone || !cat) { document.getElementById('addErr').textContent = 'املأ جميع الحقول'; return; }
  const file = document.getElementById('adImg').files[0];
  window.uploadImage(file).then(url => {
    return db.collection('ads').add({
      title, desc, price, phone, category: cat, area,
      ownerId: auth.currentUser.uid,
      imageURL: url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      featured: false
    });
  }).then(() => { window.closeM('addModal'); window.showToast('تم النشر'); window.loadAds(); })
  .catch(e => document.getElementById('addErr').textContent = e.message);
};

window.showDetail = function(id) {
  const ad = allAds.find(a => a.id === id);
  if (!ad) return;
  document.getElementById('detailBody').innerHTML = `
    <img src="${ad.imageURL || 'https://via.placeholder.com/400x250'}" style="width:100%;border-radius:16px;max-height:250px;object-fit:cover;margin-bottom:12px;">
    <h2>${ad.title}</h2>
    <p>${ad.desc}</p>
    <p><strong>السعر:</strong> ${ad.price}$</p>
    <p><strong>الفئة:</strong> ${ad.category}</p>
    <p><strong>المنطقة:</strong> ${ad.area}</p>
    <p><strong>الهاتف:</strong> ${ad.phone}</p>
    <button class="btn btn-orange" onclick="window.openChat('${ad.ownerId}','${ad.id}')">مراسلة البائع</button>
  `;
  window.openM('detailModal');
};

window.editAd = function(id) {
  const ad = allAds.find(a => a.id === id);
  if (!ad) return;
  document.getElementById('edId').value = id;
  document.getElementById('edT').value = ad.title;
  document.getElementById('edD').value = ad.desc;
  document.getElementById('edPr').value = ad.price;
  document.getElementById('edPh').value = ad.phone;
  window.openM('editModal');
};

window.doEditAd = function() {
  const id = document.getElementById('edId').value;
  db.collection('ads').doc(id).update({
    title: document.getElementById('edT').value,
    desc: document.getElementById('edD').value,
    price: parseFloat(document.getElementById('edPr').value),
    phone: document.getElementById('edPh').value
  }).then(() => { window.closeM('editModal'); window.showToast('تم التعديل'); window.loadAds(); })
  .catch(e => document.getElementById('editErr').textContent = e.message);
};

window.applyFilter = function() {
  window.renderAds(document.getElementById('sortEl').value);
};

window.loadCats = function() {
  db.collection('categories').orderBy('name').get().then(snap => {
    const sel = document.getElementById('adCat');
    sel.innerHTML = '<option value="">اختر...</option>';
    snap.forEach(doc => { sel.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`; });
    document.getElementById('edCat').innerHTML = sel.innerHTML;
  });
};

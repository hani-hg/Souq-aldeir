let lastDoc = null;
let loading = false;

async function loadAds() {
  if (loading) return;
  loading = true;

  const btn = document.getElementById("loadMoreBtn");
  btn.textContent = "جاري التحميل...";

  let query = db.collection("ads")
    .orderBy("createdAt", "desc")
    .limit(6);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snap = await query.get();

  if (!snap.empty) {
    lastDoc = snap.docs[snap.docs.length - 1];
    snap.forEach(doc => renderAd(doc.data()));
  }

  btn.textContent = "تحميل المزيد";
  loading = false;
}

function renderAd(ad) {
  const grid = document.getElementById("adsGrid");

  grid.innerHTML += `
    <div class="ad-card">
      <img src="${ad.imageUrl}" loading="lazy">
      <div class="content">
        <h3>${ad.title}</h3>
        <div class="price">${ad.price} ل.س</div>
        <small>${ad.city} • ${ad.category}</small>
      </div>
    </div>
  `;
}
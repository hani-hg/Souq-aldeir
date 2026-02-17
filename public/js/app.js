const adsDiv = document.getElementById("ads");

document.getElementById("addAdBtn").onclick = async () => {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;

  if (!title || !price || !imageUrl) {
    alert("املأ كل الحقول");
    return;
  }

  await db.collection("ads").add({
    title,
    price,
    imageUrl,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("تم نشر الإعلان");
  location.reload();
};

async function loadAds() {
  const snap = await db.collection("ads")
    .orderBy("createdAt", "desc")
    .get();

  adsDiv.innerHTML = "";

  snap.forEach(doc => {
    const ad = doc.data();
    adsDiv.innerHTML += `
      <div class="card">
        <img src="${ad.imageUrl}">
        <h3>${ad.title}</h3>
        <p>${ad.price} ل.س</p>
      </div>
    `;
  });
}

loadAds();
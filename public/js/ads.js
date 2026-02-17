window.addAd = async function(title, description, price, category, imageFile) {
    if (!window.auth.currentUser) throw new Error('يجب تسجيل الدخول أولاً');
    let imageUrl = '';
    if (imageFile) {
        const storageRef = window.storage.ref(`ads/${Date.now()}_${imageFile.name}`);
        await storageRef.put(imageFile);
        imageUrl = await storageRef.getDownloadURL();
    }
    await window.db.collection('ads').add({
        title, description, price, category,
        user: window.auth.currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrl
    });
};
window.loadAds = function(containerId) {
    const container = document.getElementById(containerId);
    window.db.collection('ads').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        if (snapshot.empty) { container.innerHTML = '<p>لا توجد إعلانات بعد</p>'; return; }
        let html = '';
        snapshot.forEach(doc => {
            const ad = doc.data();
            const img = ad.imageUrl ? `<img src="${ad.imageUrl}" alt="صورة">` : '';
            html += `<div class="ad"><h3>${ad.title}</h3><p>${ad.description}</p><p>💰 ${ad.price}</p><p>📂 ${ad.category}</p><p>👤 ${ad.user}</p>${img}</div>`;
        });
        container.innerHTML = html;
    });
};
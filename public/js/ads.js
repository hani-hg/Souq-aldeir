// دالة إضافة إعلان
window.addAd = async function(title, description, price, category, imageFile) {
    if (!window.auth.currentUser) throw new Error('يجب تسجيل الدخول أولاً');

    let imageUrl = '';
    if (imageFile) {
        const storageRef = window.storage.ref(`ads/${Date.now()}_${imageFile.name}`);
        await storageRef.put(imageFile);
        imageUrl = await storageRef.getDownloadURL();
    }

    await window.db.collection('ads').add({
        title,
        description,
        price,
        category,
        user: window.auth.currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrl
    });
};

// دالة تحميل الإعلانات
window.loadAds = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    window.db.collection('ads').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        if (snapshot.empty) {
            container.innerHTML = '<p>لا توجد إعلانات بعد</p>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const ad = doc.data();
            const imageHtml = ad.imageUrl ? `<img src="${ad.imageUrl}" alt="صورة" style="max-width:100%; max-height:200px;">` : '';
            html += `
                <div class="ad-card">
                    ${imageHtml}
                    <div class="ad-content">
                        <span class="ad-category">${ad.category}</span>
                        <div class="ad-title">${ad.title}</div>
                        <div class="ad-description">${ad.description}</div>
                        <div class="ad-price">$${ad.price}</div>
                        <div><i class="fas fa-phone-alt"></i> ${ad.phone || ''}</div>
                        <div><small>👤 ${ad.user}</small></div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    });
};
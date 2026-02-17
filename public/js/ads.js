// دالة لإضافة إعلان جديد مع صورة
window.addAd = async function(title, description, price, category, imageFile) {
    if (!window.auth.currentUser) {
        throw new Error('يجب تسجيل الدخول أولاً');
    }

    let imageUrl = '';

    // إذا كان هناك ملف صورة، نرفعه إلى Firebase Storage
    if (imageFile) {
        const storageRef = window.storage.ref(`ads/${Date.now()}_${imageFile.name}`);
        await storageRef.put(imageFile);
        imageUrl = await storageRef.getDownloadURL();
    }

    // إضافة الإعلان إلى Firestore
    await window.db.collection('ads').add({
        title,
        description,
        price,
        category,
        user: window.auth.currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrl: imageUrl
    });
};

// دالة لتحميل الإعلانات وعرضها في عنصر معين
window.loadAds = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // استماع للتغييرات في مجموعة الإعلانات
    window.db.collection('ads').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        if (snapshot.empty) {
            container.innerHTML = '<p>لا توجد إعلانات بعد</p>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const ad = doc.data();
            // عرض الصورة إذا وجدت
            const imageHtml = ad.imageUrl ? `<img src="${ad.imageUrl}" alt="صورة الإعلان">` : '';
            
            html += `
                <div class="ad">
                    <h3>${ad.title}</h3>
                    <p>${ad.description}</p>
                    <p>💰 السعر: ${ad.price}</p>
                    <p>📂 الفئة: ${ad.category}</p>
                    <p>👤 الناشر: ${ad.user}</p>
                    ${imageHtml}
                </div>
            `;
        });
        container.innerHTML = html;
    });
};
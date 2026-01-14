// ملف التطبيق الرئيسي لسوق دير الزور
console.log('🚀 تطبيق سوق دير الزور جاهز!');

// دالة الاتصال بالبائع
function contactSeller(productName, price) {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
        alert(`شكراً لاهتمامك بمنتج ${productName}\nسنتصل بالبائع للإتفاق على السعر: $${price}`);
    } else {
        alert('⚠️ يرجى تسجيل الدخول أولاً للاتصال بالبائع');
    }
}

// دالة عرض معلومات Firebase (للتطوير)
function showFirebaseInfo() {
    if (window.firebase && firebase.apps.length > 0) {
        const app = firebase.apps[0];
        console.log('معلومات Firebase:');
        console.log('- المشروع:', app.options.projectId);
        console.log('- النطاق:', app.options.authDomain);
        console.log('- المفتاح:', app.options.apiKey.substring(0, 15) + '...');
        return true;
    }
    return false;
}

// جعل الدوال متاحة عالمياً
window.contactSeller = contactSeller;
window.showFirebaseInfo = showFirebaseInfo;

// تهيئة الأزرار تلقائياً
document.addEventListener('DOMContentLoaded', function() {
    // ربط أزرار "تواصل مع البائع" بالدالة
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
        button.onclick = function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const price = productCard.querySelector('.product-price').textContent;
            contactSeller(productName, price);
        };
    });
});

// كود JavaScript لموقع سوق دير الزور المفتوح
document.addEventListener('DOMContentLoaded', function() {
    console.log('موقع سوق دير الزور المفتوح جاهز للتشغيل');
    
    // إضافة حدث للنقر على المنتجات
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        product.addEventListener('click', function() {
            const productName = this.querySelector('h3').textContent;
            const productPrice = this.querySelector('.price').textContent;
            
            alert(`تم اختيار المنتج: ${productName}\nالسعر: ${productPrice}\n\nسيتم التواصل معك قريباً لإتمام الشراء`);
        });
    });
    
    // عرض رسالة ترحيب
    setTimeout(() => {
        console.log('مرحباً بكم في سوق دير الزور المفتوح');
    }, 1000);
    
    // إضافة تاريخ اليوم في الكونسول
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    console.log('تاريخ اليوم: ' + today.toLocaleDateString('ar-EG', options));
});

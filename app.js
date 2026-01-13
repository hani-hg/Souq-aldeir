document.addEventListener('DOMContentLoaded', function() {
    console.log('موقع سوق دير الزور المفتوح جاهز للتشغيل');
    
    const products = document.querySelectorAll('.product');
    
    products.forEach(product => {
        product.addEventListener('click', function() {
            const productName = this.querySelector('h3').textContent;
            const productPrice = this.querySelector('.price').textContent;
            
            alert(`تم اختيار المنتج: ${productName}\nالسعر: ${productPrice}\n\nسيتم التواصل معك قريباً لإتمام الشراء`);
        });
    });
});
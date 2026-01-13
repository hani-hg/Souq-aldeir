// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 سوق دير الزور المفتوح - جاهز للتشغيل');
    
    // تهيئة جميع المكونات
    initNavigation();
    initProducts();
    initForm();
    initFilters();
    
    // إضافة بعض المنتجات الافتراضية
    addSampleProducts();
});

// إدارة القائمة الجوالية
function initNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// بيانات المنتجات
let products = [];

// المنتجات الافتراضية
function addSampleProducts() {
    const sampleProducts = [
        {
            id: 1,
            name: "هاتف سامسونج جديد",
            price: "$300",
            category: "electronics",
            description: "هاتف سامسونج جلاكسي S20 جديد بالكرتونة، لم يستخدم",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
            phone: "0935-123-456"
        },
        {
            id: 2,
            name: "دراجة هوائية",
            price: "$80",
            category: "vehicles",
            description: "دراجة هوائية ممتازة للأطفال، حالة جيدة جداً",
            image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=200&fit=crop",
            phone: "0944-789-123"
        },
        {
            id: 3,
            name: "كنبة 3 مقاعد",
            price: "$150",
            category: "home",
            description: "كنبة جلدية فاخرة 3 مقاعد، لون بني",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w-300&h=200&fit=crop",
            phone: "0955-456-789"
        },
        {
            id: 4,
            name: "لابتوب ديل",
            price: "$500",
            category: "electronics",
            description: "لابتوب ديل، Core i7، 16GB RAM، 512GB SSD",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
            phone: "0933-987-654"
        },
        {
            id: 5,
            name: "ثلاجة جديدة",
            price: "$400",
            category: "home",
            description: "ثلاجة سامسونج 16 قدم، جديدة ضمان 3 سنوات",
            image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=200&fit=crop",
            phone: "0945-321-987"
        },
        {
            id: 6,
            name: "دراجة نارية",
            price: "$1200",
            category: "vehicles",
            description: "دراجة نارية هوندا 250CC، موديل 2022",
            image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&h=200&fit=crop",
            phone: "0936-654-321"
        }
    ];
    
    products.push(...sampleProducts);
    displayProducts(products);
}

// عرض المنتجات
function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');
    const template = document.getElementById('productTemplate');
    
    if (!productsGrid || !template) return;
    
    // مسح المحتوى الحالي
    productsGrid.innerHTML = '';
    
    // عرض كل المنتجات
    productsToShow.forEach(product => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.product-card');
        
        // تعبئة البيانات
        card.setAttribute('data-category', product.category);
        card.querySelector('.product-img img').src = product.image;
        card.querySelector('.product-img img').alt = product.name;
        card.querySelector('.product-category').textContent = getCategoryName(product.category);
        card.querySelector('.product-title').textContent = product.name;
        card.querySelector('.product-desc').textContent = product.description;
        card.querySelector('.product-price').textContent = product.price;
        card.querySelector('.product-phone').textContent = product.phone;
        
        // حدث التواصل
        card.querySelector('.contact-btn').addEventListener('click', () => {
            showContactModal(product);
        });
        
        productsGrid.appendChild(clone);
    });
}

// تحويل رمز الفئة إلى اسم
function getCategoryName(category) {
    const categories = {
        'electronics': 'إلكترونيات',
        'home': 'أدوات منزلية',
        'vehicles': 'مركبات',
        'other': 'أخرى'
    };
    return categories[category] || 'أخرى';
}

// الفلاتر
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // تحديث الحالة النشطة
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // تصفية المنتجات
            const filter = button.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
}

// تصفية المنتجات
function filterProducts(filter) {
    if (filter === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(product => product.category === filter);
        displayProducts(filtered);
    }
}

// نموذج إضافة منتج
function initForm() {
    const form = document.getElementById('productForm');
    const previewBtn = document.getElementById('previewBtn');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    if (previewBtn) {
        previewBtn.addEventListener('click', handlePreview);
    }
}

// معالجة إرسال النموذج
function handleFormSubmit(event) {
    event.preventDefault();
    
    // جمع البيانات
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        price: '$' + document.getElementById('productPrice').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value || 'https://via.placeholder.com/300x200',
        phone: document.getElementById('sellerPhone').value
    };
    
    // إضافة المنتج
    products.unshift(product); // إضافة في البداية
    displayProducts(products);
    
    // إظهار رسالة نجاح
    alert(`✅ تم نشر إعلان "${product.name}" بنجاح!\n\nسيتم التواصل معك على الرقم ${product.phone}`);
    
    // إعادة تعيين النموذج
    event.target.reset();
    
    // إعادة تعيين المعاينة
    document.getElementById('productPreview').style.display = 'none';
    
    // التمرير إلى المنتجات
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// معاينة المنتج
function handlePreview() {
    const previewContent = document.querySelector('.preview-content');
    const previewSection = document.getElementById('productPreview');
    
    if (!previewContent || !previewSection) return;
    
    // جمع البيانات
    const product = {
        name: document.getElementById('productName').value || "اسم المنتج",
        price: document.getElementById('productPrice').value ? 
               '$' + document.getElementById('productPrice').value : "$0",
        category: document.getElementById('productCategory').value || "other",
        description: document.getElementById('productDescription').value || "وصف المنتج...",
        image: document.getElementById('productImage').value || "https://via.placeholder.com/300x200",
        phone: document.getElementById('sellerPhone').value || "09xx xxx xxx"
    };
    
    // إنشاء معاينة
    previewContent.innerHTML = `
        <div class="preview-card">
            <div class="preview-img">
                <img src="${product.image}" alt="معاينة المنتج">
                <span class="preview-category">${getCategoryName(product.category)}</span>
            </div>
            <div class="preview-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="preview-meta">
                    <strong>السعر:</strong> ${product.price}
                    <strong>رقم التواصل:</strong> ${product.phone}
                </div>
            </div>
        </div>
    `;
    
    // إظهار قسم المعاينة
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

// عرض نافذة التواصل
function showContactModal(product) {
    const message = `
    📞 تواصل مع البائع
    ------------------
    المنتج: ${product.name}
    السعر: ${product.price}
    الفئة: ${getCategoryName(product.category)}
    ------------------
    رقم التواصل: ${product.phone}
    
    هل تريد حفظ هذا الرقم؟`;
    
    if (confirm(message)) {
        alert(`✅ تم حفظ رقم ${product.phone} في جهات اتصالك\n\nيمكنك التواصل مع البائع الآن!`);
    }
}

// تحديث العداد
function updateCounter() {
    const counter = document.getElementById('productCounter');
    if (counter) {
        counter.textContent = products.length;
    }
}
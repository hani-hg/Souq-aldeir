// عناصر الواجهة
const authSection = document.getElementById('authSection');
const categoriesContainer = document.getElementById('categoriesContainer');
const adsContainer = document.getElementById('adsContainer');
const authModal = document.getElementById('authModal');
const addAdModal = document.getElementById('addAdModal');
const authForm = document.getElementById('authForm');
const addAdForm = document.getElementById('addAdForm');

let currentUser = null;
let categoriesList = [];

// مراقبة حالة المستخدم
window.auth.onAuthStateChanged(user => {
    currentUser = user;
    updateAuthUI();
    loadAds();
    loadCategories();
});

// تحديث واجهة المصادقة
function updateAuthUI() {
    if (currentUser) {
        authSection.innerHTML = `
            <span>${currentUser.email}</span>
            <button class="btn btn-danger" id="logoutBtn">خروج</button>
            <button class="btn btn-success" id="showAddAdBtn"><i class="fas fa-plus"></i> نشر إعلان</button>
        `;
        document.getElementById('logoutBtn').onclick = () => window.auth.signOut();
        document.getElementById('showAddAdBtn').onclick = showAddAdModal;
    } else {
        authSection.innerHTML = `
            <button class="btn btn-primary" id="showLoginBtn">دخول</button>
            <button class="btn btn-outline" id="showSignupBtn">حساب جديد</button>
            <button class="btn btn-success" id="showAddAdBtn" onclick="alert('يجب تسجيل الدخول أولاً')"><i class="fas fa-plus"></i> نشر إعلان</button>
        `;
        document.getElementById('showLoginBtn').onclick = () => showAuthModal('login');
        document.getElementById('showSignupBtn').onclick = () => showAuthModal('signup');
    }
}

// إظهار نافذة المصادقة
function showAuthModal(mode) {
    authModal.classList.add('active');
    document.getElementById('authModalTitle').innerText = mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب';
    document.getElementById('authSubmit').innerText = mode === 'login' ? 'دخول' : 'إنشاء';
    document.getElementById('signupNameGroup').style.display = mode === 'signup' ? 'block' : 'none';
}

// إغلاق النوافذ
document.getElementById('closeAuthModal').onclick = () => authModal.classList.remove('active');
document.getElementById('closeAddAdModal').onclick = () => {
    addAdModal.classList.remove('active');
    addAdForm.reset();
    document.getElementById('preview').innerHTML = '';
};

// إظهار نافذة إضافة إعلان
function showAddAdModal() {
    if (!currentUser) { alert('يجب تسجيل الدخول أولاً'); return; }
    const categorySelect = document.getElementById('adCategory');
    categorySelect.innerHTML = '<option value="">اختر فئة</option>';
    categoriesList.forEach(cat => {
        categorySelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
    });
    addAdModal.classList.add('active');
}

// معالجة نموذج المصادقة
authForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('signupName').value;
    try {
        if (document.getElementById('authSubmit').innerText === 'دخول') {
            await window.auth.signInWithEmailAndPassword(email, password);
        } else {
            const cred = await window.auth.createUserWithEmailAndPassword(email, password);
            if (name) await cred.user.updateProfile({ displayName: name });
        }
        authModal.classList.remove('active');
        authForm.reset();
    } catch (error) {
        document.getElementById('authError').innerText = error.message;
    }
};

// تحميل الفئات
async function loadCategories() {
    try {
        const snapshot = await window.db.collection('categories').orderBy('order', 'asc').get();
        categoriesList = snapshot.docs.map(doc => doc.data());
        if (categoriesList.length === 0) {
            categoriesList = [
                { name: 'عقارات', icon: 'fa-home', color: '#FF6B6B' },
                { name: 'سيارات', icon: 'fa-car', color: '#4ECDC4' }
            ];
        }
        categoriesContainer.innerHTML = categoriesList.map(cat => 
            `<div class="category-card" style="border-top-color:${cat.color||'#2a5298'}">
                <i class="fas ${cat.icon||'fa-tag'}"></i>
                <h3>${cat.name}</h3>
                <p>${cat.count || 0}</p>
            </div>`
        ).join('');
    } catch (error) {
        console.error(error);
        categoriesContainer.innerHTML = '<div style="color:red;">فشل تحميل الفئات</div>';
    }
}

// معاينة الصورة
document.getElementById('imageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('preview').innerHTML = `<img src="${ev.target.result}" alt="معاينة" style="max-width:100%; max-height:150px;">`;
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('preview').innerHTML = '';
    }
});

// معالجة نموذج إضافة إعلان
addAdForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const title = document.getElementById('adTitle').value;
    const desc = document.getElementById('adDescription').value;
    const price = document.getElementById('adPrice').value;
    const phone = document.getElementById('adPhone').value;
    const cat = document.getElementById('adCategory').value;
    const imageFile = document.getElementById('imageFile').files[0];

    if (!title || !desc || !price || !cat) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    try {
        await window.addAd(title, desc, price, cat, imageFile, phone);
        addAdModal.classList.remove('active');
        addAdForm.reset();
        document.getElementById('preview').innerHTML = '';
    } catch (error) {
        document.getElementById('addAdError').innerText = error.message;
    }
};

// إغلاق النوافذ عند النقر خارجها
window.onclick = (e) => {
    if (e.target === authModal) authModal.classList.remove('active');
    if (e.target === addAdModal) addAdModal.classList.remove('active');
};

// بدء التحميل
loadCategories();
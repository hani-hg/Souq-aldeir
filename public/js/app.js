const appDiv = document.getElementById('app');

function renderUI() {
    appDiv.innerHTML = `
        <div id="auth">
            <input id="email" type="email" placeholder="البريد الإلكتروني">
            <input id="password" type="password" placeholder="كلمة المرور">
            <button onclick="handleLogin()">دخول</button>
            <button onclick="handleSignup()">تسجيل</button>
        </div>

        <button onclick="handleLogout()">تسجيل خروج</button>

        <hr>

        <h3>➕ إضافة إعلان</h3>
        <input id="title" placeholder="عنوان الإعلان">
        <textarea id="desc" placeholder="الوصف"></textarea>
        <input id="price" placeholder="السعر">
        <input id="category" placeholder="الفئة (مثال: عقارات)">
        <input type="file" id="imageFile" accept="image/*">
        <div class="preview" id="preview"></div>
        <button onclick="handlePublish()">نشر الإعلان</button>

        <hr>

        <h3>📢 الإعلانات</h3>
        <div id="adsContainer"></div>
    `;
}

window.handleLogin = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await window.auth.signInWithEmailAndPassword(email, password);
        alert('تم الدخول بنجاح');
    } catch (error) {
        alert('خطأ في الدخول: ' + error.message);
    }
};

window.handleSignup = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await window.auth.createUserWithEmailAndPassword(email, password);
        alert('تم إنشاء الحساب بنجاح');
    } catch (error) {
        alert('خطأ في التسجيل: ' + error.message);
    }
};

window.handleLogout = function() {
    window.auth.signOut();
    alert('تم تسجيل الخروج');
};

window.handlePublish = async function() {
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const imageFile = document.getElementById('imageFile').files[0];

    if (!title || !desc || !price || !category) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    try {
        await window.addAd(title, desc, price, category, imageFile);
        alert('تم نشر الإعلان بنجاح');

        document.getElementById('title').value = '';
        document.getElementById('desc').value = '';
        document.getElementById('price').value = '';
        document.getElementById('category').value = '';
        document.getElementById('imageFile').value = '';
        document.getElementById('preview').innerHTML = '';
    } catch (error) {
        alert('خطأ في النشر: ' + error.message);
    }
};

document.addEventListener('change', function(e) {
    if (e.target.id === 'imageFile' && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            document.getElementById('preview').innerHTML = `<img src="${ev.target.result}" alt="معاينة">`;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

window.auth.onAuthStateChanged(function(user) {
    const authDiv = document.getElementById('auth');
    if (authDiv) {
        authDiv.style.display = user ? 'none' : 'block';
    }
});

renderUI();
window.loadAds('adsContainer');
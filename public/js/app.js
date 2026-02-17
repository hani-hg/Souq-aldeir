function renderUI() {
    document.getElementById('app').innerHTML = `
        <div id="auth">
            <input id="email" placeholder="البريد"><input id="password" type="password" placeholder="كلمة المرور">
            <button onclick="handleLogin()">دخول</button><button onclick="handleSignup()">تسجيل</button>
        </div>
        <button onclick="handleLogout()">تسجيل خروج</button><hr>
        <h3>➕ إضافة إعلان</h3>
        <input id="title" placeholder="العنوان"><textarea id="desc" placeholder="الوصف"></textarea>
        <input id="price" placeholder="السعر"><input id="category" placeholder="الفئة">
        <input type="file" id="imageFile" accept="image/*"><div class="preview" id="preview"></div>
        <button onclick="handlePublish()">نشر</button><hr>
        <h3>📢 الإعلانات</h3><div id="adsContainer"></div>
    `;
}
window.handleLogin = async () => {
    try { await window.auth.signInWithEmailAndPassword(email.value, password.value); alert('تم الدخول'); }
    catch(e) { alert(e.message); }
};
window.handleSignup = async () => {
    try { await window.auth.createUserWithEmailAndPassword(email.value, password.value); alert('تم التسجيل'); }
    catch(e) { alert(e.message); }
};
window.handleLogout = () => { window.auth.signOut(); alert('تم الخروج'); };
window.handlePublish = async () => {
    if (!title.value || !desc.value || !price.value || !category.value) { alert('املأ الحقول'); return; }
    try { await window.addAd(title.value, desc.value, price.value, category.value, imageFile.files[0]); alert('تم النشر'); } 
    catch(e) { alert(e.message); }
};
document.addEventListener('change', e => {
    if (e.target.id === 'imageFile' && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => preview.innerHTML = `<img src="${ev.target.result}" alt="معاينة">`;
        reader.readAsDataURL(e.target.files[0]);
    }
});
window.auth.onAuthStateChanged(user => {
    if (document.getElementById('auth')) document.getElementById('auth').style.display = user ? 'none' : 'block';
});
renderUI();
window.loadAds('adsContainer');
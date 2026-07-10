/* ============================================================
   auth.js
   Login, signup, password reset, logout, user-nav state,
   and the one-time "become admin" helpers.
   ============================================================ */

function initAuthListener() {
  auth.onAuthStateChanged(async u => {
    currentUser = u;
    if (u) {
      const doc = await db.collection('users').doc(u.uid).get().catch(() => null);
      isAdmin = doc && doc.exists && doc.data().role === 'admin';
      document.getElementById('adminNavBtn').style.display = isAdmin ? 'flex' : 'none';
      if (isAdmin) checkAdminNotifs();
    } else {
      isAdmin = false;
      document.getElementById('adminNavBtn').style.display = 'none';
    }
    updateUserBtn(); loadAds();
  });
}

function updateUserBtn() {
  const btn = document.getElementById('userNavBtn');
  if (currentUser) {
    btn.innerHTML = '<i class="fa fa-user-check"></i>';
    btn.style.background = 'rgba(255,220,50,.35)';
    btn.onclick = openDashboard;
  } else {
    btn.innerHTML = '<i class="fa fa-user"></i>';
    btn.style.background = 'rgba(255,255,255,.15)';
    btn.onclick = () => openModal('authModal');
  }
}

function switchAuth(tab) {
  ['login', 'signup', 'reset'].forEach(t => {
    document.getElementById('form' + t.charAt(0).toUpperCase() + t.slice(1)).style.display = t === tab ? 'block' : 'none';
    document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1)).className = 'tab-item' + (t === tab ? ' active' : '');
  });
  document.getElementById('authErr').className = 'err';
  document.getElementById('authSuc').className = 'suc';
}

async function doLogin() {
  let val = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('authErr'); errEl.className = 'err';
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    if (!val.includes('@')) {
      const snap = await db.collection('users').where('phone', '==', val).limit(1).get();
      if (snap.empty) throw { code: 'auth/user-not-found' };
      val = snap.docs[0].data().email;
    }
    await auth.signInWithEmailAndPassword(val, pass);
    closeModal('authModal'); showToast('أهلاً بعودتك 👋', 'ok');
  } catch (e) {
    const m = { 'auth/user-not-found': 'الحساب غير موجود', 'auth/wrong-password': 'كلمة المرور خاطئة', 'auth/invalid-email': 'بيانات غير صحيحة', 'auth/too-many-requests': 'محاولات كثيرة، انتظر قليلاً' };
    errEl.textContent = m[e.code] || 'خطأ في تسجيل الدخول'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-sign-in-alt"></i> دخول'; }
}

async function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const emailRaw = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPass').value;
  const errEl = document.getElementById('authErr'); errEl.className = 'err';
  if (!name) { errEl.textContent = 'الاسم مطلوب'; errEl.className = 'err show'; return; }
  if (!phone) { errEl.textContent = 'رقم الهاتف مطلوب'; errEl.className = 'err show'; return; }
  if (pass.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'err show'; return; }
  const email = emailRaw || phone.replace(/\D/g, '') + '@souq-aldeir.local';
  const btn = document.getElementById('signupBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('users').doc(cred.user.uid).set({
      name, email: emailRaw || '', phone,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      role: 'user', banned: false
    });
    closeModal('authModal'); showToast('مرحباً ' + name + '! تم إنشاء حسابك 🎉', 'ok');
  } catch (e) {
    const m = { 'auth/email-already-in-use': 'هذا الهاتف أو البريد مسجل مسبقاً', 'auth/weak-password': 'كلمة المرور ضعيفة', 'auth/invalid-email': 'بيانات غير صحيحة' };
    errEl.textContent = m[e.code] || 'خطأ في إنشاء الحساب'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-user-plus"></i> إنشاء الحساب'; }
}

async function doResetStep1() {
  const phone = document.getElementById('resetPhone').value.trim();
  const errEl = document.getElementById('authErr'), sucEl = document.getElementById('authSuc');
  errEl.className = 'err'; sucEl.className = 'suc';
  if (!phone) { errEl.textContent = 'أدخل رقم هاتفك'; errEl.className = 'err show'; return; }
  const btn = document.getElementById('resetBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const snap = await db.collection('users').where('phone', '==', phone).limit(1).get();
    if (snap.empty) { errEl.textContent = 'لم يتم العثور على حساب بهذا الرقم'; errEl.className = 'err show'; return; }
    const userData = snap.docs[0].data();
    const loginEmail = userData.email || userData.phone.replace(/\D/g, '') + '@souq-aldeir.local';
    document.getElementById('resetUserEmail').value = loginEmail;
    document.getElementById('resetStep1').style.display = 'none';
    document.getElementById('resetStep2').style.display = 'block';
  } catch (e) {
    errEl.textContent = 'حدث خطأ، حاول مجدداً'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-search"></i> ابحث عن حسابي'; }
}

async function doResetStep2() {
  const pass1 = document.getElementById('newPass1').value;
  const pass2 = document.getElementById('newPass2').value;
  const loginEmail = document.getElementById('resetUserEmail').value;
  const errEl = document.getElementById('authErr'), sucEl = document.getElementById('authSuc');
  errEl.className = 'err'; sucEl.className = 'suc';
  if (pass1.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'err show'; return; }
  if (pass1 !== pass2) { errEl.textContent = 'كلمتا المرور غير متطابقتين'; errEl.className = 'err show'; return; }
  const btn = document.getElementById('resetBtn2');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    await auth.sendPasswordResetEmail(loginEmail, { url: 'https://souq-aldeir.vercel.app' });
    sucEl.textContent = '✅ تم إرسال رابط التغيير على البريد المسجّل. إذا لم يكن لديك بريد، تواصل مع الإدارة.';
    sucEl.className = 'suc show';
    document.getElementById('resetStep1').style.display = 'block';
    document.getElementById('resetStep2').style.display = 'none';
  } catch (e) {
    errEl.textContent = 'حدث خطأ، تواصل مع الإدارة'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-lock"></i> تغيير كلمة المرور'; }
}

/* ============ DASHBOARD (حسابي) ============ */
async function openDashboard() {
  if (!currentUser) { openModal('authModal'); return; }
  document.getElementById('dashContent').innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('dashModal');
  const myAds = allAds.filter(a => a.userId === currentUser.uid);
  let userDoc = { name: currentUser.displayName || 'مستخدم', phone: '', email: '' };
  try { const doc = await db.collection('users').doc(currentUser.uid).get(); if (doc.exists) userDoc = { ...userDoc, ...doc.data() }; } catch (e) {}
  document.getElementById('dashContent').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="width:52px;height:52px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.4em;font-weight:800">${(userDoc.name || 'U').charAt(0).toUpperCase()}</div>
      <div>
        <div style="font-weight:800;font-size:1.05em">${userDoc.name}</div>
        <div style="font-size:.78em;color:var(--gray)">${userDoc.phone || ''}</div>
        <div style="font-size:.75em;color:var(--gray)">${userDoc.email || currentUser.email || ''}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
      <div class="dash-card" style="text-align:center"><div class="dash-stat">${myAds.length}</div><div style="font-size:.72em;color:var(--gray)">إعلاناتي</div></div>
      <div class="dash-card" style="text-align:center"><div class="dash-stat" style="color:var(--gold)">${myAds.filter(a => a.featured).length}</div><div style="font-size:.72em;color:var(--gray)">مميزة</div></div>
      <div class="dash-card" style="text-align:center"><div class="dash-stat" style="color:var(--green)">${favorites.size}</div><div style="font-size:.72em;color:var(--gray)">مفضلة</div></div>
    </div>
    <div class="section-label">إعلاناتي</div>
    ${myAds.length ? myAds.map(ad => `
      <div class="my-ad-row">
        <div class="my-ad-img">${ad.imageUrl ? `<img src="${ad.imageUrl}">` : '<i class="fa fa-image"></i>'}</div>
        <div class="my-ad-info">
          <div class="my-ad-title">${ad.title || ''}</div>
          <div class="my-ad-price">${ad.price ? ad.price + ' $' : 'مجاني'}</div>
          <div class="my-ad-status">${ad.featured ? '⭐ مميز · ' : ''} ${ad.area || 'دير الزور'}</div>
        </div>
        <div class="my-ad-actions">
          <button class="icon-btn edit" onclick="closeModal('dashModal');openEdit('${ad.id}')"><i class="fa fa-edit"></i></button>
          <button class="icon-btn del" onclick="confirmDelete('${ad.id}')"><i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')
      : '<div style="text-align:center;padding:20px;color:var(--gray)">لا توجد إعلانات بعد</div>'}
    <hr class="divider">
    <button class="btn btn-gold" style="margin-top:4px" onclick="openModal('featuredModal')"><i class="fa fa-star"></i> إبراز إعلان</button>
    <button class="btn btn-outline" style="margin-top:8px;border-color:var(--gray);color:var(--gray);font-size:.8em" onclick="makeAdmin()"><i class="fa fa-shield-alt"></i> إعداد المدير (أول مرة فقط)</button>
    <button class="btn btn-red" style="margin-top:8px" onclick="doLogout()"><i class="fa fa-sign-out-alt"></i> تسجيل الخروج</button>
    ${isAdmin ? `<button class="btn btn-blue" style="margin-top:8px;background:#1a237e" onclick="closeModal('dashModal');openAdminPanel()"><i class="fa fa-shield-alt"></i> لوحة تحكم المدير 🛡️</button>` : ''}
    <p style="text-align:center;font-size:.7em;color:var(--border);margin-top:16px" onclick="secretAdminTap()">v2.0</p>
  `;
}

function doLogout() {
  if (!confirm('هل تريد تسجيل الخروج؟')) return;
  auth.signOut().then(() => { closeModal('dashModal'); showToast('تم تسجيل الخروج'); });
}

/* Helper: make current user admin (one-time setup, code-word gated) */
async function makeAdmin() {
  if (!currentUser) return;
  const pw = prompt('أدخل رمز الإدارة:');
  if (pw !== 'SOUQ2025ADMIN') { alert('رمز خاطئ'); return; }
  await db.collection('users').doc(currentUser.uid).update({ role: 'admin' });
  alert('✅ تم منح صلاحية المدير! أعد تحميل الصفحة');
  location.reload();
}

/* Secret 5-tap admin bootstrap from the dashboard footer */
let adminTapCount = 0;
function secretAdminTap() {
  if (!currentUser) return;
  adminTapCount++;
  if (adminTapCount >= 5) {
    adminTapCount = 0;
    if (confirm('هل أنت مطور الموقع؟ هل تريد جعل هذا الحساب مديراً؟')) {
      db.collection('users').doc(currentUser.uid).update({ role: 'admin' }).then(() => {
        isAdmin = true;
        document.getElementById('adminNavBtn').style.display = 'flex';
        showToast('تم منحك صلاحيات المدير ✅', 'ok');
        openDashboard();
      }).catch(() => showToast('حدث خطأ', 'bad'));
    }
  }
}

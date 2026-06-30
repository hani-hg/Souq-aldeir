// src/js/auth.js
import { auth, db } from './firebase.js';
import { showToast, openModal, closeModal } from '../components/modal.js';

let currentUser = null;
let isAdmin = false;
let authStateListeners = [];

export function getCurrentUser() { return currentUser; }
export function getIsAdmin() { return isAdmin; }

export function onAuthStateChanged(callback) {
  authStateListeners.push(callback);
  if (currentUser !== undefined) callback(currentUser, isAdmin);
}

// استمع للتغييرات
auth.onAuthStateChanged(async (u) => {
  currentUser = u;
  if (u) {
    const doc = await db.collection('users').doc(u.uid).get().catch(() => null);
    isAdmin = doc && doc.exists && doc.data().role === 'admin';
    if (isAdmin) checkAdminNotifs();
  } else {
    isAdmin = false;
  }
  updateUserBtn();
  authStateListeners.forEach(fn => fn(currentUser, isAdmin));
});

export function updateUserBtn() {
  const btn = document.getElementById('userNavBtn');
  if (!btn) return;
  if (currentUser) {
    btn.innerHTML = '<i class="fa fa-user-check"></i>';
    btn.style.background = 'rgba(255,220,50,.35)';
    btn.onclick = () => window.openDashboard();
  } else {
    btn.innerHTML = '<i class="fa fa-user"></i>';
    btn.style.background = 'rgba(255,255,255,.15)';
    btn.onclick = () => openModal('authModal');
  }
}

export function switchAuth(tab) {
  ['login', 'signup', 'reset'].forEach(t => {
    const form = document.getElementById('form' + t.charAt(0).toUpperCase() + t.slice(1));
    if (form) form.style.display = t === tab ? 'block' : 'none';
    const tabEl = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (tabEl) tabEl.className = 'tab-item' + (t === tab ? ' active' : '');
  });
  const err = document.getElementById('authErr');
  if (err) err.className = 'err';
  const suc = document.getElementById('authSuc');
  if (suc) suc.className = 'suc';
}

export async function doLogin() {
  let val = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('authErr');
  if (!errEl) return;
  errEl.className = 'err';
  const btn = document.getElementById('loginBtn');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    if (!val.includes('@')) {
      const snap = await db.collection('users').where('phone', '==', val).limit(1).get();
      if (snap.empty) throw { code: 'auth/user-not-found' };
      val = snap.docs[0].data().email;
    }
    await auth.signInWithEmailAndPassword(val, pass);
    closeModal('authModal');
    showToast('أهلاً بعودتك 👋', 'ok');
  } catch (e) {
    const m = {
      'auth/user-not-found': 'الحساب غير موجود',
      'auth/wrong-password': 'كلمة المرور خاطئة',
      'auth/invalid-email': 'بيانات غير صحيحة',
      'auth/too-many-requests': 'محاولات كثيرة، انتظر قليلاً'
    };
    errEl.textContent = m[e.code] || 'خطأ في تسجيل الدخول';
    errEl.className = 'err show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-sign-in-alt"></i> دخول';
  }
}

export async function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const emailRaw = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPass').value;
  const errEl = document.getElementById('authErr');
  if (!errEl) return;
  errEl.className = 'err';
  if (!name) { errEl.textContent = 'الاسم مطلوب'; errEl.className = 'err show'; return; }
  if (!phone) { errEl.textContent = 'رقم الهاتف مطلوب'; errEl.className = 'err show'; return; }
  if (pass.length < 6) { errEl.textContent = 'كلمة المرور 6 أحرف على الأقل'; errEl.className = 'err show'; return; }
  const email = emailRaw || phone.replace(/\D/g, '') + '@souq-aldeir.local';
  const btn = document.getElementById('signupBtn');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('users').doc(cred.user.uid).set({
      name, email: emailRaw || '', phone,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      role: 'user', banned: false
    });
    closeModal('authModal');
    showToast('مرحباً ' + name + '! تم إنشاء حسابك 🎉', 'ok');
  } catch (e) {
    const m = {
      'auth/email-already-in-use': 'هذا الهاتف أو البريد مسجل مسبقاً',
      'auth/weak-password': 'كلمة المرور ضعيفة',
      'auth/invalid-email': 'بيانات غير صحيحة'
    };
    errEl.textContent = m[e.code] || 'خطأ في إنشاء الحساب';
    errEl.className = 'err show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-user-plus"></i> إنشاء الحساب';
  }
}

export async function doResetStep1() {
  const phone = document.getElementById('resetPhone').value.trim();
  const errEl = document.getElementById('authErr');
  const sucEl = document.getElementById('authSuc');
  if (!errEl || !sucEl) return;
  errEl.className = 'err';
  sucEl.className = 'suc';
  if (!phone) { errEl.textContent = 'أدخل رقم هاتفك'; errEl.className = 'err show'; return; }
  const btn = document.getElementById('resetBtn');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const snap = await db.collection('users').where('phone', '==', phone).limit(1).get();
    if (snap.empty) { errEl.textContent = 'لم يتم العثور على حساب بهذا الرقم'; errEl.className = 'err show'; return; }
    const userData = snap.docs[0].data();
    const loginEmail = userData.email || userData.phone.replace(/\D/g, '') + '@souq-aldeir.local';
    document.getElementById('resetUserEmail').value = loginEmail;
    document.getElementById('resetStep1').style.display = 'none';
    document.getElementById('resetStep2').style.display = 'block';
  } catch (e) {
    errEl.textContent = 'حدث خطأ، حاول مجدداً';
    errEl.className = 'err show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-search"></i> ابحث عن حسابي';
  }
}

export async function doResetStep2() {
  const pass1 = document.getElementById('newPass1').value;
  const pass2 = document.getElementById('newPass2').value;
  const loginEmail = document.getElementById('resetUserEmail').value;
  const errEl = document.getElementById('authErr');
  const sucEl = document.getElementById('authSuc');
  if (!errEl || !sucEl) return;
  errEl.className = 'err';
  sucEl.className = 'suc';
  if (pass1.length < 6) { errEl.textContent = 'كلمة المرور 6 أحرف على الأقل'; errEl.className = 'err show'; return; }
  if (pass1 !== pass2) { errEl.textContent = 'كلمتا المرور غير متطابقتين'; errEl.className = 'err show'; return; }
  const btn = document.getElementById('resetBtn2');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    await auth.sendPasswordResetEmail(loginEmail, { url: 'https://souq-aldeir.vercel.app' });
    sucEl.textContent = '✅ تم إرسال رابط التغيير على البريد المسجّل. إذا لم يكن لديك بريد، تواصل مع الإدارة.';
    sucEl.className = 'suc show';
    document.getElementById('resetStep1').style.display = 'block';
    document.getElementById('resetStep2').style.display = 'none';
  } catch (e) {
    errEl.textContent = 'حدث خطأ، تواصل مع الإدارة';
    errEl.className = 'err show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-lock"></i> تغيير كلمة المرور';
  }
}

export async function checkAdminNotifs() {
  const snap = await db.collection('featuredRequests').where('status', '==', 'pending').get().catch(() => null);
  const badge = document.getElementById('adminBadge');
  if (badge) {
    if (snap && snap.size > 0) {
      badge.style.display = 'flex';
      badge.textContent = snap.size;
    } else {
      badge.style.display = 'none';
    }
  }
}

export async function makeAdmin() {
  if (!currentUser) return;
  const pw = prompt('أدخل رمز الإدارة:');
  if (pw !== 'SOUQ2025ADMIN') { alert('رمز خاطئ'); return; }
  await db.collection('users').doc(currentUser.uid).update({ role: 'admin' });
  alert('✅ تم منح صلاحية المدير! أعد تحميل الصفحة');
  location.reload();
}

export function doLogout() {
  if (!confirm('هل تريد تسجيل الخروج؟')) return;
  auth.signOut().then(() => {
    closeModal('dashModal');
    showToast('تم تسجيل الخروج');
  });
}

// جعل الدوال عامة للاستخدام في onclick
window.doLogin = doLogin;
window.doSignup = doSignup;
window.doResetStep1 = doResetStep1;
window.doResetStep2 = doResetStep2;
window.switchAuth = switchAuth;
window.doLogout = doLogout;
window.makeAdmin = makeAdmin;
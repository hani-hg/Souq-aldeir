// ===== js/auth.js — المصادقة (دخول، تسجيل، خروج، إعادة تعيين) =====
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { toast, closeM, openM } from './app.js';

let CU = null;
let isAdmin = false;

export function getCurrentUser() { return CU; }
export function getIsAdmin() { return isAdmin; }

// ===== متابعة حالة المستخدم =====
export function setupAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    CU = user;
    if (user) {
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        isAdmin = docSnap.exists() && docSnap.data().role === 'admin';
      } catch { isAdmin = false; }
      document.getElementById('adminBtn').style.display = isAdmin ? 'flex' : 'none';
      if (isAdmin) checkAdminBadge();
    } else {
      isAdmin = false;
      document.getElementById('adminBtn').style.display = 'none';
    }
    updateUserBtn();
    if (window.loadAds) window.loadAds();
  });
}

export function updateUserBtn() {
  const btn = document.getElementById('userBtn');
  if (CU) { btn.innerHTML = '<i class="fa fa-user-check"></i>'; btn.style.background = 'rgba(255,220,50,.35)'; }
  else { btn.innerHTML = '<i class="fa fa-user"></i>'; btn.style.background = 'rgba(255,255,255,.15)'; }
}

export function onUserBtn() {
  if (CU) window.openDash();
  else openM('authModal');
}

// ===== تسجيل الدخول =====
export async function doLogin() {
  let val = document.getElementById('liEmail').value.trim();
  const pass = document.getElementById('liPass').value;
  const errEl = document.getElementById('authErr');
  errEl.className = 'errmsg';
  const btn = document.getElementById('liBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    if (!val.includes('@')) {
      const snap = await getDocs(query(collection(db, 'users'), where('phone', '==', val)));
      if (snap.empty) throw { code: 'auth/user-not-found' };
      const ud = snap.docs[0].data();
      val = ud.email || (ud.phone.replace(/\D/g, '') + '@souq-aldeir.local');
    }
    await signInWithEmailAndPassword(auth, val, pass);
    closeM('authModal');
    toast('أهلاً بعودتك 👋', 'ok');
  } catch (e) {
    const m = {
      'auth/user-not-found': 'الحساب غير موجود',
      'auth/wrong-password': 'كلمة المرور خاطئة',
      'auth/invalid-email': 'بيانات غير صحيحة',
      'auth/too-many-requests': 'محاولات كثيرة، انتظر قليلاً',
      'auth/invalid-credential': 'البيانات غير صحيحة'
    };
    errEl.textContent = m[e.code] || 'خطأ في تسجيل الدخول';
    errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-sign-in-alt"></i> دخول';
  }
}

// ===== إنشاء حساب جديد =====
export async function doSignup() {
  const name = document.getElementById('suName').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const emailRaw = document.getElementById('suEmail').value.trim();
  const pass = document.getElementById('suPass').value;
  const errEl = document.getElementById('authErr');
  errEl.className = 'errmsg';
  if (!name) { errEl.textContent = 'الاسم مطلوب'; errEl.className = 'errmsg show'; return; }
  if (!phone) { errEl.textContent = 'رقم الهاتف مطلوب'; errEl.className = 'errmsg show'; return; }
  if (pass.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'errmsg show'; return; }
  const email = emailRaw || phone.replace(/\D/g, '') + '@souq-aldeir.local';
  const btn = document.getElementById('suBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await cred.user.updateProfile({ displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), {
      name, email: emailRaw, phone,
      role: 'user',
      banned: false,
      createdAt: new Date()
    });
    closeM('authModal');
    toast('مرحباً ' + name + '! تم إنشاء حسابك 🎉', 'ok');
  } catch (e) {
    const m = {
      'auth/email-already-in-use': 'هذا الهاتف أو البريد مسجل مسبقاً',
      'auth/weak-password': 'كلمة المرور ضعيفة',
      'auth/invalid-email': 'بيانات غير صحيحة'
    };
    errEl.textContent = m[e.code] || 'خطأ في إنشاء الحساب';
    errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-user-plus"></i> إنشاء الحساب';
  }
}

// ===== تسجيل الخروج =====
export async function doLogout() {
  if (!confirm('هل تريد تسجيل الخروج؟')) return;
  await signOut(auth);
  closeM('dashModal');
  toast('تم تسجيل الخروج');
}

// ===== إعادة تعيين كلمة المرور (الخطوة 1: إرسال OTP) =====
export async function sendOTP() {
  const phone = document.getElementById('rsPhone').value.trim();
  const errEl = document.getElementById('authErr'), sucEl = document.getElementById('authSuc');
  errEl.className = 'errmsg'; sucEl.className = 'sucmsg';
  if (!phone) { errEl.textContent = 'أدخل رقم الهاتف'; errEl.className = 'errmsg show'; return; }
  const btn = document.getElementById('rsBtn1');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('phone', '==', phone)));
    if (snap.empty) throw new Error('رقم الهاتف غير مسجل في الموقع');
    const ud = snap.docs[0].data();
    window.otpEmail = ud.email || (phone.replace(/\D/g, '') + '@souq-aldeir.local');
    window.genOTP = Math.floor(100000 + Math.random() * 900000).toString();
    await setDoc(doc(db, 'otpCodes', phone), {
      code: window.genOTP,
      createdAt: new Date(),
      used: false
    });
    const msg = `رمز التحقق لسوق دير الزور:%0A*${window.genOTP}*%0Aصالح لمدة 10 دقائق`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
    document.getElementById('resetS1').style.display = 'none';
    document.getElementById('resetS2').style.display = 'block';
    sucEl.textContent = '✅ افتح واتساب لاستلام الرمز';
    sucEl.className = 'sucmsg show';
  } catch (e) {
    errEl.textContent = e.message || 'حدث خطأ';
    errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-mobile-alt"></i> إرسال رمز التحقق';
  }
}

// ===== إعادة تعيين كلمة المرور (الخطوة 2: التحقق من OTP) =====
export async function verifyOTP() {
  const otp = document.getElementById('rsOTP').value.trim();
  const p1 = document.getElementById('rsPass1').value;
  const p2 = document.getElementById('rsPass2').value;
  const errEl = document.getElementById('authErr');
  errEl.className = 'errmsg';
  if (!otp || !p1 || !p2) { errEl.textContent = 'يرجى ملء جميع الحقول'; errEl.className = 'errmsg show'; return; }
  if (p1 !== p2) { errEl.textContent = 'كلمتا المرور غير متطابقتين'; errEl.className = 'errmsg show'; return; }
  if (p1.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'errmsg show'; return; }
  if (otp !== window.genOTP) { errEl.textContent = 'رمز التحقق غير صحيح'; errEl.className = 'errmsg show'; return; }
  const btn = document.getElementById('rsBtn2');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    // استخدام البريد الإلكتروني لإعادة التعيين
    await sendPasswordResetEmail(auth, window.otpEmail);
    document.getElementById('authSuc').textContent = '✅ تم إرسال رابط تغيير كلمة المرور لبريدك الإلكتروني';
    document.getElementById('authSuc').className = 'sucmsg show';
    closeM('authModal');
    toast('تم إرسال رابط إعادة التعيين ✅', 'ok');
  } catch (e) {
    errEl.textContent = e.message || 'حدث خطأ';
    errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-check"></i> تغيير كلمة المرور';
  }
}

// ===== تبديل علامات التبويب في نموذج المصادقة =====
export function switchTab(tab) {
  ['login', 'signup', 'reset'].forEach(t => {
    document.getElementById('p' + t.charAt(0).toUpperCase() + t.slice(1)).style.display = t === tab ? 'block' : 'none';
    document.getElementById('t-' + t).className = 'tab-btn' + (t === tab ? ' on' : '');
  });
  document.getElementById('authErr').className = 'errmsg';
  document.getElementById('authSuc').className = 'sucmsg';
}

// ===== منح صلاحية المدير (رمز سري) =====
export async function setupAdmin() {
  if (!CU) return;
  const code = prompt('أدخل رمز المدير السري:');
  if (code !== 'SOUQ2025ADMIN') { alert('رمز خاطئ ❌'); return; }
  await updateDoc(doc(db, 'users', CU.uid), { role: 'admin' });
  alert('✅ تم منح صلاحية المدير! ستظهر لوحة التحكم بعد إعادة التحميل');
  location.reload();
}

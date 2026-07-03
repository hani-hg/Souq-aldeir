/* ============================================================
   AUTH
   تسجيل الدخول / إنشاء حساب / نسيت كلمة المرور (عبر واتساب OTP)
============================================================ */

let CU = null;       // current user
let isAdmin = false;
let genOTP = '', otpEmail = '';

auth.onAuthStateChanged(async u => {
  CU = u;
  if (u) {
    try {
      const doc = await db.collection('users').doc(u.uid).get();
      isAdmin = doc.exists && doc.data().role === 'admin';
    } catch (e) { isAdmin = false; }
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.style.display = isAdmin ? 'flex' : 'none';
    if (isAdmin && typeof checkAdminBadge === 'function') checkAdminBadge();
  } else {
    isAdmin = false;
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.style.display = 'none';
  }
  updateUserBtn();
  if (typeof loadAds === 'function') loadAds();
  if (typeof onAuthReady === 'function') onAuthReady(u); // hook for admin.html etc.
});

function updateUserBtn() {
  const btn = document.getElementById('userBtn');
  if (!btn) return;
  if (CU) {
    btn.innerHTML = '<i class="fa fa-user-check"></i>';
    btn.style.background = 'rgba(255,220,50,.35)';
  } else {
    btn.innerHTML = '<i class="fa fa-user"></i>';
    btn.style.background = 'rgba(255,255,255,.15)';
  }
}

function onUserBtn() {
  if (CU) { if (typeof openDash === 'function') openDash(); }
  else openM('authModal');
}

function switchTab(tab) {
  ['login', 'signup', 'reset'].forEach(t => {
    const p = document.getElementById('p' + t.charAt(0).toUpperCase() + t.slice(1));
    const b = document.getElementById('t-' + t);
    if (p) p.style.display = (t === tab) ? 'block' : 'none';
    if (b) b.className = 'tab-btn' + (t === tab ? ' on' : '');
  });
  document.getElementById('authErr').className = 'errmsg';
  document.getElementById('authSuc').className = 'sucmsg';
}

/* -------- LOGIN (بالبريد أو الهاتف) -------- */
async function doLogin() {
  let val = document.getElementById('liEmail').value.trim();
  const pass = document.getElementById('liPass').value;
  const errEl = document.getElementById('authErr'); errEl.className = 'errmsg';
  const btn = document.getElementById('liBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    if (!val.includes('@')) {
      const snap = await db.collection('users').where('phone', '==', val).limit(1).get();
      if (snap.empty) throw { code: 'auth/user-not-found' };
      const ud = snap.docs[0].data();
      val = ud.email || (ud.phone.replace(/\D/g, '') + '@souq-aldeir.local');
    }
    await auth.signInWithEmailAndPassword(val, pass);
    closeM('authModal'); toast('أهلاً بعودتك 👋', 'ok');
  } catch (e) {
    errEl.textContent = translateAuthError(e.code); errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-sign-in-alt"></i> دخول';
  }
}

/* -------- SIGNUP (الهاتف إجباري، البريد اختياري) -------- */
async function doSignup() {
  const name = document.getElementById('suName').value.trim();
  const phone = document.getElementById('suPhone').value.trim();
  const emailRaw = document.getElementById('suEmail').value.trim();
  const pass = document.getElementById('suPass').value;
  const errEl = document.getElementById('authErr'); errEl.className = 'errmsg';

  if (!name) { errEl.textContent = 'الاسم مطلوب'; errEl.className = 'errmsg show'; return; }
  if (!phone) { errEl.textContent = 'رقم الهاتف مطلوب'; errEl.className = 'errmsg show'; return; }
  if (pass.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'errmsg show'; return; }

  const email = emailRaw || phone.replace(/\D/g, '') + '@souq-aldeir.local';
  const btn = document.getElementById('suBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('users').doc(cred.user.uid).set({
      name, email: emailRaw, phone, role: 'user', banned: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeM('authModal'); toast('مرحباً ' + name + '! تم إنشاء حسابك 🎉', 'ok');
  } catch (e) {
    errEl.textContent = translateAuthError(e.code); errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-user-plus"></i> إنشاء الحساب';
  }
}

/* -------- إعادة تعيين كلمة المرور عبر رمز واتساب (OTP) -------- */
async function sendOTP() {
  const phone = document.getElementById('rsPhone').value.trim();
  const errEl = document.getElementById('authErr'), sucEl = document.getElementById('authSuc');
  errEl.className = 'errmsg'; sucEl.className = 'sucmsg';
  if (!phone) { errEl.textContent = 'أدخل رقم الهاتف'; errEl.className = 'errmsg show'; return; }

  const btn = document.getElementById('rsBtn1');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const snap = await db.collection('users').where('phone', '==', phone).limit(1).get();
    if (snap.empty) throw new Error('رقم الهاتف غير مسجل في الموقع');
    const ud = snap.docs[0].data();
    otpEmail = ud.email || (phone.replace(/\D/g, '') + '@souq-aldeir.local');
    genOTP = Math.floor(100000 + Math.random() * 900000).toString();

    await db.collection('otpCodes').doc(phone).set({
      code: genOTP, createdAt: firebase.firestore.FieldValue.serverTimestamp(), used: false
    });

    const msg = `رمز التحقق لسوق دير الزور:%0A*${genOTP}*%0Aصالح لمدة 10 دقائق`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`, '_blank');

    document.getElementById('resetS1').style.display = 'none';
    document.getElementById('resetS2').style.display = 'block';
    sucEl.textContent = '✅ افتح واتساب لاستلام الرمز'; sucEl.className = 'sucmsg show';
  } catch (e) {
    errEl.textContent = e.message || 'حدث خطأ'; errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-mobile-alt"></i> إرسال رمز التحقق';
  }
}

async function verifyOTP() {
  const otp = document.getElementById('rsOTP').value.trim();
  const p1 = document.getElementById('rsPass1').value, p2 = document.getElementById('rsPass2').value;
  const errEl = document.getElementById('authErr'); errEl.className = 'errmsg';

  if (!otp || !p1 || !p2) { errEl.textContent = 'يرجى ملء جميع الحقول'; errEl.className = 'errmsg show'; return; }
  if (p1 !== p2) { errEl.textContent = 'كلمتا المرور غير متطابقتين'; errEl.className = 'errmsg show'; return; }
  if (p1.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'errmsg show'; return; }
  if (otp !== genOTP) { errEl.textContent = 'رمز التحقق غير صحيح'; errEl.className = 'errmsg show'; return; }

  const btn = document.getElementById('rsBtn2');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const cred = await auth.signInWithEmailAndPassword(otpEmail, p1).catch(async () => {
      if (!otpEmail.includes('@souq-aldeir.local')) {
        await auth.sendPasswordResetEmail(otpEmail);
        document.getElementById('authSuc').textContent = '✅ تم إرسال رابط تغيير كلمة المرور لبريدك الإلكتروني';
        document.getElementById('authSuc').className = 'sucmsg show';
        return null;
      }
      throw new Error('تعذّر تغيير كلمة المرور. تواصل مع الدعم');
    });
    if (cred) {
      await cred.user.updatePassword(p1);
      closeM('authModal'); toast('تم تغيير كلمة المرور بنجاح ✅', 'ok');
    }
  } catch (e) {
    errEl.textContent = e.message || 'حدث خطأ'; errEl.className = 'errmsg show';
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-check"></i> تغيير كلمة المرور';
  }
}

function doLogout() {
  if (!confirm('هل تريد تسجيل الخروج؟')) return;
  auth.signOut().then(() => { closeM('dashModal'); toast('تم تسجيل الخروج'); });
}

/* -------- تفعيل صلاحية المدير لأول مرة -------- */
async function setupAdmin() {
  if (!CU) return;
  const code = prompt('أدخل رمز المدير السري:');
  if (code !== CONFIG.ADMIN_SETUP_CODE) { alert('رمز خاطئ ❌'); return; }
  await db.collection('users').doc(CU.uid).update({ role: 'admin' });
  alert('✅ تم منح صلاحية المدير! ستظهر لوحة التحكم بعد إعادة التحميل');
  location.reload();
}

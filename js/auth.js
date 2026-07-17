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
      if (doc && doc.exists && doc.data().banned) {
        await auth.signOut();
        showToast('تم حظر هذا الحساب من قبل الإدارة', 'bad');
        currentUser = null; isAdmin = false;
        document.getElementById('adminNavBtn').style.display = 'none';
        stopChatsListener();
        updateUserBtn(); loadAds();
        return;
      }
      isAdmin = doc && doc.exists && doc.data().role === 'admin';
      document.getElementById('adminNavBtn').style.display = isAdmin ? 'flex' : 'none';
      if (isAdmin) checkAdminNotifs();
      initChatsListener();
      checkMyWarnings();
    } else {
      isAdmin = false;
      document.getElementById('adminNavBtn').style.display = 'none';
      stopChatsListener();
    }
    updateUserBtn(); loadAds();
  });
}

function updateUserBtn() {
  const btn = document.getElementById('userNavBtn');
  if (currentUser) {
    btn.innerHTML = '<i class="fa fa-user-check"></i><span class="badge" id="userBadge" style="display:none">!</span>';
    btn.style.background = 'rgba(255,220,50,.35)';
    btn.onclick = openDashboard;
  } else {
    btn.innerHTML = '<i class="fa fa-user"></i><span class="badge" id="userBadge" style="display:none">!</span>';
    btn.style.background = 'rgba(255,255,255,.15)';
    btn.onclick = () => openModal('authModal');
  }
  updateWarningBadge();
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
  const agreed = document.getElementById('signupAgreeTerms').checked;
  const errEl = document.getElementById('authErr'); errEl.className = 'err';
  if (!name) { errEl.textContent = 'الاسم مطلوب'; errEl.className = 'err show'; return; }
  if (!phone) { errEl.textContent = 'رقم الهاتف مطلوب'; errEl.className = 'err show'; return; }
  if (pass.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'err show'; return; }
  if (!agreed) { errEl.textContent = 'يجب الموافقة على شروط استخدام السوق'; errEl.className = 'err show'; return; }
  const email = emailRaw || phone.replace(/\D/g, '') + '@souq-aldeir.local';
  const btn = document.getElementById('signupBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    await cred.user.updateProfile({ displayName: name });
    await db.collection('users').doc(cred.user.uid).set({
      name, email: emailRaw || '', phone,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      agreedTermsAt: firebase.firestore.FieldValue.serverTimestamp(),
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
    const hasRealEmail = !!(userData.email && userData.email.trim());

    if (!hasRealEmail) {
      // No real email on file: an automatic reset link has nowhere real to go.
      // Be honest about it instead of showing a fake "sent" success message.
      const msg = `طلب إعادة تعيين كلمة المرور%0Aرقم الهاتف: ${phone}%0Aالاسم: ${userData.name || ''}`;
      sucEl.innerHTML = 'هذا الحساب مسجّل برقم هاتف فقط بدون بريد إلكتروني، فلا يمكن إرسال رابط تلقائي. تواصل مع الإدارة عبر واتساب وسيتم إعادة تعيين كلمة المرور يدوياً.<br><br>' +
        `<a href="https://wa.me/${contactSettings.whatsapp}?text=${msg}" target="_blank" class="btn btn-green btn-sm" style="display:inline-flex;margin-top:6px"><i class="fa fa-comment"></i> تواصل عبر واتساب</a>`;
      sucEl.className = 'suc show';
      return;
    }

    await auth.sendPasswordResetEmail(userData.email, { url: 'https://souq-aldeir.vercel.app' });
    sucEl.textContent = '✅ تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني. افتح البريد واضغط على الرابط لتعيين كلمة مرور جديدة (تحقّق من مجلد الرسائل غير المرغوبة/Spam أيضاً).';
    sucEl.className = 'suc show';
  } catch (e) {
    errEl.textContent = 'حدث خطأ، حاول مجدداً'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-search"></i> ابحث عن حسابي'; }
}

/* ============ ADMIN WARNINGS (شارة + عرض في لوحة "حسابي") ============ */
async function checkMyWarnings() {
  if (!currentUser) { myWarnings = []; updateWarningBadge(); return; }
  const snap = await db.collection('users').doc(currentUser.uid).collection('warnings')
    .where('read', '==', false).get().catch(() => null);
  myWarnings = snap ? snap.docs.map(d => ({ id: d.id, ...d.data() })) : [];
  updateWarningBadge();
}

function updateWarningBadge() {
  const count = myWarnings.length;
  ['userBadge', 'userBadgeBottom'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (count > 0) { el.style.display = 'flex'; el.textContent = count > 9 ? '9+' : count; }
    else { el.style.display = 'none'; }
  });
}

async function ackWarning(warningId) {
  if (!currentUser) return;
  await db.collection('users').doc(currentUser.uid).collection('warnings').doc(warningId).update({ read: true }).catch(() => {});
  myWarnings = myWarnings.filter(w => w.id !== warningId);
  updateWarningBadge();
  openDashboard(); // re-render without the acknowledged warning
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
    ${myWarnings.length ? myWarnings.map(w => `
      <div style="background:var(--red-light);border:1.5px solid #ef9a9a;border-radius:12px;padding:10px 12px;margin-bottom:10px">
        <div style="display:flex;gap:8px;align-items:flex-start">
          <i class="fa fa-triangle-exclamation" style="color:var(--red);margin-top:2px"></i>
          <div style="flex:1;font-size:.85em;color:#7a1a1a;line-height:1.6">${w.message}</div>
        </div>
        <button class="btn btn-red btn-sm" style="margin-top:8px" onclick="ackWarning('${w.id}')">فهمت</button>
      </div>`).join('') : ''}
    ${!userDoc.email ? `
      <div style="background:var(--gold-light);border:1.5px solid #ffe082;border-radius:12px;padding:10px 12px;margin-bottom:14px">
        <div style="display:flex;gap:8px;align-items:flex-start">
          <i class="fa fa-triangle-exclamation" style="color:#7a5000;margin-top:2px"></i>
          <div style="flex:1;font-size:.83em;color:#5c4400;line-height:1.6">حسابك بدون بريد إلكتروني حقيقي. إذا نسيت كلمة المرور لاحقاً لن نتمكن من إرسال رابط استعادة تلقائي إلا إذا أضفت بريدك الآن.</div>
        </div>
        <button class="btn btn-gold btn-sm" style="margin-top:8px" onclick="addRecoveryEmail()"><i class="fa fa-envelope"></i> إضافة بريد إلكتروني الآن</button>
      </div>` : ''}
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
          <div class="my-ad-price">${formatPrice(ad)}</div>
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
    <button class="btn btn-outline" style="margin-top:8px" onclick="openAboutModal()"><i class="fa fa-circle-info"></i> عن السوق والتواصل مع الإدارة</button>
    <button class="btn btn-outline" style="margin-top:8px;border-color:var(--gray);color:var(--gray);font-size:.8em" onclick="makeAdmin()"><i class="fa fa-shield-alt"></i> إعداد المدير (أول مرة فقط)</button>
    <button class="btn btn-red" style="margin-top:8px" onclick="doLogout()"><i class="fa fa-sign-out-alt"></i> تسجيل الخروج</button>
    ${isAdmin ? `<button class="btn btn-blue" style="margin-top:8px;background:#1a237e" onclick="closeModal('dashModal');openAdminPanel()"><i class="fa fa-shield-alt"></i> لوحة تحكم المدير 🛡️</button>` : ''}
    <p style="text-align:center;font-size:.7em;color:var(--border);margin-top:16px" onclick="secretAdminTap()">v2.0</p>
  `;
}

/* Lets an already-signed-in user add a real email to their account.
   This is the actual fix for "how do I reset a phone-only user's
   password?" — Firebase gives no free/serverless way for an admin
   to reset another user's password directly; the only automatic
   path is an emailed reset link, which only works if a real email
   was added *while still signed in*. Encourage this proactively. */
async function addRecoveryEmail() {
  if (!currentUser) return;
  const newEmail = prompt('أدخل بريدك الإلكتروني الحقيقي (سيُستخدم فقط لاستعادة كلمة المرور):');
  if (!newEmail || !newEmail.trim()) return;
  const email = newEmail.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('صيغة البريد الإلكتروني غير صحيحة', 'bad'); return; }
  try {
    await currentUser.updateEmail(email);
    await db.collection('users').doc(currentUser.uid).update({ email });
    showToast('تم إضافة بريدك بنجاح ✅', 'ok');
    openDashboard();
  } catch (e) {
    if (e.code === 'auth/requires-recent-login') {
      showToast('لأسباب أمنية، سجّل خروج ثم دخول مجدداً وأعد المحاولة', 'bad');
    } else if (e.code === 'auth/email-already-in-use') {
      showToast('هذا البريد مستخدم في حساب آخر', 'bad');
    } else {
      showToast('تعذر إضافة البريد', 'bad');
    }
  }
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



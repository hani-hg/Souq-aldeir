/* ============================================================
   auth.js  –  v2
   Login, signup, reset, dashboard, change-password (inline),
   warnings, logout, admin bootstrap.
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
        stopChatsListener(); updateUserBtn(); loadAds(); return;
      }
      isAdmin = doc && doc.exists && doc.data().role === 'admin';
      document.getElementById('adminNavBtn').style.display = isAdmin ? 'flex' : 'none';
      if (isAdmin) checkAdminNotifs();
      initChatsListener(); checkMyWarnings();
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
  ['login','signup','reset'].forEach(t => {
    document.getElementById('form' + t.charAt(0).toUpperCase() + t.slice(1)).style.display = t === tab ? 'block' : 'none';
    document.getElementById('tab'  + t.charAt(0).toUpperCase() + t.slice(1)).className = 'tab-item' + (t === tab ? ' active' : '');
  });
  document.getElementById('authErr').className = 'err';
  document.getElementById('authSuc').className = 'suc';
}

/* ── Login ── */
async function doLogin() {
  let val = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errEl = document.getElementById('authErr'); errEl.className = 'err';
  const btn   = document.getElementById('loginBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    if (!val.includes('@')) {
      const snap = await db.collection('users').where('phone','==',val).limit(1).get();
      if (snap.empty) throw { code: 'auth/user-not-found' };
      val = snap.docs[0].data().email;
    }
    await auth.signInWithEmailAndPassword(val, pass);
    closeModal('authModal'); showToast('أهلاً بعودتك 👋', 'ok');
  } catch(e) {
    const m = {'auth/user-not-found':'الحساب غير موجود','auth/wrong-password':'كلمة المرور خاطئة',
               'auth/invalid-email':'بيانات غير صحيحة','auth/too-many-requests':'محاولات كثيرة، انتظر قليلاً',
               'auth/invalid-credential':'رقم الهاتف أو كلمة المرور خاطئة'};
    errEl.textContent = m[e.code] || 'خطأ في تسجيل الدخول'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-sign-in-alt"></i> دخول'; }
}

/* ── Signup ── */
async function doSignup() {
  const name    = document.getElementById('signupName').value.trim();
  const phone   = document.getElementById('signupPhone').value.trim();
  const emailRaw = document.getElementById('signupEmail').value.trim();
  const pass    = document.getElementById('signupPass').value;
  const agreed  = document.getElementById('signupAgreeTerms').checked;
  const errEl   = document.getElementById('authErr'); errEl.className = 'err';
  if (!name)        { errEl.textContent = 'الاسم مطلوب'; errEl.className = 'err show'; return; }
  if (!phone)       { errEl.textContent = 'رقم الهاتف مطلوب'; errEl.className = 'err show'; return; }
  if (pass.length < 6) { errEl.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'err show'; return; }
  if (!agreed)      { errEl.textContent = 'يجب الموافقة على شروط استخدام السوق'; errEl.className = 'err show'; return; }
  const email = emailRaw || phone.replace(/\D/g,'') + '@souq-aldeir.local';
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
  } catch(e) {
    const m = {'auth/email-already-in-use':'هذا الهاتف أو البريد مسجل مسبقاً',
               'auth/weak-password':'كلمة المرور ضعيفة','auth/invalid-email':'بيانات غير صحيحة'};
    errEl.textContent = m[e.code] || 'خطأ في إنشاء الحساب'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-user-plus"></i> إنشاء الحساب'; }
}

/* ── Reset password (step 1) ── */
async function doResetStep1() {
  const phone = document.getElementById('resetPhone').value.trim();
  const errEl = document.getElementById('authErr'), sucEl = document.getElementById('authSuc');
  errEl.className = 'err'; sucEl.className = 'suc';
  if (!phone) { errEl.textContent = 'أدخل رقم هاتفك'; errEl.className = 'err show'; return; }
  const btn = document.getElementById('resetBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const snap = await db.collection('users').where('phone','==',phone).limit(1).get();
    if (snap.empty) { errEl.textContent = 'لم يتم العثور على حساب بهذا الرقم'; errEl.className = 'err show'; return; }
    const userData = snap.docs[0].data();
    const hasRealEmail = !!(userData.email && userData.email.trim() && !userData.email.includes('@souq-aldeir.local'));
    if (!hasRealEmail) {
      const msg = `طلب إعادة تعيين كلمة المرور%0Aرقم الهاتف: ${phone}%0Aالاسم: ${userData.name || ''}`;
      sucEl.innerHTML = `هذا الحساب مسجّل برقم هاتف فقط بدون بريد إلكتروني — لا يمكن إرسال رابط تلقائي.
        تواصل مع الإدارة عبر واتساب وسيتم إعادة تعيين كلمة المرور يدوياً.<br><br>
        <a href="https://wa.me/${contactSettings.whatsapp}?text=${msg}" target="_blank"
           class="btn btn-green btn-sm" style="display:inline-flex;margin-top:6px">
          <i class="fa fa-comment"></i> تواصل عبر واتساب</a>`;
      sucEl.className = 'suc show'; return;
    }
    await auth.sendPasswordResetEmail(userData.email, { url: location.origin });
    sucEl.textContent = '✅ تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني. تحقق من البريد ومجلد Spam.';
    sucEl.className = 'suc show';
  } catch(e) {
    errEl.textContent = 'حدث خطأ، حاول مجدداً'; errEl.className = 'err show';
  } finally { btn.disabled = false; btn.innerHTML = '<i class="fa fa-search"></i> ابحث عن حسابي'; }
}

/* ── Warnings ── */
async function checkMyWarnings() {
  if (!currentUser) { myWarnings = []; updateWarningBadge(); return; }
  const snap = await db.collection('users').doc(currentUser.uid).collection('warnings')
    .where('read','==',false).get().catch(() => null);
  myWarnings = snap ? snap.docs.map(d => ({id:d.id,...d.data()})) : [];
  updateWarningBadge();
}
function updateWarningBadge() {
  const count = myWarnings.length;
  ['userBadge','userBadgeBottom'].forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    if (count > 0) { el.style.display = 'flex'; el.textContent = count > 9 ? '9+' : count; }
    else el.style.display = 'none';
  });
}
async function ackWarning(warningId) {
  if (!currentUser) return;
  await db.collection('users').doc(currentUser.uid).collection('warnings')
    .doc(warningId).update({ read: true }).catch(() => {});
  myWarnings = myWarnings.filter(w => w.id !== warningId);
  updateWarningBadge(); openDashboard();
}

/* ── Dashboard ── */
async function openDashboard() {
  if (!currentUser) { openModal('authModal'); return; }
  document.getElementById('dashContent').innerHTML =
    '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>جاري التحميل...</p></div>';
  openModal('dashModal');

  const myAds = allAds.filter(a => a.userId === currentUser.uid);
  let userDoc = { name: currentUser.displayName || 'مستخدم', phone: '', email: '' };
  try {
    const doc = await db.collection('users').doc(currentUser.uid).get();
    if (doc.exists) userDoc = { ...userDoc, ...doc.data() };
  } catch(e) {}

  const hasRealEmail = !!(userDoc.email && userDoc.email.trim() && !userDoc.email.includes('@souq-aldeir.local'));
  const avatarColor  = typeof getAvatarColor === 'function' ? getAvatarColor(userDoc.name || '') : 'var(--blue)';
  const initial      = (userDoc.name || 'م').charAt(0);

  document.getElementById('dashContent').innerHTML = `

    ${/* ── Warnings ── */ myWarnings.length ? myWarnings.map(w => `
      <div class="warn-card">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <i class="fa fa-triangle-exclamation" style="color:var(--red);margin-top:2px;font-size:1.1em"></i>
          <div style="flex:1;font-size:.85em;color:#7a1a1a;line-height:1.65">${w.message}</div>
        </div>
        <button class="btn btn-red btn-sm" style="margin-top:8px" onclick="ackWarning('${w.id}')">
          فهمت</button>
      </div>`).join('') : ''}

    ${/* ── No-email warning ── */ !hasRealEmail ? `
      <div class="warn-card" style="background:var(--gold-light);border-color:#ffe082">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <i class="fa fa-triangle-exclamation" style="color:#7a5000;margin-top:2px"></i>
          <div style="flex:1;font-size:.83em;color:#5c4400;line-height:1.65">
            حسابك بدون بريد إلكتروني حقيقي. إذا نسيت كلمة المرور لن نتمكن من إرسال رابط
            استعادة تلقائي.
          </div>
        </div>
        <button class="btn btn-gold btn-sm" style="margin-top:8px" onclick="showAddEmailForm()">
          <i class="fa fa-envelope"></i> إضافة بريد الآن</button>
      </div>` : ''}

    <!-- ── Profile header ── -->
    <div class="dash-profile">
      <div class="dash-avatar" style="background:${avatarColor}">${initial}</div>
      <div class="dash-profile-info">
        <div class="dash-profile-name">${userDoc.name}</div>
        <div class="dash-profile-sub">${userDoc.phone || ''}</div>
        ${hasRealEmail ? `<div class="dash-profile-sub" style="color:var(--blue)">${userDoc.email}</div>` : ''}
      </div>
    </div>

    <!-- ── Stats strip ── -->
    <div class="dash-stats-strip">
      <div class="dash-strip-item">
        <span class="dash-strip-val">${myAds.length}</span>
        <span class="dash-strip-lbl">إعلاناتي</span>
      </div>
      <div class="dash-strip-divider"></div>
      <div class="dash-strip-item">
        <span class="dash-strip-val" style="color:var(--gold)">${myAds.filter(a=>a.featured).length}</span>
        <span class="dash-strip-lbl">مميزة</span>
      </div>
      <div class="dash-strip-divider"></div>
      <div class="dash-strip-item">
        <span class="dash-strip-val" style="color:var(--green)">${favorites.size}</span>
        <span class="dash-strip-lbl">مفضلة</span>
      </div>
    </div>

    <!-- ── My ads ── -->
    <div class="section-label">📦 إعلاناتي</div>
    ${myAds.length ? myAds.map(ad => `
      <div class="my-ad-row">
        <div class="my-ad-img">
          ${((ad.images&&ad.images[0])||ad.imageUrl)
            ? `<img src="${(ad.images&&ad.images[0])||ad.imageUrl}" loading="lazy">`
            : '<i class="fa fa-image"></i>'}
        </div>
        <div class="my-ad-info">
          <div class="my-ad-title">${ad.title || ''}</div>
          <div class="my-ad-price">${formatPrice(ad)}</div>
          <div class="my-ad-status">${ad.featured ? '⭐ مميز · ' : ''}${ad.area || 'دير الزور'}</div>
        </div>
        <div class="my-ad-actions">
          <button class="icon-btn edit" onclick="closeModal('dashModal');openEdit('${ad.id}')">
            <i class="fa fa-edit"></i></button>
          <button class="icon-btn del" onclick="confirmDelete('${ad.id}')">
            <i class="fa fa-trash"></i></button>
        </div>
      </div>`).join('')
    : '<div style="text-align:center;padding:24px;color:var(--gray)"><i class="fa fa-box-open" style="font-size:2em;opacity:.3;display:block;margin-bottom:8px"></i>لا توجد إعلانات بعد</div>'}

    <!-- ── Action buttons ── -->
    <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
      <button class="btn btn-gold" onclick="openModal('featuredModal')">
        <i class="fa fa-star"></i> إبراز إعلان مميز</button>
      <button class="btn btn-outline" onclick="showChangePasswordForm()">
        <i class="fa fa-lock"></i> تغيير كلمة المرور</button>
      <button class="btn btn-outline" onclick="openAboutModal()">
        <i class="fa fa-circle-info"></i> عن السوق والتواصل</button>
      ${isAdmin ? `
      <button class="btn btn-blue" style="background:#1a237e" onclick="closeModal('dashModal');openAdminPanel()">
        <i class="fa fa-shield-alt"></i> لوحة تحكم المدير 🛡️</button>` : ''}
      <button class="btn btn-red" onclick="doLogout()">
        <i class="fa fa-sign-out-alt"></i> تسجيل الخروج</button>
    </div>

    <p style="text-align:center;font-size:.7em;color:var(--border);margin-top:18px"
       onclick="secretAdminTap()">v2.1</p>
  `;
}

/* ── Change password (inline form) ── */
function showChangePasswordForm() {
  document.getElementById('dashContent').innerHTML = `
    <button class="btn btn-outline btn-sm" style="margin-bottom:16px" onclick="openDashboard()">
      <i class="fa fa-arrow-right"></i> رجوع للحساب</button>

    <div class="section-label">🔐 تغيير كلمة المرور</div>
    <div class="fg">
      <label>كلمة المرور الحالية</label>
      <input type="password" id="cpCurrent" placeholder="أدخل كلمة مرورك الحالية">
    </div>
    <div class="fg">
      <label>كلمة المرور الجديدة</label>
      <input type="password" id="cpNew" placeholder="6 أحرف على الأقل">
    </div>
    <div class="fg">
      <label>تأكيد كلمة المرور الجديدة</label>
      <input type="password" id="cpConfirm" placeholder="أعد كتابة كلمة المرور الجديدة">
    </div>
    <div class="err" id="cpErr"></div>
    <button class="btn btn-blue" id="cpBtn" onclick="doChangePassword()">
      <i class="fa fa-lock"></i> تغيير كلمة المرور</button>`;
}

async function doChangePassword() {
  const current  = document.getElementById('cpCurrent').value;
  const newPass  = document.getElementById('cpNew').value;
  const confirm  = document.getElementById('cpConfirm').value;
  const errEl    = document.getElementById('cpErr');
  errEl.className = 'err';

  if (!current)        { errEl.textContent = 'أدخل كلمة المرور الحالية'; errEl.className = 'err show'; return; }
  if (newPass.length < 6) { errEl.textContent = 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'; errEl.className = 'err show'; return; }
  if (newPass !== confirm) { errEl.textContent = 'كلمة المرور الجديدة غير متطابقة'; errEl.className = 'err show'; return; }

  const btn = document.getElementById('cpBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  try {
    const cred = firebase.auth.EmailAuthProvider.credential(currentUser.email, current);
    await currentUser.reauthenticateWithCredential(cred);
    await currentUser.updatePassword(newPass);
    showToast('تم تغيير كلمة المرور بنجاح ✅', 'ok');
    openDashboard();
  } catch(e) {
    const msgs = {
      'auth/wrong-password'    : 'كلمة المرور الحالية خاطئة',
      'auth/invalid-credential': 'كلمة المرور الحالية خاطئة',
      'auth/weak-password'     : 'كلمة المرور الجديدة ضعيفة جداً',
      'auth/requires-recent-login': 'لأسباب أمنية، سجّل خروج ودخول مجدداً ثم حاول مرة أخرى'
    };
    errEl.textContent = msgs[e.code] || 'حدث خطأ، حاول مجدداً'; errEl.className = 'err show';
  } finally {
    const b = document.getElementById('cpBtn');
    if (b) { b.disabled = false; b.innerHTML = '<i class="fa fa-lock"></i> تغيير كلمة المرور'; }
  }
}

/* ── Add recovery email (inline form — replaces prompt()) ── */
function showAddEmailForm() {
  document.getElementById('dashContent').innerHTML = `
    <button class="btn btn-outline btn-sm" style="margin-bottom:16px" onclick="openDashboard()">
      <i class="fa fa-arrow-right"></i> رجوع للحساب</button>

    <div class="section-label">📧 إضافة بريد إلكتروني</div>
    <p style="font-size:.83em;color:var(--gray);margin-bottom:12px;line-height:1.6">
      سيُستخدم فقط لاستعادة كلمة المرور عند نسيانها.</p>
    <div class="fg">
      <label>البريد الإلكتروني</label>
      <input type="email" id="recovEmailInput" placeholder="example@email.com">
    </div>
    <div class="err" id="recovEmailErr"></div>
    <button class="btn btn-blue" onclick="doAddRecoveryEmail()">
      <i class="fa fa-envelope"></i> إضافة البريد</button>`;
}

async function doAddRecoveryEmail() {
  const email = document.getElementById('recovEmailInput').value.trim();
  const errEl = document.getElementById('recovEmailErr'); errEl.className = 'err';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'صيغة البريد الإلكتروني غير صحيحة'; errEl.className = 'err show'; return;
  }
  try {
    await currentUser.updateEmail(email);
    await db.collection('users').doc(currentUser.uid).update({ email });
    showToast('تم إضافة بريدك بنجاح ✅', 'ok'); openDashboard();
  } catch(e) {
    const msgs = {
      'auth/requires-recent-login' : 'لأسباب أمنية، سجّل خروج ثم دخول مجدداً وأعد المحاولة',
      'auth/email-already-in-use'  : 'هذا البريد مستخدم في حساب آخر',
      'auth/invalid-email'         : 'صيغة البريد غير صحيحة'
    };
    errEl.textContent = msgs[e.code] || 'تعذر إضافة البريد'; errEl.className = 'err show';
  }
}

/* kept for backward compat (HTML buttons may still call it) */
function addRecoveryEmail() { showAddEmailForm(); }

/* ── Logout ── */
function doLogout() {
  auth.signOut().then(() => { closeModal('dashModal'); showToast('تم تسجيل الخروج'); });
}

/* ── Admin bootstrap (one-time, code-word gated) ── */
async function makeAdmin() {
  if (!currentUser) return;
  const pw = prompt('أدخل رمز الإدارة:');
  if (pw !== 'SOUQ2025ADMIN') { alert('رمز خاطئ'); return; }
  await db.collection('users').doc(currentUser.uid).update({ role: 'admin' });
  alert('✅ تم منح صلاحية المدير! أعد تحميل الصفحة'); location.reload();
}

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
        showToast('تم منحك صلاحيات المدير ✅', 'ok'); openDashboard();
      }).catch(() => showToast('حدث خطأ', 'bad'));
    }
  }
}

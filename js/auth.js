/* ============================================================
   auth.js  –  v2
   Login, signup, reset, dashboard, change-password (inline),
   warnings, logout, admin bootstrap.
   ============================================================ */

const AUTH_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizeAuthEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeArabicDigits(value) {
  return String(value || '').replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
}

function normalizePhone(value) {
  return normalizeArabicDigits(value).trim().replace(/\D/g, '');
}

function phoneDigits(value) {
  return normalizePhone(value);
}

function showAuthError(message) {
  const el = document.getElementById('authErr');
  if (!el) return;
  el.textContent = message;
  el.className = 'err show';
}

function showAuthSuccess(message) {
  const el = document.getElementById('authSuc');
  if (!el) return;
  el.textContent = message;
  el.className = 'suc show';
}

/* ── Password visibility toggle ── */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  const icon = btn ? btn.querySelector('i') : null;
  if (icon) icon.className = show ? 'fa fa-eye-slash' : 'fa fa-eye';
}

/* ── Password strength (0..4) ── */
function passwordStrength(pass) {
  let score = 0;
  if (pass.length >= 8) score++;
  if (pass.length >= 12) score++;
  if (/[A-Za-z]/.test(pass) && /\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return Math.min(score, 4);
}

/* ── Live password strength hint (signup + change-password) ── */
function updatePassHint(inputId, hintId) {
  const input = document.getElementById(inputId);
  const hint = document.getElementById(hintId);
  if (!input || !hint) return;
  const pass = input.value;
  if (!pass) { hint.textContent = ''; hint.className = 'pw-hint'; return; }
  if (pass.length < 8) {
    hint.textContent = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    hint.className = 'pw-hint bad';
    return;
  }
  const score = passwordStrength(pass);
  const labels = ['ضعيفة', 'مقبولة', 'جيدة', 'قوية'];
  const colors = ['var(--red)', '#e6a700', '#4caf50', '#2e7d32'];
  hint.textContent = 'قوة كلمة المرور: ' + labels[score];
  hint.style.color = colors[score];
  hint.className = 'pw-hint';
}

/* ── Keyboard support + live hints wiring ── */
function initAuthWiring() {
  const enter = handler => e => { if (e.key === 'Enter') handler(); };
  ['loginEmail', 'loginPass'].forEach(id => {
    const el = document.getElementById(id); if (el) el.addEventListener('keydown', enter(doLogin));
  });
  ['signupName', 'signupPhone', 'signupEmail', 'signupPass', 'signupConfirmPass'].forEach(id => {
    const el = document.getElementById(id); if (el) el.addEventListener('keydown', enter(doSignup));
  });
  const resetEl = document.getElementById('resetEmail');
  if (resetEl) resetEl.addEventListener('keydown', enter(doResetStep1));
  const sp = document.getElementById('signupPass');
  if (sp) sp.addEventListener('input', () => updatePassHint('signupPass', 'signupPassHint'));
}

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
  const hint = document.getElementById('signupPassHint');
  if (hint) { hint.textContent = ''; hint.className = 'pw-hint'; hint.style.color = ''; }
  const firstField = document.getElementById({ login: 'loginEmail', signup: 'signupName', reset: 'resetEmail' }[tab]);
  if (firstField) firstField.focus();
}

/* ── Login ── */
async function doLogin() {
  let identifier = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  const btn = document.getElementById('loginBtn');
  document.getElementById('authErr').className = 'err';
  document.getElementById('authSuc').className = 'suc';

  identifier = identifier.trim();
  if (!identifier) { showAuthError('أدخل البريد الإلكتروني أو رقم الهاتف'); return; }
  if (!pass) { showAuthError('أدخل كلمة المرور'); return; }

  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جارٍ الدخول';
  try {
    let email = identifier;
    if (!identifier.includes('@')) {
      // Phone login is kept only for legacy accounts whose Firebase email was
      // deterministically generated from the phone number. New accounts use email login.
      const phone = normalizePhone(identifier);
      const digits = phoneDigits(phone);
      if (digits.length < 7) throw { code: 'auth/invalid-identifier' };
      email = digits + '@souq-aldeir.local';
    } else {
      email = normalizeAuthEmail(identifier);
      if (!AUTH_EMAIL_RE.test(email)) throw { code: 'auth/invalid-email' };
    }
    if (!email) throw { code: 'auth/user-not-found' };
    await auth.signInWithEmailAndPassword(email, pass);
    closeModal('authModal'); showToast('أهلاً بعودتك', 'ok');
  } catch(e) {
    const m = {
      'auth/user-not-found': 'الحساب غير موجود أو بيانات الدخول غير صحيحة',
      'auth/wrong-password': 'البريد أو كلمة المرور غير صحيحة',
      'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة',
      'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة',
      'auth/invalid-identifier': 'أدخل رقم هاتف صالحًا أو بريدًا إلكترونيًا صحيحًا',
      'auth/too-many-requests': 'محاولات كثيرة، انتظر قليلًا ثم حاول مجددًا'
    };
    showAuthError(m[e.code] || 'تعذر تسجيل الدخول، حاول مجددًا');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-sign-in-alt"></i> دخول';
  }
}

/* ── Signup ── */
async function doSignup() {
  const name = document.getElementById('signupName').value.trim();
  const phoneInput = document.getElementById('signupPhone').value.trim();
  const phone = normalizePhone(phoneInput);
  const email = normalizeAuthEmail(document.getElementById('signupEmail').value);
  const pass = document.getElementById('signupPass').value;
  const confirmPass = document.getElementById('signupConfirmPass') ? document.getElementById('signupConfirmPass').value : '';
  const agreed = document.getElementById('signupAgreeTerms').checked;
  document.getElementById('authErr').className = 'err';
  document.getElementById('authSuc').className = 'suc';

  if (name.length < 2) { showAuthError('أدخل الاسم الكامل'); return; }
  if (name.length > 80) { showAuthError('الاسم طويل جدًا'); return; }
  if (phoneDigits(phone).length < 7 || phoneDigits(phone).length > 15) { showAuthError('أدخل رقم هاتف صالحًا'); return; }
  if (!AUTH_EMAIL_RE.test(email)) { showAuthError('أدخل بريدًا إلكترونيًا صحيحًا لاستعادة الحساب'); return; }
  if (pass.length < 8) { showAuthError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }
  if (pass.length > 128) { showAuthError('كلمة المرور طويلة جدًا'); return; }
  if (confirmPass && pass !== confirmPass) { showAuthError('كلمتا المرور غير متطابقتين'); return; }
  if (!agreed) { showAuthError('يجب الموافقة على شروط استخدام السوق'); return; }

  const btn = document.getElementById('signupBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جارٍ إنشاء الحساب';
  try {
    // Firebase Email/Password is free to use and gives every new account a reliable reset path.
    // Phone login remains available for legacy accounts via their generated Firebase email.
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    const phoneIndexRef = db.collection('phoneIndex').doc(phoneDigits(phone));
    try {
      // The users doc is created before phoneIndex so that Firestore rules can tie the
      // phone index to the phone the user actually claimed in their own profile (anti-squatting).
      await db.collection('users').doc(cred.user.uid).set({
        name, email, phone, phoneNormalized: phone,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        agreedTermsAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: 'user', banned: false
      });
      // Firebase Web SDK v8 supports set(); Firestore rules reject an overwrite
      // of an existing phone index, preserving uniqueness without a paid backend.
      await phoneIndexRef.set({ userId: cred.user.uid, phoneNormalized: phone });
      await cred.user.updateProfile({ displayName: name });
    } catch (setupError) {
      await phoneIndexRef.delete().catch(() => {});
      await db.collection('users').doc(cred.user.uid).delete().catch(() => {});
      await cred.user.delete().catch(() => {});
      throw setupError;
    }
    closeModal('authModal'); showToast('مرحبًا ' + name + '! تم إنشاء حسابك', 'ok');
  } catch(e) {
    const m = {
      'auth/email-already-in-use': 'البريد الإلكتروني مسجل مسبقًا',
      'already-exists': 'رقم الهاتف مسجل مسبقًا',
      'auth/permission-denied': 'رقم الهاتف مسجل مسبقًا أو لا يمكن استخدامه',
      'permission-denied': 'تعذر حفظ الحساب؛ قد يكون رقم الهاتف مستخدمًا مسبقًا',
      'failed-precondition': 'تعذر إكمال إنشاء الحساب، حاول مجددًا',
      'unavailable': 'خدمة الحساب غير متاحة مؤقتًا، حاول مجددًا',
      'auth/weak-password': 'كلمة المرور ضعيفة، استخدم 8 أحرف على الأقل',
      'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة',
      'auth/network-request-failed': 'تعذر الاتصال بالإنترنت، حاول مجددًا',
      'auth/operation-not-allowed': 'تسجيل البريد الإلكتروني غير مفعّل في إعدادات المشروع'
    };
    showAuthError(m[e.code] || 'تعذر إنشاء الحساب، حاول مجددًا');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-user-plus"></i> إنشاء الحساب';
  }
}

/* ── Reset password ── */
async function doResetStep1() {
  const email = normalizeAuthEmail(document.getElementById('resetEmail').value);
  document.getElementById('authErr').className = 'err';
  document.getElementById('authSuc').className = 'suc';
  if (!AUTH_EMAIL_RE.test(email)) { showAuthError('أدخل بريدًا إلكترونيًا صحيحًا'); return; }

  const btn = document.getElementById('resetBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جارٍ الإرسال';
  try {
    // The server generates the Firebase reset link and sends it through Outlook SMTP.
    // Keep the endpoint response neutral so account existence is never exposed.
    const endpoint = window.SOUQ_PASSWORD_RESET_ENDPOINT || '/api/password-reset';
    const response = await fetch(endpoint, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      // Resilience fallback: Firebase sends the reset email if the optional SMTP
      // service is temporarily unavailable, so users are not locked out.
      await auth.sendPasswordResetEmail(email);
      showAuthSuccess('تم إرسال رابط إعادة التعيين. تحقق من البريد ومجلد Spam.');
      return;
    }
    showAuthSuccess('إذا كان هذا البريد مرتبطًا بحساب، فسيصل إليه رابط آمن لإعادة تعيين كلمة المرور. تحقق من البريد ومجلد Spam.');
  } catch(e) {
    const msgs = {
      'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة',
      'auth/too-many-requests': 'تم تجاوز عدد المحاولات. انتظر قليلًا ثم حاول مجددًا',
      'auth/network-request-failed': 'تعذر الاتصال بالإنترنت، حاول مجددًا'
    };
    // Keep user enumeration-resistant behavior for unknown emails.
    if (e.code === 'auth/user-not-found') {
      showAuthSuccess('إذا كان هذا البريد مرتبطًا بحساب، فسيصل إليه رابط آمن لإعادة تعيين كلمة المرور.');
    } else if (e.message === 'reset-service-unavailable' || e.message === 'Failed to fetch') {
      showAuthError('تعذر إرسال رابط الاستعادة. تأكد من أن البريد مسجل في Firebase وأن مزود Email/Password مفعّل');
    } else {
      showAuthError(msgs[e.code] || 'تعذر إرسال رابط الاستعادة، حاول مجددًا');
    }
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-envelope"></i> إرسال رابط الاستعادة';
  }
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
  const safeName = escapeHtml(userDoc.name || 'مستخدم');
  const safePhone = escapeHtml(userDoc.phone || '');
  const safeEmail = escapeHtml(userDoc.email || '');
  const safeInitial = escapeHtml((userDoc.name || 'م').charAt(0));
  const avatarColor  = typeof getAvatarColor === 'function' ? getAvatarColor(userDoc.name || '') : 'var(--blue)';

  document.getElementById('dashContent').innerHTML = `

    ${/* ── Warnings ── */ myWarnings.length ? myWarnings.map(w => `
      <div class="warn-card">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <i class="fa fa-triangle-exclamation" style="color:var(--red);margin-top:2px;font-size:1.1em"></i>
          <div style="flex:1;font-size:.85em;color:#7a1a1a;line-height:1.65">${escapeHtml(w.message)}</div>
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
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <button class="btn btn-gold btn-sm" onclick="showAddEmailForm()">
            <i class="fa fa-envelope"></i> إضافة بريد الآن</button>
          <button class="btn btn-outline btn-sm" onclick="requestRecoveryHelp()">
            <i class="fa fa-headset"></i> طلب مساعدة</button>
        </div>
      </div>` : ''}

    <!-- ── Profile header ── -->
    <div class="dash-profile">
      <div class="dash-avatar" style="background:${avatarColor}">${safeInitial}</div>
      <div class="dash-profile-info">
        <div class="dash-profile-name">${safeName}</div>
        <div class="dash-profile-sub">${safePhone}</div>
        ${hasRealEmail ? `<div class="dash-profile-sub" style="color:var(--blue)">${safeEmail}</div>` : ''}
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
          <div class="my-ad-title">${escapeHtml(ad.title || '')}</div>
          <div class="my-ad-price">${formatPrice(ad)}</div>
          <div class="my-ad-status">${ad.featured ? '⭐ مميز · ' : ''}${escapeHtml(ad.area || 'دير الزور')}</div>
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

    <p style="text-align:center;font-size:.7em;color:var(--border);margin-top:18px">v2.2</p>
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
      <div style="position:relative">
        <input type="password" id="cpCurrent" autocomplete="current-password" placeholder="أدخل كلمة مرورك الحالية" style="padding-left:40px">
        <button type="button" class="pw-toggle" onclick="togglePassword('cpCurrent', this)" aria-label="إظهار كلمة المرور"><i class="fa fa-eye"></i></button>
      </div>
    </div>
    <div class="fg">
      <label>كلمة المرور الجديدة</label>
      <div style="position:relative">
        <input type="password" id="cpNew" autocomplete="new-password" minlength="8" maxlength="128" placeholder="8 أحرف على الأقل" style="padding-left:40px">
        <button type="button" class="pw-toggle" onclick="togglePassword('cpNew', this)" aria-label="إظهار كلمة المرور"><i class="fa fa-eye"></i></button>
      </div>
      <div id="cpNewHint" class="pw-hint"></div>
    </div>
    <div class="fg">
      <label>تأكيد كلمة المرور الجديدة</label>
      <div style="position:relative">
        <input type="password" id="cpConfirm" autocomplete="new-password" placeholder="أعد كتابة كلمة المرور الجديدة" style="padding-left:40px">
        <button type="button" class="pw-toggle" onclick="togglePassword('cpConfirm', this)" aria-label="إظهار كلمة المرور"><i class="fa fa-eye"></i></button>
      </div>
    </div>
    <div class="err" id="cpErr"></div>
    <button class="btn btn-blue" id="cpBtn" onclick="doChangePassword()">
      <i class="fa fa-lock"></i> تغيير كلمة المرور</button>`;

  const cpNew = document.getElementById('cpNew');
  if (cpNew) cpNew.addEventListener('input', () => updatePassHint('cpNew', 'cpNewHint'));
}

async function doChangePassword() {
  const current  = document.getElementById('cpCurrent').value;
  const newPass  = document.getElementById('cpNew').value;
  const confirm  = document.getElementById('cpConfirm').value;
  const errEl    = document.getElementById('cpErr');
  errEl.className = 'err';

  if (!current)        { errEl.textContent = 'أدخل كلمة المرور الحالية'; errEl.className = 'err show'; return; }
  if (newPass.length < 8) { errEl.textContent = 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'; errEl.className = 'err show'; return; }
  if (newPass.length > 128) { errEl.textContent = 'كلمة المرور الجديدة طويلة جدًا'; errEl.className = 'err show'; return; }
  if (newPass === current) { errEl.textContent = 'كلمة المرور الجديدة يجب أن تختلف عن الحالية'; errEl.className = 'err show'; return; }
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
function isPhoneAuthOnlyAccount() {
  const providers = currentUser?.providerData || [];
  return !currentUser?.email
    && providers.some(provider => provider.providerId === 'phone')
    && !providers.some(provider => provider.providerId === 'password');
}

function showAddEmailForm() {
  const phoneOnly = isPhoneAuthOnlyAccount();
  document.getElementById('dashContent').innerHTML = `
    <button class="btn btn-outline btn-sm" style="margin-bottom:16px" onclick="openDashboard()">
      <i class="fa fa-arrow-right"></i> رجوع للحساب</button>

    <div class="section-label">📧 إضافة بريد إلكتروني</div>
    <p style="font-size:.83em;color:var(--gray);margin-bottom:12px;line-height:1.6">
      سيُستخدم فقط لاستعادة كلمة المرور عند نسيانها.</p>
    <div class="fg">
      <label>البريد الإلكتروني</label>
      <input type="email" id="recovEmailInput" autocomplete="email" maxlength="254" placeholder="example@email.com">
    </div>
    ${phoneOnly ? `
    <div class="fg">
      <label>أنشئ كلمة مرور للحساب</label>
      <input type="password" id="recovNewPass" autocomplete="new-password" minlength="8" maxlength="128" placeholder="8 أحرف على الأقل">
    </div>
    <div class="fg">
      <label>تأكيد كلمة المرور</label>
      <input type="password" id="recovConfirmPass" autocomplete="new-password" minlength="8" maxlength="128" placeholder="أعد كتابة كلمة المرور">
    </div>` : `
    <div class="fg">
      <label>كلمة المرور الحالية</label>
      <input type="password" id="recovCurrentPass" autocomplete="current-password" placeholder="للتأكد من هويتك">
    </div>`}
    <div class="err" id="recovEmailErr"></div>
    <button class="btn btn-blue" id="recovEmailBtn" onclick="doAddRecoveryEmail()">
      <i class="fa fa-envelope"></i> إضافة البريد</button>`;
}

async function doAddRecoveryEmail() {
  const email = normalizeAuthEmail(document.getElementById('recovEmailInput').value);
  const phoneOnly = isPhoneAuthOnlyAccount();
  const currentPass = document.getElementById('recovCurrentPass')?.value || '';
  const newPass = document.getElementById('recovNewPass')?.value || '';
  const confirmPass = document.getElementById('recovConfirmPass')?.value || '';
  const errEl = document.getElementById('recovEmailErr');
  const btn = document.getElementById('recovEmailBtn');
  errEl.className = 'err';
  if (!AUTH_EMAIL_RE.test(email)) {
    errEl.textContent = 'صيغة البريد الإلكتروني غير صحيحة'; errEl.className = 'err show'; return;
  }
  if (phoneOnly) {
    if (newPass.length < 8) {
      errEl.textContent = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'; errEl.className = 'err show'; return;
    }
    if (newPass !== confirmPass) {
      errEl.textContent = 'كلمتا المرور غير متطابقتين'; errEl.className = 'err show'; return;
    }
  } else if (!currentPass) {
    errEl.textContent = 'أدخل كلمة المرور الحالية للتأكد من هويتك'; errEl.className = 'err show'; return;
  }
  if (!currentUser) {
    errEl.textContent = 'انتهت جلسة الدخول، سجّل الدخول مجددًا'; errEl.className = 'err show'; return;
  }
  btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جارٍ الحفظ';
  try {
    let linkedPhonePassword = false;
    let previousEmail = currentUser.email;
    if (phoneOnly) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, newPass);
      await currentUser.linkWithCredential(credential);
      linkedPhonePassword = true;
    } else {
      const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPass);
      await currentUser.reauthenticateWithCredential(credential);
      await currentUser.updateEmail(email);
    }
    try {
      // merge supports legacy profile documents while Firestore rules still
      // restrict a normal user's update to allowed profile fields.
      await db.collection('users').doc(currentUser.uid).set({ email }, { merge: true });
    } catch (profileError) {
      if (linkedPhonePassword) await currentUser.unlink('password').catch(() => {});
      else await currentUser.updateEmail(previousEmail).catch(() => {});
      throw profileError;
    }
    await currentUser.reload();
    showToast('تمت إضافة بريد الاسترداد بنجاح', 'ok'); openDashboard();
  } catch(e) {
    const msgs = {
      'auth/wrong-password'       : 'كلمة المرور الحالية خاطئة',
      'auth/invalid-credential'   : 'كلمة المرور الحالية خاطئة',
      'auth/requires-recent-login': 'انتهت صلاحية التحقق، سجّل الدخول مجددًا ثم أعد المحاولة',
      'auth/email-already-in-use' : 'هذا البريد مستخدم في حساب آخر',
      'auth/credential-already-in-use': 'هذا البريد مستخدم في حساب آخر',
      'auth/provider-already-linked': 'هذا الحساب مرتبط ببريد مسبقًا',
      'auth/weak-password'        : 'كلمة المرور ضعيفة، استخدم 8 أحرف على الأقل',
      'auth/invalid-email'        : 'صيغة البريد غير صحيحة',
      'auth/network-request-failed': 'تعذر الاتصال بالإنترنت، حاول مجددًا',
      'auth/operation-not-allowed': 'تعديل البريد غير مفعّل في إعدادات Firebase',
      'auth/user-token-expired'   : 'انتهت جلسة التحقق، سجّل الدخول مجددًا',
      'auth/invalid-user-token'   : 'انتهت جلسة التحقق، سجّل الدخول مجددًا',
      'auth/user-disabled'        : 'هذا الحساب موقوف',
      'permission-denied'         : 'لا تملك صلاحية تحديث ملف الحساب',
      'not-found'                 : 'ملف الحساب غير موجود في قاعدة البيانات',
      'unavailable'               : 'قاعدة البيانات غير متاحة مؤقتًا، حاول مجددًا'
    };
    errEl.textContent = msgs[e.code] || 'تعذر إضافة البريد'; errEl.className = 'err show';
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa fa-envelope"></i> إضافة البريد';
  }
}

async function requestRecoveryHelp() {
  if (!currentUser) return;
  const existing = await db.collection('recoveryRequests')
    .where('userId', '==', currentUser.uid).limit(10).get().catch(() => null);
  if (existing && existing.docs.some(doc => doc.data().status === 'pending')) {
    showToast('لديك طلب استعادة قيد المتابعة بالفعل', 'bad');
    return;
  }
  const userDoc = await db.collection('users').doc(currentUser.uid).get().catch(() => null);
  const data = userDoc && userDoc.exists ? userDoc.data() : {};
  await db.collection('recoveryRequests').add({
    userId: currentUser.uid,
    userName: data.name || currentUser.displayName || 'مستخدم',
    phone: data.phone || '',
    currentEmail: data.email || currentUser.email || '',
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => showToast('تم إرسال طلبك للإدارة', 'ok'))
    .catch(() => showToast('تعذر إرسال الطلب، حاول مجددًا', 'bad'));
}

/* kept for backward compat (HTML buttons may still call it) */
function addRecoveryEmail() { showAddEmailForm(); }

/* ── Logout ── */
function doLogout() {
  auth.signOut().then(() => { closeModal('dashModal'); showToast('تم تسجيل الخروج'); });
}

/* تمنح صلاحيات المدير خارج العميل فقط عبر حساب موثوق وقواعد Firebase. */

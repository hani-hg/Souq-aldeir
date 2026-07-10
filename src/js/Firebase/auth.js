// auth.js
window.switchAuth = function(mode) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('on'));
  const btns = document.querySelectorAll('.tab-btn');
  if (mode === 'login') btns[0].classList.add('on');
  else if (mode === 'signup') btns[1].classList.add('on');
  else btns[2].classList.add('on');
  document.getElementById('pLogin').style.display = (mode === 'login') ? 'block' : 'none';
  document.getElementById('pSignup').style.display = (mode === 'signup') ? 'block' : 'none';
  document.getElementById('pReset').style.display = (mode === 'reset') ? 'block' : 'none';
  document.getElementById('authErr').textContent = '';
  document.getElementById('authSuc').textContent = '';
};

window.doLogin = function() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  auth.signInWithEmailAndPassword(email, pass)
    .then(() => { window.closeM('authModal'); window.showToast('تم الدخول'); window.location.reload(); })
    .catch(e => document.getElementById('authErr').textContent = e.message);
};

window.doSignup = function() {
  const email = document.getElementById('signupEmail').value;
  const pass = document.getElementById('signupPass').value;
  const name = document.getElementById('signupName').value;
  const phone = document.getElementById('signupPhone').value;
  auth.createUserWithEmailAndPassword(email, pass)
    .then(cred => db.collection('users').doc(cred.user.uid).set({ name, phone, email, createdAt: firebase.firestore.FieldValue.serverTimestamp() }))
    .then(() => { window.closeM('authModal'); window.showToast('تم إنشاء الحساب'); window.location.reload(); })
    .catch(e => document.getElementById('authErr').textContent = e.message);
};

window.doReset = function() {
  const email = document.getElementById('resetEmail').value;
  auth.sendPasswordResetEmail(email)
    .then(() => document.getElementById('authSuc').textContent = 'تم إرسال الرابط')
    .catch(e => document.getElementById('authErr').textContent = e.message);
};

window.onUserBtn = function() {
  if (auth.currentUser) { window.openDash(); return; }
  document.getElementById('pLogin').innerHTML = `<div class="fg"><label>البريد</label><input type="email" id="loginEmail"></div><div class="fg"><label>كلمة المرور</label><input type="password" id="loginPass"></div><button class="btn btn-orange" onclick="window.doLogin()">دخول</button>`;
  document.getElementById('pSignup').innerHTML = `<div class="fg"><label>البريد</label><input type="email" id="signupEmail"></div><div class="fg"><label>كلمة المرور</label><input type="password" id="signupPass"></div><div class="fg"><label>الاسم</label><input type="text" id="signupName"></div><div class="fg"><label>الهاتف</label><input type="tel" id="signupPhone"></div><button class="btn btn-orange" onclick="window.doSignup()">إنشاء</button>`;
  document.getElementById('pReset').innerHTML = `<div class="fg"><label>البريد</label><input type="email" id="resetEmail"></div><button class="btn btn-blue" onclick="window.doReset()">أرسل</button>`;
  window.openM('authModal');
  window.switchAuth('login');
};

window.openDash = function() {
  const user = auth.currentUser;
  if (!user) return window.onUserBtn();
  db.collection('users').doc(user.uid).get().then(doc => {
    const data = doc.data() || {};
    document.getElementById('dashBody').innerHTML = `<p><strong>الاسم:</strong> ${data.name}</p><p><strong>البريد:</strong> ${user.email}</p><p><strong>الهاتف:</strong> ${data.phone}</p><button class="btn btn-orange" onclick="window.logout()">تسجيل خروج</button>`;
    window.openM('dashModal');
  });
};

window.logout = function() {
  auth.signOut().then(() => { window.closeM('dashModal'); window.location.reload(); });
};

auth.onAuthStateChanged(user => {
  const adminBtn = document.getElementById('adminBtn');
  if (user && user.email === 'admin@example.com') adminBtn.style.display = 'inline-flex';
  else adminBtn.style.display = 'none';
});

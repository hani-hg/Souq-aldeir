let resetCode = '';

function resetError(message) {
  const el = document.getElementById('resetPageErr');
  if (!el) return;
  el.textContent = message;
  el.className = 'err show';
}

function clearResetError() {
  const el = document.getElementById('resetPageErr');
  if (el) el.className = 'err';
}

function toggleResetPassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const visible = input.type === 'password';
  input.type = visible ? 'text' : 'password';
  const icon = button?.querySelector('i');
  if (icon) icon.className = visible ? 'fa fa-eye-slash' : 'fa fa-eye';
}

function resetErrorMessage(code) {
  return ({
    'auth/expired-action-code': 'انتهت صلاحية رابط الاستعادة. اطلب رابطًا جديدًا.',
    'auth/invalid-action-code': 'رابط الاستعادة غير صالح أو تم استخدامه سابقًا.',
    'auth/user-disabled': 'هذا الحساب موقوف، تواصل مع الإدارة.',
    'auth/user-not-found': 'الحساب المرتبط بالرابط غير موجود.',
    'auth/weak-password': 'كلمة المرور ضعيفة، استخدم 8 أحرف على الأقل.',
    'auth/network-request-failed': 'تعذر الاتصال بالإنترنت، حاول مجددًا.'
  })[code] || 'تعذر التحقق من الرابط. اطلب رابط استعادة جديدًا.';
}

async function loadResetLink() {
  const params = new URLSearchParams(location.search);
  resetCode = params.get('oobCode') || '';
  if (params.get('mode') !== 'resetPassword' || !resetCode) {
    resetError('رابط الاستعادة غير مكتمل. اطلب رابطًا جديدًا من صفحة نسيت كلمة المرور.');
    document.getElementById('resetSubmit').disabled = true;
    return;
  }
  try {
    // Firebase Auth enforces the action-code lifetime and one-time consumption.
    // The browser never receives the Firebase Admin service-account credentials.
    await auth.verifyPasswordResetCode(resetCode);
  } catch (error) {
    resetError(resetErrorMessage(error.code));
    document.getElementById('resetSubmit').disabled = true;
  }
}

async function submitNewPassword() {
  clearResetError();
  const password = document.getElementById('newPassword').value;
  const confirmation = document.getElementById('confirmPassword').value;
  if (password.length < 8) return resetError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
  if (password.length > 128) return resetError('كلمة المرور طويلة جدًا.');
  if (password !== confirmation) return resetError('كلمتا المرور غير متطابقتين.');
  if (!resetCode) return resetError('رابط الاستعادة غير صالح.');

  const button = document.getElementById('resetSubmit');
  button.disabled = true;
  button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جارٍ الحفظ';
  try {
    await auth.confirmPasswordReset(resetCode, password);
    document.getElementById('resetFormState').style.display = 'none';
    document.getElementById('resetState').style.display = 'block';
  } catch (error) {
    resetError(resetErrorMessage(error.code));
    button.disabled = false;
    button.innerHTML = '<i class="fa fa-key"></i> حفظ كلمة المرور الجديدة';
  }
}

document.addEventListener('DOMContentLoaded', loadResetLink);

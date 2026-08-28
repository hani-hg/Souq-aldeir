import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../api.js';

export default function AuthModal({ onClose }) {
  const { login, register, settings } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);
  const [form, setForm] = useState({
    identifier: '',
    password: '',
    name: '',
    phone: '',
    email: ''
  });

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setResetInfo(null);
  }

  async function doLogin() {
    if (!form.identifier.trim() || !form.password) return toast('أدخل البيانات كاملة', 'error');
    setLoading(true);
    try {
      await login(form.identifier.trim(), form.password);
      toast('تم تسجيل الدخول بنجاح', 'success');
      onClose();
    } catch (e) {
      toast(e.message, 'error');
    }
    setLoading(false);
  }

  async function doRegister() {
    if (!form.name.trim()) return toast('الاسم الكامل مطلوب', 'error');
    if (!form.phone.trim()) return toast('رقم الهاتف مطلوب', 'error');
    if (form.password.length < 6) return toast('كلمة المرور 6 أحرف على الأقل', 'error');
    setLoading(true);
    try {
      await register({ name: form.name.trim(), phone: form.phone, email: form.email || null, password: form.password });
      toast('تم إنشاء حسابك بنجاح', 'success');
      onClose();
    } catch (e) {
      toast(e.message, 'error');
    }
    setLoading(false);
  }

  async function doReset() {
    if (!form.phone.trim()) return toast('أدخل رقم الهاتف', 'error');
    setLoading(true);
    try {
      const d = await api.post('/api/auth/reset', { phone: form.phone.trim() });
      setResetInfo(d);
    } catch (e) {
      toast(e.message, 'error');
    }
    setLoading(false);
  }

  return (
    <Modal title={tab === 'login' ? 'الدخول إلى السوق' : tab === 'register' ? 'حساب جديد' : 'استعادة كلمة المرور'} onClose={onClose}>
      <div className="auth-tabs">
        <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>دخول</button>
        <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>حساب جديد</button>
        <button className={tab === 'reset' ? 'active' : ''} onClick={() => setTab('reset')}>نسيت كلمة المرور</button>
      </div>

      {tab === 'login' && (
        <>
          <div className="form-group">
            <label>رقم الهاتف أو البريد الإلكتروني</label>
            <input value={form.identifier} onChange={(e) => set('identifier', e.target.value)} dir="ltr" />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} dir="ltr" onKeyDown={(e) => e.key === 'Enter' && doLogin()} />
          </div>
          <button className="btn btn-primary btn-block" onClick={doLogin} disabled={loading}>
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </>
      )}

      {tab === 'register' && (
        <>
          <div className="form-group">
            <label>الاسم الكامل <span className="req">*</span></label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>رقم الهاتف <span className="req">*</span></label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} dir="ltr" placeholder="09xxxxxxx" />
          </div>
          <div className="form-group">
            <label>البريد الإلكتروني (اختياري)</label>
            <input value={form.email} onChange={(e) => set('email', e.target.value)} dir="ltr" />
          </div>
          <div className="form-group">
            <label>كلمة المرور <span className="req">*</span> (6 أحرف على الأقل)</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} dir="ltr" />
          </div>
          <button className="btn btn-primary btn-block" onClick={doRegister} disabled={loading}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </>
      )}

      {tab === 'reset' && (
        <>
          {resetInfo ? (
            <div className="card" style={{ background: 'var(--primary-light)' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: 10 }}>{resetInfo.note}</p>
              {resetInfo.tempPassword && (
                <div style={{ textAlign: 'center', padding: 12, background: '#fff', borderRadius: 10, marginBottom: 10 }}>
                  <b style={{ fontSize: '1.2rem', letterSpacing: 2 }}>{resetInfo.tempPassword}</b>
                </div>
              )}
              {resetInfo.contact && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {resetInfo.contact.email && (
                    <a className="btn btn-sm btn-ghost" href={`mailto:${resetInfo.contact.email}`}>
                      <i className="fas fa-envelope" /> الإدارة
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 14 }}>
                أدخل رقم هاتفك المسجل. إذا كان حسابك مرتبطاً ببريد إلكتروني حقيقي سنعرض لك كلمة مرور مؤقتة، وإلا سنعرض لك طريقة التواصل مع الإدارة.
              </p>
              <div className="form-group">
                <label>رقم الهاتف المسجل</label>
                <input value={form.phone} onChange={(e) => set('phone', e.target.value)} dir="ltr" placeholder="09xxxxxxx" />
              </div>
              <button className="btn btn-primary btn-block" onClick={doReset} disabled={loading}>
                {loading ? 'جاري البحث...' : 'ابحث عن حسابي'}
              </button>
            </>
          )}
        </>
      )}
    </Modal>
  );
}

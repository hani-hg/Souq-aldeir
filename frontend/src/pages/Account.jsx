import { useEffect, useState } from 'react';
import { api } from '../api.js';
import AdCard from '../components/AdCard.jsx';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { formatDate } from '../utils.js';

export default function Account({ onOpen, onEdit, onAuth, onAdmin }) {
  const { user, setUser, logout, settings } = useAuth();
  const [myAds, setMyAds] = useState([]);
  const [stats, setStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [pwMode, setPwMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [pw, setPw] = useState({ current: '', password: '' });
  const [tab, setTab] = useState('myAds');

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name, email: user.email || '' });
    api.get('/api/ads/my').then((d) => setMyAds(d.ads)).catch(() => {});
    api.get('/api/stats').then(setStats).catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div className="empty">
        <i className="fas fa-user" />
        <p>سجل دخولك لمشاهدة حسابك</p>
        <button className="btn btn-primary" onClick={onAuth} style={{ marginTop: 12 }}>دخول / حساب جديد</button>
      </div>
    );
  }

  async function saveProfile() {
    try {
      const d = await api.put('/api/auth/me', form);
      setUser(d.user);
      setEditMode(false);
      toast('تم حفظ البيانات', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function changePassword() {
    if (pw.password.length < 6) return toast('كلمة المرور الجديدة 6 أحرف على الأقل', 'error');
    try {
      await api.put('/api/auth/password', pw);
      setPw({ current: '', password: '' });
      setPwMode(false);
      toast('تم تغيير كلمة المرور', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>حسابي</h1>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div className="seller-card" style={{ flex: 1, marginTop: 0, boxShadow: 'none', padding: 0, background: 'transparent' }}>
          <div className="ava">{user.name.slice(0, 1)}</div>
          <div className="info">
            <b>{user.name}</b>
            <span><i className="fas fa-phone" /> {user.phone}</span>
            {user.email && <span style={{ display: 'block' }}><i className="fas fa-envelope" /> {user.email}</span>}
            <span>عضو منذ {formatDate(user.createdAt)}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          <i className="fas fa-right-from-bracket" /> خروج
        </button>
      </div>

      {user.role === 'admin' && (
        <div className="landing-stats" style={{ padding: '0 0 16px', justifyContent: 'flex-start', gap: 30 }}>
          {stats && (
            <>
              <div className="s"><b>{stats.ads}</b><span>إعلان</span></div>
              <div className="s"><b>{stats.users}</b><span>مستخدم</span></div>
              <div className="s"><b>{stats.visits}</b><span>زيارة</span></div>
              <button className="btn btn-primary btn-sm" onClick={onAdmin} style={{ marginRight: 'auto' }}>
                <i className="fas fa-shield-halved" /> لوحة المدير
              </button>
            </>
          )}
        </div>
      )}

      <div className="auth-tabs" style={{ maxWidth: 480 }}>
        <button className={tab === 'myAds' ? 'active' : ''} onClick={() => setTab('myAds')}>إعلاناتي</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>البيانات</button>
        <button className={tab === 'favorites' ? 'active' : ''} onClick={() => setTab('favorites')}>المفضلة</button>
      </div>

      {tab === 'myAds' && (
        <div className="ads-grid" style={{ marginTop: 12 }}>
          {myAds.length === 0 && (
            <div className="empty" style={{ gridColumn: '1 / -1' }}>
              <i className="fas fa-box-open" />
              <p>لم تنشر أي إعلان بعد</p>
            </div>
          )}
          {myAds.map((ad) => (
            <div key={ad.id} onClick={() => onOpen(ad.id)} style={{ cursor: 'pointer' }}>
              <AdCard ad={ad} onOpen={onOpen} favBtn={false} />
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); onEdit(ad); }}>
                  <i className="fas fa-pen" /> تعديل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <div className="form-card" style={{ marginTop: 12 }}>
          {!editMode && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                <i className="fas fa-pen" /> تعديل البيانات
              </button>
              <button className="btn btn-ghost" onClick={() => setPwMode(true)}>
                <i className="fas fa-key" /> تغيير كلمة المرور
              </button>
            </div>
          )}

          {editMode && (
            <>
              <div className="form-group">
                <label>الاسم</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={saveProfile}>حفظ</button>
                <button className="btn btn-ghost" onClick={() => setEditMode(false)}>إلغاء</button>
              </div>
            </>
          )}

          {pwMode && (
            <>
              <div className="divider" />
              <div className="form-group">
                <label>كلمة المرور الحالية</label>
                <input type="password" dir="ltr" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
              </div>
              <div className="form-group">
                <label>كلمة المرور الجديدة</label>
                <input type="password" dir="ltr" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={changePassword}>تغيير</button>
                <button className="btn btn-ghost" onClick={() => setPwMode(false)}>إلغاء</button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'favorites' && <FavoritesTab onOpen={onOpen} onAuth={onAuth} />}
    </div>
  );
}

function FavoritesTab({ onOpen, onAuth }) {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get(`/api/ads?onlyFav=1&userId=${user.id}`).then((d) => {
      setAds(d.ads);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="empty">
        <i className="fas fa-heart" />
        <p>سجل دخولك لمشاهدة مفضلتك</p>
        <button className="btn btn-primary" onClick={onAuth} style={{ marginTop: 12 }}>دخول</button>
      </div>
    );
  }
  if (loading) return <div className="spinner" />;

  return (
    <div className="ads-grid" style={{ marginTop: 12 }}>
      {ads.length === 0 && (
        <div className="empty" style={{ gridColumn: '1 / -1' }}>
          <i className="fas fa-heart" />
          <p>لا توجد إعلانات في المفضلة</p>
        </div>
      )}
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} onOpen={onOpen} favBtn={false} />
      ))}
    </div>
  );
}

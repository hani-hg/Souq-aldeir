import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { formatPrice, timeAgo, formatDate } from '../utils.js';

export default function Admin() {
  const { user, settings, setSettings } = useAuth();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adSearch, setAdSearch] = useState('');
  const [contact, setContact] = useState({ email: '', phone: '' });
  const [marketSettings, setMarketSettings] = useState({ tickerEnabled: true, tickerText: '', tickerLink: '', featuredInterval: 3 });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    setContact({ email: settings.email, phone: settings.phone });
    loadMarketSettings();
    loadStats();
  }, [user]);

  async function loadStats() {
    setLoading(true);
    try {
      const d = await api.get('/api/admin/stats');
      setStats(d);
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  async function loadAds() {
    setLoading(true);
    try {
      const d = await api.get(`/api/admin/ads?search=${encodeURIComponent(adSearch)}`);
      setAds(d.ads);
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const d = await api.get('/api/admin/users');
      setUsers(d.users);
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  async function loadReports() {
    setLoading(true);
    try {
      const d = await api.get('/api/admin/reports');
      setReports(d.reports);
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  }

  async function loadMarketSettings() {
    try {
      const data = await api.get('/api/admin/market-settings');
      setMarketSettings(data.settings);
    } catch (e) { toast(e.message, 'error'); }
  }

  function switchTab(t) {
    setTab(t);
    if (t === 'ads') loadAds();
    if (t === 'users') loadUsers();
    if (t === 'reports') loadReports();
    if (t === 'settings') { setContact({ email: settings.email, phone: settings.phone, whatsapp: settings.whatsapp }); loadMarketSettings(); }
  }

  async function toggleAd(ad) {
    try {
      const d = await api.post(`/api/admin/ads/${ad.id}/toggle`);
      setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, status: d.status } : a)));
      toast(d.status === 'active' ? 'تم تفعيل الإعلان' : 'تم إخفاء الإعلان', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }

  async function featureAd(ad) {
    try {
      const d = await api.post(`/api/admin/ads/${ad.id}/feature`);
      setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, featured: d.featured } : a)));
      toast(d.featured ? 'تم التمييز' : 'تم إلغاء التمييز', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }

  async function deleteAd(ad) {
    if (!confirm(`حذف الإعلان: ${ad.title}؟`)) return;
    try {
      await api.delete(`/api/admin/ads/${ad.id}`);
      setAds((prev) => prev.filter((a) => a.id !== ad.id));
      toast('تم الحذف', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }

  async function toggleBan(u) {
    try {
      const d = await api.post(`/api/admin/users/${u.id}/ban`);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isBanned: d.isBanned } : x)));
      toast(d.isBanned ? 'تم حظر المستخدم' : 'تم رفع الحظر', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }

  async function deleteReport(id) {
    try {
      await api.delete(`/api/admin/reports/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast('تم إغلاق البلاغ', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }

  async function saveSettings() {
    try {
      const d = await api.put('/api/admin/settings', contact);
      setSettings(d.settings);
      toast('تم حفظ إعدادات التواصل', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }

  async function saveMarketSettings() {
    try {
      const data = await api.put('/api/admin/market-settings', marketSettings);
      setMarketSettings(data.settings);
      toast('تم حفظ إعدادات واجهة السوق', 'success');
    } catch (e) { toast(e.message, 'error'); }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="empty">
        <i className="fas fa-shield-halved" />
        <p>غير مصرح لك</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1><i className="fas fa-shield-halved" style={{ color: 'var(--primary)' }} /> لوحة المدير</h1>
      </div>

      <div className="auth-tabs" style={{ maxWidth: '100%', overflowX: 'auto' }}>
        {[['stats', 'الإحصائيات'], ['ads', 'الإعلانات'], ['users', 'المستخدمون'], ['reports', 'البلاغات'], ['settings', 'إعدادات السوق']].map(([id, lbl]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => switchTab(id)} style={{ minWidth: 110 }}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'stats' && (
        <>
          {loading || !stats ? <div className="spinner" /> : (
            <>
              <div className="admin-stats" style={{ marginBottom: 16 }}>
                <div className="stat-card"><div className="num">{stats.users}</div><div className="lbl">مستخدم</div></div>
                <div className="stat-card"><div className="num">{stats.ads}</div><div className="lbl">إعلان</div></div>
                <div className="stat-card"><div className="num">{stats.activeAds}</div><div className="lbl">إعلان نشط</div></div>
                <div className="stat-card"><div className="num">{stats.messages}</div><div className="lbl">رسالة</div></div>
                <div className="stat-card"><div className="num">{stats.reports}</div><div className="lbl">بلاغ</div></div>
                <div className="stat-card"><div className="num">{stats.newUsers7}</div><div className="lbl">مستخدم جديد (7 أيام)</div></div>
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 12 }}>إعلانات خلال آخر 14 يوماً</h3>
                <BarChart data={stats.last14} />
              </div>

              <div className="card">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 12 }}>الإعلانات حسب الفئة</h3>
                {stats.byCat.map((c) => {
                  const pct = stats.ads ? Math.round((c.c / stats.ads) * 100) : 0;
                  return (
                    <div key={c.category} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                        <span>{c.category}</span>
                        <b>{c.c}</b>
                      </div>
                      <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {tab === 'ads' && (
        <>
          <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
            <input
              style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 14px', outline: 'none' }}
              value={adSearch}
              onChange={(e) => setAdSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadAds()}
              placeholder="بحث في الإعلانات..."
            />
            <button className="btn btn-primary btn-sm" onClick={loadAds}><i className="fas fa-search" /></button>
          </div>
          <div className="card table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>العنوان</th><th>السعر</th><th>الحالة</th><th>مميز</th><th>التاريخ</th><th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((a) => (
                  <tr key={a.id}>
                    <td style={{ maxWidth: 200 }}>{a.title}</td>
                    <td>{formatPrice(a.price, a.currency)}</td>
                    <td><span className={`pill ${a.status}`}>{a.status === 'active' ? 'نشط' : a.status === 'sold' ? 'مُباع' : a.status === 'expired' ? 'منتهي' : 'مخفي'}</span></td>
                    <td>{a.featured ? 'نعم' : 'لا'}</td>
                    <td>{timeAgo(a.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => toggleAd(a)}>{a.status === 'active' ? 'إخفاء' : 'تفعيل'}</button>
                        <button className="btn btn-sm btn-accent" onClick={() => featureAd(a)}>{a.featured ? 'إلغاء تمييز' : 'مميز'}</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAd(a)}><i className="fas fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {ads.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)' }}>لا توجد إعلانات</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="card table-wrap" style={{ marginTop: 12 }}>
          <table className="tbl">
            <thead>
              <tr><th>الاسم</th><th>الهاتف</th><th>البريد</th><th>إعلانات</th><th>التسجيل</th><th>الحالة</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name} {u.role === 'admin' && <span className="pill featured">مدير</span>}</td>
                  <td dir="ltr">{u.phone}</td>
                  <td dir="ltr">{u.email || '-'}</td>
                  <td>{u.adsCount}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{u.isBanned ? <span className="pill sold">محظور</span> : <span className="pill active">نشط</span>}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className={`btn btn-sm ${u.isBanned ? 'btn-success' : 'btn-outline-danger'}`} onClick={() => toggleBan(u)}>
                        {u.isBanned ? 'رفع حظر' : 'حظر'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reports' && (
        <div className="card table-wrap" style={{ marginTop: 12 }}>
          <table className="tbl">
            <thead>
              <tr><th>الإعلان</th><th>المبلّغ</th><th>السبب</th><th>التاريخ</th><th></th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.adTitle}</td>
                  <td>{r.reporterName || 'زائر'}</td>
                  <td>{r.reason || '-'}</td>
                  <td>{timeAgo(r.createdAt)}</td>
                  <td><button className="btn btn-sm btn-success" onClick={() => deleteReport(r.id)}>إغلاق</button></td>
                </tr>
              ))}
              {reports.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>لا توجد بلاغات</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'settings' && (
        <div className="form-card" style={{ marginTop: 12 }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 16 }}>الشريط الإخباري والسلايدر</h2>
          <div className="form-group check-row">
            <input id="ticker-enabled" type="checkbox" checked={marketSettings.tickerEnabled} onChange={(e) => setMarketSettings({ ...marketSettings, tickerEnabled: e.target.checked })} />
            <label htmlFor="ticker-enabled">إظهار الشريط الإخباري أعلى السوق</label>
          </div>
          <div className="form-group">
            <label>نص الشريط الإخباري</label>
            <textarea maxLength={180} value={marketSettings.tickerText} onChange={(e) => setMarketSettings({ ...marketSettings, tickerText: e.target.value })} placeholder="مثال: تخفيضات نهاية الأسبوع متاحة لدى الإعلانات المميزة" />
          </div>
          <div className="form-group">
            <label>رابط اختياري للشريط الإخباري</label>
            <input dir="ltr" value={marketSettings.tickerLink} onChange={(e) => setMarketSettings({ ...marketSettings, tickerLink: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>مدة عرض الإعلان المميز بالثواني</label>
            <input type="number" min="3" max="10" value={marketSettings.featuredInterval} onChange={(e) => setMarketSettings({ ...marketSettings, featuredInterval: e.target.value })} />
            <small style={{ color: 'var(--muted)' }}>من 3 إلى 10 ثوانٍ. اختر الإعلان المميز أو ألغِ تمييزه من تبويب «الإعلانات».</small>
          </div>
          <button className="btn btn-accent" onClick={saveMarketSettings}><i className="fas fa-display" /> حفظ إعدادات الواجهة</button>
          <div className="divider" />
          <h2 style={{ fontSize: '1rem', marginBottom: 16 }}>بيانات التواصل</h2>
          <div className="form-group">
            <label>بريد الإدارة</label>
            <input dir="ltr" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>رقم هاتف الإدارة</label>
            <input dir="ltr" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          </div>
          <button className="btn btn-primary" onClick={saveSettings}><i className="fas fa-save" /> حفظ</button>
        </div>
      )}
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              width: '100%',
              height: `${Math.max((d.count / max) * 100, 3)}%`,
              background: 'linear-gradient(180deg, var(--primary), var(--primary-dark))',
              borderRadius: '6px 6px 0 0',
              minHeight: 3
            }}
            title={`${d.count} إعلان`}
          />
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

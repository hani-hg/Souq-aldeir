import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Modal from './components/Modal.jsx';
import AuthModal from './components/AuthModal.jsx';
import Home from './pages/Home.jsx';
import AdDetail from './pages/AdDetail.jsx';
import AdForm from './pages/AdForm.jsx';
import Account from './pages/Account.jsx';
import Messages, { useUnread } from './pages/Messages.jsx';
import Admin from './pages/Admin.jsx';
import { ToastHost } from './components/Toast.jsx';
import { toast } from './components/Toast.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { api } from './api.js';

function shareUrl() {
  return typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
}

export default function App() {
  const { user, loading } = useAuth();
  const { unread } = useUnread();
  const [route, setRoute] = useState('home');
  const [adId, setAdId] = useState(null);
  const [editAd, setEditAd] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [contactTarget, setContactTarget] = useState(null);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#\/?/, '');
      if (!h) { setRoute('home'); return; }
      if (h.startsWith('ad/')) { setRoute('ad'); setAdId(decodeURIComponent(h.split('/')[1])); }
      else if (h.startsWith('new')) setRoute('new');
      else if (h.startsWith('account')) setRoute('account');
      else if (h.startsWith('messages')) setRoute('messages');
      else if (h.startsWith('admin')) setRoute('admin');
      else if (h.startsWith('favorites')) setRoute('account');
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function navigate(name, param) {
    const hash = name === 'home' ? '' : name === 'ad' ? `ad/${param}` : name;
    window.location.hash = hash;
    setRoute(name);
    if (param && name === 'ad') setAdId(param);
  }

  function openAd(id) {
    navigate('ad', id);
    window.scrollTo(0, 0);
  }

  function requireAuth() {
    setShowAuth(true);
  }

  function startContact(ad) {
    if (!user) return setShowAuth(true);
    setContactTarget(ad);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl()).then(() => toast('تم نسخ رابط الموقع', 'success'));
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Header
        user={user}
        unread={unread}
        route={route}
        navigate={navigate}
        onAuth={() => setShowAuth(true)}
        onMessages={() => navigate('messages')}
        onFavorites={() => navigate('favorites')}
        onAccount={() => navigate('account')}
        onAdmin={() => navigate('admin')}
        onShare={() => setShowShare(true)}
        onAbout={() => setShowAbout(true)}
      />

      <main style={{ maxWidth: 1200, margin: '0 auto' }}>
        {route === 'home' && (
          <Home
            onOpen={openAd}
            onAuth={() => setShowAuth(true)}
            openCreate={() => navigate('new')}
          />
        )}

        {route === 'ad' && (
          <AdDetail
            id={adId}
            onBack={() => navigate('home')}
            onEdit={(ad) => { setEditAd(ad); navigate('new'); }}
            onContact={startContact}
            onAuth={() => setShowAuth(true)}
          />
        )}

        {route === 'new' && (
          <div style={{ padding: 16 }}>
            {editAd ? (
              <AdForm
                editAd={editAd}
                onDone={() => { setEditAd(null); navigate('home'); toast('تم الحفظ', 'success'); }}
                onRequireAuth={requireAuth}
                onCancel={() => { setEditAd(null); navigate('home'); }}
              />
            ) : (
              <AdForm
                onDone={() => navigate('home')}
                onRequireAuth={requireAuth}
                onCancel={() => navigate('home')}
              />
            )}
          </div>
        )}

        {route === 'account' && (
          <Account
            onOpen={openAd}
            onEdit={(ad) => { setEditAd(ad); navigate('new'); }}
            onAuth={() => setShowAuth(true)}
            onAdmin={() => navigate('admin')}
          />
        )}

        {route === 'messages' && <Messages onAuth={() => setShowAuth(true)} />}

        {route === 'admin' && <Admin />}
      </main>

      <button className="fab" onClick={() => navigate('new')} title="أضف إعلان">
        <i className="fas fa-plus" />
      </button>

      <BottomNav route={route} navigate={navigate} unread={unread} />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {contactTarget && <ContactModal ad={contactTarget} onClose={() => setContactTarget(null)} />}

      {showShare && (
        <Modal title="مشاركة السوق" onClose={() => setShowShare(false)}>
          <div style={{ textAlign: 'center', padding: 10 }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 12 }}>
              امسح الرمز بكاميرا الجوال لفتح سوق دير الزور مباشرة
            </div>
            <button className="btn btn-primary btn-block" onClick={copyLink}>
              <i className="fas fa-link" /> نسخ رابط الموقع
            </button>
          </div>
        </Modal>
      )}

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} onOpenShare={() => { setShowAbout(false); setShowShare(true); }} />}

      <ToastHost />
    </>
  );
}

function ContactModal({ ad, onClose }) {
  const { user } = useAuth();
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  async function send() {
    if (!draft.trim()) return toast('اكتب نص الرسالة', 'error');
    setSending(true);
    try {
      await api.post(`/api/chats/${ad.seller.id}`, { text: draft.trim() });
      toast('تم إرسال الرسالة', 'success');
      onClose();
    } catch (e) {
      toast(e.message, 'error');
    }
    setSending(false);
  }

  return (
    <Modal title={`راسل ${ad.seller.name}`} onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div className="ava" style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem'
        }}>
          {ad.seller.name.slice(0, 1)}
        </div>
        <div>
          <b>{ad.seller.name}</b>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{ad.title}</div>
        </div>
      </div>
      <div className="form-group">
        <label>رسالتك إلى البائع</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="مثال: هل السلعة ما تزال متوفرة؟ هل يمكن معاينتها؟"
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={send} disabled={sending}>
          <i className="fas fa-paper-plane" /> إرسال
        </button>
        <a
          className="btn btn-whatsapp"
          href={`https://wa.me/${String(ad.phone).replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp" /> واتساب
        </a>
      </div>
    </Modal>
  );
}

function AboutModal({ onClose, onOpenShare }) {
  const { settings } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/stats').then(setStats).catch(() => {});
  }, []);

  return (
    <Modal title="عن السوق والتواصل مع الإدارة" onClose={onClose}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: '0.88rem', color: '#374151' }}>
          سوق دير الزور المفتوح هو منصة إعلانات مبوبة مجانية تتيح للمستخدمين نشر إعلانات بيع وشراء والتواصل مباشرة فيما بينهم.
          الموقع وسيط عرض إعلانات فقط ولا يملك ولا يبيع أي سلعة.
        </p>
      </div>
      {stats && (
        <div className="landing-stats" style={{ padding: '0 0 16px' }}>
          <div className="s"><b>{stats.visits}</b><span>زيارة</span></div>
          <div className="s"><b>{stats.users}</b><span>مستخدم مسجل</span></div>
          <div className="s"><b>{stats.ads}</b><span>إعلان منشور</span></div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {settings.whatsapp && (
          <a className="btn btn-whatsapp btn-sm" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp" /> تواصل مع الإدارة عبر واتساب
          </a>
        )}
        {settings.email && (
          <a className="btn btn-ghost btn-sm" href={`mailto:${settings.email}`}>
            <i className="fas fa-envelope" /> البريد
          </a>
        )}
        <button className="btn btn-ghost btn-sm" onClick={onOpenShare}>
          <i className="fas fa-qrcode" /> مشاركة السوق
        </button>
      </div>
      <button className="btn btn-primary btn-block" onClick={onClose}>شروط الاستخدام</button>
    </Modal>
  );
}

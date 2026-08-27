/** تصميم سوق الحي الواثق: تطبيق عربي عملي، مع محتوى متاح فوراً وتحميل مؤجل للصفحات الثقيلة. */
import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Modal from './components/Modal.jsx';
import AuthModal from './components/AuthModal.jsx';
import Home from './pages/Home.jsx';
import Messages, { useUnread } from './pages/Messages.jsx';
import { ToastHost, toast } from './components/Toast.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { api } from './api.js';
import InstallPrompt from './components/InstallPrompt.jsx';

const AdDetail = lazy(() => import('./pages/AdDetail.jsx'));
const AdForm = lazy(() => import('./pages/AdForm.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function shareUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

export default function App() {
  const { user } = useAuth();
  const { unread } = useUnread();
  const [route, setRoute] = useState('home');
  const [adId, setAdId] = useState(null);
  const [editAd, setEditAd] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [contactTarget, setContactTarget] = useState(null);

  useEffect(() => {
    const syncRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) return setRoute('home');
      if (hash.startsWith('ad/')) { setAdId(decodeURIComponent(hash.split('/')[1])); return setRoute('ad'); }
      if (['new', 'account', 'messages', 'admin'].includes(hash)) return setRoute(hash);
      if (hash === 'favorites') return setRoute('account');
      setRoute('home');
    };
    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  function navigate(name, param) {
    const hash = name === 'home' ? '' : name === 'ad' ? `ad/${param}` : name;
    window.location.hash = hash;
    setRoute(name);
    if (name === 'ad') setAdId(param);
  }

  function openAd(id) {
    navigate('ad', id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(shareUrl()); toast('تم نسخ رابط السوق', 'success'); }
    catch { toast('تعذر نسخ الرابط تلقائياً', 'error'); }
  }

  return (
    <>
      <Header
        unread={unread}
        onAuth={() => setShowAuth(true)}
        onMessages={() => navigate('messages')}
        onFavorites={() => navigate('favorites')}
        onAccount={() => navigate('account')}
        onAdmin={() => navigate('admin')}
        onShare={() => setShowShare(true)}
        onAbout={() => setShowAbout(true)}
      />
      <main>
        <Suspense fallback={<div className="page-loader"><div className="spinner" /><span>يتم تجهيز الصفحة…</span></div>}>
          {route === 'home' && <Home onOpen={openAd} onAuth={() => setShowAuth(true)} openCreate={() => navigate('new')} />}
          {route === 'ad' && <AdDetail id={adId} onBack={() => navigate('home')} onEdit={(ad) => { setEditAd(ad); navigate('new'); }} onContact={(ad) => user ? setContactTarget(ad) : setShowAuth(true)} onAuth={() => setShowAuth(true)} />}
          {route === 'new' && <div className="route-shell"><AdForm editAd={editAd} onDone={() => { setEditAd(null); navigate('home'); }} onRequireAuth={() => setShowAuth(true)} onCancel={() => { setEditAd(null); navigate('home'); }} /></div>}
          {route === 'account' && <Account onOpen={openAd} onEdit={(ad) => { setEditAd(ad); navigate('new'); }} onAuth={() => setShowAuth(true)} onAdmin={() => navigate('admin')} />}
          {route === 'messages' && <Messages onAuth={() => setShowAuth(true)} />}
          {route === 'admin' && <Admin />}
        </Suspense>
      </main>
      <button className="fab" onClick={() => navigate('new')} title="أضف إعلاناً" aria-label="أضف إعلاناً"><i className="fas fa-plus" /></button>
      <BottomNav route={route} navigate={navigate} unread={unread} />
      <InstallPrompt />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {contactTarget && <ContactModal ad={contactTarget} onClose={() => setContactTarget(null)} />}
      {showShare && <Modal title="مشاركة السوق" onClose={() => setShowShare(false)}><div className="modal-note"><i className="fas fa-share-nodes" /><p>شارك رابط السوق ليصل إلى الباحثين عن البيع والشراء في منطقتك.</p><button className="btn btn-primary btn-block" onClick={copyLink}><i className="fas fa-link" /> نسخ رابط السوق</button></div></Modal>}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} onOpenShare={() => { setShowAbout(false); setShowShare(true); }} />}
      <ToastHost />
    </>
  );
}

function ContactModal({ ad, onClose }) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  async function send() {
    if (!draft.trim()) return toast('اكتب نص الرسالة', 'error');
    setSending(true);
    try { await api.post(`/api/chats/${ad.seller.id}`, { text: draft.trim() }); toast('تم إرسال الرسالة', 'success'); onClose(); }
    catch (error) { toast(error.message, 'error'); }
    finally { setSending(false); }
  }
  return <Modal title={`راسل ${ad.seller.name}`} onClose={onClose}><div className="contact-person"><span className="ava">{ad.seller.name.slice(0, 1)}</span><div><b>{ad.seller.name}</b><small>{ad.title}</small></div></div><div className="form-group"><label>رسالتك إلى البائع</label><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="مثال: هل السلعة ما تزال متوفرة؟" /></div><div className="contact-actions"><button className="btn btn-primary" onClick={send} disabled={sending}><i className="fas fa-paper-plane" /> إرسال</button><a className="btn btn-whatsapp" href={`https://wa.me/${String(ad.phone).replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp" /> واتساب</a></div></Modal>;
}

function AboutModal({ onClose, onOpenShare }) {
  const { settings } = useAuth();
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/api/stats').then(setStats).catch(() => {}); }, []);
  return <Modal title="عن السوق والتواصل مع الإدارة" onClose={onClose}><div className="about-copy"><p>سوق دير الزور منصة إعلانات محلية مجانية تتيح للبائعين والمشترين التواصل مباشرة. الموقع وسيط عرض فقط ولا يملك ولا يبيع السلع المعروضة.</p></div>{stats && <div className="landing-stats modal-stats"><div className="s"><b>{stats.ads}</b><span>إعلان منشور</span></div><div className="s"><b>{stats.users}</b><span>مستخدم مسجّل</span></div><div className="s"><b>{stats.visits}</b><span>زيارة</span></div></div>}<div className="contact-actions">{settings.whatsapp && <a className="btn btn-whatsapp btn-sm" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp" /> تواصل مع الإدارة</a>}{settings.email && <a className="btn btn-ghost btn-sm" href={`mailto:${settings.email}`}><i className="fas fa-envelope" /> البريد</a>}<button className="btn btn-ghost btn-sm" onClick={onOpenShare}><i className="fas fa-share-nodes" /> مشاركة السوق</button></div><button className="btn btn-primary btn-block" onClick={onClose}>إغلاق</button></Modal>;
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Messages({ onAuth }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    loadChats();
    timerRef.current = setInterval(loadChats, 8000);
    return () => clearInterval(timerRef.current);
  }, [user]);

  async function loadChats() {
    if (!user) return;
    try {
      const d = await api.get('/api/chats');
      setChats(d.chats);
      window.dispatchEvent(new CustomEvent('chats-update', { detail: { totalUnread: d.totalUnread } }));
    } catch (e) {}
  }

  useEffect(() => {
    if (!active) return;
    loadThread();
    const t = setInterval(loadThread, 6000);
    return () => clearInterval(t);
  }, [active]);

  async function loadThread() {
    if (!active) return;
    try {
      const d = await api.get(`/api/chats/${active.id}`);
      setMessages(d.messages);
      listRef.current && listRef.current.scrollTo({ top: listRef.current.scrollHeight });
    } catch (e) {}
  }

  async function send() {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    try {
      const d = await api.post(`/api/chats/${active.id}`, { text });
      setMessages((prev) => [...prev, d.message]);
      setTimeout(() => listRef.current && listRef.current.scrollTo({ top: listRef.current.scrollHeight }), 50);
      loadChats();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  if (!user) {
    return (
      <div className="empty">
        <i className="fas fa-comment-dots" />
        <p>سجل دخولك لاستخدام الرسائل</p>
        <button className="btn btn-primary" onClick={onAuth} style={{ marginTop: 12 }}>دخول</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>الرسائل</h1>
      </div>

      {active ? (
        <div className="card thread" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="thread-head">
            <button className="btn btn-ghost btn-sm" onClick={() => setActive(null)}>
              <i className="fas fa-arrow-right" />
            </button>
            <div className="ava" style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
            }}>
              {active.name.slice(0, 1)}
            </div>
            <div>
              <b style={{ fontSize: '0.95rem' }}>{active.name}</b>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{active.phone}</div>
            </div>
          </div>
          <div className="thread-msgs" ref={listRef}>
            {messages.length === 0 && (
              <div className="empty" style={{ padding: 20 }}>
                <i className="fas fa-comment" />
                <p>ابدأ المحادثة مع {active.name}</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.senderId === user.id ? 'mine' : ''}`}>
                {m.text}
                <span className="time">
                  {new Date(m.createdAt).toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
          <div className="thread-input">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="اكتب رسالتك..."
            />
            <button onClick={send}><i className="fas fa-paper-plane" /></button>
          </div>
        </div>
      ) : (
        <div className="chat-list" style={{ marginTop: 12 }}>
          {loading && chats.length === 0 && <div className="spinner" />}
          {!loading && chats.length === 0 && (
            <div className="empty">
              <i className="fas fa-inbox" />
              <p>لا توجد محادثات بعد</p>
              <p style={{ fontSize: '0.8rem' }}>اضغط "راسل البائع" من أي إعلان لبدء محادثة</p>
            </div>
          )}
          {chats.map((c) => (
            <button key={c.partner.id} className="chat-item" onClick={() => setActive(c.partner)}>
              <div className="ava">{c.partner.name.slice(0, 1)}</div>
              <div className="info">
                <b>{c.partner.name}</b>
                <span>{c.lastMessage || 'لا توجد رسائل'}</span>
              </div>
              {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function useUnread() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const d = await api.get('/api/chats');
      setUnread(d.totalUnread);
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    refresh();
    const t = setInterval(refresh, 10000);
    window.addEventListener('chats-update', refresh);
    return () => {
      clearInterval(t);
      window.removeEventListener('chats-update', refresh);
    };
  }, [refresh, user]);

  return { unread, refresh };
}

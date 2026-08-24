const TABS = [
  { id: 'home', icon: 'fa-house', label: 'الرئيسية' },
  { id: 'favorites', icon: 'fa-heart', label: 'المفضلة' },
  { id: 'new', icon: 'fa-plus', label: 'أضف' },
  { id: 'messages', icon: 'fa-comment-dots', label: 'الرسائل' },
  { id: 'account', icon: 'fa-user', label: 'حسابي' }
];

export default function BottomNav({ route, navigate, unread }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={route === t.id || (t.id === 'home' && route === 'ad') ? 'active' : ''}
          onClick={() => navigate(t.id)}
        >
          <i className={`fas ${t.icon}`} />
          {t.label}
          {t.id === 'messages' && unread > 0 && <span className="badge">{unread}</span>}
        </button>
      ))}
    </nav>
  );
}

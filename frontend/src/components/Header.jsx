import { useAuth } from '../contexts/AuthContext.jsx';

const CAT_ICONS = {
  'سيارات ومركبات': 'fa-car',
  'عقارات': 'fa-building',
  'موبايل وأجهزة لوحية': 'fa-mobile-screen',
  'إلكترونيات وأجهزة': 'fa-tv',
  'أجهزة منزلية': 'fa-blender',
  'أثاث وديكور': 'fa-couch',
  'ملابس وأزياء': 'fa-shirt',
  'أطفال ورضّع': 'fa-baby',
  'حيوانات أليفة': 'fa-paw',
  'مواد غذائية ومحاصيل': 'fa-wheat-awn',
  'أدوات ومعدات': 'fa-toolbox',
  'رياضة وترفيه': 'fa-futbol',
  'كتب وأدوات تعليمية': 'fa-book',
  'وظائف': 'fa-briefcase',
  'خدمات': 'fa-screwdriver-wrench',
  'أخرى': 'fa-tags'
};

export function catIcon(cat) {
  return CAT_ICONS[cat] || 'fa-tag';
}

export default function Header({ onAuth, onMessages, onFavorites, onAdmin, onAccount, onShare, onAbout, unread, route, navigate }) {
  const { user, settings } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="brand">
          <div className="logo"><i className="fas fa-basket-shopping" /></div>
          <span>سوق دير الزور</span>
        </div>
        <div className="topbar-actions">
          {user && user.role === 'admin' && (
            <button className="icon-btn" onClick={onAdmin} title="لوحة المدير">
              <i className="fas fa-shield-halved" />
            </button>
          )}
          <button className="icon-btn" onClick={onShare} title="مشاركة">
            <i className="fas fa-qrcode" />
          </button>
          <button className="icon-btn" onClick={onAbout} title="عن السوق">
            <i className="fas fa-circle-info" />
          </button>
          <button className="icon-btn" onClick={onFavorites} title="المفضلة">
            <i className="fas fa-heart" />
          </button>
          <button className="icon-btn" onClick={onMessages} title="الرسائل">
            <i className="fas fa-comment-dots" />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          {user ? (
            <button className="user-chip" onClick={onAccount}>
              <span className="ava">{user.name.slice(0, 1)}</span>
              <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </span>
              <i className="fas fa-chevron-down" />
            </button>
          ) : (
            <button className="user-chip" onClick={onAuth}>
              <i className="fas fa-user" />
              <span>دخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

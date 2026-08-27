/** تصميم مرجع الأثاث العصري: رأس داكن فاخر وشريط خبري قصير يربط السوق بأهل المنطقة. */
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../api.js';

const BRAND_SYMBOL = '/assets/souq-aldeir-symbol.png';
const DEFAULT_MARKET = { tickerEnabled: true, tickerText: 'أهلاً بكم في سوق دير الزور — تصفح الإعلانات المحلية وتواصل مباشرة مع البائعين.', tickerLink: '' };

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

export default function Header({ onAuth, onMessages, onFavorites, onAdmin, onAccount, onShare, onAbout, unread }) {
  const { user } = useAuth();
  const [market, setMarket] = useState(DEFAULT_MARKET);

  useEffect(() => { api.get('/api/market-settings').then((data) => setMarket({ ...DEFAULT_MARKET, ...(data.settings || {}) })).catch(() => {}); }, []);
  const tickerText = market.tickerText || DEFAULT_MARKET.tickerText;

  return (
    <header className="topbar">
      {market.tickerEnabled !== false && <div className="news-ticker" role="status" aria-label="أخبار السوق"><div className="news-ticker-inner"><span className="news-label"><i className="fas fa-bullhorn" /> أخبار السوق</span>{market.tickerLink ? <a href={market.tickerLink} target="_blank" rel="noreferrer" className="ticker-text">{tickerText}</a> : <span className="ticker-text">{tickerText}</span>}</div></div>}
      <div className="topbar-row">
        <button className="brand" onClick={() => { window.location.hash = ''; }} aria-label="العودة إلى الرئيسية">
          <span className="brand-mark"><img src={BRAND_SYMBOL} alt="" /></span>
          <span className="brand-copy"><strong>سوق دير الزور</strong><small>إعلانات قريبة منك</small></span>
        </button>
        <div className="topbar-actions">
          {user && user.role === 'admin' && (
            <button className="icon-btn" onClick={onAdmin} title="لوحة المدير">
              <i className="fas fa-shield-halved" />
            </button>
          )}
          <button className="icon-btn optional-action" onClick={onShare} title="مشاركة السوق" aria-label="مشاركة السوق">
            <i className="fas fa-arrow-up-from-bracket" />
          </button>
          <button className="icon-btn optional-action" onClick={onAbout} title="عن السوق" aria-label="عن السوق">
            <i className="fas fa-circle-info" />
          </button>
          <button className="icon-btn" onClick={onFavorites} title="المفضلة">
            <i className="fas fa-heart" />
          </button>
          <button className="icon-btn" onClick={onMessages} title="الرسائل">
            <i className="fas fa-comment-dots" />
            {unread > 0 && <span className="badge">{unread > 99 ? '99+' : unread}</span>}
          </button>
          {user ? (
            <button className="user-chip" onClick={onAccount}>
              <span className="ava">{user.name.slice(0, 1)}</span>
              <span className="user-name">
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

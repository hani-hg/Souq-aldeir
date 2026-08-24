import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import AdCard from '../components/AdCard.jsx';
import { catIcon } from '../components/Header.jsx';
import { formatPrice, timeAgo } from '../utils.js';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const SORTS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price_asc', label: 'السعر: الأقل' },
  { value: 'price_desc', label: 'السعر: الأعلى' },
  { value: 'views', label: 'الأكثر مشاهدة' }
];

export default function Home({ onOpen, onAuth, openCreate }) {
  const { user, settings } = useAuth();
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [ads, setAds] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ area: '', min: '', max: '' });
  const [area, setArea] = useState('');
  const [page, setPage] = useState(0);
  const loadMoreRef = useRef(null);
  const PAGE_SIZE = 30;

  useEffect(() => {
    api.get('/api/ads/categories').then((d) => setCategories(d)).catch(() => {});
    api.get('/api/ads/areas').then((d) => setAreas(d)).catch(() => {});
    api.get('/api/ads/featured').then((d) => setFeatured(d.ads)).catch(() => {});
    api.get('/api/stats').then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(0);
    loadAds(true);
  }, [activeCat, sort, area]);

  useEffect(() => {
    const t = setTimeout(() => loadAds(true), 350);
    return () => clearTimeout(t);
  }, [search]);

  async function loadAds(reset = false) {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (activeCat) params.set('cat', activeCat);
    if (area) params.set('area', area);
    if (filters.min) params.set('min', filters.min);
    if (filters.max) params.set('max', filters.max);
    params.set('sort', sort);
    const offset = reset ? 0 : page * PAGE_SIZE;
    params.set('limit', PAGE_SIZE);
    params.set('offset', offset);
    try {
      const data = await api.get(`/api/ads?${params.toString()}`);
      setAds(reset ? data.ads : (prev) => [...prev, ...data.ads]);
      setTotal(data.total);
      if (reset) setPage(1);
    } catch (e) {
      toast(e.message, 'error');
    }
    setLoading(false);
  }

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && ads.length < total) {
        loadAds(false);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, ads, total]);

  async function toggleFav(ad) {
    if (!user) return onAuth();
    try {
      const d = await api.post(`/api/ads/${ad.id}/favorite`);
      setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, isFavorite: d.isFavorite } : a)));
      setFeatured((prev) => prev.map((a) => (a.id === ad.id ? { ...a, isFavorite: d.isFavorite } : a)));
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  function applyAdvanced() {
    setShowAdvanced(false);
    setPage(0);
    loadAds(true);
  }

  return (
    <>
      <div className="ticker">
        {stats
          ? `مرحباً بك في سوق دير الزور المفتوح — ${stats.ads} إعلان منشور • ${stats.users} مستخدم مسجّل • ${stats.visits} زيارة`
          : 'مرحباً بك في سوق دير الزور المفتوح'}
      </div>

      <div className="search-wrap">
        <div className="search-bar">
          <i className="fas fa-magnifying-glass" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن سيارة، شقة، جهاز..."
          />
          <button onClick={() => loadAds(true)}>بحث</button>
        </div>
      </div>

      <div className="cats-scroll">
        <button
          className={`cat-chip ${activeCat === null ? 'active' : ''}`}
          onClick={() => setActiveCat(null)}
        >
          الكل
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`cat-chip ${activeCat === c ? 'active' : ''}`}
            onClick={() => setActiveCat(c === activeCat ? null : c)}
          >
            <i className={`fas ${catIcon(c)}`} style={{ marginInlineEnd: 4 }} /> {c}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <span className="count">{total} إعلان</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button className="filter-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
          <i className="fas fa-sliders" style={{ marginInlineEnd: 4 }} /> تصفية متقدمة
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-filters">
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">كل المناطق</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <input
            className="price-input"
            type="number"
            placeholder="السعر من"
            value={filters.min}
            onChange={(e) => setFilters({ ...filters, min: e.target.value })}
            style={{ maxWidth: 120 }}
          />
          <input
            className="price-input"
            type="number"
            placeholder="السعر إلى"
            value={filters.max}
            onChange={(e) => setFilters({ ...filters, max: e.target.value })}
            style={{ maxWidth: 120 }}
          />
          <button className="apply" onClick={applyAdvanced}>تطبيق</button>
          <button
            className="clear"
            onClick={() => {
              setArea('');
              setFilters({ area: '', min: '', max: '' });
              loadAds(true);
            }}
          >
            مسح
          </button>
        </div>
      )}

      {featured.length > 0 && (
        <>
          <div className="section-title">
            <i className="fas fa-star" style={{ color: 'var(--accent)' }} /> إعلانات مميزة
          </div>
          <div className="slider-wrap">
            <div className="slider-track">
              {featured.map((ad) => (
                <div key={ad.id} className="slider-card" onClick={() => onOpen(ad.id)} style={{ cursor: 'pointer' }}>
                  {ad.images && ad.images.length > 0 ? (
                    <img className="img" src={ad.images[0]} alt={ad.title} loading="lazy" />
                  ) : (
                    <div className="img"><i className={`fas ${catIcon(ad.category)}`} /></div>
                  )}
                  <div className="body">
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ad.title}
                    </div>
                    <div className="price">{formatPrice(ad.price, ad.currency)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {ad.customArea || ad.area} • {timeAgo(ad.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="section-head">
        <h2>{activeCat ? `إعلانات: ${activeCat}` : 'أحدث الإعلانات'}</h2>
      </div>
      <div className="container">
        {loading && page === 0 ? (
          <div className="spinner" />
        ) : ads.length === 0 ? (
          <div className="empty">
            <i className="fas fa-box-open" />
            <p>لا توجد إعلانات مطابقة</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openCreate}>
              أضف أول إعلان
            </button>
          </div>
        ) : (
          <>
            <div className="ads-grid">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} onOpen={onOpen} onFav={toggleFav} favBtn />
              ))}
            </div>
            {ads.length < total && <div ref={loadMoreRef} style={{ height: 40 }} />}
          </>
        )}
      </div>
    </>
  );
}

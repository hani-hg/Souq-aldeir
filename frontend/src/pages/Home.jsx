/** تصميم سوق الحي الواثق: البحث هو البطل، مع نتائج قابلة للمسح السريع وحالات مرئية صادقة. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import AdCard from '../components/AdCard.jsx';
import { catIcon } from '../components/Header.jsx';
import { formatPrice, timeAgo } from '../utils.js';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const HERO_IMAGE = '/assets/souq-aldeir-riverfront-hero.jpg';
const FEATURE_IMAGE = '/assets/souq-aldeir-marketplace-lifestyle.jpg';
const SORTS = [{ value: 'newest', label: 'الأحدث أولاً' }, { value: 'price_asc', label: 'السعر: الأقل' }, { value: 'price_desc', label: 'السعر: الأعلى' }, { value: 'views', label: 'الأكثر مشاهدة' }];

export default function Home({ onOpen, onAuth, openCreate }) {
  const { user } = useAuth();
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
  const [draftFilters, setDraftFilters] = useState({ area: '', min: '', max: '' });
  const [appliedFilters, setAppliedFilters] = useState({ area: '', min: '', max: '' });
  const adsRef = useRef([]);
  const requestRef = useRef(0);
  const loadMoreRef = useRef(null);
  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;
  const PAGE_SIZE = 24;
  useEffect(() => { adsRef.current = ads; }, [ads]);

  useEffect(() => {
    api.get('/api/ads/categories').then(setCategories).catch(() => {});
    api.get('/api/ads/areas').then(setAreas).catch(() => {});
    api.get('/api/ads/featured').then((data) => setFeatured(data.ads || [])).catch(() => {});
    api.get('/api/stats').then(setStats).catch(() => {});
  }, []);

  const loadAds = useCallback(async ({ reset = false } = {}) => {
    const requestId = ++requestRef.current;
    setLoading(true);
    const params = new URLSearchParams({ sort, limit: String(PAGE_SIZE), offset: String(reset ? 0 : adsRef.current.length) });
    if (search.trim()) params.set('search', search.trim());
    if (activeCat) params.set('cat', activeCat);
    if (appliedFilters.area) params.set('area', appliedFilters.area);
    if (appliedFilters.min) params.set('min', appliedFilters.min);
    if (appliedFilters.max) params.set('max', appliedFilters.max);
    try {
      const data = await api.get(`/api/ads?${params.toString()}`);
      if (requestId !== requestRef.current) return;
      setAds((current) => reset ? data.ads : [...current, ...data.ads.filter((next) => !current.some((old) => old.id === next.id))]);
      setTotal(data.total || 0);
    } catch (error) {
      if (requestId === requestRef.current) toast(error.message || 'تعذر تحميل الإعلانات', 'error');
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [activeCat, appliedFilters, search, sort]);

  useEffect(() => {
    const timer = window.setTimeout(() => loadAds({ reset: true }), search.trim() ? 320 : 0);
    return () => window.clearTimeout(timer);
  }, [loadAds, search]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !loading && adsRef.current.length < total) loadAds(); }, { rootMargin: '240px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [loading, total, loadAds]);

  async function toggleFav(ad) {
    if (!user) return onAuth();
    try {
      const data = await api.post(`/api/ads/${ad.id}/favorite`);
      setAds((items) => items.map((item) => item.id === ad.id ? { ...item, isFavorite: data.isFavorite } : item));
      setFeatured((items) => items.map((item) => item.id === ad.id ? { ...item, isFavorite: data.isFavorite } : item));
    } catch (error) { toast(error.message, 'error'); }
  }

  function resetFilters() { const empty = { area: '', min: '', max: '' }; setDraftFilters(empty); setAppliedFilters(empty); }
  function applyAdvanced() { setAppliedFilters({ ...draftFilters }); setShowAdvanced(false); }

  return <>
    <section className="market-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,44,71,.96) 0%, rgba(8,44,71,.88) 39%, rgba(8,44,71,.16) 72%), url(${HERO_IMAGE})` }}>
      <div className="hero-inner"><div className="hero-copy"><span className="eyebrow"><i className="fas fa-location-dot" /> دير الزور وما حولها</span><h1>كل ما تحتاجه،<br /><em>أقرب مما تتوقع.</em></h1><p>ابحث بين الإعلانات المحلية أو انشر ما لديك ليصل إلى المهتمين في منطقتك.</p></div><div className="hero-action-panel"><div className="search-bar"><i className="fas fa-magnifying-glass" /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && loadAds({ reset: true })} placeholder="ابحث عن سيارة، شقة، جهاز..." aria-label="ابحث في الإعلانات" /><button onClick={() => loadAds({ reset: true })}>بحث</button></div><button className="publish-cta" onClick={openCreate}><i className="fas fa-plus" /> انشر إعلانك</button></div></div>
    </section>
    <section className="market-context" aria-label="إحصاءات السوق"><div className="market-context-inner"><div className="context-note"><span className="live-dot" /> سوق محلي منظم لعرض وطلب يومك</div><div className="landing-stats"><div className="s"><b>{stats ? stats.ads : '—'}</b><span>إعلان منشور</span></div><div className="s"><b>{stats ? stats.users : '—'}</b><span>مستخدم مسجّل</span></div><div className="s"><b>{stats ? stats.visits : '—'}</b><span>زيارة</span></div></div></div></section>
    <section className="browse-shell"><div className="cats-heading"><span>تصفح حسب الفئة</span><small>اختر ما تبحث عنه</small></div><div className="cats-scroll" role="tablist" aria-label="فئات الإعلانات"><button className={`cat-chip ${activeCat === null ? 'active' : ''}`} onClick={() => setActiveCat(null)}><i className="fas fa-layer-group" /> الكل</button>{categories.map((category) => <button key={category} className={`cat-chip ${activeCat === category ? 'active' : ''}`} onClick={() => setActiveCat(category === activeCat ? null : category)}><i className={`fas ${catIcon(category)}`} /> {category}</button>)}</div><div className="results-toolbar"><div className="results-title"><span className="results-number">{total}</span><div><strong>{activeCat ? `إعلانات ${activeCat}` : 'نتائج السوق'}</strong><small>{search ? `نتائج البحث عن «${search}»` : 'أحدث ما نُشر في منطقتك'}</small></div></div><div className="results-controls"><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="ترتيب النتائج">{SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><button className={`filter-toggle ${activeFilterCount ? 'applied' : ''}`} onClick={() => setShowAdvanced((value) => !value)}><i className="fas fa-sliders" /> تصفية {activeFilterCount ? <span>{activeFilterCount}</span> : null}</button></div></div>{showAdvanced && <div className="advanced-filters"><label><span>المنطقة</span><select value={draftFilters.area} onChange={(event) => setDraftFilters({ ...draftFilters, area: event.target.value })}><option value="">كل المناطق</option>{areas.map((area) => <option key={area} value={area}>{area}</option>)}</select></label><label><span>السعر من</span><input type="number" min="0" placeholder="مثال: 500000" value={draftFilters.min} onChange={(event) => setDraftFilters({ ...draftFilters, min: event.target.value })} /></label><label><span>السعر إلى</span><input type="number" min="0" placeholder="مثال: 2000000" value={draftFilters.max} onChange={(event) => setDraftFilters({ ...draftFilters, max: event.target.value })} /></label><div className="advanced-actions"><button className="apply" onClick={applyAdvanced}>تطبيق</button><button className="clear" onClick={resetFilters}>مسح الكل</button></div></div>}</section>
    {featured.length > 0 && <section className="featured-rail"><div className="section-title"><span><i className="fas fa-star" /> اختيارات مميزة</span><small>إعلانات ذات أولوية في السوق</small></div><div className="slider-wrap"><div className="slider-track">{featured.map((ad) => <button key={ad.id} className="slider-card" onClick={() => onOpen(ad.id)}><div className="slider-thumb" style={{ backgroundImage: `linear-gradient(0deg, rgba(4,40,67,.76), transparent 65%), url(${ad.images && ad.images[0] ? ad.images[0] : FEATURE_IMAGE})` }}><span>إعلان مميز</span><strong>{Number(ad.price) > 0 ? formatPrice(ad.price, ad.currency) : 'السعر عند التواصل'}</strong></div><div className="body"><b>{ad.title}</b><small><i className="fas fa-location-dot" /> {ad.customArea || ad.area} <span>•</span> {timeAgo(ad.createdAt)}</small></div></button>)}</div></div></section>}
    <main className="list-section">{loading && ads.length === 0 ? <div className="loading-grid" aria-label="جاري تحميل الإعلانات"><span /><span /><span /><span /></div> : ads.length === 0 ? <div className="empty"><i className="fas fa-magnifying-glass" /><h2>لا توجد إعلانات مطابقة الآن</h2><p>جرّب تغيير الكلمات أو إزالة بعض عوامل التصفية، أو كن أول من ينشر في هذه الفئة.</p><div><button className="btn btn-ghost" onClick={resetFilters}>مسح التصفية</button><button className="btn btn-primary" onClick={openCreate}>أضف إعلاناً</button></div></div> : <div className="ads-grid">{ads.map((ad) => <AdCard key={ad.id} ad={ad} onOpen={onOpen} onFav={toggleFav} favBtn />)}</div>}{ads.length < total && <div ref={loadMoreRef} className="load-more-sentinel">{loading && ads.length > 0 ? <span className="inline-loader">يتم تحميل المزيد…</span> : null}</div>}</main>
  </>;
}

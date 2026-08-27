/** تصميم مرجع الأثاث العصري: لوحة مميزة عريضة، داكنة، ذات انتقال هادئ وتحكم يدوي كامل. */
import { useEffect, useState } from 'react';
import { formatPrice } from '../utils.js';

const FALLBACK_IMAGE = '/assets/souq-aldeir-marketplace-lifestyle.jpg';

export default function FeaturedShowcase({ ads, onOpen, interval = 3 }) {
  const [active, setActive] = useState(0);
  const total = ads.length;
  const safeIndex = total ? active % total : 0;
  const current = ads[safeIndex];

  useEffect(() => { setActive(0); }, [total]);
  useEffect(() => {
    if (total < 2) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % total), Math.max(3, Number(interval) || 3) * 1000);
    return () => window.clearInterval(timer);
  }, [total, interval]);

  if (!current) return null;
  const price = Number(current.price) > 0 ? formatPrice(current.price, current.currency) : 'السعر عند التواصل';
  const image = current.images && current.images[0] ? current.images[0] : FALLBACK_IMAGE;

  return <section className="featured-showcase" aria-label="الإعلانات المميزة">
    <div className="showcase-kicker"><span><i className="fas fa-crown" /> مختارات السوق</span><small>إعلانات اختارها مدير السوق</small></div>
    <article className="showcase-card" key={current.id}>
      <img className="showcase-image" src={image} alt={current.title} />
      <div className="showcase-shade" />
      <div className="showcase-copy">
        <span className="showcase-badge"><i className="fas fa-star" /> إعلان مميز</span>
        <span className="showcase-category">{current.category || 'إعلان محلي'}</span>
        <h2>{current.title}</h2>
        <p><i className="fas fa-location-dot" /> {current.customArea || current.area || 'دير الزور'}</p>
        <strong>{price}</strong>
        <button onClick={() => onOpen(current.id)}><i className="fas fa-arrow-left" /> عرض الإعلان</button>
      </div>
      {total > 1 && <>
        <button className="showcase-arrow next" onClick={() => setActive((index) => (index + 1) % total)} aria-label="الإعلان المميز التالي"><i className="fas fa-chevron-right" /></button>
        <button className="showcase-arrow prev" onClick={() => setActive((index) => (index - 1 + total) % total)} aria-label="الإعلان المميز السابق"><i className="fas fa-chevron-left" /></button>
        <div className="showcase-dots" aria-label="انتقال بين الإعلانات المميزة">{ads.map((ad, index) => <button key={ad.id} className={index === safeIndex ? 'active' : ''} onClick={() => setActive(index)} aria-label={`عرض الإعلان ${index + 1}`} aria-current={index === safeIndex ? 'true' : undefined} />)}</div>
      </>}
    </article>
  </section>;
}

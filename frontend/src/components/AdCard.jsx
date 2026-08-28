/** تصميم سوق الحي الواثق: بطاقة معلوماتية ذات تسلسل واضح وصورة صادقة أو بديل فئوي. */
import { useState } from 'react';
import { formatPrice, timeAgo } from '../utils.js';
import { catIcon } from './Header.jsx';

export default function AdCard({ ad, onOpen, onFav, favBtn }) {
  const [imageFailed, setImageFailed] = useState(false);
  const img = ad.images && ad.images.length > 0 && !imageFailed ? ad.images[0] : null;
  const isFree = Boolean(ad.isFree || ad.priceType === 'free');
  const tag = ad.featured ? { cls: 'featured', label: 'مميز' } : isFree ? { cls: 'free', label: 'مجاني' } : null;

  return (
    <article className="ad-card" onClick={() => onOpen(ad.id)} role="button" tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && onOpen(ad.id)}>
      {img ? (
        <img className="img" src={img} alt={ad.title} loading="lazy" onError={() => setImageFailed(true)} />
      ) : (
        <div className="img ad-image-fallback"><i className={`fas ${catIcon(ad.category)}`} /><span>لا توجد صورة</span></div>
      )}
      {tag && <span className={`tag ${tag.cls}`}>{tag.label}</span>}
      {favBtn && (
        <button
          className={`fav-btn ${ad.isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onFav(ad);
          }}
          aria-label={ad.isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <i className="fas fa-heart" />
        </button>
      )}
      <div className="body">
        <div className="category-cue"><i className={`fas ${catIcon(ad.category)}`} /> {ad.category || 'إعلان محلي'}</div>
        <h3 className="title">{ad.title || 'إعلان بلا عنوان'}</h3>
        <div className={`price ${isFree ? 'price-free' : Number(ad.price) > 0 ? '' : 'price-unspecified'}`}>{isFree ? 'مجاني' : Number(ad.price) > 0 ? formatPrice(ad.price, ad.currency) : 'السعر عند التواصل'}</div>
        <div className="meta">
          <span><i className="fas fa-location-dot" /> {ad.customArea || ad.area || 'دير الزور'}</span>
          <span><i className="fas fa-clock" /> {timeAgo(ad.createdAt)}</span>
        </div>
        <button className="quick-offer" onClick={(e) => { e.stopPropagation(); onOpen(ad.id); }}><i className="fas fa-comment-dots" /> التواصل مع البائع</button>
      </div>
    </article>
  );
}

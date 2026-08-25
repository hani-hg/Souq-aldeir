import { formatPrice, timeAgo } from '../utils.js';
import { catIcon } from './Header.jsx';

export default function AdCard({ ad, onOpen, onFav, favBtn }) {
  const img = ad.images && ad.images.length > 0 ? ad.images[0] : null;
  const tag =
    ad.status === 'sold' ? { cls: 'sold', label: 'مُباع' }
    : ad.status === 'expired' ? { cls: 'expired', label: 'منتهي' }
    : ad.featured ? { cls: 'featured', label: 'مميز' }
    : null;

  return (
    <div className="ad-card" onClick={() => onOpen(ad.id)} style={{ cursor: 'pointer' }}>
      {img ? (
        <img className="img" src={img} alt={ad.title} loading="lazy" />
      ) : (
        <div className="img"><i className={`fas ${catIcon(ad.category)}`} /></div>
      )}
      {tag && <span className={`tag ${tag.cls}`}>{tag.label}</span>}
      {favBtn && (
        <button
          className={`fav-btn ${ad.isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onFav(ad);
          }}
          aria-label="مفضلة"
        >
          <i className={`fas ${ad.isFavorite ? 'fa-heart' : 'fa-heart'}`} style={{ color: ad.isFavorite ? 'inherit' : '' }} />
        </button>
      )}
      <div className="body">
        <div className="title">{ad.title}</div>
        <div className="price">{formatPrice(ad.price, ad.currency)}</div>
        <div className="meta">
          <span><i className="fas fa-location-dot" /> {ad.customArea || ad.area}</span>
          <span>{timeAgo(ad.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

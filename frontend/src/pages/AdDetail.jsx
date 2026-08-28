/** تصميم سوق الحي الواثق: تفاصيل صريحة تحمي دقة بيانات البائع والسعر قبل أي تواصل. */
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { formatPrice, timeAgo, formatDate, daysLeft } from '../utils.js';
import { catIcon } from '../components/Header.jsx';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function AdDetail({ id, onBack, onEdit, onContact, onAuth }) {
  const { user, settings } = useAuth();
  const [ad, setAd] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImgIdx(0);
    api.get(`/api/ads/${id}`)
      .then((d) => setAd(d.ad))
      .catch((e) => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!ad) {
    return (
      <div className="empty">
        <i className="fas fa-circle-exclamation" />
        <p>الإعلان غير موجود</p>
        <button className="btn btn-primary" onClick={onBack}>عودة للرئيسية</button>
      </div>
    );
  }

  const isOwner = user && user.id === ad.seller.id;
  const days = daysLeft(ad.expiresAt);
  const sellerSince = ad.seller.createdAt > 946684800000 ? `عضو منذ ${formatDate(ad.seller.createdAt)}` : 'عضو في سوق دير الزور';

  async function toggleFav() {
    if (!user) return onAuth();
    try {
      const d = await api.post(`/api/ads/${ad.id}/favorite`);
      setAd({ ...ad, isFavorite: d.isFavorite });
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/api/ads/${ad.id}`);
      toast('تم حذف الإعلان', 'success');
      onBack();
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function toggleSold() {
    try {
      const d = await api.post(`/api/ads/${ad.id}/sold`);
      setAd({ ...ad, status: d.status });
      toast(d.status === 'sold' ? 'تم وضع الإعلان كمُباع' : 'تم إعادة تفعيل الإعلان', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function renew() {
    try {
      await api.post(`/api/ads/${ad.id}/renew`);
      toast('تم تجديد الإعلان', 'success');
      const d = await api.get(`/api/ads/${ad.id}`);
      setAd(d.ad);
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  async function report() {
    if (!user) return onAuth();
    const reason = prompt('سبب الإبلاغ عن هذا الإعلان:');
    if (reason === null) return;
    try {
      await api.post(`/api/ads/${ad.id}/report`, { reason });
      toast('تم إرسال البلاغ، شكراً لك', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
  }

  return (
    <div className="detail-page">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 10 }}>
        <i className="fas fa-arrow-right" /> عودة
      </button>

      <div className="detail-hero">
        {ad.images.length > 0 ? (
          <img className="detail-img" src={ad.images[imgIdx]} alt={ad.title} />
        ) : (
          <div className="detail-img"><i className={`fas ${catIcon(ad.category)}`} /></div>
        )}
        {ad.images.length > 1 && (
          <div className="detail-thumbs">
            {ad.images.map((im, i) => (
              <img
                key={i}
                src={im}
                alt=""
                className={i === imgIdx ? 'active' : ''}
                onClick={() => setImgIdx(i)}
              />
            ))}
          </div>
        )}
        {ad.video && (
          <div style={{ padding: 12 }}>
            <video src={ad.video} controls style={{ width: '100%', borderRadius: 10 }} />
          </div>
        )}
        <div className="detail-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <h1 className="detail-title">{ad.title}</h1>
            <button
              className={`btn btn-sm ${ad.isFavorite ? 'btn-danger' : 'btn-ghost'}`}
              onClick={toggleFav}
            >
              <i className="fas fa-heart" />
            </button>
          </div>
          <div className="detail-price">{Number(ad.price) > 0 ? formatPrice(ad.price, ad.currency) : 'السعر عند التواصل'}</div>
          {ad.status === 'sold' && <span className="pill sold">مُباع</span>}
          {ad.status === 'expired' && <span className="pill expired">منتهي — يحتاج تجديد</span>}
          <div className="detail-meta">
            <span><i className="fas fa-folder" /> {ad.category}</span>
            <span><i className="fas fa-location-dot" /> {ad.customArea || ad.area}</span>
            <span><i className="fas fa-eye" /> {ad.views} مشاهدة</span>
            <span><i className="fas fa-clock" /> {timeAgo(ad.createdAt)}</span>
            <span><i className="fas fa-calendar" /> ينتهي خلال {days} يوم</span>
          </div>
        </div>
      </div>

      <div className="detail-desc">
        <h3>وصف الإعلان</h3>
        <p>{ad.description}</p>
      </div>

      <div className="seller-card">
        <div className="ava">{ad.seller.name.slice(0, 1)}</div>
        <div className="info">
          <b>{ad.seller.name}</b>
          <span>{sellerSince}</span>
        </div>
        {!isOwner && (
          <button className="btn btn-primary btn-sm" onClick={() => onContact(ad)}>
            <i className="fas fa-comment-dots" /> راسل البائع
          </button>
        )}
      </div>

      {!isOwner ? (
        <div className="contact-actions">
          <a className="btn btn-success" href={`tel:${ad.phone}`}>
            <i className="fas fa-phone" /> اتصل: {ad.phone}
          </a>
          <button className="btn btn-ghost" onClick={report}>
            <i className="fas fa-flag" /> إبلاغ
          </button>
        </div>
      ) : (
        <div className="owner-actions">
          <button className="btn btn-primary" onClick={() => onEdit(ad)}>
            <i className="fas fa-pen" /> تعديل
          </button>
          <button className={`btn ${ad.status === 'sold' ? 'btn-success' : 'btn-accent'}`} onClick={toggleSold}>
            <i className="fas fa-check" /> {ad.status === 'sold' ? 'إعادة للبيع' : 'تم البيع'}
          </button>
          {ad.status !== 'expired' && (
            <button className="btn btn-ghost" onClick={renew}>
              <i className="fas fa-rotate" /> تجديد
            </button>
          )}
          {confirmDel ? (
            <>
              <button className="btn btn-danger" onClick={handleDelete}>تأكيد الحذف</button>
              <button className="btn btn-ghost" onClick={() => setConfirmDel(false)}>إلغاء</button>
            </>
          ) : (
            <button className="btn btn-outline-danger" onClick={() => setConfirmDel(true)}>
              <i className="fas fa-trash" /> حذف
            </button>
          )}
        </div>
      )}
    </div>
  );
}

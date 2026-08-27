/** مرجع السوق الأزرق: تذييل تماس مباشر وواضح يربط المستخدم بإدارة السوق. */
const ADMIN_WHATSAPP = '12087630327';
export default function MarketFooter({ settings }) {
  const whatsapp = ADMIN_WHATSAPP;
  return <footer className="market-footer"><div className="footer-brand"><span className="footer-icon"><i className="fas fa-recycle" /></span><div><strong>سوق دير الزور</strong><small>منصة محلية للشراء والبيع المستعمل</small></div></div><div className="footer-contact"><span>تحتاج مساعدة في إعلانك؟</span><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp" /> واتساب الإدارة: +1 (208) 763-0327</a></div><p>سوق دير الزور وسيط لعرض الإعلانات، والتواصل والاتفاق يتمان مباشرة بين البائع والمشتري.</p></footer>;
}

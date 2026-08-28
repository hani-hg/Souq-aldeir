/** مرجع السوق الأزرق: تذييل تماس مباشر وواضح يربط المستخدم بإدارة السوق. */
const ADMIN_PHONE = '+12087630327';
export default function MarketFooter() {
  return <footer className="market-footer"><div className="footer-brand"><span className="footer-icon"><i className="fas fa-recycle" /></span><div><strong>سوق دير الزور</strong><small>منصة محلية للشراء والبيع المستعمل</small></div></div><div className="footer-contact"><span>تحتاج مساعدة في إعلانك؟</span><a href={`tel:${ADMIN_PHONE}`} dir="ltr"><i className="fas fa-phone" /> تواصل مع الإدارة: +1 (208) 763-0327</a></div><p>سوق دير الزور وسيط لعرض الإعلانات، والتواصل والاتفاق يتمان مباشرة بين البائع والمشتري.</p></footer>;
}

/** مرجع السوق الأزرق: رمز QR صغير بجانب الإضافة، يفتح بطاقة تثبيت واضحة بدلاً من محاولة تثبيت غير مسموح بها. */
import { QRCodeSVG } from 'qrcode.react';
import Modal from './Modal.jsx';

export default function InstallQr({ onClose }) {
  const url = window.location.origin;
  return <Modal title="أضف السوق إلى هاتفك" onClose={onClose}><div className="install-qr-modal"><div className="qr-tile"><QRCodeSVG value={url} size={188} level="M" includeMargin /></div><h3>امسح الرمز لفتح سوق دير الزور</h3><p>افتح الرابط من هاتفك، ثم اختر «تثبيت» في Chrome أو «إضافة إلى الشاشة الرئيسية» في Safari.</p><small>لأمانك، يطلب المتصفح تأكيد التثبيت ولا يمكن تثبيته تلقائياً.</small></div></Modal>;
}

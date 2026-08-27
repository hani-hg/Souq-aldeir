/** تصميم سوق الحي الواثق: دعوة تثبيت هادئة وعملية على الهاتف، بعيداً عن مسار البحث والبيع. */
import { useEffect, useState } from 'react';

const DISMISS_KEY = 'souq-install-dismissed-until';

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (isStandalone() || Number(localStorage.getItem(DISMISS_KEY)) > Date.now()) return;
    const ua = window.navigator.userAgent;
    setIos(/iPad|iPhone|iPod/.test(ua) && !window.MSStream);
    const showInstall = (event) => { event.preventDefault(); setInstallEvent(event); setVisible(true); };
    const installed = () => { setInstallEvent(null); setVisible(false); };
    const setOnline = () => setOffline(false);
    const setOfflineMode = () => setOffline(true);
    window.addEventListener('beforeinstallprompt', showInstall);
    window.addEventListener('appinstalled', installed);
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOfflineMode);
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) setVisible(true);
    return () => {
      window.removeEventListener('beforeinstallprompt', showInstall);
      window.removeEventListener('appinstalled', installed);
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOfflineMode);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 7));
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome !== 'accepted') dismiss();
    setInstallEvent(null);
  };

  if (offline) return <div className="offline-notice" role="status"><i className="fas fa-wifi" /> أنت دون اتصال — يمكنك تصفح ما حُفِظ على جهازك.</div>;
  if (!visible) return null;

  return <aside className="install-prompt" aria-label="تثبيت تطبيق سوق دير الزور">
    <img src="/assets/market-icon-192.png" alt="" />
    <div><strong>افتح السوق كتطبيق</strong><span>{ios && !installEvent ? 'من زر المشاركة اختر «إضافة إلى الشاشة الرئيسية».' : 'تصفّح أسرع، وعودة سهلة إلى السوق من الشاشة الرئيسية.'}</span></div>
    {installEvent && <button className="install-action" onClick={install}>تثبيت</button>}
    <button className="install-dismiss" onClick={dismiss} aria-label="إغلاق دعوة التثبيت"><i className="fas fa-xmark" /></button>
  </aside>;
}

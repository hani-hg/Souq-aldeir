/* Firebase Cloud Messaging for web/PWA.
   The public VAPID key is intentionally configurable; never place a private key here. */
const FCM_VAPID_KEY = window.SOUQ_FCM_VAPID_KEY || '';
let fcmMessaging = null;

async function enablePushNotifications() {
  if (!currentUser || !FCM_VAPID_KEY || !('Notification' in window) || !('serviceWorker' in navigator)) {
    showToast('إشعارات المتصفح تحتاج تفعيل مفتاح Web Push من إعدادات Firebase', 'bad');
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      showToast('لم يتم السماح بإشعارات المتصفح', 'bad');
      return false;
    }
    if (!firebase.messaging.isSupported()) throw new Error('fcm-not-supported');
    fcmMessaging = firebase.messaging();
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await fcmMessaging.getToken({ vapidKey: FCM_VAPID_KEY, serviceWorkerRegistration: registration });
    if (!token) throw new Error('fcm-token-empty');
    await db.collection('users').doc(currentUser.uid).update({ fcmTokens: firebase.firestore.FieldValue.arrayUnion(token) });
    fcmMessaging.onMessage(payload => {
      const title = payload.notification?.title || payload.data?.title || 'إشعار جديد';
      const body = payload.notification?.body || payload.data?.body || '';
      showToast(`${title}${body ? `: ${body}` : ''}`, 'ok');
    });
    showToast('تم تفعيل إشعارات المتصفح', 'ok');
    return true;
  } catch (error) {
    console.warn('FCM registration failed:', error?.message || error);
    showToast('تعذر تفعيل الإشعارات على هذا الجهاز', 'bad');
    return false;
  }
}

async function sendPushNotification(targetUserId, kind, title, body, link, chatId = '') {
  if (!currentUser || !targetUserId || !body) return;
  try {
    const token = await currentUser.getIdToken();
    await fetch('/api/send-notification', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ targetUserId, kind, title, body, link, chatId })
    });
  } catch (_) { /* in-app notification remains available if push is unavailable */ }
}

function maybeOfferPushNotifications() {
  if (currentUser && FCM_VAPID_KEY && 'Notification' in window && Notification.permission === 'default') {
    const banner = document.getElementById('pushPermissionBtn');
    if (banner) banner.style.display = 'inline-flex';
  }
}

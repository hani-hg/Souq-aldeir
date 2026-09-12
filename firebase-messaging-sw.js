/* Firebase Cloud Messaging background worker for Souq-aldeir PWA. */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAlFgTzlcbaS6NKKlqyOvrxYAnKmxXLTLQ',
  authDomain: 'souq-aldeir.firebaseapp.com',
  projectId: 'souq-aldeir',
  storageBucket: 'souq-aldeir.firebasestorage.app',
  messagingSenderId: '153018999224',
  appId: '1:153018999224:web:ddfb7660584941091f6f4d'
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
  const notification = payload.notification || payload.data || {};
  return self.registration.showNotification(notification.title || 'سوق دير الزور', {
    body: notification.body || 'لديك إشعار جديد',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { link: notification.click_action || '/' }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const link = event.notification.data?.link || '/';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const existing = list.find(client => 'focus' in client);
    return existing ? existing.focus() : clients.openWindow(link);
  }));
});

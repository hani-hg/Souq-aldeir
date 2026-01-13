// Service Worker لتطبيق سوق دير الزور
const CACHE_NAME = 'souq-dear-pwa-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// التثبيت
self.addEventListener('install', event => {
  console.log('📦 Service Worker: جاري التثبيت...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Service Worker: تم تخزين الملفات في الكاش');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// التنشيط
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: جاري التنشيط...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Service Worker: حذف الكاش القديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// طلب الملفات
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد في الكاش
        if (response) {
          return response;
        }
        
        // وإلا حمّل من الإنترنت
        return fetch(event.request)
          .then(response => {
            // لا نخزن إلا الطلبات الناجحة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // إذا فشل الاتصال
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// رسالة للصفحة
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

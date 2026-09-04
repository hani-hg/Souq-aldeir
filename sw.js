/* ============================================================
   sw.js — Service Worker for سوق دير الزور PWA
   Strategy: Cache-first for static assets, network-first for data.
   ============================================================ */

const CACHE = 'souq-aldeir-v9-manus-icon';
const STATIC = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/firebase-config.js',
  '/js/utils.js',
  '/js/slider.js',
  '/js/modal.js',
  '/js/toast.js',
  '/js/ads.js',
  '/js/auth.js',
  '/js/chat.js',
  '/js/share.js',
  '/js/admin.js',
  '/js/app.js',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json'
];

/* ── Install: pre-cache static shell ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: remove old caches ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first for static, network-first for Firebase/Cloudinary ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and Firebase / Cloudinary (always fresh)
  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('firestore') || url.hostname.includes('firebase') ||
      url.hostname.includes('cloudinary') || url.hostname.includes('googleapis.com/identitytoolkit')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => {
        if (cached) return cached;
        if (e.request.mode === 'navigate') return caches.match('/index.html');
        return Response.error();
      });
      return cached || network;
    })
  );
});

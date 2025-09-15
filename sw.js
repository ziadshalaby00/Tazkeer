const CACHE_NAME = 'tazkeer-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/app.js',
  '/using-fontawesome/css/all.min.css',
  '/using-fontawesome/webfonts/fa-solid-900.woff2',
  '/using-fontawesome/webfonts/fa-regular-400.woff2',
  '/using-fontawesome/webfonts/fa-brands-400.woff2',
  '/favicon_io/favicon.ico'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// جلب الطلبات من الشبكة أو من الذاكرة المؤقتة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع الملف من الذاكرة المؤقتة إذا كان موجوداً
        if (response) {
          return response;
        }

        // إذا لم يكن موجوداً، جلبها من الشبكة
        return fetch(event.request).then(response => {
          // التحقق من أن الاستجابة صالحة
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // استنساخ الاستجابة
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
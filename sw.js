const CACHE_NAME = 'tazkeer-v1';

const BASE_PATH = '/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'style.css',
  BASE_PATH + 'main.js',
  BASE_PATH + 'using-fontawesome/css/all.min.css',
  BASE_PATH + 'using-fontawesome/webfonts/fa-brands-400.woff2',
  BASE_PATH + 'using-fontawesome/webfonts/fa-regular-400.woff2',
  BASE_PATH + 'using-fontawesome/webfonts/fa-solid-900.woff2',
  BASE_PATH + 'using-fontawesome/webfonts/fa-v4compatibility.woff2',
  BASE_PATH + 'favicon_io/favicon.ico',
  BASE_PATH + 'android-chrome-192x192.png',
  BASE_PATH + 'android-chrome-512x512.png'
];


// تثبيت Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('Opening cache and adding files...');
        for (const url of urlsToCache) {
          try {
            console.log('Caching:', url);
            await cache.add(url);
          } catch (err) {
            console.error('❌ Failed to cache:', url, err);
          }
        }
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
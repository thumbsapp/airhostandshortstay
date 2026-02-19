// service-worker.js
const CACHE_NAME = 'ahss-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/search.html',
  '/property.html',
  '/compare.html',
  '/dashboard-host.html',
  '/dashboard-guest.html',
  '/dispute-center.html',
  '/css/main.css',
  '/css/layout.css',
  '/css/responsive.css',
  '/js/core/app.js',
  '/js/core/config.js',
  '/js/data/mock-data.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
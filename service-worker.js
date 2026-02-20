// /service-worker.js
const CACHE_NAME = 'ahss-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/pages/search.html',
    '/pages/property.html',
    '/pages/compare.html',
    '/pages/dashboard-host.html',
    '/pages/dashboard-guest.html',
    '/pages/dispute-center.html',
    '/css/main.css',
    '/css/layout.css',
    '/css/responsive.css',
    '/css/map.css',
    '/css/incentives.css',
    '/css/comparison.css',
    '/css/animations.css',
    '/css/pricing.css',
    '/css/services.css',
    '/css/fraud.css',
    '/css/search-advanced.css',
    '/js/core/config.js',
    '/js/core/constants.js',
    '/js/core/app.js',
    '/js/core/router.js',
    '/js/core/state-manager.js',
    '/js/data/mock-data.js',
    '/js/data/data.js',
    '/js/data/api-adapter.js',
    '/js/data/caching.js',
    '/js/listings/listings.js',
    '/js/listings/listing-card.js',
    '/js/listings/price-transparency.js',
    '/js/listings/badges.js',
    '/js/map/map.js',
    '/js/map/clustering.js',
    '/js/map/geo-sync.js',
    '/js/incentives/incentive.ui.js',
    '/js/wishlist/wishlist.js',
    '/js/comparison/comparison.js',
    '/js/comparison/comparison-ui.js',
    '/js/payments/negotiation.js',
    '/js/payments/lipa-mdogo.js',
    '/js/ui/modals.js',
    '/js/ui/toasts.js',
    '/js/ui/assistant.js',
    '/js/ui/loader.js',
    '/js/ui/animations.js',
    '/discovery/hot-homes-engine/urgency-timer.js',
    '/discovery/hot-homes-engine/scarcity-logic.js',
    '/components/property-preview/property-preview.js',
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
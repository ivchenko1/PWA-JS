const cacheName = 'my-cache-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/images/pwa-icon-128.png',
                '/images/pwa-icon-192.png',
                '/images/cat-meme1.jpg',
                '/images/cat-meme2.jpg',
                '/pages/about.html',
                '/pages/memes.html',
                '/js/main.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

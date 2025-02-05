const cacheName = 'piac-pwa-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/meme.html',      // nowa podstrona
  '/style.css',
  '/js/main.js',
  '/js/meme.js',     // jeśli korzystasz z dodatkowego skryptu
  '/images/pwa-icon-128.png',
  '/images/pwa-icon-144.png',
  '/images/pwa-icon-192.png',
  '/images/pwa-icon-256.png',
  '/images/pwa-icon-512.png',
  '/images/cat-meme1.jpg',
  '/images/cat-meme2.jpg',
  // Dodaj inne zasoby (np. plik JSON) jeśli są potrzebne:
  // '/data/memes.json'
];

// Instalacja Service Workera i zapisanie plików do cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(filesToCache);
      })
  );
});

// Pobieranie zasobów – najpierw sprawdzamy pamięć podręczną
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Zwróć cache lub wykonaj zapytanie sieciowe
      return response || fetch(event.request).then((fetchResponse) => {
        // Dynamiczne buforowanie tylko dla metod GET
        if (event.request.method === 'GET') {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Jeśli użytkownik jest offline i żądanie dotyczy nawigacji, zwróć index.html
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

// Aktywacja Service Workera i usuwanie starego cache
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


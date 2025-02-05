const cacheName = 'my-cache-v1'; // Переменная для хранения имени кеша

self.addEventListener('install', (event) => {
  // Устанавливаем сервис-воркер и кешируем ресурсы
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll([
        '/index.html',
        '/style.css',
        '/script.js',
        // Добавьте другие ресурсы, которые должны быть закешированы при установке
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Активируем сервис-воркер
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(cacheName).then((cache) => {
          cache.put(event.request, fetchResponse.clone()); // Добавляем ответ в кеш
          return fetchResponse; // Возвращаем ответ из сети
        });
      });
    }).catch(() => {
      // Резервный вариант, если нет соединения с интернетом
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html'); // Возвращаем главную страницу, если нет соединения
      }
    })
  );
});

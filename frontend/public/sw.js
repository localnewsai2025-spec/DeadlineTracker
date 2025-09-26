// Service Worker для push-сповіщень
const CACHE_NAME = 'deadline-tracker-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

// Встановлення Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кеш відкрито');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активація Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Видаляємо старий кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обробка fetch запитів
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Повертаємо кешовану версію або робимо запит
        return response || fetch(event.request);
      })
  );
});

// Обробка push-сповіщень
self.addEventListener('push', (event) => {
  console.log('Push-повідомлення отримано:', event);

  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'Нове сповіщення',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Відкрити',
        icon: '/favicon.ico',
      },
      {
        action: 'close',
        title: 'Закрити',
        icon: '/favicon.ico',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'DeadlineTracker', options)
  );
});

// Обробка кліків по сповіщеннях
self.addEventListener('notificationclick', (event) => {
  console.log('Клік по сповіщенню:', event);

  event.notification.close();

  if (event.action === 'open') {
    // Відкриваємо додаток
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Просто закриваємо сповіщення
    return;
  } else {
    // За замовчуванням відкриваємо додаток
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Обробка повідомлень від основного потоку
self.addEventListener('message', (event) => {
  console.log('Повідомлення отримано в Service Worker:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

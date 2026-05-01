const CACHE_NAME = 'neurotests-v1';

// Assets to cache on install
const PRECACHE = [
  '/',
  '/favicon.svg',
  '/icons.svg',
];

// Install — precache shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first for navigations, cache-first for assets
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  // Navigation requests: network-first
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  if (request.url.match(/\.(js|css|svg|png|woff2?)(\?|$)/)) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        });
      })
    );
    return;
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('/');
    })
  );
});

// Listen for messages from main thread
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SCHEDULE_STREAK_REMINDER') {
    const { delayMs, streak } = e.data;
    setTimeout(() => {
      self.registration.showNotification('NeuroTests Pro', {
        body: streak > 0
          ? `Llevas ${streak} días de racha. No la pierdas, haz tu test diario.`
          : 'Tu cerebro necesita ejercicio. Haz tu chequeo diario.',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'streak-reminder',
        renotify: true,
        data: { url: '/' },
      });
    }, delayMs);
  }

  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

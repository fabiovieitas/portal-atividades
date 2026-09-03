const CACHE_NAME = 'portal-lab-v7';
const POU_CACHE_NAME = 'portal-lab-v7-pou';

const STATIC_ASSETS = [
  '/',
  '/img/logo-prof.png',
  '/css/style.css',
  '/js/app-enhancements.js',
  '/js/avatar_system.js',
  '/manifest.json',
  '/games/pou-online/index.html',
  '/games/pou-online/pou.min.js',
  '/games/pou-online/version.js',
  '/games/pou-online/assets/css/app.css',
  '/games/pou-online/assets/icon.jpeg'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME && key !== POU_CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // 1. Network-First com Fallback para Cache para Jogos HTML5 Locais (Pou Online e Assets)
  if (url.pathname.startsWith('/games/pou-online/')) {
    e.respondWith(
      fetch(e.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(POU_CACHE_NAME).then(cache => cache.put(e.request, resClone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(e.request);
      })
    );
    return;
  }


  // 2. Stale-While-Revalidate para Mídias, Áudios, Fontes, JSONs, CSS e Scripts
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|woff2?|ttf|otf|eot|ogg|mp3|m4a|json)$/i)) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(e.request).then(cachedResponse => {
          const fetchPromise = fetch(e.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Network-First para páginas HTML/EJS dinâmicas com fallback para cache offline
  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (response.status === 200) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});

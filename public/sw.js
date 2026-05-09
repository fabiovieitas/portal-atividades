const CACHE_NAME = 'portal-lab-v3';

// Remover assets estáticos da raiz para evitar cache eterno da index
const assets = [
  '/img/logo-prof.png'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // Força a atualização imediata
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', e => {
  // Limpa os caches antigos (v1, v2, etc)
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', e => {
  // Estratégia Network First (Busca na rede, se falhar pega do cache)
  e.respondWith(
    fetch(e.request).then(response => {
      // Se a rede funcionou, atualiza o cache silenciosamente (opcional, mas bom pra offline)
      if (e.request.method === 'GET') {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
      }
      return response;
    }).catch(() => {
      // Se a rede falhar (offline), busca no cache
      return caches.match(e.request);
    })
  );
});

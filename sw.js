const CACHE_NAME = 'Saldo-network-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      // Always ask the server first so changes to index.html are picked up.
      const response = await fetch(event.request, { cache: 'no-store' });
      if (response && response.ok && event.request.destination !== 'document') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, copy)).catch(() => {});
      }
      return response;
    } catch (err) {
      const cached = await caches.match(event.request);
      return cached || Response.error();
    }
  })());
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// Versão simples: sem cache offline (sempre online).
// Depois, se você quiser, eu coloco cache offline aqui.
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

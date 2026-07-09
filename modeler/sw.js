const CACHE_NAME = "microcd-modeller-pwa-v3";
const APP_SHELL = [
  "/modeler/index.html?v=pwa-v1",
  "/modeler/app/index.html?v=pwa-v1",
  "/modeler/app.html?v=pwa-v1",
  "/modeler/assets/index-D0KmHFoL.css",
  "/modeler/assets/index-Dqs6NZ9t.js",
  "/modeler/manifest.webmanifest",
  "/modeler/icon.svg",
  "/modeler/icon-192.png",
  "/modeler/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith("/modeler/")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          const responseCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
          return networkResponse;
        })
        .catch(() => caches.match("/modeler/index.html?v=pwa-v1"));
    })
  );
});

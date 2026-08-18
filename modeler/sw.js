const CACHE = "microcd-modeler-v2.0.0-beta.1";
const CORE = [
  "/modeler/", "/modeler/index.html", "/modeler/workspace.css", "/modeler/modeler.js",
  "/assets/scientific-ui.css", "/assets/scientific-ui.js", "/modeler/icon-192.png", "/modeler/icon-512.png"
];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then((response) => { const copy=response.clone();caches.open(CACHE).then((cache)=>cache.put(event.request,copy));return response; }).catch(() => caches.match(event.request).then((response) => response || caches.match("/modeler/"))));
});

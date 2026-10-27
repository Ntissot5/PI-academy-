// Pi Academy : garde le site en cache pour qu'il s'ouvre même sans réseau.
// Jamais de cache pour /api et /_ (données et administration) : elles restent toujours à jour et privées.
const VERSION = "pi-v1";
const STATIQUE = /^\/(_next\/static|icons|fonts)\//;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_/")) return;

  // Fichiers du build (noms uniques) et icônes : le cache d'abord.
  if (STATIQUE.test(url.pathname)) {
    e.respondWith(caches.open(VERSION).then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }
  // Pages : le réseau d'abord, la dernière version connue si on est hors ligne.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(async () => (await caches.match(req)) || (await caches.match("/parcours")) || Response.error()));
  }
});

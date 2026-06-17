// Service worker — mode hors-ligne (PWA) pour « Mon Piano des mots ».
// Le « base » est déduit de l'emplacement du SW (racine en local, /Piano sur GitHub Pages).
const BASE = self.location.pathname.replace(/\/sw\.js$/, "");
const HOME = BASE + "/";
const CACHE = "mpm-v3";
const CORE = [
  HOME,
  BASE + "/parcours/",
  BASE + "/piano/",
  BASE + "/module-0/",
  BASE + "/mur-des-sons/",
  BASE + "/atelier/",
  BASE + "/dictee/",
  BASE + "/histoires/",
  BASE + "/jeux/",
  BASE + "/adulte/",
  BASE + "/manifest.webmanifest",
  BASE + "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations : réseau d'abord, repli sur le cache (puis l'accueil).
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(HOME))),
    );
    return;
  }

  // Autres ressources : cache d'abord, puis réseau (et on met en cache).
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res && res.ok && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached),
    ),
  );
});

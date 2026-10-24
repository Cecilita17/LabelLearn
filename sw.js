// Service worker de LabelLearn: guarda la app para que abra sin conexión. Red primero (siempre la versión nueva), caché como respaldo.
var CACHE = 'labellearn-v3';
var SHELL = ['./', 'index.html', 'styles.css', 'data.js', 'search-index.js', 'sentences.js', 'flashcards.js', 'search.js', 'iso.js', 'scene-bathroom.js', 'scene-kids.js', 'scene-kitchen.js', 'scene-dining.js', 'scene-laundry.js', 'scene-living.js', 'scene-study.js', 'scene-garden.js', 'scene-bedroom.js', 'scene-entrance.js', 'scene-structure.js', 'scene-misc.js', 'scene-positions.js', 'iso-view.js', 'app.js', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'manifest.webmanifest'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (res) {
    var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return res;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('index.html'); }); }));
});

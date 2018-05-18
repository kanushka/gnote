var dataCacheName = 'gnote-app-data-v1';
var cacheName = 'gnote-app-v1';

var filesToCache = [
  '/',
  '/index.html',

  '/css/animate.css',
  '/css/materialize.min.css',
  '/css/style.css',

  '/js/init.js',
  '/js/app.js',
  '/js/materialize.min.js',

  '/img/note-10.png',
  '/img/office.jpg',
  '/img/icons/apple-icon-152x152.png',
  '/img/icons/note-icon-512x512.png'
];


self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
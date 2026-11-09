var CACHE = 'biblia-v1';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

// Primero la red; si no hay internet, lo último que se guardó.
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  if(url.origin !== location.origin && url.hostname !== 'bolls.life') return;
  e.respondWith(
    fetch(req).then(function(res){
      if(res && res.ok){ var cp = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, cp); }); }
      return res;
    }).catch(function(){ return caches.match(req); })
  );
});

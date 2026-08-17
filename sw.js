var C = 'dash-v1';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(clients.claim()); });
function key(req){ var u = new URL(req.url); return u.pathname; }
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var cl = r.clone();
      caches.open(C).then(function(c){ c.put(key(e.request), cl); });
      return r;
    }).catch(function(){
      return caches.open(C).then(function(c){ return c.match(key(e.request)); })
        .then(function(m){ return m || Response.error(); });
    })
  );
});

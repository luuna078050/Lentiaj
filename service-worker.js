const CACHE='lenivets-test-v9';
const ASSETS=['./','./index.html','./style.css','./theme-fix.css','./i18n.js','./app.js','./voice.js','./library-sync.js','./shops.js','./library.json','./manifest.webmanifest','./install.js','./logo-lenivets.svg','./icons/icon-192.svg','./icons/icon-512.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(x=>x.put(e.request,copy));return r}).catch(()=>caches.match('./index.html')))));

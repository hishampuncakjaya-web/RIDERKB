const CACHE = 'myriderku-micro-marketplace-v62-pisah';
const SHELL = ['./', './customer.html', './customer-track.html', './manifest-rider.webmanifest', './rider.html', './admin.html', './vendor.html', './manifest-vendor.webmanifest', './app.css', './theme.css', './myriderku-brand.css', './myriderku-ui.css', './myriderku-ceria.css', './myriderku-v37.css?v=38', './myriderku-v38-design.css?v=39', './myriderku-v41-fixes.css?v=41','./myriderku-v43-complete.css?v=44', './myriderku-v52-fixes.css?v=52', './theme.js', './common.js?v=61', './customer-shop.html', './firebase-config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './manifest-admin.webmanifest', './icon-customer-192.png', './icon-customer-512.png', './icon-rider-192.png', './icon-rider-512.png', './icon-vendor-192.png', './icon-vendor-512.png', './icon-admin-192.png', './icon-admin-512.png', './apple-touch-icon-customer.png', './apple-touch-icon-rider.png', './apple-touch-icon-vendor.png', './apple-touch-icon-admin.png', './icon-customer-maskable-512.png', './icon-rider-maskable-512.png', './icon-vendor-maskable-512.png', './icon-admin-maskable-512.png'];
const CDN = ['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.concat(CDN).map(u => c.add(u)))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('push', e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) { p = { data: { body: e.data ? e.data.text() : '' } }; }
  const d = Object.assign({}, p.notification || {}, p.data || {});
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.some(c => c.visibilityState === 'visible' && c.focused)) return;   // app sedang dibuka: app sendiri sudah tunjuk notis
    const icon = d.icon || 'icon-192.png';
    return self.registration.showNotification(d.title || 'MYRIDERKU', { body: d.body || '', tag: d.tag || 'rkb', renotify: true, requireInteraction: true, vibrate: [300, 120, 300], icon, badge: icon, data: { url: d.url || './' } });
  }));
});
self.addEventListener('notificationclick', e => {
  const url = (e.notification.data && e.notification.data.url) || 'rider.html';
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const page = url.split('?')[0].split('/').pop();
    for (const c of cs) { if (page && c.url.indexOf(page) >= 0 && 'focus' in c) return c.focus(); }
    return clients.openWindow(url);
  }));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  // halaman: rangkaian dahulu, cache jika luar talian
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; }).catch(() => caches.match(req, {ignoreSearch:true}).then(h => h || caches.match('./customer.html'))));
    return;
  }
  // fail app sendiri: rangkaian dahulu (sentiasa versi terkini), cache jika luar talian
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; }).catch(() => caches.match(req)));
    return;
  }
  // Leaflet CDN: cache dahulu, kemas kini di latar
  if (url.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return r; }).catch(() => hit);
      return hit || net;
    }));
  }
  // peta, laluan, alamat, cuaca: terus ke rangkaian (data langsung)
});

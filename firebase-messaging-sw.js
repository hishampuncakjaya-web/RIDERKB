/* MYRIDERKU Firebase Cloud Messaging background worker.
 * Letak di ROOT deployment, sama aras dengan rider.html dan index.html.
 */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCLe-RqEQ3-KhEEa7HxdaKjUOFkcPr4bFg',
  authDomain: 'riderkb-fe7e1.firebaseapp.com',
  databaseURL: 'https://riderkb-fe7e1-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'riderkb-fe7e1',
  storageBucket: 'riderkb-fe7e1.firebasestorage.app',
  messagingSenderId: '412815286373',
  appId: '1:412815286373:web:1ae9b01be1de978d72668c'
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const data = Object.assign({}, payload.data || {});
  const note = payload.notification || {};
  return self.registration.showNotification(note.title || data.title || 'MYRIDERKU', {
    body: note.body || data.body || 'Anda mempunyai kemas kini baharu.',
    icon: data.icon || './icon-rider-192.png',
    badge: './icon-rider-192.png',
    tag: data.tag || 'myriderku-update',
    data: { url: data.url || './rider.html' },
    renotify: true
  });
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './rider.html';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    for (const client of windows) {
      if ('focus' in client) {
        if ('navigate' in client) client.navigate(target);
        return client.focus();
      }
    }
    return clients.openWindow(target);
  }));
});

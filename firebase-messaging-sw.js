/* Firebase Cloud Messaging background worker for MYRIDERKU.
   Public web-app config only; VAPID public key is configured in firebase-config.js. */
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
messaging.onBackgroundMessage(payload => {
  const n = payload.notification || {};
  return self.registration.showNotification(n.title || 'MYRIDERKU', {
    body: n.body || 'Anda mempunyai kemas kini baharu.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {}
  });
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    for (const c of list) if ('focus' in c) { c.navigate(target); return c.focus(); }
    return clients.openWindow(target);
  }));
});

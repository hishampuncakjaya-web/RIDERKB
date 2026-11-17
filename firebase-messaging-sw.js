importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// GANTI nilai di bawah dengan firebaseConfig projek anda
// (Firebase Console > Project Settings > General > Your apps)
firebase.initializeApp({
  apiKey: "ISI_DI_SINI",
  authDomain: "ISI_DI_SINI",
  projectId: "ISI_DI_SINI",
  storageBucket: "ISI_DI_SINI",
  messagingSenderId: "ISI_DI_SINI",
  appId: "ISI_DI_SINI"
});

const messaging = firebase.messaging();

// Klik pada notifikasi akan membuka / memfokuskan app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      return clients.openWindow('/');
    })
  );
});

# MYRIDERKU V88 — Audit dan patch statik

## Asas
- Dibina daripada `MYRIDERKU_V87_FLAT.zip`.
- Firebase utama dikekalkan seperti konfigurasi V87 (`riderkb-fe7e1`).
- Tiada Firebase Rules, rekod database atau Cloud Functions production diubah.

## Pembaikan dalam pakej ini
1. `map-controls.js`: kawalan Leaflet seragam untuk peta yang dicipta selepas skrip dimuatkan; double-click zoom, touch zoom, scroll zoom dan butang full-screen; Escape untuk keluar; saiz peta dikira semula selepas perubahan.
2. `myriderku-v87-fixes.css`: gaya full-screen peta dengan viewport telefon dan kunci skrol latar.
3. `firebase-messaging-sw.js`: fail Service Worker FCM di root supaya laluan lalai `/firebase-messaging-sw.js` tidak lagi 404 pada root deployment.
4. `customer-track.html`: label tambang pada pesanan selesai ditukar kepada “Harga akhir”; nilai masih menggunakan nilai pesanan tersimpan `o.price` dan tidak mengira semula.
5. Mesej `PERMISSION_DENIED` Customer dijadikan neutral dan tidak lagi mendakwa pengguna terlalu kerap membuat pesanan.

## Semakan statik
- `node --check` untuk semua fail JavaScript sumber berjaya.
- JSON Rules candidate perlu disemak berasingan sebelum sebarang deploy.

## Belum boleh disahkan / perlu backend atau ujian langsung
- Punca sebenar Customer order-block: `createCustomerOrder` callable, Firebase Rules/App Check, auth dan rate-limit backend perlu diperiksa dalam source Cloud Functions dan Firebase Emulator. Patch UI tidak membuka sekatan atau memintas keselamatan.
- Harga akhir yang dipaparkan ialah `o.price` kerana itulah medan tambang yang dibaca oleh V87; perlu sahkan callable menyimpan harga final ke medan itu. Tiada andaian medan baru dibuat.
- FCM memerlukan VAPID public key dalam `firebase-config.js`, domain HTTPS yang dibenarkan, permission pengguna dan fungsi server yang menghantar FCM. Worker sahaja tidak menghantar notifikasi.
- Semua peta perlu diuji pada browser sebenar; Leaflet map yang dicipta sebelum `map-controls.js` dimuatkan mungkin tidak menerima kawalan tambahan.
- GPS, live radar, cuaca, dispatch, payment, wallet dan transaksi memerlukan ujian Firebase staging/emulator. Tiada data production disentuh.

## Release gate
Jangan anggap pakej ini sebagai production-verified sehingga ujian Customer → Callable → Firebase → Rider → selesai → resit dijalankan di staging, serta semua role diuji pada Android dan desktop.

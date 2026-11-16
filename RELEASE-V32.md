# MYRIDERKU V32: keselamatan, privasi & marketplace

## ⚠️ Urutan deploy (WAJIB ikut, supaya admin tak terkunci)
1. **Sahkan e-mel admin dahulu.** Log masuk `/admin.html` (rules lama masih berfungsi), tekan **📧 Hantar e-mel pengesahan**, klik pautan dalam e-mel, kemudian tekan **✅ Dah sahkan, muat semula**.
   - Jika e-mel admin anda bukan `admin@riderkb.com`, tukar di `firebase-config.js` (`admins`), `functions/index.js` (`ADMIN_EMAILS`) dan cari-ganti dalam `database.rules.json`.
2. **Uji dahulu di Firebase Emulator / projek staging.** Rules baharu BELUM diuji dalam Emulator (tiada alat itu semasa penyediaan). Gunakan Rules Playground di Console sekurang-kurangnya untuk: pelanggan buat order, pelanggan batal, rider terima/ambil/selesai, admin ubah status, vendor terima order.
3. Upload semua fail ke Netlify (V32 menukar `common.js?v=32`, `sw.js` dan `shop.html`).
4. Tampal `database.rules.json` ke Realtime Database > Rules > **Publish** (atau `firebase deploy --only database,functions`).
5. `cd functions && npm install`, kemudian `firebase deploy --only functions` (perlu pelan Blaze).
6. Ujian pantas selepas deploy: tempah dari `/`, jejak di `track.html`, batal, terima sebagai rider, buka `/shop.html`.

**Jalan keluar kecemasan:** di Console > Realtime Database, tambah nod `admins/{UID admin}: true`. Ini membenarkan admin tanpa pengesahan e-mel (nod ini tak boleh diubah daripada app).

## Apa yang berubah
**Keselamatan (rules)**
- Admin hanya sah jika e-mel disahkan, atau UID ada dalam `admins/`. Sebelum ini sesiapa boleh daftar e-mel admin jika akaun belum wujud.
- Rider hanya boleh ubah order yang ditugaskan kepadanya. Terima hanya dari `baru`; `diambil` perlu gambar barang; `selesai` perlu gambar bukti. Harga, bayaran dan `need` tak boleh diubah rider.
- Medan seperti `riderUid`, `pickPhoto`, `riderLoc` tak boleh diisi semasa pelanggan buat order. Panjang alamat, kenderaan, jarak, koordinat disahkan. Harga order tak boleh di bawah harga asas (Tetapan admin).
- `reports`: pelanggan hanya boleh lapor untuk order yang wujud; SOS hanya rider diluluskan; semua medan disahkan.
- `proofs`: hanya rider yang ditugaskan boleh tulis gambar.
- `fcmTokens`: token role `admin` hanya boleh ditulis admin sah; Cloud Function juga menapis admin sebelum hantar push.
- Medan profil rider disahkan panjang/jenis.

**Privasi**
- Nombor telefon & penerima disimpan di `orderContacts/{id}` (bukan dalam order). Hanya admin dan rider yang ditugaskan boleh baca. Rider lain tak nampak nombor, dan kad order `baru` tak paparkan nombor. Order lama yang masih ada `phone` dalam order tetap dipaparkan (fallback).
- Halaman jejak tak lagi bergantung pada nombor dalam order.

**Fungsi baharu / dibaiki**
- 🏪 **`shop.html`**: pelanggan pilih kedai, menu, troli, hantar pesanan, jejak status, batal (jika masih `baru`), nilai selepas selesai, dan tekan **Panggil rider hantar** yang membuka borang tempahan rider dengan lokasi kedai dan alamat hantar sudah diisi. Pautan "Pesan terus dari kedai" ada di halaman utama.
- 🚫 Pelanggan boleh **batal order** (selagi belum diterima rider) di halaman jejak.
- 🔌 Status online rider didaftar semula setiap kali sambungan pulih (`onDisconnect`).
- Lokasi rider ditulis berasingan supaya satu penolakan tak menggagalkan kemas kini lokasi lain.
- 🔔 Cloud Functions: notifikasi status order kepada pelanggan (perlu `vapidKey` & izin notifikasi), wallet automatik (pilihan, hidupkan di Admin > Tetapan; tunai: tolak komisyen platform, online: kredit upah rider; tanda `settled` elak berganda).
- `sw.js` kini rangkaian-dahulu untuk fail app (tiada lagi risiko `common.js` lapuk), cache `v32`.
- Fail rules lama (`.previous`, `v20`, `v22`) dibuang. `firebase.json` kini merujuk `database.rules.json`.

## Belum / sengaja tak diubah
- **Push order kepada rider tak ditapis ikut jarak/online**: rider dengan app tertutup memang berstatus offline, jadi menapis `online` akan menghalang push daripada sampai.
- **GPS latar belakang** masih bergantung pada skrin menyala (PWA). Penyelesaian sebenar: pembalut TWA/Capacitor dengan foreground service.
- **App Check**: isi `appCheckKey` (reCAPTCHA v3) dalam `firebase-config.js` dan aktifkan penguatkuasaan di Console untuk halang spam. Tanpa kunci, perlindungan spam hanya had 30 saat per nombor + rules.
- Gambar bukti/QR masih base64 dalam Realtime Database (pindah ke Storage pada versi akan datang).
- OSRM/Nominatim/Overpass percuma ada had penggunaan: untuk volum tinggi guna perkhidmatan sendiri/berbayar.
- Harga dihantar klien; rules hanya jamin ia ≥ harga asas dan ≤ RM500. Pengesahan penuh ikut jarak perlu Cloud Function.
- Kedai marketplace: upah rider dikira berasingan di borang rider (tiada pelekatan automatik antara `vorders` dan `orders`).
- Ujian V32 yang telah dijalankan: semakan sintaks semua skrip, dan ujian pelayar dengan pangkalan data tiruan (senarai kedai → pesan → jejak → batal; tempahan biasa menyimpan nombor di `orderContacts`; pembatalan di jejak; kad rider sorok/papar nombor). Rules dan Cloud Functions belum dijalankan terhadap Firebase sebenar.

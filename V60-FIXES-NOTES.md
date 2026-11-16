# V60 audit fixes

1. database.rules.v60.staging.json: salinan LENGKAP rules semasa + nod publicConfig (settings read = admin sahaja). Fail candidate asal hanya 2 nod; jika di-deploy sebagai rules penuh ia memadam semua rules lain.
2. admin.html: simpan tetapan kini tulis /settings DAN /publicConfig sekali (update atomik); auto-seed publicConfig jika kosong semasa admin buka.
3. Cache dinaikkan ke v60 (sw.js, common.js?v=60).
4. tests/v60-integration.test.cjs ditambah.

Langkah staging: deploy rules v60 ke projek STAGING -> buka admin.html (auto-seed) atau import payload dari prepare-public-config.mjs -> uji index/track/shop -> baru pertimbang production.
Belum diuji: Firebase Emulator, `npm install` functions, Android/iOS PWA.

## V61 (app berasingan setiap peranan)
- manifest rider/vendor/admin: scope kini ./rider.html, ./vendor.html, ./admin.html (customer kekal ./). Chrome kini anggap 4 app berasingan dengan ikon masing-masing.
- common.js: rider/vendor/admin guna sesi Firebase Auth bernama sendiri, jadi tak perlu log keluar bila tukar app. Customer kekal app lalai.
- Cache dinaikkan ke v61. Rider/vendor/admin perlu log masuk sekali lagi.

# MYRIDERKU V36: kemas, konsisten, sedia guna

## Perubahan
- **Manifest**: `scope` kini `./` (sebelum ini fail tunggal, jadi `track.html`/`shop.html` keluar daripada app dan bar pelayar muncul).
- **Tema**: gaya lalai kini *Klasik* (hijau Kelantan, bersih). Gaya *Ceria* kekal sebagai pilihan 🎨. `@import` Google Fonts dibuang (menyekat paparan, gagal luar talian).
- **Mod gelap** kini berfungsi di halaman pelanggan/rider/vendor (gaya Klasik).
- **Navigasi seragam** (Tempah / Kedai / Jejak) di index, shop, track.
- **Skrin pasang app** untuk pelanggan: `customerInstall` dalam `firebase-config.js`
  - `'soft'` (lalai): skrin pasang + butang "Teruskan di pelayar buat sementara" (sesi sahaja)
  - `true`: WAJIB pasang, tiada langkau (pelayar dalam WhatsApp/Facebook tak boleh pasang, jadi pelanggan di situ akan tersekat)
  - `false`: mati
- Versi diseragamkan: `common.js?v=36`, cache `myriderku-v36`.

## Cara deploy
Upload semua fail ke Netlify (tiada perubahan rules/functions). Buka app sekali dengan sambungan, kemudian tutup dan buka semula supaya service worker v36 aktif.

## Belum disentuh (lihat cadangan)
Rules & Cloud Functions belum diuji pada Firebase sebenar; `vapidKey`/`appCheckKey` kosong; tile OSM & OSRM demo; gambar base64 dalam database; wallet `Math.max(0,…)`.

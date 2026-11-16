# MYRIDERKU V37 — Premium role-based interface

## Perubahan V37
- Lapisan CSS baharu `myriderku-v37.css` dengan tema khusus mengikut peranan.
- Customer dan Marketplace: Fresh Green + White + Warm neutral.
- Rider: Midnight Navy + Electric Green, kontras tinggi untuk penggunaan ketika bekerja.
- Vendor: Warm Ivory + Emerald, gaya konsol perniagaan.
- Admin: Obsidian + Emerald + Lime, gaya pusat kawalan operasi.
- Halaman jejak pelanggan mengekalkan bahasa visual customer.
- Cache service worker dinaik taraf kepada `myriderku-v37`; semua halaman memuatkan `common.js?v=37`.

## Keselamatan perubahan
- Perubahan ini ialah lapisan visual CSS dan versi cache sahaja.
- HTML fungsi, Firebase configuration, database rules, Cloud Functions, formula tambang, komisen, login, order workflow dan peta tidak sengaja diubah.
- Tiada jaminan fungsi produksi hanya melalui perubahan visual. Uji pada staging/Netlify dan Firebase sebelum penggunaan pelanggan sebenar.

## Deploy
1. Simpan salinan V36 sebagai rollback.
2. Extract ZIP V37 dan upload keseluruhan kandungan folder ke direktori publish Netlify (bukan folder ZIP bersarang).
3. Buka setiap halaman dengan internet: `index.html`, `rider.html`, `vendor.html`, `shop.html`, `track.html`, `admin.html`.
4. Tutup aplikasi sepenuhnya dan buka semula supaya service worker V37 aktif.
5. Uji aliran order, login, GPS, notifikasi dan paparan pada telefon sebenar sebelum go-live.

## V38 (pembaikan atas V37)
- **Peta skrin penuh (punca sebenar):** animasi kad `uiUp` meninggalkan `transform` pada `.card`, dan ancestor yang ada `transform` menjadikan `position:fixed` terikat pada kad itu (bukan skrin). Peta admin berada dalam kad, jadi skrin penuh tersangkut kecil. Animasi kini hanya `opacity`, dan peta dipindah sementara ke `<body>` semasa skrin penuh (pulih semula bila keluar). Esc untuk keluar.
- **Admin nampak rider online:** rider kini hantar degupan lokasi setiap 25 saat jika tiada kemas kini GPS (rider berhenti/senyap), sebab admin hanya papar rider yang isyaratnya <120 saat. Admin juga papar rider yang masih `online` hingga 15 minit (pudar = isyarat lama), dengan senarai butang di bawah peta; tekan untuk zum ke rider.
- Banner "Pasang app" diturunkan z-index supaya tak menutup peta skrin penuh. Cache `myriderku-v38`; `myriderku-v37.css` ditambah ke precache.

## V38 semakan (pembetulan kecil)
- `database.rules.json`: pesanan kedai (vorders) tidak lagi ditolak jika `settings/vendorMarkup` belum pernah disimpan admin (guna lalai 10%, sama seperti `firebase-config.js`). Semakan jumlah masih dikuatkuasa, jadi harga tak boleh dimanipulasi.
- `common.js`: butang "Teruskan di pelayar" pada skrin pasang app kini butang jelas, bukan pautan kecil.
- **WAJIB: tampal semula `database.rules.json` ke Firebase Console > Realtime Database > Rules > Publish.**

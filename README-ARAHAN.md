# MYRIDERKU Repair V2 — arahan pemasangan

Pakej ini ialah PATCH TERARAH berdasarkan fail `main` repositori `hishampuncakjaya-web/RIDERKB` yang diperiksa pada 18 Nov 2026. Ia bukan full source bundle.

## Kandungan
- `firebase-messaging-sw.js`: fail worker FCM lengkap untuk diletakkan di root yang sama dengan `rider.html`.
- `PATCH-common.js.txt`: perubahan khusus fungsi FCM dalam `common.js`.
- `PATCH-vendor.html.txt`: perubahan khusus fungsi peta Vendor.
- `DIAGNOSIS-RIDER-LIST.md`: diagnosis untuk ralat Callable `listRiderOrders` dan langkah semakan log.
- `UPLOAD-ORDER.txt`: senarai fail dan urutan upload.

## Penting
1. Jangan replace `index.js`, `firebase-rules.json`, `sw.js` atau keseluruhan `rider.html` dengan pakej ini.
2. Ralat `listRiderOrders: internal` tidak boleh dibetulkan dengan meneka kod. Ia memerlukan log Cloud Functions. Panduan diagnosis disertakan.
3. Pastikan GitHub Pages menerbitkan folder root repo. Fail worker mesti boleh dicapai terus pada URL `https://hishampuncakjaya-web.github.io/firebase-messaging-sw.js` (atau URL root sebenar laman).
4. Selepas upload, tunggu deployment berjaya, kemudian clear site data/service worker untuk domain MYRIDERKU atau buka dalam Incognito untuk ujian.

# MYRIDERKU V46 — Guest Authentication Readiness

## Perubahan
- Memuat Firebase Authentication compat SDK pada Customer dan Tracking.
- Menambah `RKB.ensureGuestAuth()` untuk mendapatkan sesi Firebase Anonymous Authentication tanpa borang daftar akaun.
- Customer menunggu pengesahan sesi sebelum menghantar tempahan Firebase.
- Pesanan baharu menyimpan `customerUid` daripada sesi Anonymous.
- Tracking memulakan/memulihkan sesi tetamu sebelum memasang listener pesanan.
- Service Worker dinaik taraf kepada cache V46 dan merujuk `common.js?v=46`.

## Perkara yang mesti diaktifkan di Firebase Console
1. Authentication > Sign-in method > Anonymous > Enable.
2. Pastikan domain Netlify produksi dan domain ujian berada dalam Authorized domains.
3. Uji tempahan baharu, refresh halaman, buka pautan tracking pada peranti yang sama dan semak `customerUid` dalam Realtime Database.

## Had keselamatan — jangan anggap V46 sudah menutup kebocoran data
`database.rules.json` sengaja belum diubah dalam pakej ini. V45 mempunyai `.read: true` pada `orders/$id` dan `proofsP/$id`, dan beberapa lokasi bukti lain juga perlu audit. `orders` juga mempunyai bacaan pada parent untuk rider. Menukar rules tanpa merancang query/dispatch dan kaedah tracking token boleh memutuskan tracking lama atau mendedahkan rekod legacy kepada sesi tetamu lain.

Oleh itu V46 hanya menyediakan identiti tetamu dan UID untuk pesanan baharu; ia BUKAN pelepasan keselamatan Firebase lengkap. Jangan publish rules baharu sehingga ujian Emulator Suite meliputi customer, rider assigned/unassigned, vendor, admin, tracking legacy dan proof access.

## Data lama
Tiada nod Firebase dipadam atau diubah oleh pakej ini. Sejarah pelanggan V44/V45 dalam localStorage tidak disentuh. Pesanan lama yang tiada `customerUid` kekal sebagai legacy.

## Semakan pakej
- JSON parse: `database.rules.json`, manifests, `firebase.json`.
- JavaScript syntax: inline dan fail JS.
- ZIP integrity dan rujukan fail cache diperiksa.
- Firebase runtime, Auth provider, Rules dan fungsi Cloud perlu diuji dalam projek sebenar; ujian itu tidak boleh disahkan dari ZIP sahaja.

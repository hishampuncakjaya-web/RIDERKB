# MYRIDERKU V81 — Audit Peringkat Seterusnya

Tarikh audit: 17 November 2026
Skop: pemeriksaan statik fail dalam pakej kerja V81. Tiada sambungan ke Firebase Production dibuat.

## Keputusan
**Belum layak untuk ujian hujung-ke-hujung atau deployment.** Audit menemui jurang endpoint dan integrasi yang nyata.

## Isu kritikal

### 1. Callable yang dipanggil tetapi belum dieksport
`v81-callables.js` memanggil:
- `riderMarkArrival`
- `customerConfirmReceipt`

Semakan `functions/index.js` tidak menemui eksport kedua-dua endpoint ini. Tindakan berkaitan akan gagal dengan `functions/not-found` jika dipanggil pada backend yang hanya mengandungi fungsi semasa.

### 2. Customer belum dimasukkan ke jambatan callable
`customer.html` tidak memuatkan Firebase Functions compat SDK atau `v81-callables.js`.
`customer-track.html` memuatkan Functions SDK tetapi tidak memuatkan `v81-callables.js`.
Oleh itu butang pengesahan Customer tidak boleh dianggap sudah disambungkan kepada `customerConfirmReceipt`.

### 3. Rider masih mempunyai laluan Wallet lama
`rider.html` masih mengandungi `reserveWalletForOrder()` dan `releaseWalletReservation()` yang menulis terus ke:
- `riders/{uid}/walletReserved`
- `orders/{id}/walletReservationReleased`

Ini bercanggah dengan reka bentuk keselamatan V81 yang menetapkan tempahan dan pelepasan COD dilakukan di backend. Fungsi lama perlu dibuang hanya selepas aliran callable disahkan.

### 4. Ketibaan Rider belum mempunyai backend
`rider.html` memanggil `MYRIDERKU_V81.riderArrival()`, tetapi endpoint `riderMarkArrival` belum wujud. Ketibaan pickup/drop tidak boleh dianggap berfungsi melalui backend.

### 5. Status Vendor dan Rider menggunakan medan status global yang sama
`updateVendorOrderStatus` boleh menulis `orders/{id}/status = selesai`, manakala `riderUpdateOrderStatus` mengharapkan status `diambil` sebelum Rider menandakan penghantaran selesai.
Jika Vendor menandakan pesanan kedai selesai terlebih dahulu, status global boleh bertembung dengan kitaran penghantaran Rider. Perlu asingkan status vendor/item dan status penghantaran, contohnya `vendorStatus` dan `deliveryStatus`, dengan migrasi data yang dirancang.

## Perkara yang telah ditemui
- Firebase Functions compat SDK dimuatkan pada Rider, Vendor, Admin dan Customer Tracking.
- `v81-callables.js` dimuatkan pada Rider, Vendor dan Admin.
- Backend mengandungi callable `acceptOrder`, `releaseCodReservation`, `updateVendorOrderStatus`, `adminAdjustRiderWallet`, `riderUpdateOrderStatus`.
- `customer.html` tiada jambatan Functions.
- Firebase CLI tidak tersedia dalam persekitaran kerja ini; Firebase Emulator belum boleh dijalankan di sini.

## Pelan pembetulan wajib
1. Tambah dan uji `customerConfirmReceipt` dengan pengesahan UID pemilik, nilai tindakan sah, aduan idempotent dan larangan auto-selesai apabila ada aduan.
2. Tambah dan uji `riderMarkArrival` dengan pengesahan rider yang ditugaskan serta jenis lokasi pickup/drop yang sah.
3. Muatkan SDK + bridge pada Customer dan Tracking serta hubungkan butang sebenar.
4. Gantikan fungsi Wallet lama Rider dengan callable sahaja; jangan benarkan client menulis `walletReserved`.
5. Asingkan status Vendor daripada status penghantaran Rider sebelum ujian status penuh.
6. Sediakan emulator config, jalankan ujian concurrency COD, pemilikan pesanan, transition status dan Rules.
7. Selepas semua ujian lulus barulah sediakan release ZIP berasingan.

## Sekatan deployment
- Jangan deploy.
- Jangan aktifkan Blaze.
- Jangan ubah Firebase Rules Production.
- Jangan upload pakej audit ini ke Netlify sebagai release production.

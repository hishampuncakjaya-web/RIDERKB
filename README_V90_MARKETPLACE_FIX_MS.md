# MYRIDERKU V90 — Marketplace Checkout Fix (18 November 2026)

## Asas
- Dibina daripada `MYRIDERKU_MASTER_BUILD_V89_AUDIT_MERGED(1).zip`.
- Firebase Realtime Database dan Cloud Functions `asia-southeast1` kekal sebagai backend utama.
- Tiada deployment, perubahan Firebase produksi atau perubahan data live dibuat.

## Perubahan
1. Halaman `customer-shop.html` memuatkan Firebase Auth compat, Functions compat dan `v81-callables.js`.
2. Checkout Marketplace tidak lagi menulis terus ke `/vorders`; ia memanggil `createMarketplaceOrder` selepas sesi Firebase Anonymous Auth disediakan.
3. Cloud Function membaca semula status kedai/menu dan mengira semula harga produk/markup daripada data menu server-side.
4. Cipta pesanan menggunakan transaksi unik pada `/vorders/{vendorUid}/{orderId}` dan had kadar per nombor telefon.
5. Caj penghantaran dikira semula di server berdasarkan koordinat kedai dan destinasi (anggaran jarak garis lurus × 1.3), bukan mempercayai caj yang dihantar browser.
6. Apabila Vendor menerima pesanan, `updateVendorOrderStatus` mewujudkan rekod `/orders/{orderId}` untuk aliran Rider. Pesanan ambil sendiri tidak dimasukkan ke feed Rider.
7. RTDB Rules calon membenarkan Customer yang authenticated membaca pesanan sendiri melalui `customerUid`; write terus oleh Customer kekal dilarang.
8. Service worker cache dinaik taraf kepada `myriderku-v90-marketplace-fix`.

## Perkara wajib sebelum deploy
- Semak dan deploy `functions/index.js` ke projek `riderkb-fe7e1` selepas ujian Emulator.
- Semak dan deploy `database.rules.V85_3_CANDIDATE.json` hanya selepas ujian Emulator menyeluruh. Fail ini masih calon, bukan Rules produksi.
- Pastikan Anonymous Authentication diaktifkan dalam Firebase Authentication.
- Pastikan akaun Vendor mempunyai `vshops/{uid}/open=true`, koordinat `lat/lng`, serta menu sah di `vmenu/{uid}`.
- Uji checkout ambil sendiri dan penghantaran, kedai tutup, stok habis, retry ID sama, rate limit, Vendor accept/reject, Rider claim serentak, dan akses silang akaun.
- Caj jarak server ialah anggaran garis lurus × 1.3; bandingkan dengan laluan sebenar dan polisi tambang sebelum produksi.

## Status QA
- ZIP extraction: PASS.
- `node --check functions/index.js`: PASS.
- `node --check v81-callables.js`: PASS.
- JSON parse Rules: PASS.
- Firebase Emulator/live Android/production deployment: NOT RUN.

**Status: STAGING CANDIDATE — bukan release produksi.**

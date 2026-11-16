# MYRIDERKU V48 — Vendor Commission Calculation

## Polisi
Komisen vendor marketplace bagi setiap unit ialah `max(RM1.00, 10% × harga seunit)`.
Harga RM10 ke atas menghasilkan 10% (contohnya RM20 → RM2); harga di bawah RM10 dikenakan minimum RM1 bagi setiap unit.

## Pelaksanaan dalam pakej
Cloud Function `calculateVendorCommission` dicetuskan apabila rekod `/vorders/{vendorUid}/{orderId}` dicipta. Ia membaca harga semasa daripada `/vmenu/{vendorUid}/{itemId}` dan menghasilkan snapshot `/finance` yang mengandungi jumlah kasar, komisen dan pendapatan vendor.

Fungsi ini **tidak** memindahkan wang, menambah wallet atau menolak bayaran. Penyelesaian wallet memerlukan pengesahan kaedah bayaran, status pesanan, refund/pembatalan dan model siapa memegang wang. Ia sengaja tidak disentuh untuk mengelakkan kredit/ debit berganda atau salah kira.

## Nota keselamatan & operasi
- Firebase Cloud Functions v2 memerlukan deployment dan pelan Firebase yang menyokong Functions.
- Semak konfigurasi `BASE` dan region sebelum deploy.
- Fungsi membaca menu server-side; ia tidak mempercayai harga atau jumlah komisen yang dihantar browser.
- Jika menu item tiada atau kuantiti/harga tidak sah, snapshot ditandakan `review_required`.
- Transaksi Realtime Database menjadikan snapshot idempotent.
- Tiada rekod lama dipadam atau ditulis semula.
- Firebase Rules tidak diubah dalam keluaran ini.

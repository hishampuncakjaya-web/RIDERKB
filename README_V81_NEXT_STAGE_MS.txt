MYRIDERKU V81 — NEXT STAGE: RIDER / VENDOR / ADMIN CALLABLE INTEGRATION

Perubahan dalam patch ini:
- Rider menerima pesanan melalui acceptOrder Cloud Function (atomic claim + COD reservation).
- Rider menukar status diambil/selesai melalui riderUpdateOrderStatus. Pelepasan walletReserved berlaku dalam transaksi backend yang sama ketika selesai.
- Rider merekod ketibaan ambil/hantar melalui riderMarkArrival.
- Vendor menerima/menolak/menanda siap/selesai/batal melalui updateVendorOrderStatus.
- Admin melaras Wallet melalui adminAdjustRiderWallet dan log ditulis di backend.
- Firebase Functions compat SDK + v81-callables.js dimuatkan pada halaman Rider, Vendor, Admin.

BATASAN / WAJIB UJI:
1. Ini migrasi kod, bukan deployment. Jangan upload ke Netlify production dahulu.
2. Cloud Functions belum deploy; callable tidak akan berfungsi pada projek production sehingga deploy dengan persetujuan pemilik dan pelan Firebase yang sesuai.
3. Rules aktif mungkin masih menyekat bacaan/penulisan lain seperti GPS rider, proof, menu/stok, profil dan notifikasi. Patch ini tidak menukar Rules.
4. Vendor stock deduction/return masih menggunakan transaksi client-side; perlu semakan berasingan untuk memastikan idempotency dan rollback bila callable gagal.
5. Semak bahawa vorders/{vendorUid}/{orderId} mempunyai salinan pesanan dan status yang selaras.
6. Uji Emulator: rider accept COD/non-COD, dua rider claim serentak, status pickup/complete, reserve release sekali sahaja, vendor transitions, admin wallet top-up/deduction dan percubaan bukan pemilik.
7. Root transaction dalam fungsi ini mengunci keseluruhan root RTDB dan sesuai sebagai scaffolding awal sahaja; untuk skala production, reka semula kepada transaksi berstruktur / queue / idempotency dengan ujian beban.

Tiada deploy, tiada perubahan billing/Blaze, tiada Rules Production diubah.

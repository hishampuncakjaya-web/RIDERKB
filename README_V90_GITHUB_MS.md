# MYRIDERKU V90 — Pembaikan Marketplace (sedia upload GitHub)

## Apa yang dibaiki
1. **"Sistem tidak membenarkan pesanan ini"** — `customer-shop.html` tidak lagi menulis terus ke `/vorders`, `/orders`, `/orderContacts`. Ia kini guna 3 callable baharu dalam `functions/index.js`:
   - `createMarketplaceOrder` — harga, markup, stok, jumlah dan upah rider dikira semula di pelayan.
   - `createMarketplaceDispatch` — panggil rider selepas kedai terima (pemilik pesanan sahaja, idempotent).
   - `customerMarketplaceAction` — batal (hanya status "baru") dan penilaian.
2. `customer-shop.html` kini memuatkan `firebase-auth-compat.js`, `firebase-functions-compat.js` dan `v81-callables.js` (sebelum ini tiada, jadi log masuk tetamu dan callable tak boleh jalan).
3. `updateVendorOrderStatus`: rekod `orders/{id}` tidak lagi wajib. Sebelum ini Vendor tak dapat terima pesanan kedai kerana rekod itu belum wujud.
4. `createCustomerOrder`: bahagian rider ikut tetapan Dana Operasi (`publicConfig/payout/platformShare`, lalai 20%), bukan 80% tetap.
5. `database.rules.V85_3_CANDIDATE.json`: pelanggan boleh BACA pesanan kedai sendiri sahaja (untuk halaman jejak). Tulis masih admin sahaja.
6. `sw.js`: nama cache dinaikkan supaya pelanggan dapat fail baharu.

## Langkah (ikut turutan)
1. **GitHub**: ekstrak zip, upload SEMUA fail ke root repo `RIDERKB` (padam fail lama yang bertindih). Folder `functions/` tidak dijalankan oleh GitHub Pages.
2. **Firebase Functions** (wajib, kalau tidak pesanan kedai tetap gagal):
   `firebase deploy --only functions` (Node 20, wilayah asia-southeast1). Rahsia WhatsApp (`WA_*`) mesti sudah ditetapkan.
3. **Rules**: JANGAN tampal terus. Uji dalam Firebase Emulator dahulu. Pastikan `/vshops` dan `/vmenu` masih boleh dibaca awam.
4. **Push FCM**: isi `vapidKey` dalam `firebase-config.js` (Firebase Console → Project settings → Cloud Messaging → Web Push certificates). Kunci TIDAK direka. Fungsi pelayan yang menghantar notifikasi belum ada dalam pakej ini.
5. Uji di staging: Customer → pilih kedai → hantar → Vendor terima → rider dipanggil → selesai → nilai.

## Belum dibuat / belum diuji
- Ujian sebenar (Emulator, Android, transaksi) TIDAK dijalankan. Logik 3 callable diuji dengan pangkalan data tiruan sahaja.
- `appCheckKey` kosong. Jika App Check dikuatkuasakan, callable akan ditolak.
- Jarak laluan daripada klien diterima hanya jika munasabah berbanding jarak garis lurus; jika tidak, pelayan guna jarak garis lurus x 1.3.

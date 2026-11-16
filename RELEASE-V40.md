# MYRIDERKU V40: Vendor lebih mudah, selamat dan terkawal

Fokus: kurangkan kerja harian vendor tanpa mengubah formula harga, komisen, wallet atau aliran order.

## WAJIB sebelum upload
1. Firebase Console > Realtime Database > Rules > tampal `database.rules.json` (versi V40) > **Publish**.
   Perubahan rules hanya DUA medan pilihan: `vmenu/{uid}/{item}/ex` dan `vshops/{uid}/reopen` (nombor sahaja).
   Tanpa langkah ini, "Habis hari ni" dan "Rehat" akan gagal dengan mesej ralat (fungsi lain tetap jalan).
2. Upload semua fail ke Netlify, buka semula app sekali supaya cache `myriderku-v40` aktif.

## Vendor (vendor.html)
- **Menu ikut kategori**: kumpulan boleh dilipat (diingati), carian produk (bila ≥8 produk), kategori dicadangkan ikut yang sedia ada.
- **⛔ Habis hari ni**: satu ketik; pelanggan tak boleh pesan sehingga tengah malam, kemudian produk sedia semula sendiri. ✅ Sedia semula untuk batal.
- **📄 Salin produk**: salinan dimatikan dahulu supaya tak terjual sebelum harga/nama diedit.
- **Terima / Tolak / Batal guna chip** (10/15/20/30/45 min; Stok habis, Kedai sibuk, dll.) ganti kotak taip. Masa sedia terakhir diingati.
- **⏸ Rehat 15 min / 30 min / 1 jam**: kedai ditutup sementara. Dibuka semula sendiri HANYA jika app vendor dibuka pada masa itu; jika tidak kedai kekal tutup (selamat).
- **Sejarah order**: tapis Hari ini / 7 hari / Semua, carian no. order, nama, telefon.
- **Amaran**: stok hampir habis (≤3), notifikasi belum dihidupkan / disekat, senarai semak kedai baru.
- **Notis pelanggan batal order**: bunyi + mesej (sebelum ini senyap).
- **Loceng order baru kini berbunyi walaupun kedai ditutup** (sebelum ini senyap).
- **Tulisan besar** (Lagi > Tulisan): untuk warga emas / skrin kecil. Butang ≥44px.
- Toast tak lagi menutup bar navigasi.

## Kawalan keselamatan
- Semua tindakan order disemak semula selepas dialog ditutup: jika pelanggan batal semasa vendor memilih, order TIDAK diterima dan stok tak ditolak.
- "Dah diserah" (selesai) minta pengesahan, kerana ia menjejaskan jualan dan payout.
- Rehat gagal-tutup (fail-closed): kedai tidak dibuka sendiri jika app tertutup.
- Tiada perubahan pada: harga, markup, komisen, wallet rider, formula, login, Cloud Functions. Rules lain tidak berubah.

## Pelanggan (shop.html)
- Produk "habis hari ni" dipapar HABIS dan disemak semula semasa hantar pesanan.

## Diuji
Skrip pelayar (Playwright + Firebase palsu): 29 semakan lulus: sejarah/carian, rehat dan buka semula auto, terima/tolak/batal + pulang stok, perlumbaan pelanggan-batal, lipat/carian menu, habis hari ni, salin, tulisan besar; tiada ralat konsol.
**Belum diuji pada Firebase sebenar dan telefon sebenar.** Uji dengan satu akaun vendor ujian dahulu sebelum semua vendor.

## Belum dibuat (cadangan seterusnya)
Pilihan/tambahan produk (option groups), waktu operasi berjadual, gambar produk, penyata CSV, laporan mingguan automatik, rehat auto-buka tanpa app (perlu Cloud Function berjadual).

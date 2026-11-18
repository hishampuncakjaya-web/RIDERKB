# MYRIDERKU V81 — Integrasi Customer & Rider Wallet (Patch 2)

## Perubahan kod dalam patch ini
1. `customer-track.html` kini memuatkan `v81-callables.js` selepas `firebase-config.js`.
2. Butang pengesahan Customer menggunakan bridge `MYRIDERKU_V81.customerReceipt()` dan bukannya membina callable secara berasingan dalam halaman.
3. Dua fungsi Wallet Rider lama yang tidak digunakan (`reserveWalletForOrder`, `releaseWalletReservation`) dan melakukan penulisan terus ke RTDB telah dibuang daripada `rider.html`. Penerimaan pesanan kekal menggunakan `MYRIDERKU_V81.acceptOrder()` dan status penghantaran menggunakan `MYRIDERKU_V81.riderStatus()`.

## Batasan yang masih ada
- Customer `customer.html` masih mencipta pesanan melalui penulisan RTDB terus. Ini belum dimigrasikan kepada callable `createOrder`.
- Fungsi Vendor masih mengubah `orders/{id}/status` dan `vorders/{uid}/{id}/status` bersama-sama. Status vendor dan penghantaran belum diasingkan.
- Pengesahan Customer callable hanya boleh berfungsi selepas Cloud Function `customerConfirmReceipt` dideploy. Tiada deployment dibuat.
- Penghapusan fungsi Wallet lama tidak bermakna semua penulisan Wallet dari seluruh aplikasi sudah dihapuskan. Admin/Vendor paths dan Rules perlu diaudit lanjut.
- Belum dijalankan Firebase Emulator, browser end-to-end, atau ujian peranti.

## Semakan sintaks
`node --check` untuk skrip inline HTML tidak tersedia secara automatik; pemeriksaan dilakukan pada fail backend/bridge dan pemeriksaan struktur.

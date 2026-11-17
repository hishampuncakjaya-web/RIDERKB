MYRIDERKU V81 - PATCH SETERUSNYA (BELUM DEPLOY)

Asas: V80_VENDOR_FIXED_LOCATION.

Perubahan kod dalam patch ini:
1. customer-track.html: tindakan Dah terima / Belum terima tidak lagi menulis terus ke orders/{id}/conf. Ia memanggil callable Cloud Function customerConfirmReceipt di asia-southeast1.
2. functions/index.js: callable customerConfirmReceipt mengesahkan Firebase Auth, pemilik order (customerUid), status selesai, dan menghalang pengesahan berganda. Laporan belum terima disimpan ke reports/receipt_{orderId}.
3. customer.html: semakan cuaca dibuat di lokasi ambil DAN hantar melalui Open-Meteo. Caj hujan RM2 hanya ditambah jika hujan dikesan. Jika semakan gagal, caj tidak dikenakan dan status cuaca menyatakan belum dapat disahkan. Kotak cuaca dijadikan paparan automatik (disabled).

PENTING:
- Ini patch kod untuk ujian, bukan pelepasan production.
- Cloud Function belum deploy dan tidak akan berfungsi pada production sehingga deploy dibuat dengan persetujuan pemilik.
- Deploy Cloud Functions memerlukan pelan Firebase yang menyokong Functions (lazimnya Blaze). Tiada pelan/billing diubah.
- Database Rules production tidak diubah.
- Uji pada Firebase Emulator dahulu. Pastikan reports/receipt_{orderId} sesuai dengan struktur laporan admin semasa sebelum production.
- Semakan cuaca bergantung kepada Open-Meteo, rangkaian, koordinat dan ketepatan data cuaca setempat. Jika API gagal, caj hujan tidak dikenakan.
- Semakan cuaca semasa ini menggunakan data current dari dua koordinat; ia bukan ramalan hujan sepanjang perjalanan.

Ujian yang dibuat:
- Node syntax check untuk functions/index.js.
- JSON dan Firebase Emulator / integrasi browser belum diuji.

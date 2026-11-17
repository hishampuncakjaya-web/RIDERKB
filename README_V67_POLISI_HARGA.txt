MYRIDERKU - SELARAS POLISI HARGA & PEMBAYARAN

Fail diubah: common.js, customer-shop.html, customer.html (+ vendor/admin/customer-track dari kemas kini sebelum ini)

Dilaksanakan:
- Markup produk per unit: bawah RM10 = RM1.00; RM10 ke atas = 10% (minimum RM1.00). Vendor terima 100% harga asal.
- Upah hantar: RM5.00 untuk 5 KM pertama; selepas 5 KM, RM1.00 bagi setiap KM tambahan. Jarak perpuluhan dikira mengikut 0.1 KM tanpa pembundaran tambang. Sama di kedai (customer-shop) dan Hantar Barang (customer).
- Caj pesanan kecil RM1 dimansuhkan (diganti markup RM1/unit).
- Job rider dari order kedai COD: wallet diperlukan = Dana Operasi 20% daripada upah (bukan harga produk). Nota rider: jumlah tunai untuk dikutip.

BELUM ADA (perlu pembangunan lanjut/backend):
- Tip pilihan customer (100% rider).
- Subsidi pickup RM0.25/KM selepas 3KM (maks RM3.00).
- Potongan Dana Operasi wallet SELEPAS order selesai & kutipan disahkan, rekod sejarah transaksi, dan tolak transaksi jika baki negatif (kini hanya tempahan/lepas tempahan dalam rider.html).
- Caj gerbang pembayaran dalam talian (FPX/QR) dan pembayaran dalam app: kini hanya transfer manual.
- Tetapan admin "KM termasuk" (freeKm) tidak lagi digunakan.

- customer.html (Tempah): mesej lokasi lebih jelas (hantar sudah diisi, pilih ambil) + butang "Nak hantar DARI lokasi saya? Tukar".
  Jika customer ada order kedai aktif, kad biru "Order kedai anda sedang diproses: rider dipanggil automatik" dipaparkan supaya tak tempah dua kali.

- Polisi upah RM5.00 untuk 5 KM pertama + RM1.00 bagi setiap KM tambahan kini DIKUNCI dalam kod (customer-shop.html & customer.html). Tetapan admin base/perKm/freeKm tidak lagi mengubah upah (hanya kereta & hujan masih dari admin).


PEMBETULAN FORMULA TAMBANG (V68):
- 0.0 hingga 5.0 KM = RM5.00.
- Lebih 5.0 KM: RM5.00 + (jarak - 5.0) x RM1.00.
- Contoh 5.5 KM = RM5.50; 6.0 KM = RM6.00; 10.0 KM = RM10.00.
- Tiada pembundaran ke RM0.50 atau RM1.00. Jarak dipaparkan/dikira pada ketepatan 0.1 KM.


KEMAS KINI V69 - NAMA BAHAGIAN PLATFORM
- Istilah komisen/untung platform bagi bahagian MYRIDERKU daripada upah penghantaran dinamakan Dana Operasi.
- Tetapan Admin mengawal Dana Operasi (%) secara terus; nilai lalai 20%, pendapatan rider ialah baki 80%.
- Untuk keserasian rekod lama, tetapan riderShare turut disimpan sebagai 100% - platformShare. Tetapan awam terhad publicConfig.payout.platformShare dibaca oleh app bagi mengira bahagian rider; paparan pengguna kekal mengikut peranan.
- Markup produk vendor kekal berasingan dan tidak dinamakan Dana Operasi.
- Perubahan tetapan digunakan untuk pesanan baharu; pesanan yang sudah mempunyai riderPay tersimpan kekal menggunakan nilai tersimpan.

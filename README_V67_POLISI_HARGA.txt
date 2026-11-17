MYRIDERKU - SELARAS POLISI HARGA & PEMBAYARAN

Fail diubah: common.js, customer-shop.html, customer.html (+ vendor/admin/customer-track dari kemas kini sebelum ini)

Dilaksanakan:
- Markup produk per unit: bawah RM10 = RM1.00; RM10 ke atas = 10% (minimum RM1.00). Vendor terima 100% harga asal.
- Upah hantar: RM5.00 + RM1.00 setiap KM (tiada KM percuma), dibundar KE ATAS kepada gandaan RM0.50. Sama di kedai (customer-shop) dan Hantar Barang (customer).
- Caj pesanan kecil RM1 dimansuhkan (diganti markup RM1/unit).
- Job rider dari order kedai COD: wallet diperlukan = komisen platform 20% daripada upah (bukan harga produk). Nota rider: jumlah tunai untuk dikutip.

BELUM ADA (perlu pembangunan lanjut/backend):
- Tip pilihan customer (100% rider).
- Subsidi pickup RM0.25/KM selepas 3KM (maks RM3.00).
- Potongan komisen wallet SELEPAS order selesai & kutipan disahkan, rekod sejarah transaksi, dan tolak transaksi jika baki negatif (kini hanya tempahan/lepas tempahan dalam rider.html).
- Caj gerbang pembayaran dalam talian (FPX/QR) dan pembayaran dalam app: kini hanya transfer manual.
- Tetapan admin "KM termasuk" (freeKm) tidak lagi digunakan.

- customer.html (Tempah): mesej lokasi lebih jelas (hantar sudah diisi, pilih ambil) + butang "Nak hantar DARI lokasi saya? Tukar".
  Jika customer ada order kedai aktif, kad biru "Order kedai anda sedang diproses: rider dipanggil automatik" dipaparkan supaya tak tempah dua kali.

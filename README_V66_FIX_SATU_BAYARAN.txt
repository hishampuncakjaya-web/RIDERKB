MYRIDERKU V66 - SATU ORDER, SATU BAYARAN (kedai + rider)

Fail diubah: customer-shop.html, vendor.html, admin.html, customer-track.html

- Order kedai "Hantar" kini termasuk upah rider (formula sama seperti customer.html: asas + KM lebih, genap 0.50, ikut tetapan admin).
- Caj pesanan kecil RM1.00 untuk jumlah produk bawah RM10 (ambil sendiri & hantar). Ubah di customer-shop.html: SMALL_MIN / SMALL_FEE.
- Rider dipanggil automatik bila kedai Terima (pickup = kedai, drop = lokasi semasa order). Ada butang "Cuba panggil rider" jika gagal.
- Upah/KM/caj kecil disimpan dalam teks nota order ([#U=..;K=..;S=..]) supaya tiada medan baharu ditolak oleh Firebase Rules. Vendor & admin tak nampak tag ini.
- Halaman jejak rider tak lagi minta "Bayar upah" kali kedua untuk order dari kedai.

BELUM DIUJI pada Firebase sebenar. Uji: 1 order ambil sendiri, 1 order hantar (tunai), 1 order hantar (online) hingga selesai.

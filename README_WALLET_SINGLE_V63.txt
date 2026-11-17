MYRIDERKU V3 - KEMAS KINI WALLET TUNGGAL (V63)

Perubahan dalam pakej ini:
1. Paparan Rider menggunakan satu Wallet Rider sahaja.
2. Paparan baki menunjukkan baki keseluruhan, baki tersedia dan amaun COD yang ditempah sementara.
3. Kelayakan COD menyemak baki tersedia (wallet - walletReserved).
4. Semasa Rider menerima COD, sistem cuba menempah amaun `need` secara transaksi pada rekod Rider sebelum menuntut order. Jika tuntutan order gagal, tempahan dilepaskan.
5. Apabila order selesai, sistem menandakan dan melepaskan tempahan COD.
6. Admin tidak boleh menolak Wallet sehingga baki jatuh di bawah amaun COD yang sedang ditempah.
7. Cache service worker dinaikkan kepada v63.

PENTING - SEMAKAN SEBELUM PRODUKSI:
- Ini ialah kemas kini kod bahagian klien. Ia belum diuji pada Firebase projek sebenar dan belum membuktikan perlindungan keselamatan hujung-ke-hujung.
- Firebase Realtime Database Rules mesti mengehadkan siapa boleh mengubah `wallet`, `walletReserved`, `walletLog` dan status order. Jangan benarkan Rider mengubah baki sendiri.
- Untuk perlindungan transaksi kewangan sebenar, pindahkan reserve/commit/release Wallet dan tuntutan COD ke Cloud Functions (atau backend dipercayai) dengan transaksi atomik dan idempotency. Kod klien sahaja tidak boleh menjamin keselamatan daripada klien diubah suai atau kegagalan rangkaian pada sela transaksi.
- Medan `need` sedia ada dikekalkan sebagai amaun yang perlu disediakan untuk pesanan COD (termasuk `itemEst` dan `walletMinCash` mengikut aliran sedia ada). Formula ini belum diubah kepada komisen 20% kerana ia berbeza daripada aliran talangan barang yang terdapat dalam kod V3. Sahkan formula sebelum mengaktifkan COD produksi.
- Pesanan COD lama yang sudah aktif sebelum kemas kini mungkin tidak mempunyai `walletReservedBy` / `walletReservedAmount`; semak dan selesaikan secara manual sebelum deploy.

Fail utama diubah: rider.html, admin.html, firebase-config.js, sw.js.

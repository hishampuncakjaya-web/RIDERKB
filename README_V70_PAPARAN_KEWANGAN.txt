MYRIDERKU V70 - PAPARAN KEWANGAN MENGIKUT PERANAN

Asas: MYRIDERKU V69 DANA OPERASI

Perubahan UI:
- Rider tidak memaparkan Dana Operasi, kadar 20%, atau pecahan potongan dalaman.
- Rider melihat pendapatan penghantaran bersih.
- Jika rekod pesanan mengandungi medan bonus (bonus, bonusAmount, spotBonus, riderBonus), Bonus dipaparkan berasingan.
- Jika rekod pesanan mengandungi medan tip (tip, tipAmount, customerTip, riderTip), Tip pelanggan dipaparkan berasingan.
- Jumlah pendapatan rider memasukkan pendapatan penghantaran + bonus + tip.
- Ringkasan pendapatan harian/mingguan/bulanan turut mengambil kira bonus dan tip yang tersimpan.
- Admin kekal melihat Dana Operasi dan pecahan kewangan penuh dalam panel Admin.
- Paparan Customer dan Vendor tidak ditambah sebarang pecahan Dana Operasi.

PENTING - HAD PELAKSANAAN:
- V69 sedia ada membaca publicConfig.payout.platformShare untuk pengiraan bahagian rider. Nilai itu masih berada dalam Firebase publicConfig. Menyembunyikan paparan bukan kawalan keselamatan pangkalan data.
- Firebase Security Rules tidak disertakan dalam ZIP ini. Untuk memastikan hanya Admin boleh membaca kadar dan pecahan Dana Operasi, perlu pindahkan tetapan sensitif ke laluan Firebase yang dilindungi Admin dan gunakan Cloud Functions/rekod riderPay yang disahkan server-side.
- V69 README menyatakan fungsi tip pelanggan dan backend bonus belum lengkap. V70 hanya memaparkan bonus/tip jika nilai sudah wujud dalam rekod pesanan; ia tidak mencipta aliran tip atau sistem pemberian bonus.

Ujian: Semak sintaks JavaScript sebaris HTML dan arkib ZIP sebelum deploy. Uji Firebase sebenar selepas pemasangan.

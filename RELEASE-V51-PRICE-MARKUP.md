# MYRIDERKU V51 — Marketplace markup per unit

## Polisi harga
- Setiap unit menggunakan markup `max(RM1.00, 10% × harga asal seunit)`.
- Harga pelanggan seunit = harga asal Vendor + markup.
- Untuk item bawah RM10, sistem menambah RM1 bagi setiap unit.
- Harga asal Vendor tidak diubah; Vendor menerima 100% harga asal item.
- Tiada komisen Vendor tambahan atas transaksi item ini. Caj penghantaran kekal berasingan.

## Pelaksanaan
- `common.js`: fungsi `vMarkup()` dan `vPrice()` menggunakan formula yang sama.
- `shop.html`: jumlah troli mengira markup bagi setiap unit, termasuk kuantiti berbilang.
- `functions/index.js`: snapshot kewangan merekod markup platform secara berasingan dan mengekalkan `vendorNet` pada jumlah penuh harga asal Vendor.
- Perubahan ini mengemas kini pengiraan dan rekod; ia tidak mengaktifkan gateway pembayaran atau pemindahan wang automatik.

## Contoh
| Harga asal seunit | Markup seunit | Harga pelanggan seunit | Vendor terima |
|---:|---:|---:|---:|
| RM5.00 | RM1.00 | RM6.00 | RM5.00 |
| RM9.90 | RM1.00 | RM10.90 | RM9.90 |
| RM10.00 | RM1.00 | RM11.00 | RM10.00 |
| RM30.00 | RM3.00 | RM33.00 | RM30.00 |

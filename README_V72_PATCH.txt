MYRIDERKU V72 - PATCH ALIRAN TEMPAHAN
====================================

Fail ini ialah patch pada V72 asal, bukan binaan semula.

Pembaikan:
1. customer-shop.html
   - Kunci place() seawal sentuhan pertama supaya dua proses penghantaran tidak berjalan serentak.
   - Payload dispatch pelanggan kini menyertakan vendorUid dan riderPay.
   - Dispatch sedia ada kekal sebagai fallback dan menyemak rekod orders/{id} sebelum mencipta rekod.

2. vendor.html
   - Apabila vendor menerima pesanan bertanda [HANTAR], aplikasi vendor mencipta tugasan rider pada orders/{orderId}.
   - Firebase transaction memastikan satu orderId hanya mencipta satu tugasan.
   - Rekod orderContacts disediakan sebelum tugasan dibuka kepada rider.
   - Pesanan AMBIL SENDIRI tidak dihantar kepada rider.

3. firebase-rules.json
   - Disertakan salinan Rules yang pengguna muat naik. Struktur rules sedia ada sudah membenarkan penciptaan orders/{id} oleh pengguna yang login dan penciptaan orderContacts/{id}.
   - Tiada perubahan automatik dibuat pada Rules supaya dasar akses sedia ada tidak diubah tanpa ujian projek Firebase sebenar.

PENTING SEBELUM PRODUKSI:
- Deploy fail web ke Netlify.
- Semak Firebase Rules yang disertakan dan pastikan ia masih sama dengan Rules aktif dalam Firebase Console.
- Uji dengan akaun Customer, Vendor dan Rider berasingan.
- Uji satu pesanan HANTAR, satu AMBIL SENDIRI, dua ketikan pantas pada butang hantar, serta dua rider cuba menerima tugasan serentak.
- Ujian hujung-ke-hujung terhadap Firebase sebenar belum boleh dijalankan dari sini. ZIP ini ialah pembaikan kod yang perlu diuji di projek anda.

Aliran HANTAR selepas patch:
Customer create vorders/{vendorUid}/{orderId}
 -> Vendor terima
 -> Vendor transaction create orders/{orderId}
 -> Rider menerima tawaran
 -> Customer fallback semak ID sama dan tidak mencipta order kedua.

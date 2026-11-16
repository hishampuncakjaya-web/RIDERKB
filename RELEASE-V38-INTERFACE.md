# MYRIDERKU V38 — Multi-page Interface Refresh

## Halaman yang dikemas kini
- `index.html` — Customer / tempahan
- `rider.html` — Rider
- `vendor.html` — Vendor
- `admin.html` — Admin
- `shop.html` — Marketplace
- `track.html` — Jejak pesanan

## Arah reka bentuk
- Customer, Rider, Vendor dan Marketplace: tema hijau-putih yang konsisten.
- Admin: konsol operasi gelap dengan kontras tinggi.
- Kad, butang, borang, status dan tab diseragamkan.
- Responsif untuk telefon dan desktop.
- Rider: hierarki status bertugas, peta dan senarai tugasan.
- Vendor: fokus pesanan, menu, jualan dan navigasi bawah.
- Admin: gaya dashboard operasi.

## Skop perubahan
Lapisan CSS/presentation sahaja. Logik Firebase, autentikasi, database rules, tambang, dispatch dan aliran pesanan tidak diubah. Fail baharu `myriderku-v38-design.css` dimuatkan selepas stylesheet sedia ada.

## Deploy
Muat naik semua kandungan folder ini bersama-sama. Pastikan CSS baharu berada pada root yang sama dengan fail HTML. Selepas deploy, refresh halaman atau kosongkan cache jika gaya lama masih dipaparkan.

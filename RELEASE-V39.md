# MYRIDERKU V39

## 1. Pasang 4 app serentak (Customer, Rider, Vendor, Admin)
Punca: semua manifest berkongsi `scope: "./"`. Chrome Android menganggap halaman lain
(rider/vendor/admin) sudah "dalam skop" app pertama yang dipasang, lalu tidak
menawarkan pemasangan app baharu. Kini setiap manifest ada `scope`, `start_url` dan `id`
sendiri (`index.html`, `rider.html`, `vendor.html`, `admin.html`).

Selepas upload:
1. Uninstall app MYRIDERKU & MYRIDERKU Rider lama dari telefon (supaya skop baharu dipakai).
2. Buka `admin.html` dan `vendor.html` di Chrome > menu ⋮ > Pasang app / Add to Home screen.
3. Pasang semula customer dan rider.

## 2. Paparan order & tema
- Admin dan Rider kini TERANG sebagai lalai (ikut tema telefon / butang tema). Mod gelap dilembutkan
  (bukan hitam pekat) dengan kontras lebih baik.
- Kad order admin disusun semula: no. order + status, harga & pecahan, laluan Ambil -> Hantar,
  pelanggan/rider/nota, kemudian butang tindakan.
- Baris maklumat: label tetap di kiri, nilai sejajar kiri (tidak lagi terpecah).
- Lencana status (Auto-sah, selesai, dll.) kini serasi dengan latar.
- Bar amaran (order tiada rider / rider off duty) guna warna terang yang jelas.
- Fail baharu: `myriderku-v39.css`. Fungsi, Firebase, rules dan formula tidak diubah.
- Cache: `myriderku-v39`.

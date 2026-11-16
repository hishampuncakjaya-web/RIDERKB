# MYRIDERKU V41 — Complete UI/UX & Mobile Safety Fixes

Asas: V40 Midnight Sapphire. Ini patch berperingkat yang mengekalkan halaman, aliran kerja, konfigurasi Firebase dan formula sedia ada.

## Penambahbaikan V41
- Lapisan CSS responsif untuk kontras, fokus papan kekunci, saiz sentuhan dan safe-area telefon.
- Kad/modal Rider menggunakan teks cerah yang boleh dibaca pada latar gelap; butang tindakan dikekalkan dengan kontras tinggi.
- Bar anggaran harga Customer diberi ruang skrol tambahan supaya kandungan dan butang bawah tidak tertindih.
- Butang fullscreen peta diberi lapisan susunan yang sesuai; dalam mod fullscreen, peta kekal di atas halaman.
- Borang nombor plat Rider menggunakan dialog dalam aplikasi dan bukannya popup prompt pelayar.
- Service worker dinaik taraf kepada cache V41 supaya fail baharu tidak bercampur dengan cache V40.

## Dikekalkan
- Firebase Realtime Database dan Cloud Functions sedia ada.
- Formula tambang, komisen, wallet, status order dan dispatch tidak diubah.
- Semua portal Customer, Rider, Vendor, Admin dan Tracking dikekalkan.

## Perhatian ujian
- Pemeriksaan statik dan semakan sintaks JavaScript perlu dibuat sebelum release.
- Perlu ujian akhir pada Firebase sebenar, telefon Android sebenar, GPS, push notification, peta dan aliran order hujung-ke-hujung.
- Amaran Leave Site Rider dikekalkan hanya apabila rider mempunyai order aktif berstatus `diterima` atau `diambil`; ini perlindungan supaya tugas tidak tertinggal jika tab ditutup.

## Deploy
Muat naik keseluruhan kandungan ZIP ke Netlify (bukan ZIP bersarang). Jangan ubah Firebase Rules semata-mata untuk patch UI ini.

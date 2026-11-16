# MYRIDERKU V42 — Admin UX Correction

Binaan ini meneruskan V41 dan mengekalkan Firebase, struktur portal serta logik pesanan sedia ada.

## Pembetulan
- Kad statistik Admin menggunakan teks bernilai kontras tinggi dan susun atur grid responsif.
- Senarai Rider ditukar kepada kad profil yang lebih padat dan mudah dibaca.
- Butang Lulus, Wallet, Tolak, Gantung, Reset dan Padam disusun dalam grid dua lajur pada telefon; label tidak lagi dipaksa menegak dalam lajur sempit.
- Tab Admin kekal boleh ditatal secara mendatar.
- Warna dan tipografi Admin diseragamkan dengan tema navy, putih krim dan emas/hijau.

## Deploy
Muat naik kandungan ZIP ini ke Netlify. Firebase config, rules dan data tidak diubah oleh patch UI ini.

## Nota ujian
Pemeriksaan sintaks JavaScript dan integriti ZIP perlu dibuat selepas binaan. Ujian langsung Firebase, login, tindakan wallet dan aliran tempahan masih perlu disahkan pada site sebenar.

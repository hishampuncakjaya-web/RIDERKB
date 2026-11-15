# Setup Firebase (sekali sahaja, ±10 minit)

Projek: **RiderKB** (`riderkb-fe7e1`)

## 1. Realtime Database
Firebase Console > **Build > Realtime Database > Create Database**
- Lokasi: Singapore
- Mod: **Locked mode**
Salin URL database (cth `https://riderkb-fe7e1-default-rtdb.asia-southeast1.firebasedatabase.app`).

## 2. Rules
Tab **Rules** > padam semua > tampal isi `database.rules.json` > tukar `admin@riderkb.com` kepada e-mel admin sebenar (huruf kecil) > **Publish**.

## 3. Akaun admin & rider
**Build > Authentication > Get started > Email/Password > Enable.**
Tab **Users > Add user**: buat akaun admin `admin@riderkb.com` **dahulu sekali** (sebelum kongsi pautan rider supaya orang lain tak boleh daftar e-mel ni).
Rider tak perlu dibuat di sini: mereka daftar sendiri di `/rider.html` dan menunggu kelulusan admin.

## 4. Config web app
**Project settings (ikon gear) > Your apps > Web (`</>`)** > daftar app > salin `apiKey`, `appId`.
Buka `firebase-config.js` dan isi `apiKey`, `appId`, `databaseURL`, serta tukar `admins` kepada e-mel admin.

## 5. Upload ke Netlify
Upload semula zip. Pautan:
- Customer: `/` (index.html)
- Rider: `/rider.html`
- Admin: `/admin.html`
- Jejak order: `/track.html?id=...` (pautan automatik dalam mesej WhatsApp)

## Cara guna
1. Customer hantar tempahan: masuk ke database dan WhatsApp, pautan jejak keluar.
2. Rider daftar di `/rider.html`, admin tekan **✅ Lulus** di panel Rider (`/admin.html`). Selepas lulus, rider log masuk, dengar bunyi bila ada order baru, tekan **Terima**, kemudian **Barang dah diambil**, kemudian **Selesai**. Lokasi dikongsi automatik semasa ada order aktif.
3. Customer nampak status dan 🛵 bergerak live di peta.
4. Admin nampak semua order, rider online, hasil harian, boleh tugaskan rider, batal, padam dan eksport CSV.

## Nota keselamatan
- Pelanggan tak perlu log masuk. Link jejak sukar diteka (10 aksara rawak).
- Hanya akaun e-mel/kata laluan (rider/admin) boleh lihat senarai order. Hanya e-mel admin dalam rules boleh padam order.
- Skala percuma (Spark) cukup untuk permulaan.

## Ciri baru (v12)
- **Garis peta ikut fasa:** selepas terima, rider->ambil terang dan ambil->hantar kabur. Selepas "Barang dah diambil", garis rider->hantar terang sahaja. Selepas selesai, customer tak nampak lokasi rider lagi.
- **Kelajuan & amaran kamera/AES:** rider nampak kelajuan di peta. Admin tambah lokasi kamera/AES di peta admin; data OpenStreetMap turut digunakan (tak lengkap).
- **Order terdekat dulu:** pop up order sampai kepada rider terdekat dahulu (tawaran lebih lewat untuk rider lebih jauh).
- **Wallet:** order TUNAI hanya boleh diterima rider yang baki wallet >= `walletMinCash` + anggaran harga barang. Admin tambah/tolak wallet di panel Rider.
- **Pop up selesai:** ucapan dan doa untuk rider dan customer.
- **PENTING:** Tampal semula `database.rules.json` ke Realtime Database > Rules > Publish.

**Peraturan wallet:** order tunai hanya boleh diterima rider yang baki wallet >= anggaran harga barang (+ `walletMinCash` jika ditetapkan). Job nilai tinggi hanya sampai kepada rider yang cukup wallet.

## Kategori kedai (v17)
- Customer: 18 kategori (8 teratas + butang Lagi), carian nama, 🔁 Kerap, dan kedai pilihan admin ⭐.
- Admin: kad **Kedai pilihan** untuk tambah kedai (nama, kategori, lokasi di peta, waktu, hari buka).
- **PENTING:** tampal semula `database.rules.json` (ada nod `shops` baru) ke Rules > Publish.

## Kemas kini (v18)
- **PENTING:** tampal semula `database.rules.json` ke Rules > Publish (ada medan `email` rider).
- Admin: peta tunjuk rider yang ada job walaupun isyarat lama (marker pudar), serta laluan terang setiap job aktif.
- Lupa kata laluan: rider tekan "🔑 Lupa kata laluan?" di login, atau admin tekan "🔑 Reset" di panel Rider (hantar e-mel tetapan semula).

## Kemas kini (v19) – keselamatan & pengalaman pengguna
- **PENTING:** tampal semula `database.rules.json` ke Realtime Database > Rules > Publish. Peraturan baru: had tempahan (1 tempahan / 30 saat setiap nombor telefon), semakan panjang medan, penilaian pelanggan, laporan/SOS, bukti hantar, plat rider. Fail lama disimpan sebagai `database.rules.previous.json` jika perlu kembali.
- Selepas publish, **uji satu tempahan** dari halaman customer untuk pastikan ia masuk ke admin.
- **App Check (halang bot/spam):** Firebase Console > Build > App Check > daftar app Web dengan **reCAPTCHA v3** (dapatkan site key dari google.com/recaptcha/admin) > salin site key ke `appCheckKey` dalam `firebase-config.js`. Biarkan mod *Unenforced* beberapa hari, semak metrik, kemudian *Enforce* untuk Realtime Database.
- Customer: anggaran masa sampai, alamat Rumah/Pejabat (disimpan dalam telefon sahaja), tempah semula, notifikasi status (semasa halaman jejak dibuka), lapor masalah, penilaian bintang, bukti hantar.
- Rider: no. plat, butang "Dah sampai di lokasi ambil", gambar bukti hantar, butang SOS, pendapatan 7 hari/bulan ini, purata penilaian. Nombor telefon customer disembunyikan selepas order selesai.
- Admin: panel Laporan & SOS (bunyi amaran), penilaian pada order, plat rider.

## Kemas kini (v20) – tema & pengalaman pengguna
- Tema baharu `theme.css` (marun songket + emas) dipakai di semua halaman. Ubah warna di bahagian `:root` fail itu sahaja.
- Halaman tempah: kawasan panas, alamat tersimpan dan cari kedai dilipat dalam satu bahagian; medan utama (ambil/hantar) di atas.
- Loghat Kelantan (hidup secara lalai) untuk teks status dan sapaan; pengguna boleh matikan dengan butang "🗣️ Loghat". Arahan penting kekal BM jelas.
- Perayaan (confetti + mesej) bila order selesai; hormati tetapan "kurangkan gerakan" peranti.

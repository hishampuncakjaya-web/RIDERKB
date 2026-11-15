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

## Kemas kini (v21) – pengesahan customer & tempahan lebih selamat
- **PENTING:** tampal semula `database.rules.json` ke Realtime Database > Rules > Publish. Salinan peraturan sebelum ini ada dalam `database.rules.v20.json` jika perlu kembali.
- **Pengesahan customer:** lepas rider tekan "Hantar selesai", halaman jejak tunjuk "Dah terima" / "Belum terima". Tiada tindakan = auto-sah selepas `confAutoMin` minit (lalai 30). "Belum terima" terus masuk panel Laporan & SOS admin. Rider tak tersekat dan upah tak ditahan.
- **Semakan jarak rider:** "Dah sampai di lokasi hantar" dan "Hantar selesai" ditolak jika rider lebih `dropRadiusM` meter (lalai 300) dari lokasi hantar. Jarak (atau "tiada GPS") direkod pada order dan ditanda di panel admin. Ini semakan di sisi app; ia mengurangkan salah guna, bukan jaminan mutlak.
- **Tempahan customer:** WhatsApp dibuka hanya selepas order benar-benar masuk sistem; ada timeout 8 saat, mesej ralat jelas, butang dikunci selepas hantar, cuba semula tak jadi order berganda, dan jam telefon yang salah tak lagi menolak order (guna masa pelayan).
- **Rules baharu:** `pay`, `price`, `need`, `itemEst` disemak semasa order dicipta; nod `conf` boleh ditulis sekali sahaja selepas order selesai.
- **Masih perlu dibuat:** aktifkan **App Check (reCAPTCHA v3)** dan isi `appCheckKey`. Tanpa ini, had 30 saat per nombor telefon masih boleh dipintas dengan menukar nombor.
- **Butang lebih mudah (v21):** selepas hantar, butang bawah jadi "📡 Jejak order saya" dan "＋ Baru" (tiada lagi butang mati). Bar bawah disorok semasa menaip supaya tak tutup ruang. Langkah ada label jelas. Halaman jejak guna helaian pilihan sebab (satu ketik) ganti kotak prompt, dan ada "🔁 Tempah lagi". Kad order rider dikemas: Call, WhatsApp dan satu butang navigasi ikut fasa; yang lain dalam "⋯ Lagi"; SOS kekal nampak. Nombor customer tak lagi boleh dihubungi dari order yang dah selesai.
- **Tempah dalam 5 langkah (v21):** Ambil > Hantar > Servis > Kontak > Sahkan. Langkah Ambil dan Hantar kongsi satu peta (skrin penuh dan keluar berfungsi seperti biasa); peta letak pin ikut langkah semasa. Lokasi semasa customer diisi automatik sebagai lokasi hantar, jadi langkah Hantar biasanya cuma semak dan tekan Seterusnya.

## Kemas kini (v22): lebih mudah guna
- **PENTING:** tampal semula `database.rules.json` ke Realtime Database > Rules > Publish (ada nod `settings` baharu).
- **Customer: 3 langkah sahaja** (Lokasi, Butiran, Sahkan). Pin ambil dan hantar dalam satu skrin, pin seterusnya dipilih automatik. Nota ada chip cepat ikut servis. Nama/telefon disemak dengan mesej jelas di bawah ruangan. Skrin Sahkan tunjuk pecahan upah (asas, jarak, kereta, hujan).
- **Tema Cerah / Gelap / Auto** di semua halaman (butang tema). Cerah sesuai untuk rider di bawah matahari.
- **Admin > Tetapan:** tukar upah asas, KM asas, RM/KM lebihan, caj kereta, caj hujan, nombor WhatsApp pusat dan butiran bayaran (bank, no. akaun, QR) tanpa upload semula. Customer terus guna nilai baharu. Jika kosong, nilai asal dalam app digunakan.
- **Admin > Tab:** Order, Peta, Rider, Kedai & Kamera, Tetapan. Lencana nombor pada tab (order baru, rider menunggu). Laporan/SOS sentiasa muncul di atas bila ada.
- **Amaran order tiada rider** lebih X minit (tetapan `Amaran order tiada rider`), dengan bunyi.
- **Bayaran Transfer/QR:** butiran bayaran dipaparkan kepada customer semasa tempah, dan di halaman jejak bila barang dah diambil/selesai (ada butang salin no. akaun).
- **Rider:** butang 🚙 Waze di sebelah 🧭 Google Maps; butang tema.
- **Jejak:** butang "Kongsi pautan jejak" (kongsi ke WhatsApp/keluarga).
- **Alamat (Nominatim):** permintaan dihadkan 1 sesaat dan dicache, supaya tak disekat bila ramai guna.

## 6. Vendor (BAHARU, v23)
**Wajib dahulu:** Realtime Database > Rules > tampal isi `database.rules.json` yang baharu (ada bahagian `vendors`, `vshops`, `vmenu`, `vorders`, `vpayouts`) > pastikan e-mel admin betul > **Publish**. Peraturan lama disimpan sebagai `database.rules.v22.json`.

Pautan vendor: `/vendor.html`
1. Vendor daftar sendiri (nama, telefon, nama kedai, e-mel, kata laluan).
2. Admin: `/admin.html` > tab **🏪 Vendor** > **✅ Lulus** .
3. Vendor log masuk > isi profil kedai (tekan 📍 untuk lokasi) > tambah produk di tab **Menu** > buka kedai.
4. Order masuk dengan bunyi berulang sehingga dijawab. Terima (stok ditolak automatik), siap, serah. Tolak/batal memulangkan stok.
5. Bayaran: admin tekan **↻ Kira bayaran** > **💸** pada vendor > jumlah direkod (jumlah = harga asal vendor). Vendor nampak di tab Jualan.

Nota: order pelanggan ke vendor (struktur `vorders/<uidVendor>/<idOrder>`) disambung di Peringkat 3 (app customer). Struktur dan peraturannya sudah sedia dan diuji.

Keselamatan vendor:
- Vendor hanya boleh baca/tulis data kedai sendiri. Tak boleh luluskan diri sendiri atau ubah komisen.
- Vendor tak boleh ubah jumlah, nama atau telefon pelanggan pada order. Status hanya boleh maju mengikut aliran.
- Order hanya diterima jika kedai berstatus lulus dan BUKA. Vendor digantung terus tak boleh terima order.
- Had percubaan order (ratelimit) dan pengesahan medan dikuatkuasakan di pelayan.

## 7. Kongsi hasil (v24)
**Wajib selepas publish rules:** buka `/admin.html` > **Tetapan** > semak **Bahagian rider (80%)** dan **Markup vendor (10%)** > **Simpan tetapan** (sekali sahaja, supaya nilai wujud dalam database; tanpa ini order vendor akan ditolak).

- **Rider 80/20:** upah RM10 => rider nampak RM8.00 sahaja. Peratusan dan untung platform (RM2) hanya dipaparkan di admin (stat, baris order, CSV).
- **Vendor +10%:** vendor letak harga RM100 => vendor terima RM100, pelanggan bayar RM110, untung platform RM10. Vendor tak nampak jumlah pelanggan dalam app (hanya "Anda terima").
- Peraturan Firebase mengesahkan jumlah order = harga vendor × (1 + markup) di pelayan, jadi pelanggan tak boleh bayar kurang. Upah rider (`riderPay`) turut disahkan.
- Tukar peratusan pada waktu sunyi. Order lama kekal guna nilai asal; pelanggan yang skrinnya dibuka sebelum perubahan perlu muat semula.
- Had sebenar: peratusan disimpan dalam `settings` yang boleh dibaca app, jadi orang yang tahu menggunakan alat pembangun boleh menjumpainya. App hanya menyembunyikannya daripada paparan. Penyembunyian sepenuhnya memerlukan pelayan (Cloud Functions).

## Kemas kini (v25)
- Ikon berbeza setiap app (Pelanggan biru, Rider oren, Vendor hijau, Admin ungu) dan nama app berbeza (Rider KB, KB Rider, KB Vendor, KB Admin). Admin kini ada manifest sendiri.
- **Pasang semula app di telefon:** buang ikon lama dari skrin utama, buka semula pautan masing-masing di Chrome, kemudian "Pasang app". Android menyimpan ikon lama untuk app yang sudah dipasang.
- Akaun admin yang tersangkut di /rider.html atau /vendor.html kini nampak mesej jelas (bukan skrin kosong).
- **PENTING (PERMISSION_DENIED):** tampal semula `database.rules.json` ke Realtime Database > Rules > Publish.

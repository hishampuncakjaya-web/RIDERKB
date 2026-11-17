MYRIDERKU V77 — MATRIX DIAGNOSTIC & MAINTENANCE
================================================

Perubahan:
- Matrix Digital Rain overlay semasa scan.
- Health checks menggunakan respons sebenar: network/origin, Firebase .info/connected,
  Firebase Auth session, GPS timestamp Rider, Open-Meteo weather API, notification
  permission dan localStorage read/write.
- Cloudinary hanya mengesahkan konfigurasi cloudName/uploadPreset. Ia TIDAK membuat
  upload ujian, supaya tiada fail ujian dicipta. Status konfigurasi akan kekal AMARAN.
- Admin sahaja mendapat kawalan Maintenance Mode pada path:
  /system/maintenance
- Customer, Rider dan Vendor menerima notis jika maintenance diaktifkan.

PENTING — FIREBASE RULES:
Kawalan Admin dalam UI bukan keselamatan. Sebelum guna Maintenance Mode, tambah
peraturan khusus di bawah /system/maintenance dalam Firebase Realtime Database Rules
yang hanya membenarkan Admin yang telah disahkan membaca/menulis path ini.
Jangan longgarkan rules sedia ada. Contoh konsep (sesuaikan dengan struktur admin
yang sudah digunakan dalam rules projek):

"system": {
  "maintenance": {
    ".read": "auth != null",
    ".write": "auth != null && auth.token.email_verified == true && auth.token.email == 'ADMIN_EMAIL_ANDA'"
  }
}

Gantikan ADMIN_EMAIL_ANDA dengan e-mel admin sebenar. Jika projek menggunakan custom
claims atau senarai UID admin dalam database, gunakan kaedah autorisasi sedia ada
yang lebih kukuh. Jangan terus paste snippet ini jika bercanggah dengan rules sedia ada.

SKOP MAINTENANCE V77:
Maintenance Mode dalam versi ini ialah suis status + notis masa nyata kepada pengguna.
Ia TIDAK menyekat semua transaksi atau menutup semua halaman secara automatik.
Untuk hard maintenance (menyekat create/update order, wallet, vendor dan rider actions),
perlu integrasi flag ini ke semua laluan tulis dan enforce di Firebase Rules/server.
Jangan anggap banner sebagai enforcement keselamatan.

PENGUJIAN:
1. Deploy sebagai Netlify Preview.
2. Log masuk Admin dan buka MISSION CONTROL.
3. Jalankan scan. Sahkan keputusan Firebase, Auth, GPS dan cuaca.
4. Semak Cloudinary: jika konfigurasi lengkap ia akan memaparkan AMARAN kerana upload
   sebenar tidak dibuat.
5. Aktifkan Maintenance hanya selepas Firebase Rules dilindungi.
6. Buka Customer/Rider/Vendor dan sahkan notis maintenance muncul.
7. Pulihkan operasi dari Admin dan pastikan notis hilang.

Tiada perubahan disengajakan pada tambang, wallet, dispatch atau aliran pesanan.

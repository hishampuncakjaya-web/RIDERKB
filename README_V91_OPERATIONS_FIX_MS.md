# MYRIDERKU V91 — Marketplace & Operations Fix

Tarikh binaan: 18 November 2026  
Asas: `MYRIDERKU_V90_MARKETPLACE_FIX_STAGING.zip` (Master Build Firebase V89)

## Perubahan V91

1. Markup Marketplace diseragamkan kepada tepat 10% pada paparan Customer dan backend. Tiada minimum RM1 dikenakan secara automatik.
2. Caj penghantaran marketplace menggunakan formula anggaran garis lurus × 1.3 di kedua-dua client dan backend, supaya anggaran checkout konsisten. Kadar: RM5 untuk 5 KM pertama, kemudian RM1 bagi setiap KM tambahan.
3. Rekod pesanan Marketplace menyimpan `fee` dan `deliveryFee` untuk keserasian paparan Jejak dan aliran dispatch Rider.
4. Customer membatalkan pesanan Marketplace melalui Callable; bukan write terus ke RTDB.
5. Customer membatalkan pesanan Rider melalui Callable; hanya pemilik boleh batal dan hanya sebelum Rider claim.
6. Vendor boleh batal status `baru`, `diterima` atau `siap` jika Rider belum claim. Jika Rider sudah claim, backend menolak pembatalan Vendor supaya rekod Rider/Wallet tidak rosak.
7. Pickup Marketplace tidak lagi mencipta rekod global `/orders` atau masuk ke dispatch Rider. Hanya pesanan penghantaran dihantar ke feed Rider.
8. Rider upload bukti melalui Callable yang mengesahkan pemilikan pesanan dan status.
9. Rules calon membenarkan Rider yang ditugaskan mengemas kini `riderLoc`; Customer boleh menghantar rating untuk pesanan sendiri yang selesai.
10. Stock Vendor dipulangkan hanya selepas pembatalan berjaya; jika penerimaan gagal selepas stock ditolak, stock dipulihkan.
11. Cache Service Worker dinaik taraf kepada `myriderku-v91-marketplace-ops`.
12. Ditambah `firebase.json` dan `.firebaserc` untuk projek `riderkb-fe7e1`.

## Deployment — jangan deploy ke LIVE sebelum ujian

Keperluan: Node.js 20, Firebase CLI terkini, akses projek `riderkb-fe7e1`.

```bash
cd functions
npm install
cd ..
firebase use riderkb-fe7e1
firebase emulators:start --only auth,database,functions,hosting
```

Selepas ujian Emulator dan semakan akaun/Rules:

```bash
firebase deploy --only functions
firebase deploy --only database
firebase deploy --only hosting
```

`database.rules.V85_3_CANDIDATE.json` ialah calon Rules, bukan Rules yang telah diuji pada data produksi. Semak Rules sedia ada dan jalankan ujian role silang sebelum deploy `database`.

## Konfigurasi yang perlu disahkan dalam Firebase Console

- Authentication: Email/Password dan Anonymous Authentication aktif.
- Admin `mnhzuan@gmail.com`: akaun wujud, kata laluan betul, e-mel disahkan.
- Vendor: `vshops/{uid}/open=true`, `vshops/{uid}/lat`, `lng`, `approved` dan menu `vmenu/{uid}` sah.
- Functions secrets WhatsApp: `WA_ACCESS_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_VERIFY_TOKEN`, `WA_OTP_PEPPER` disediakan jika OTP WhatsApp digunakan.
- Project region: `asia-southeast1`.
- Semak Firebase RTDB URL dan web app config sebelum deploy.

## QA yang dijalankan di sini

- ZIP extraction/integrity: PASS.
- `node --check` backend, bridge, common.js dan service worker: PASS.
- Inline scripts HTML: 17 blok diperiksa, 0 syntax error.
- JSON parse Firebase Rules, firebase.json, package.json dan manifests: PASS.
- Pemeriksaan padanan Callable client/backend: PASS.
- Pemeriksaan statik Marketplace checkout, cancellation, pickup/delivery split, Rider proof dan rules: PASS.

## Belum boleh disahkan tanpa persekitaran Firebase

- Firebase Emulator Auth/RTDB/Functions end-to-end.
- Akses akaun sebenar Admin, Vendor, Rider dan Customer.
- Meta WhatsApp OTP delivery.
- Google/OSM map tile dan GPS pada Android sebenar.
- Transaksi Rider accept serentak, wallet/COD concurrency dan load test.
- Deployment Firebase Hosting/Functions/Rules.

**Status: V91 STAGING CANDIDATE — belum release produksi.**

## V91.1 — Customer tanpa OTP wajib + anti-penipuan berasaskan risiko

Perubahan tambahan pada V91:

- OTP WhatsApp tidak lagi menjadi prasyarat untuk menyimpan profil atau menghantar pesanan Customer.
- Customer masih perlu sesi Firebase Auth (Anonymous Auth disokong), nama, nombor telefon dan alamat yang sah.
- Fungsi `saveCustomerProfile` menyimpan profil tanpa menandakan nombor sebagai `phoneVerified`.
- `createCustomerOrder` tidak lagi menolak pesanan semata-mata kerana `phoneVerified !== true`.
- Akaun yang disekat Admin tetap ditolak.
- Pengiraan tambang kekal di backend; nombor telefon dinormalisasi dan disimpan dalam `orderContacts`.
- Pencegahan spam: semakan pesanan hampir serupa dalam 2 minit, had kekerapan per UID/telefon, dan skor risiko berasaskan corak berulang.
- Skor risiko 3 atau lebih menghasilkan status `semakan_admin` dan rekod di `customerOrderReviews`; pesanan ini tidak masuk ke feed Rider yang hanya mengambil status `baru`.
- OTP backend dikekalkan sebagai pilihan step-up verification pada masa hadapan; ia bukan lagi sebahagian daripada aliran wajib Customer.
- WhatsApp masih dibuka selepas pesanan berjaya disimpan; pelanggan perlu menekan Send. Auto-reply Meta Business Agent perlu dikonfigurasi berasingan pada WhatsApp Business.

### Batasan ujian V91.1

Pemeriksaan sintaks/static boleh dibuat pada pakej ini. Ujian Firebase Emulator, semakan Rules sebenar, pengujian beban serentak, dan deployment ke projek `riderkb-fe7e1` belum dijalankan. Status `semakan_admin` perlu diuji pada panel Admin sebenar sebelum produksi; jangan anggap ia sudah menjadi release produksi.

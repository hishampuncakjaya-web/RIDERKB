MYRIDERKU V91.7 — LIVE RADAR RIDER DETAILS

Asas: pakej V91.6 ALL MAPS STANDARD.

Perubahan:
1. Admin: klik marker Rider membuka butiran nama, telefon, jenis kenderaan, nombor pendaftaran, status tugasan, kelajuan/arah (jika tersedia), umur GPS dan pesanan aktif.
2. Customer Tracking: klik marker Rider membuka butiran Rider, telefon, kenderaan, nombor pendaftaran, status penghantaran dan kesegaran GPS.
3. Rider: klik marker lokasi sendiri membuka butiran profil dan status GPS sendiri.
4. Vendor: setiap pesanan yang mempunyai Rider memaparkan panel butiran Rider yang boleh dibuka. Nombor telefon untuk panggilan/WhatsApp dipaparkan jika tersedia.
5. Cloud Function acceptOrder menyalin butiran Rider minimum ke rekod vorders milik Vendor bagi pesanan yang sepadan.
6. Callable riderPublishLocation mengesahkan Rider pemilik tugasan, koordinat dan masa GPS, kemudian menyalin lokasi semasa ke rekod pesanan Vendor. Rider menghantar snapshot ini setiap 15 saat ketika ada tugasan aktif.
7. Status Rider dalam salinan Vendor dikemas kini apabila status pesanan bertukar.

Privasi:
- Vendor hanya menerima butiran Rider bagi pesanan milik kedainya; tidak diberi akses kepada keseluruhan nod riders.
- Customer Tracking hanya memaparkan Rider yang ditugaskan kepada pesanan tersebut.
- Admin melihat maklumat mengikut peranan Admin.

Ujian yang dijalankan:
- node --check functions/index.js: lulus.
- node --check v81-callables.js: lulus.
- Semakan sintaks semua blok JavaScript inline dalam admin.html, rider.html, vendor.html, customer.html dan customer-track.html: lulus.
- Integriti ZIP: disahkan selepas arkib dibina.

Belum diuji:
- Firebase Emulator / live Firebase project.
- Rules dan kebenaran callable pada akaun setiap role.
- Ujian GPS langsung pada Android, background/lock-screen dan rangkaian lemah.
- Deployment Hosting / Functions.

PENTING: Ini calon STAGING. Deploy Cloud Functions (termasuk riderPublishLocation) dan hosting bersama sebelum menguji Vendor live tracking. Jangan anggap lokasi Vendor live sehingga callable baharu telah dideploy dan ujian end-to-end lulus.

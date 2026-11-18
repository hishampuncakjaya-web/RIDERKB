# MYRIDERKU V91.3 — Rider GPS & Job Integrity Patch

## Perubahan
1. Rider tidak ditandakan Online sebelum koordinat GPS pertama diterima dan disahkan.
2. Jika GPS ditolak/tidak tersedia/timeout, status Online diturunkan ke false dan UI memaparkan amaran.
3. Backend `acceptOrder` kini menolak Rider yang tiada koordinat sah atau heartbeat lokasi lebih 90 saat.
4. Backend menghalang peralihan `diterima -> diambil` tanpa rekod ketibaan pickup dan gambar bukti pickup.
5. Backend menghalang peralihan `diambil -> selesai` tanpa rekod ketibaan drop-off dan gambar bukti penghantaran.
6. `riderSaveProof` hanya menerima bukti pickup/drop pada status dan selepas ketibaan yang sepadan.

## Semakan yang dijalankan
- `node --check` pada `functions/index.js`: LULUS.
- Ekstrak semua blok JavaScript inline `rider.html`, kemudian `node --check`: LULUS.
- Semakan struktur dan kandungan ZIP: dibuat selepas pembungkusan.

## Belum diuji
- Firebase Emulator dan rules sebenar.
- Dua Rider menerima order serentak.
- GPS sebenar pada Android apabila skrin dikunci / aplikasi di latar belakang.
- Upload bukti foto sebenar dan perubahan status pada Firebase.
- Deployment Firebase Hosting / Cloud Functions production.

## Nota operasi
Patch ini mengekalkan Firebase Realtime Database dan Cloud Functions di `asia-southeast1`. `acceptOrder` masih menggunakan transaksi atomik di root untuk memastikan tuntutan order dan reservasi wallet COD berlaku bersama. Ini mengurangkan risiko tuntutan berganda tetapi boleh menyebabkan contention; perlu ujian beban sebelum skala production.

Jangan deploy fail `database.rules.V85_3_CANDIDATE.json` tanpa audit berasingan terhadap semua rules. Pakej ini ialah calon staging, bukan pengesahan production.

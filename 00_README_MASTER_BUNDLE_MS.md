# MYRIDERKU — MASTER BUNDLE V83.1

Bundle ini menyatukan fail projek dan pakej kerja V81 hingga V83.1 yang tersedia dalam sesi ini.

## Struktur
- `01_PROJECT_SOURCE_V82_1/` — salinan projek penuh daripada arkib V82.1 (baseline kod lengkap terkini yang tersedia).
- `02_VERSION_PACKAGES/` — arkib asal V81 WhatsApp OTP, V82.1, V82.2, V82.3, V82.4, V83 dan V83.1.

## Status penting
Ini ialah **bundle sumber dan audit**, bukan pakej deployment siap guna.

1. V82.2 ialah patch nod privasi + laporan audit.
2. V82.3 Rules ialah candidate yang berasal daripada fail Rules Library; belum disahkan sama dengan Firebase Production Rules.
3. V82.4 ialah laporan audit keserasian statik.
4. V83 checkout/payment ialah spesifikasi dan adapter fail-closed; integrasi TnG belum aktif.
5. V83.1 RiderPay ialah candidate callable dan Rules snippet; belum digabungkan ke `functions/index.js`, belum ada Customer wallet UI, belum ada proses top-up sebenar.
6. Tiada Firebase Emulator tests dijalankan.
7. Tiada Production Rules/data diubah, tiada deployment dan tiada Blaze diaktifkan.

## Cara guna
- Gunakan `01_PROJECT_SOURCE_V82_1/` sebagai sumber projek untuk kerja sambungan.
- Baca setiap README/spec dalam pakej berkaitan sebelum merge.
- Jangan terus publish `V82_3_FULL_RULES_CANDIDATE.json`.
- Jangan deploy fail `.STUB.js.txt` atau `.CANDIDATE.js.txt` tanpa merge, review, test dan kelulusan.
- Jangan upload keseluruhan Master Bundle ke Netlify sebagai aplikasi; ia mengandungi arkib dan fail audit.

## Cadangan susunan kerja selepas bundle
1. Sahkan Rules sebenar yang sedang aktif di Firebase Console.
2. Integrasikan V82.2/V82.3 rules secara selamat selepas audit lengkap.
3. Betulkan callable dan front-end yang ditemui dalam V82.4.
4. Gabungkan RiderPay V83.1 ke backend dan UI; bina ujian Emulator.
5. Sambungkan TnG hanya selepas merchant/provider rasmi dan webhook tersedia.

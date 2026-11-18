# MYRIDERKU MASTER BUILD V89 — AUDIT MERGED (18 NOVEMBER 2026)

## Kandungan / asas
- Front-end root diambil daripada MYRIDERKU_V88_AUDIT_PATCH.zip (V88 berasaskan V87).
- Backend Cloud Functions `functions/index.js` dan `functions/package.json` dibawa daripada MYRIDERKU_V85_3_INTEGRATED_CANDIDATE.
- `database.rules.V85_3_CANDIDATE.json` dikekalkan sebagai calon sahaja; bukan Rules produksi.
- Konfigurasi Firebase projek `riderkb-fe7e1` dikekalkan. Tiada deploy atau perubahan data produksi dibuat.

## Pembaikan yang digabungkan
1. Kekalkan pembaikan peta V88: kawalan zoom Leaflet, double-click/double-tap, pinch/touch zoom dan butang skrin penuh/Escape.
2. Peta Vendor: tambah pengendalian tile error, semakan Leaflet, invalidateSize selepas panel dipaparkan dan ResizeObserver.
3. FCM: pendaftaran Service Worker secara eksplisit di root untuk role login.
4. Kekalkan `firebase-messaging-sw.js` V88 di root deployment.
5. Kekalkan label tambang akhir dan mesej PERMISSION_DENIED neutral daripada V88.
6. Bawa masuk callable `listRiderOrders` V85.3 bersama bridge frontend yang telah sedia ada dalam V88.

## Had penting — belum production-ready
- `firebase-config.js` masih mempunyai `vapidKey` kosong. Push FCM tidak akan berfungsi sehingga VAPID public key sebenar dimasukkan dalam konfigurasi. Tiada key direka.
- `listRiderOrders` perlu dibandingkan dengan Cloud Functions yang sedang deployed dan diuji menggunakan log sebenar. Ralat `internal` tidak boleh diselesaikan dengan meneka.
- Marketplace checkout masih memerlukan callable `createMarketplaceOrder`; V85.3 audit menyatakan UI masih menulis terus ke `/vorders`, `/orders` dan `/orderContacts`.
- Customer tracking masih memerlukan aliran token tracking selamat dan ujian lintas sesi.
- Rules calon mesti diuji melalui Firebase Emulator dan semakan data awam `/vshops` serta `/vmenu`. Jangan deploy terus.
- Cuaca, GPS, dispatch, wallet/COD, payment, WhatsApp, radar dan notifikasi memerlukan ujian staging/browser/peranti sebenar.

## Ujian automatik dalam build ini
- ZIP integrity: PASS ketika dibina.
- JSON config/rules parse: diperiksa semasa build.
- Node syntax check: lihat `V89_BUILD_QA_REPORT.json`.
- Firebase Emulator, Netlify staging, Android dan transaksi sebenar: NOT RUN.

## Arahan deployment
Ini ialah pakej audit/merge untuk staging sahaja. Jangan upload sebagai production release sebelum release gate ditutup. Deploy Firebase Functions hanya selepas semakan kod, dependency, environment dan log. Jangan deploy Rules calon tanpa Emulator test.

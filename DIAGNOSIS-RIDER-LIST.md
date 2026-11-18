# Diagnosis ralat Rider: “Tak dapat memuatkan tugasan: internal”

## Apa yang disahkan daripada kod `main`
- `rider.html` memanggil `MYRIDERKU_V81.listRiderOrders()`.
- `v81-callables.js` ialah bridge callable yang memetakan nama itu kepada Cloud Function `listRiderOrders`.
- `index.js` mengeksport `listRiderOrders` di region `asia-southeast1`.
- Function itu memerlukan Rider authenticated, `riders/{uid}.approved === true`, dan `suspended !== true`, kemudian membaca root `orders` melalui Firebase Admin SDK.
- UI Rider sudah memaparkan `e.message` atau `e.code`; screenshot “internal” bermakna callable memulangkan kod internal atau ralat generik, bukan bukti yang cukup untuk menukar syarat kelulusan.

## Semakan yang perlu dibuat di Firebase Console
1. Buka Firebase project `riderkb-fe7e1`.
2. Functions → `listRiderOrders` → Logs.
3. Tapis masa ketika Rider tekan/refresh senarai tugasan.
4. Salin mesej exception penuh (jangan kongsi token, secret, atau data pelanggan).
5. Pastikan function `listRiderOrders` benar-benar deployed di `asia-southeast1` dan deployment terakhir berjaya.
6. Pastikan Rider yang diuji mempunyai `approved: true` dan bukan `suspended: true` dalam `riders/{uid}`.

## Deploy (hanya selepas log dikenal pasti dan semakan staging)
Jangan deploy semua functions secara rambang. Selepas kod backend disahkan, deploy function berkaitan sahaja dari folder functions menggunakan Firebase CLI:

`firebase deploy --only functions:listRiderOrders --project riderkb-fe7e1`

Jika log menunjukkan `permission-denied`, `unauthenticated`, `database/permission_denied`, atau function belum wujud, pembaikan berbeza diperlukan. Jangan menukar rules atau melonggarkan akses pangkalan data untuk menutup ralat ini.

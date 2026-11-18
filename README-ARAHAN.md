# MYRIDERKU_FIX_COMPLETE

Folder ini disusun untuk upload melalui GitHub telefon. Fail deployment berada terus di root folder ini.

## Fail
- `firebase-messaging-sw.js` — background worker Firebase Cloud Messaging. Ia perlu berada di ROOT deployment, sama aras dengan `rider.html` dan `index.html`.

## Dapatan semakan pada `RIDERKB/main`
- `firebase-messaging-sw.js` memang sudah wujud di root repo main (SHA ketika disemak: `1335c97fec5951b75d024ab8ee6bf705101390f9`).
- `firebase-config.js` mengandungi `vapidKey: ""`. Push tidak boleh diaktifkan sepenuhnya sehingga Web Push certificate key sebenar dimasukkan daripada Firebase Console > Project settings > Cloud Messaging > Web Push certificates.
- `common.js` hanya memanggil `getToken()` apabila `RKB_CFG.vapidKey` diisi dan menggunakan `navigator.serviceWorker.ready`.
- `listRiderOrders` memerlukan rider authenticated, approved dan tidak suspended. Ralat `internal` memerlukan Cloud Functions logs; jangan ubah backend secara rambang.
- Peta Vendor menggunakan Leaflet dan OpenStreetMap. Koordinat tersimpan tidak membuktikan tile peta berjaya dimuatkan.

## Cara upload
1. Buka `hishampuncakjaya-web/RIDERKB`, branch `main`, pada root repo.
2. GitHub > Add file > Upload files.
3. Upload `firebase-messaging-sw.js` ke root repo. Jika GitHub menyatakan fail sudah wujud, jangan replace secara automatik: fail tersebut sudah ada dalam main.
4. Commit hanya jika ada perubahan yang diperlukan.

## Semakan URL selepas deployment
Buka:
`https://hishampuncakjaya-web.github.io/RIDERKB/firebase-messaging-sw.js`

URL mesti memaparkan JavaScript, bukan 404.

## VAPID
Jangan reka VAPID key. Dapatkan key sebenar daripada Firebase Console > Project settings > Cloud Messaging > Web Push certificates, kemudian masukkan dalam `firebase-config.js` selepas sahkan domain hosting.

## Belum selesai
Pakej ini tidak mendakwa menyelesaikan `listRiderOrders: internal`, peta Vendor kosong atau aliran Marketplace Customer > Vendor > Rider. Ia juga tidak menggantikan `index.js`, `common.js`, `vendor.html`, `rider.html` atau `firebase-rules.json` kerana perubahan pada backend/rules memerlukan log dan ujian keselamatan.

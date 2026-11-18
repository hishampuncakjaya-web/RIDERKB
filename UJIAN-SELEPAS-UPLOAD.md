# Ujian selepas upload

1. Buka `.../RIDERKB/firebase-messaging-sw.js` secara terus dan pastikan bukan 404.
2. Pastikan VAPID key sebenar telah disediakan sebelum menguji token FCM.
3. Jika `listRiderOrders: internal` masih muncul, buka Firebase Console > Functions > Logs, pilih `listRiderOrders`, dan simpan mesej error serta timestamp. Jangan kongsi token rahsia.
4. Jika peta Vendor kosong, semak sama ada `leaflet.min.js` dan tile `tile.openstreetmap.org` gagal dimuatkan. Screenshot sahaja belum menentukan punca.
5. Jangan uji COD sebenar sehingga senarai tugasan Rider dan kawalan wallet disahkan.

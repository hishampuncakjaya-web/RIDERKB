MYRIDERKU ADMIN LIVE RIDER RADAR V65

Perubahan: paparan kawalan radar Admin, kad statistik live berdasarkan data Firebase sedia ada, butang skrin penuh, fit semua Rider, legenda status, popup maklumat Rider, dan cuaca semasa berdasarkan pusat peta melalui Open-Meteo API.

Penting:
- Lokasi dan kelajuan hanya dipaparkan daripada data GPS yang benar-benar diterima melalui Firebase. Tiada lokasi/kelajuan simulasi.
- Statistik bergantung pada struktur riders dan orders sedia ada.
- Cuaca memerlukan sambungan internet dan API Open-Meteo; jika gagal, paparan menyatakan cuaca tidak tersedia.
- Kemas kini ini tidak menambah sejarah jejak GPS. Jejak laluan pesanan aktif yang sedia ada dikekalkan.
- Kemas kini ini ialah frontend. Ia tidak mengubah Firebase Rules, Cloud Functions atau kaedah penghantaran GPS Rider.
- Uji dengan akaun Admin dan Rider sebenar selepas deploy.

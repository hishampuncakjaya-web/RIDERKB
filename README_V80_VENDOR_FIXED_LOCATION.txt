MYRIDERKU V80 – VENDOR LOCATION PICKER & SAVE LOCK

Asas: MYRIDERKU V79 MINIMAL CERIA PROFESIONAL.

Perubahan utama:
- Tetapan profil Vendor kini mempunyai peta interaktif OpenStreetMap melalui Leaflet.
- Vendor boleh menekan peta untuk meletakkan pin, menyeret pin untuk pelarasan, atau menggunakan My Location (GPS).
- Koordinat dipaparkan dengan enam tempat perpuluhan.
- Menekan Simpan menyimpan latitud/longitud bersama locationLocked=true dan locationUpdatedAt.
- Selepas keluar daripada tetapan, lokasi tersimpan dipaparkan sebagai lokasi rasmi. Untuk mengubahnya kemudian, Vendor masuk semula ke Edit profil & promosi kedai, pilih lokasi baharu dan Simpan.
- Fungsi profil, menu, pesanan dan struktur Firebase sedia ada dikekalkan.

Perkara yang perlu diketahui:
- Peta memerlukan sambungan internet dan halaman HTTPS untuk geolokasi.
- Penanda locationLocked ialah status aplikasi. Penguatkuasaan keselamatan sebenar terhadap perubahan terus melalui Firebase Console/REST mesti dibuat melalui Firebase Security Rules yang disemak berasingan. Rules tidak diubah dalam pakej ini kerana fail Rules aktif belum diberikan.
- Uji login Vendor, kebenaran GPS, pemilihan pin, simpan profil dan paparan lokasi pada Customer/Rider sebelum deployment produksi.

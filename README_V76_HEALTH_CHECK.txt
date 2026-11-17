MYRIDERKU V76 - HEALTH CHECK

Ditambah ke halaman Admin, Customer, Rider dan Vendor melalui butang terapung Health Check.
Pemeriksaan: status rangkaian, Firebase Realtime Database (.info/connected), sesi Authentication, GPS Rider (umur koordinat), Cloudinary config, konfigurasi cuaca yang boleh dikesan, notifikasi, local storage dan jam peranti.

Nota keselamatan dan ketepatan:
- Health Check tidak menulis atau mengubah data pesanan, wallet, tambang atau dispatch.
- Cloudinary hanya mengesahkan tetapan asas. Tiada muat naik ujian dilakukan dan API Secret tidak diminta.
- Status cuaca ialah pemeriksaan konfigurasi, bukan pengesahan API/cuaca masa nyata kerana tiada kontrak endpoint cuaca standard yang jelas dalam konfigurasi semasa.
- Internet navigator.onLine ialah petunjuk rangkaian peranti, bukan bukti bahawa semua laman web boleh dicapai.
- Admin GPS audit membaca rekod /riders dan menandakan lokasi online lebih 2 minit sebagai lapuk.
- GPS Rider memeriksa /riders/{uid}/lat,lng,t,online; struktur ini berdasarkan medan GPS Rider sedia ada.

Deploy sebagai Netlify Preview dahulu dan uji dengan akaun setiap peranan.

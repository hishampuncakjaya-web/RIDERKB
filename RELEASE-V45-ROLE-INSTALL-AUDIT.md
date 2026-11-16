# MYRIDERKU V45 — Role Installation & Safety Audit Package

## Asas
- Dibina terus daripada V44; fail dan aliran sedia ada dikekalkan.
- Firebase kekal sebagai pangkalan data utama.
- Tiada rekod Firebase dipadam atau diubah oleh pakej ini.

## Perubahan kod dalam V45
1. Customer menggunakan `gateInstall` dalam mod hard: tiada pilihan langkau ke pelayar pada peranti/pelayar yang menyokong pemasangan PWA.
2. Vendor dan Admin kini menggunakan gate pemasangan mengikut peranan, bukan banner pilihan.
3. Rider mengekalkan kawalan pemasangan wajib sedia ada.
4. Service worker dinaik taraf ke cache V45 dan senarai shell dibetulkan supaya hanya memanggil stylesheet V43 yang benar-benar wujud. Ini mengelakkan permintaan cache kepada fail CSS yang tiada.

## Had platform pemasangan
PWA tidak boleh dipasang secara senyap oleh laman web. Pengguna masih perlu mengesahkan pemasangan melalui Chrome/Edge atau Add to Home Screen pada Safari. Jika browser/peranti tidak menyokong prompt pemasangan, arahan manual diperlukan. Gate role tidak boleh menjamin bahawa ikon sudah dipasang; ia hanya mengawal laluan aplikasi.

## Keselamatan Firebase — tindakan sengaja TIDAK dibuat secara automatik
V44 mempunyai `.read: true` pada rekod `orders/$id`, `proofs/$id`, `proofsP/$id` dan `vorders/$uid/$id`. Ini perlu diperketatkan. Namun `track.html` membaca `orders/$id` secara terus tanpa sesi pemilik yang dibuktikan, manakala aliran pesanan semasa belum menulis `ownerUid` daripada Firebase Auth. Menutup bacaan awam tanpa migrasi boleh memutuskan penjejakan pelanggan lama dan baharu. Oleh itu `database.rules.json` dikekalkan tanpa perubahan dalam pakej ini; jangan anggap isu tersebut telah diselesaikan.

## Keperluan sebelum mengaktifkan Firebase Anonymous Auth dan rules baharu
1. Aktifkan Anonymous provider dalam Firebase Authentication.
2. Tambah sign-in anonymous sebelum pelanggan menghantar pesanan.
3. Simpan `ownerUid` pada pesanan baharu dan bina pemetaan selamat untuk pesanan lama tanpa memadamnya.
4. Ubah `track.html` supaya pemilik hanya boleh membaca pesanan miliknya; rider yang ditugaskan dan Admin kekal dibenarkan.
5. Asingkan maklumat awam minimum untuk live tracking daripada butiran peribadi pesanan dan bukti.
6. Uji Rules Simulator untuk customer A/B, rider assigned/unassigned, vendor dan admin sebelum menerbitkan rules.

## Skop yang belum siap dalam pakej ini
- Anonymous Auth + pemilikan pesanan end-to-end.
- Penguncian bacaan bukti pembayaran/penghantaran.
- Sejarah pelanggan lokal berbilang rekod dan fungsi tempah semula.
- Butang Call Penerima menggunakan nombor telefon penerima yang berasingan. Medan V44 `recv` ialah teks penerima, bukan nombor telefon berstruktur; nombor pelanggan disimpan dalam `orderContacts`.
- Anti-scam penuh, pengesahan nombor, idempotency server-side dan App Check.

## Ujian pakej
- JSON parse: `database.rules.json`, `firebase.json`, semua manifest.
- JavaScript syntax: fail JS utama dan `functions/index.js`.
- Semakan pautan aset service worker terhadap fail yang wujud.
- ZIP integrity.

Pakej ini ialah V45 role-install + audit safety baseline. Ia bukan pengesahan bahawa Firebase rules telah diterbitkan atau bahawa semua fungsi backend sudah live.

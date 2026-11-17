# MYRIDERKU V85.1 — Audit Rules aktif dan candidate

## Fail asal
`database.rules.json` yang diberikan pengguna. JSON sah.

## Pembetulan yang dimasukkan dalam candidate
Parent `.read` Admin (email tepat + email_verified) ditambah pada:
- `/orders`
- `/reports`
- `/riders`
- `/vendors`
- `/vshops`
- `/vorders`
- `/vpayouts`
- `/orderContacts`
- `/proofs`
- `/proofsP`

Semua child rules asal dikekalkan. Tiada `.write` dibuka atau diluaskan. Root `.read:false` dan `.write:false` dikekalkan.

## Kenapa perlu parent read?
Admin app melanggan collection root seperti `orders`, `reports`, `riders`, `vendors`, `vshops`, `vorders`, `vpayouts` dan `orderContacts`. RTDB Rules bukan penapis data: permission di child tidak memberi kebenaran kepada query pada parent. Admin perlu parent-level read yang terhad kepada akaun admin verified.

## Yang sengaja TIDAK dibuka
- `/orders` untuk Rider: tidak dibuka. Rider app query semua `/orders` untuk dispatch, tetapi order belum assigned tidak boleh dibaca melalui existing child rule. Membuka semua order kepada Rider akan mendedahkan PII.
- `/vshops` dan `/vmenu` kepada public: tidak dibuka pada parent. Customer-shop memuatkan kedua-dua collection; sebelum dibuka, semak struktur data untuk pastikan tiada phone/private data. Sediakan `publicVendorProfiles` / `publicMenus` yang hanya mengandungi medan awam atau endpoint server-side.
- `/reports` untuk Customer/Rider: tidak dibuka; write rules kekal seperti asal.
- Semua wallet, settings, proof, order writes kekal seperti asal.

## Masalah lain yang masih perlu pembaikan kod
1. Rider dispatch: buat callable `listAvailableRiderOrders` atau server-written `riderDispatchFeed/{uid}` dengan medan minimum (order ID, pickup coordinates/label yang perlu, jarak/jenis servis, createdAt, fare preview). Jangan sertakan customer phone, full address, receiver details atau notes sehingga order accepted. `acceptOrder` kekal transaksi server-side.
2. Marketplace: `customer-shop.html` baca `vshops` dan `vmenu` pada collection-level; Rules child read sahaja tidak cukup. Jangan buka data sedia ada tanpa data classification. Salin medan awam ke node awam atau callable.
3. Customer receipt: `customerConfirmReceipt` memerlukan `orders/{id}.customerUid === auth.uid` dan status `selesai`. `customer-track.html` guna `ensureGuestAuth`; jika pautan dibuka dengan sesi UID lain/anonymous, callable akan reject. Penyelesaian selamat ialah tracking token rawak, tamat tempoh, disimpan hash server-side dan dihantar dalam URL; jangan buang ownership check.
4. Radar: Admin collection read `/riders` ditambah pada candidate. GPS stale masih bergantung kepada app Rider menghantar `riders/{uid}/loc`/timestamp dengan betul dan permission write field yang sesuai.

## Status ujian
- JSON parse: lulus.
- Static source comparison: lulus.
- Firebase Rules Emulator: belum dijalankan.
- Live Production test: tidak dijalankan.
- Tiada Production Rules/data diubah.
- Tiada deployment atau Blaze.

## Arahan penting
Candidate ini ialah full rules JSON berasaskan fail yang pengguna hantar. Jangan paste ke Production sebelum:
- sahkan fail tersebut memang sama dengan Rules live sekarang;
- uji dalam Firebase Emulator;
- tambah dispatch feed Rider dan public marketplace data path;
- semak write restrictions untuk semua direct writes dalam aplikasi.

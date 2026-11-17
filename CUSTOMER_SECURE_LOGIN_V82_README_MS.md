# MYRIDERKU V82 — Customer Secure Login & Anti-Scam

## Apa yang dibina
- Customer meminta OTP WhatsApp 6 digit melalui Meta Cloud API.
- OTP disahkan di backend; backend mengeluarkan Firebase Custom Token untuk akaun Customer.
- `customerPhoneIndex/{E164}` mengunci satu nombor kepada satu UID melalui RTDB transaction.
- Customer wajib simpan nama penuh dan alamat melalui callable backend.
- `createCustomerOrder` menyemak status aktif, OTP verified, profil lengkap, dan padanan nombor di server sebelum menulis order.
- `orders/{orderId}` menyimpan `customerUid`; `orderContacts/{orderId}` menyimpan `customerUid` dan nombor telefon (lebih terhad berbanding meletakkan nombor di rekod order umum).
- Admin tab baharu "Customer" memaparkan senarai pengguna dan fungsi Block / Unblock.
- Block status disemak ketika OTP diminta, OTP disahkan, profil disimpan, sesi dimuatkan dan order dibuat.

## Data model (Realtime Database)
- `privatePhoneOtp/{temporaryUid}`: hash OTP, expiry, attempts, send cooldown.
- `customerPhoneIndex/{phoneE164}`: UID akaun tunggal untuk nombor tersebut.
- `customers/{uid}`: nama, alamat, telefon disahkan, status, tarikh.
- `orders/{orderId}.customerUid`: UID pemilik order.
- `orderContacts/{orderId}`: `customerUid`, `phone`, `phoneKey`.

## Peraturan keselamatan
`CUSTOMER_LOGIN_PRIVATE_NODES_RULES_SNIPPET.json` ialah snippet untuk melarang akses client ke node sensitif. Ia bukan Firebase Rules lengkap dan tidak boleh menggantikan Production Rules. Cloud Functions Admin SDK mengakses RTDB melalui service credentials dan tidak bergantung pada client rules.

## Tindakan Admin
- Senarai akaun, nombor telefon, alamat, status dan UID.
- Block memerlukan sebab; unblock memerlukan pengesahan.
- Pengguna blocked tidak boleh meminta OTP bagi nombor itu, mendapatkan sesi Customer atau membuat order.
- Sekatan order dikuatkuasakan di backend walaupun pelanggan masih mempunyai token Firebase lama.

## Penting sebelum production
1. Integrasi Meta Cloud API memerlukan WABA, Phone Number ID, Access Token dan Authentication Template yang telah diluluskan.
2. `WA_ACCESS_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_OTP_PEPPER` perlu disimpan sebagai Firebase Secrets; jangan masukkan ke HTML atau repository.
3. Tambah App Check / rate limiting tambahan mengikut IP/device dan pemantauan kos OTP.
4. Semak Production RTDB Rules secara berasingan. Jangan replace keseluruhan rules dengan snippet ini.
5. Jalankan Firebase Emulator tests: OTP sah/tidak sah/expired, dua UID berlumba claim nombor sama, akaun blocked, profile belum lengkap, order dari UID lain, admin non-admin cuba block, unblock dan order history.
6. Lakukan audit privacy/PDPA untuk retention alamat/nombor telefon dan akses Rider/Vendor. Nombor telefon disimpan di `orderContacts`, bukan `orders` supaya tidak terdedah pada semua pembaca order.
7. Sesi Customer menggunakan Firebase Custom Token selepas OTP. Jika browser data dipadam, pengguna boleh meminta OTP semula dan masuk ke UID yang sama melalui indeks nombor telefon.

## Status ujian
- Node syntax check backend + bridge.
- Node syntax check inline JS Customer + Admin.
- Belum diuji melalui Firebase Emulator, Meta WABA sebenar atau production.
- Tiada deployment, tiada Blaze diaktifkan, tiada Production Rules/data disentuh.

## V82.1 — audit laluan tindakan
- `customerConfirmReceipt` kini menyemak status Customer di backend; akaun blocked tidak boleh menghantar pengesahan atau laporan penerimaan.
- `startWhatsAppOtp` mempunyai cooldown 60 saat pada peringkat nombor telefon (bukan hanya UID sementara), mengurangkan risiko pengguna membuka banyak sesi anonymous untuk menghantar OTP berulang.
- Apabila Admin block, backend cuba revoke refresh tokens Firebase untuk UID tersebut. Callable penting tetap menyemak status `customers/{uid}` kerana token ID sedia ada mungkin masih hidup sehingga luput.
- Rider dan Vendor dibenarkan meneruskan tindakan operasi bagi order yang sudah diterima/diproses. Ini disengajakan supaya sekatan akaun Customer tidak menyebabkan order yang sedang berjalan terbengkalai atau rider/vendor tidak dapat menamatkan penghantaran. Customer yang blocked tidak boleh membuat order baharu atau mengesahkan penerimaan.
- OTP resend cooldown node baharu: `privatePhoneOtpPhoneIndex/{phoneE164}`; tambah perlindungan Rules client seperti dalam snippet.

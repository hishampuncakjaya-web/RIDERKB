# MYRIDERKU — WhatsApp Cloud API OTP (Kod dahulu)

## Keputusan reka bentuk
- Kaedah: Meta WhatsApp Business Platform Cloud API.
- Customer mesti log masuk Firebase Anonymous Auth sebelum meminta OTP.
- OTP 6 digit, tempoh 5 minit, had 5 cubaan, jarak permintaan 60 saat.
- OTP disimpan sebagai SHA-256 digest di RTDB `privatePhoneOtp/{uid}`; plaintext tidak disimpan.
- Status nombor disimpan di `customerPhoneVerifications/{uid}`.
- `createCustomerOrder` menyekat pesanan jika nombor tidak disahkan atau nombor pesanan tidak sepadan.

## Keperluan akaun Meta (belum dibuat)
1. Meta Business Portfolio.
2. WhatsApp Business Account (WABA) dan nombor perniagaan yang didaftarkan.
3. WhatsApp Phone Number ID dan access token yang mempunyai kebenaran `whatsapp_business_messaging`.
4. Authentication template bernama `myriderku_otp` yang diluluskan Meta.
5. Sahkan format bahasa dan komponen template dengan contoh payload yang dijana dalam WhatsApp Manager. Kod contoh kini menggunakan `language.code=en` dan butang OTP URL; sesuaikan `components` tepat mengikut jenis template yang diluluskan Meta sebelum ujian.

## Firebase secrets (belum diset)
- `WA_ACCESS_TOKEN`
- `WA_PHONE_NUMBER_ID`
- `WA_VERIFY_TOKEN` (reserved for webhook verification / future inbound status webhook)

Simpan melalui Firebase Secret Manager apabila tiba masa deployment. Jangan letak token dalam HTML, `firebase-config.js`, Git atau ZIP awam.

## Deployment / bil
Tiada deploy dilakukan. Tiada Blaze diaktifkan. Firebase Production tidak disentuh.
Cloud Functions v2 + Secret Manager memerlukan konfigurasi bil/Blaze pada projek Firebase untuk deployment; kod ini hanya disediakan untuk semakan setempat.

## Anggaran kos
Semakan sumber pasaran Malaysia pada 17 Nov 2026 menunjukkan kadar Meta untuk Authentication sekitar RM0.0564 bagi setiap mesej OTP yang dihantar/delivered. Angka ini bukan jaminan kekal; semak rate card Meta dalam WhatsApp Manager sebelum penggunaan. Provider pihak ketiga boleh mengenakan yuran tambahan. Untuk 100 OTP dihantar: anggaran Meta RM5.64 sebelum caj tambahan/provider dan cukai jika berkenaan.

## Semakan keselamatan sebelum production
- Tambah App Check / abuse throttling dan had harian per UID, nombor, IP/device.
- Jangan benarkan OTP request tanpa consent yang jelas.
- Pastikan template authentication disahkan dan sesuai dengan negara/nombor sasaran.
- Audit RTDB Rules: `privatePhoneOtp` dan `customerPhoneVerifications` mesti tidak boleh dibaca/ditulis oleh client.
- Periksa bahawa `publicConfig/walletMinCash` path betul dan migrasi `createCustomerOrder` lengkap.
- Jalankan Emulator tests: expiry, wrong code, brute-force limit, resend cooldown, number mismatch, duplicate requests, account UID binding.
- Uji WhatsApp send response / delivery status dan pengendalian nombor tidak mempunyai WhatsApp.

## Batasan semasa
- Ini scaffolding integrasi; belum diuji dengan WABA sebenar atau template yang diluluskan.
- Authentication template button component boleh berbeza mengikut template Meta yang dipilih; semak payload rasmi dalam WhatsApp Manager.
- Tiada webhook inbound diperlukan untuk OTP jenis ini kerana Customer memasukkan OTP dalam app; delivery callback/webhook boleh ditambah kemudian.

## Patch keselamatan seterusnya (V81.1)
- Semakan nombor verified kini dibuat di backend `createCustomerOrder`, bukan bergantung pada butang/UI sahaja.
- Cooldown OTP dibuat melalui RTDB transaction sebelum panggilan Meta untuk mengelakkan permintaan serentak.
- OTP digest menggunakan HMAC-SHA256 dengan secret `WA_OTP_PEPPER` (bukan hash tanpa kunci).
- Pilihan bahasa template dan nama template boleh dikonfigurasi melalui `WA_OTP_TEMPLATE_LANGUAGE` dan `WA_OTP_TEMPLATE_NAME`; nilai fallback ialah `en` dan `myriderku_otp`.
- Payload penghantaran menggunakan body parameter + butang OTP URL/copy-code. Pastikan template yang diluluskan ialah Authentication dengan COPY_CODE; jangan gunakan template URL biasa.
- `WHATSAPP_OTP_RTDB_RULES_SNIPPET.json` hanya snippet keselamatan untuk dua node OTP. Jangan ganti keseluruhan Firebase Rules production dengannya.

## Arahan Secret untuk masa deployment sahaja
Arahan ini untuk rujukan kemudian; belum dijalankan:
```bash
firebase functions:secrets:set WA_ACCESS_TOKEN
firebase functions:secrets:set WA_PHONE_NUMBER_ID
firebase functions:secrets:set WA_OTP_PEPPER
```
`WA_OTP_PEPPER` perlu nilai rawak kriptografi yang panjang (sekurang-kurangnya 32 bait). Jangan masukkan secret ke fail projek atau hantar dalam chat.

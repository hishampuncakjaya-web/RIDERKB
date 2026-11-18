# MYRIDERKU V91.4 — Vendor Fix (18 November 2026)

## Skop perubahan
1. Marketplace checkout kini menyemak rekod akaun Vendor di `vendors/{uid}` dan mensyaratkan `approved === true` serta `suspended !== true`. Semakan profil kedai awam sahaja tidak lagi mencukupi untuk meluluskan checkout.
2. Paparan harga dalam borang Vendor kini mengira markup tepat 10% bagi semua harga, selaras dengan kiraan server dan polisi Vendor menerima harga asal sepenuhnya. Tiada lagi minimum markup RM1 untuk item bawah RM10.

## Semakan statik
- `node --check functions/index.js`: PASS.
- Semakan sintaks JavaScript inline `vendor.html`: PASS.
- Assertion semakan kelulusan Vendor dan markup 10%: PASS.
- ZIP integrity: diuji selepas arkib dibina.

## Belum diuji
- Firebase Emulator / rules sebenar.
- Login Vendor pada Android dan ujian kedai buka/tutup.
- Muat naik imej produk ke Cloudinary.
- Checkout sebenar, stok serentak, aliran penghantaran ke Rider, dan payout.
- Tiada deployment ke Firebase Hosting atau Cloud Functions dibuat.

**Status: STAGING CANDIDATE sahaja. Jangan anggap production-ready sebelum ujian Emulator dan peranti sebenar.**

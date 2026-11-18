# MYRIDERKU V89.1 — Laporan Semakan QA

Tarikh: 18 November 2026
Asas: `MYRIDERKU_MASTER_BUILD_V89_AUDIT_MERGED.zip`

## Keputusan
**Semakan statik lulus; ujian staging langsung belum dijalankan. Pakej belum diluluskan untuk produksi.**

## Pemeriksaan yang dilaksanakan
- Integriti arkib ZIP: PASS
- Bilangan fail: 101
- Laluan arkib pendua: 0
- Sintaks JavaScript luaran: 11/11 lulus
- Sintaks skrip sebaris HTML: 9/9 halaman lulus
- JSON dan Web Manifest: 11/11 lulus
- Projek Firebase dalam konfigurasi: `riderkb-fe7e1`
- VAPID key: BELUM DIKONFIGURASI

## Isu yang menghalang release
1. **FCM belum aktif:** `vapidKey` masih kosong. Perlu VAPID public key sah daripada Firebase Console; jangan cipta atau teka key.
2. **Marketplace belum selamat sepenuhnya:** `customer-shop.html` masih menulis terus ke `/vorders`, `/orders` dan `/orderContacts`; callable `createMarketplaceOrder` tiada dalam `functions/index.js`. Perlu bina callable dengan pengesahan customer, semakan vendor/item/harga/markup/stok, idempotency dan penulisan atomik sebelum fungsi ini dianggap selamat.
3. **Ujian `listRiderOrders`:** callable wujud dalam source, tetapi ralat `internal` hanya boleh dikenal pasti melalui deployed function version, log Cloud Functions dan ujian auth pada staging.
4. **Firebase Rules:** `database.rules.V85_3_CANDIDATE.json` ialah calon, bukan rules produksi yang telah dibuktikan selamat. Perlu emulator tests termasuk akses rentas role dan percubaan menaik taraf role.
5. **Tracking Customer:** aliran token tracking perlu ujian lintas sesi dan pengesahan bahawa data peribadi tidak boleh dibaca melalui ID order sahaja.
6. **Fungsi luaran:** GPS, cuaca, dispatch, wallet/COD, pembayaran, WhatsApp dan push perlu ujian integrasi pada staging dan peranti sebenar.

## Skop yang TIDAK dijalankan
- Tiada deploy Netlify atau Firebase dibuat.
- Tiada Firebase Emulator / staging transaction dijalankan.
- Tiada akaun, token, VAPID key atau kredensial produksi diakses.
- Tiada data produksi atau Firebase Rules produksi diubah.

## Keputusan release
**BLOCKED untuk produksi.** Gunakan V89 hanya sebagai calon staging selepas projek Firebase staging dan domain staging disahkan. Tutup semua isu di atas dan jalankan UAT Customer → Firebase callable → Rider → Vendor/Admin → selesai → resit sebelum label STABLE.

## Fail bukti
Butiran keputusan mesin berada dalam `V89_1_QA_REVIEW_REPORT.json`.

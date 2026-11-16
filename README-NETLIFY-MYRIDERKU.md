# MYRIDERKU — Midnight Sapphire (Netlify package)

## Halaman aplikasi
- Customer: `/` atau `/index.html`
- Rider: `/rider.html`
- Vendor: `/vendor.html`
- Admin: `/admin.html`
- Marketplace: `/shop.html`
- Tracking: `/track.html`

## Deploy ke Netlify
1. Extract ZIP ini.
2. Buka Netlify > Sites > pilih site MYRIDERKU > Deploys.
3. Seret folder hasil extract (kandungan folder ini termasuk `index.html`) ke kawasan manual deploy.
4. Tunggu deploy selesai, kemudian uji keenam-enam URL di atas.

## Penting: Firebase
- Firebase kekal sebagai backend. Fail `firebase-config.js` dan `database.rules.json` disertakan.
- Sebelum menggunakan ciri Vendor V40 seperti "Habis hari ini" dan "Rehat", semak `RELEASE-V40.md` yang disertakan dalam ZIP dan publish `database.rules.json` yang sepadan ke Firebase Realtime Database Rules.
- Upload ke Netlify tidak menerbitkan Firebase Rules atau Firebase Cloud Functions. Itu proses berasingan.
- Jangan anggap aplikasi production-ready sehingga login, tempahan, GPS, notifikasi, vendor actions dan tracking diuji dengan akaun ujian pada Firebase sebenar.

## Identiti visual
MYRIDERKU Midnight Sapphire:
- Midnight Sapphire: `#182E4A`
- Deep Navy: `#102238`
- Amber Gold: `#E7A64B`
- Ivory: `#F5F0E5`
- Steel Blue: `#7793AE`

Tema ini mengubah lapisan visual, warna PWA dan cache version. Logik Firebase, harga, dispatch dan order tidak diubah oleh patch tema ini.


## Master Build notice
See `RELEASE-MASTER-BUILD.md` for consolidated features, deployment steps and the outstanding Firebase security release blocker. Do not treat the current compatibility rules as production-hardened.


See `RELEASE-REWARDS-PREVIEW.md` for the Rewards/VIP preview status and limitations.

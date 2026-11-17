MYRIDERKU V79 — MINIMAL, CERIA & PROFESIONAL

Asas: MYRIDERKU V78 AISYAH CUSTOM ALERTS.

Perubahan UI/UX:
- Senarai pesanan Admin, Rider dan Vendor bermula tertutup; nombor pesanan dipaparkan pada ringkasan.
- Butiran pesanan dibuka apabila pengguna menekan nombor/panel ringkasan.
- Satu kad pesanan dibuka pada satu masa bagi setiap senarai.
- Mission Control tidak lagi terapung pada semua halaman; butang hanya dipaparkan dalam header Admin selepas akaun dikenal pasti sebagai Admin.
- Standard CSS responsif dikongsi antara halaman Admin, Rider, Vendor dan Customer.

Kekal:
- Firebase sebagai pangkalan data utama.
- Struktur halaman dan fungsi operasi V78.
- Formula tambang, wallet, dispatch, dan polisi kewangan tidak diubah.

Nota keselamatan:
- Paparan UI bukan pengganti Firebase Security Rules.
- Perubahan Maintenance Mode masih tertakluk kepada Rules Firebase yang mengehadkan /system/maintenance kepada Admin yang disahkan.

Ujian setempat:
- Semakan sintaks JavaScript untuk skrip utama dan skrip sebaris halaman telah lulus.
- Perlu diuji di hosting sebenar dengan akaun Admin, Rider, Vendor dan Customer sebelum dijadikan produksi.

MYRIDERKU V78 – AISYAH CUSTOM VOICE ALERTS

Berdasarkan V77 MATRIX DIAGNOSTIC & MAINTENANCE.
Tambahan:
- sounds/rider-alert-aisyah.wav: suara Rider "Abanggg... ada pesanan masuk ni!"
- sounds/vendor-order-aisyah.wav: suara Vendor "Bosss... ada pesanan masuk ni!"
- Rider memainkan suara custom apabila tawaran order dipaparkan dan mengulang setiap 4 saat selagi order masih baharu.
- Vendor memainkan suara custom apabila snapshot Firebase mengesan order baharu dan mengulang setiap 4 saat selagi ada order baharu yang belum dijawab dan kedai dibuka.
- Jika audio custom gagal dimainkan (contohnya autoplay disekat oleh browser), kod fallback kepada bunyi beep sedia ada.
- Fail WAV disimpan secara lokal dalam ZIP; tiada API pihak ketiga diperlukan untuk memainkan audio.

Nota:
- Browser/Android boleh menyekat audio automatik sehingga pengguna berinteraksi dengan halaman. Pastikan Rider/Vendor telah membuka aplikasi dan memberi kebenaran bunyi/media.
- Volume akhir turut bergantung kepada volume media telefon, mod senyap, battery saver dan tetapan browser.
- Ini tidak mengubah Firebase schema, pricing, wallet atau dispatch.
- Ujian sebenar pada telefon dan Netlify Preview masih diperlukan.

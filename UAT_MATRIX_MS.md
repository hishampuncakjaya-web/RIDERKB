# MYRIDERKU V81 — Ujian Penerimaan (UAT)

| ID | Peranan | Ujian | Keputusan dijangka |
|---|---|---|---|
| C01 | Customer | Hantar pesanan dengan lokasi sah | Pesanan direkod sekali; UID datang daripada Auth |
| C02 | Customer | Tekan Dah terima | Hanya pemilik pesanan boleh sahkan; status selesai |
| C03 | Customer | Tekan Belum terima | Aduan direkod; pesanan tidak auto-selesai |
| C04 | Customer | Hantar pengesahan berulang | Idempotent; tiada rekod berganda |
| W01 | Cuaca | Hujan dikesan pada salah satu lokasi | Caj RM2 sekali sahaja |
| W02 | Cuaca | API gagal / koordinat tiada | Papar tidak dapat disahkan; tiada caj senyap |
| R01 | Rider | Dua rider menerima pesanan serentak | Tepat seorang berjaya |
| R02 | Rider | COD melebihi baki tersedia | Ditolak; wallet tidak negatif |
| R03 | Rider | Lengkapkan penghantaran COD | Reservation dilepaskan sekali |
| V01 | Vendor | Terima → siap → selesai | Kedua-dua rekod status segerak |
| V02 | Vendor | Vendor lain cuba ubah pesanan | Ditolak |
| A01 | Admin | Pelarasan wallet tanpa pengesahan email | Ditolak |
| A02 | Admin | Pelarasan menyebabkan baki < reservation | Ditolak |
| P01 | Privasi | Customer/Rider/Vendor baca Dana Operasi | Tidak dibenarkan |
| P02 | Privasi | Admin lihat pecahan kewangan | Dibenarkan |

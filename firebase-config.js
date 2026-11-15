/* ===== TETAPAN FIREBASE =====
   Isi nilai di bawah daripada Firebase Console > Project settings > Your apps (Web).
   Panduan penuh: FIREBASE-SETUP.md                                              */
window.RKB_CFG = {
  firebase: {
    apiKey: "AIzaSyCLe-RqEQ3-KhEEa7HxdaKjUOFkcPr4bFg",
    authDomain: "riderkb-fe7e1.firebaseapp.com",
    databaseURL: "https://riderkb-fe7e1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "riderkb-fe7e1",
    storageBucket: "riderkb-fe7e1.firebasestorage.app",
    messagingSenderId: "412815286373",
    appId: "1:412815286373:web:1ae9b01be1de978d72668c"
  },
  appCheckKey: "",                // reCAPTCHA v3 site key untuk Firebase App Check (lihat FIREBASE-SETUP.md). Kosong = tak aktif
  admins: ["admin@riderkb.com"],   // e-mel akaun admin (huruf kecil). Mesti sama dengan dalam rules
  riderMustInstall: true,         // rider wajib pasang app (set false untuk ujian dalam pelayar)
  walletMinCash: 0,               // tambahan baki minimum (RM). Peraturan asas: rider layak jika wallet >= harga barang (job tunai)
  waNumber: "601139900099"        // WhatsApp rider/pusat, format 60xxxxxxxxx
};

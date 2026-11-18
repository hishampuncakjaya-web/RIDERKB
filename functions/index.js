const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const crypto = require("crypto");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase, ServerValue } = require("firebase-admin/database");
const { getAuth } = require("firebase-admin/auth");

initializeApp();
const REGION = "asia-southeast1";
const ADMIN_EMAIL = "mnhzuan@gmail.com";
const db = getDatabase();
const WA_ACCESS_TOKEN = defineSecret("WA_ACCESS_TOKEN");
const WA_PHONE_NUMBER_ID = defineSecret("WA_PHONE_NUMBER_ID");
const WA_VERIFY_TOKEN = defineSecret("WA_VERIFY_TOKEN");
const WA_OTP_PEPPER = defineSecret("WA_OTP_PEPPER");

function requireAuth(req) {
  if (!req.auth) throw new HttpsError("unauthenticated", "Sila log masuk.");
  return req.auth.uid;
}
function isAdmin(req) {
  return !!req.auth &&
    String(req.auth.token.email || "").toLowerCase() === ADMIN_EMAIL &&
    req.auth.token.email_verified === true;
}
function money(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 100000) {
    throw new HttpsError("invalid-argument", "Nilai wang tidak sah.");
  }
  return Math.round(n * 100) / 100;
}
function cleanId(v) {
  const s = String(v || "");
  if (!/^[A-Za-z0-9_-]{6,100}$/.test(s)) {
    throw new HttpsError("invalid-argument", "ID pesanan tidak sah.");
  }
  return s;
}

/**
 * Atomically claims a new order and reserves COD wallet funds.
 * Client must NOT write orders/{id}, riders/{uid}/walletReserved,
 * or wallet fields directly after this endpoint is integrated.
 */
exports.acceptOrder = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const orderId = cleanId(req.data && req.data.orderId);
  const rootRef = db.ref("/");
  let outcome = "not-found";

  const tx = await rootRef.transaction((root) => {
    if (!root) return root;
    const order = root.orders && root.orders[orderId];
    const rider = root.riders && root.riders[uid];
    if (!order || !rider) { outcome = "not-found"; return; }
    if (rider.approved !== true || rider.suspended === true || rider.online !== true) {
      outcome = "rider-ineligible"; return;
    }
    if (order.status !== "baru" || order.riderUid) { outcome = "already-claimed"; return; }

    const need = order.pay === "cash" ? money(order.need || 0) : 0;
    const balance = money(rider.wallet || 0);
    const reserved = money(rider.walletReserved || 0);
    if (balance - reserved < need) { outcome = "wallet-insufficient"; return; }

    const now = Date.now();
    rider.walletReserved = Math.round((reserved + need) * 100) / 100;
    order.status = "diterima";
    order.riderUid = uid;
    order.riderName = String(rider.name || "").slice(0, 80);
    order.riderPhone = String(rider.phone || "").slice(0, 24);
    order.riderPlate = String(rider.plate || "").slice(0, 24);
    order.t = Object.assign({}, order.t || {}, { diterima: now });
    if (need > 0) {
      order.walletReservedBy = uid;
      order.walletReservedAmount = need;
      order.walletReservationReleased = false;
    }
    root.orders[orderId] = order;
    root.riders[uid] = rider;
    outcome = "accepted";
    return root;
  });

  if (!tx.committed || outcome !== "accepted") {
    const messages = {
      "not-found": "Pesanan atau akaun Rider tidak ditemui.",
      "rider-ineligible": "Akaun Rider belum diluluskan, digantung atau tidak online.",
      "already-claimed": "Pesanan telah diambil atau tidak lagi tersedia.",
      "wallet-insufficient": "Baki Wallet tersedia tidak mencukupi untuk COD."
    };
    throw new HttpsError("failed-precondition", messages[outcome] || "Pesanan tidak dapat diterima.");
  }
  return { ok: true, orderId, status: "diterima" };
});

/** Idempotently releases the COD reservation when an order is cancelled/closed. */
exports.releaseCodReservation = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const orderId = cleanId(req.data && req.data.orderId);
  let outcome = "not-found";
  const tx = await db.ref("/").transaction((root) => {
    if (!root) return root;
    const order = root.orders && root.orders[orderId];
    if (!order) { outcome = "not-found"; return; }
    if (order.riderUid !== uid && !isAdmin(req)) {
      outcome = "forbidden"; return;
    }
    if (order.pay !== "cash" || !order.walletReservedBy || order.walletReservationReleased) {
      outcome = "nothing-to-release"; return root;
    }
    const rider = root.riders && root.riders[order.walletReservedBy];
    if (!rider) { outcome = "rider-not-found"; return; }
    const amount = money(order.walletReservedAmount || order.need || 0);
    const held = money(rider.walletReserved || 0);
    rider.walletReserved = Math.max(0, Math.round((held - amount) * 100) / 100);
    order.walletReservationReleased = true;
    order.walletReservationReleasedAt = Date.now();
    root.riders[order.walletReservedBy] = rider;
    root.orders[orderId] = order;
    outcome = "released";
    return root;
  });
  if (!tx.committed && outcome !== "nothing-to-release") {
    const messages = {
      "not-found": "Pesanan tidak ditemui.",
      "forbidden": "Tidak dibenarkan.",
      "rider-not-found": "Rekod Rider tidak ditemui."
    };
    throw new HttpsError("failed-precondition", messages[outcome] || "Tidak dapat melepaskan tempahan Wallet.");
  }
  return { ok: true, released: outcome === "released" };
});

/**
 * Vendor-only status transition. Keeps global orders and vorders mirror in sync.
 * Supported actions: accept, reject, ready, complete, cancel.
 */
exports.updateVendorOrderStatus = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const orderId = cleanId(req.data && req.data.orderId);
  const action = String(req.data && req.data.action || "");
  const prep = Math.max(0, Math.min(240, Math.round(Number(req.data && req.data.prepMinutes) || 0)));
  const reason = String(req.data && req.data.reason || "").trim().slice(0, 120);
  const transitions = {
    accept: ["baru", "diterima"],
    reject: ["baru", "ditolak"],
    ready: ["diterima", "siap"],
    complete: ["siap", "selesai"],
    cancel: ["baru", "batal"]
  };
  if (!transitions[action]) throw new HttpsError("invalid-argument", "Tindakan Vendor tidak sah.");
  let outcome = "not-found";
  const tx = await db.ref("/").transaction((root) => {
    if (!root) return root;
    const vendorOrder = root.vorders && root.vorders[uid] && root.vorders[uid][orderId];
    if (!vendorOrder) { outcome = "not-owned"; return; }
    const order = root.orders && root.orders[orderId];
    if (!order) { outcome = "not-found"; return; }
    const [expected, next] = transitions[action];
    if (String(vendorOrder.status || order.status) !== expected) {
      outcome = "bad-transition"; return;
    }
    const now = Date.now();
    vendorOrder.status = next;
    order.status = next;
    const timeKey = ({accept:"diterima",reject:"ditolak",ready:"siap",complete:"selesai",cancel:"batal"})[action];
    vendorOrder.t = Object.assign({}, vendorOrder.t || {}, { [timeKey]: now });
    order.t = Object.assign({}, order.t || {}, { [timeKey]: now });
    if (action === "accept") { vendorOrder.prep = prep; vendorOrder.stk = true; order.prep = prep; order.stk = true; }
    if (action === "reject" || action === "cancel") {
      vendorOrder.reason = reason || "Ditolak kedai";
      order.reason = vendorOrder.reason;
      vendorOrder.stk = false; order.stk = false;
    }
    root.vorders[uid][orderId] = vendorOrder;
    root.orders[orderId] = order;
    outcome = "updated";
    return root;
  });
  if (!tx.committed || outcome !== "updated") {
    const messages = {
      "not-owned": "Pesanan ini bukan milik kedai anda.",
      "not-found": "Pesanan tidak ditemui.",
      "bad-transition": "Status pesanan telah berubah atau tindakan tidak dibenarkan."
    };
    throw new HttpsError("failed-precondition", messages[outcome] || "Status tidak dapat dikemas kini.");
  }
  return { ok: true, orderId, action };
});

/** Admin-only server-side wallet adjustment; every adjustment is logged. */
exports.adminAdjustRiderWallet = onCall({ region: REGION }, async (req) => {
  if (!isAdmin(req)) throw new HttpsError("permission-denied", "Admin sahaja.");
  const uid = String(req.data && req.data.riderUid || "");
  const amount = Number(req.data && req.data.amount);
  const note = String(req.data && req.data.note || "").trim().slice(0, 160);
  if (!uid || !Number.isFinite(amount) || amount === 0 || Math.abs(amount) > 10000) {
    throw new HttpsError("invalid-argument", "UID atau jumlah pelarasan tidak sah.");
  }
  let result = null;
  const tx = await db.ref("/").transaction((root) => {
    if (!root || !root.riders || !root.riders[uid]) return;
    const rider = root.riders[uid];
    const bal = money(rider.wallet || 0);
    const held = money(rider.walletReserved || 0);
    const next = Math.round((bal + amount) * 100) / 100;
    if (next < held || next < 0) return;
    rider.wallet = next;
    const logRef = root.walletLog || (root.walletLog = {});
    const list = logRef[uid] || (logRef[uid] = {});
    const id = `fn_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    list[id] = { amount, balanceAfter: next, note, by: req.auth.uid, at: Date.now(), source: "admin-function" };
    root.riders[uid] = rider;
    root.walletLog[uid] = list;
    result = { balance: next };
    return root;
  });
  if (!tx.committed || !result) throw new HttpsError("failed-precondition", "Pelarasan gagal; baki tidak boleh kurang daripada jumlah COD yang ditempah.");
  return { ok: true, ...result };
});




/** Rider status updates are server-validated; COD reservation is released atomically on completion. */
exports.riderUpdateOrderStatus = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const orderId = cleanId(req.data && req.data.orderId);
  const action = String(req.data && req.data.action || '');
  const transitions = { pickup: ['diterima','diambil'], complete: ['diambil','selesai'] };
  if (!transitions[action]) throw new HttpsError('invalid-argument', 'Tindakan Rider tidak sah.');
  let outcome = 'not-found';
  const tx = await db.ref('/').transaction((root) => {
    if (!root || !root.orders || !root.orders[orderId]) { outcome='not-found'; return; }
    const order = root.orders[orderId];
    if (order.riderUid !== uid) { outcome='forbidden'; return; }
    const [expected, next] = transitions[action];
    if (order.status !== expected) { outcome='bad-transition'; return; }
    const now = Date.now();
    order.status = next;
    order.t = Object.assign({}, order.t || {}, { [next]: now });
    if (action === 'complete') {
      const rider = root.riders && root.riders[uid];
      if (order.pay === 'cash' && order.walletReservedBy === uid && !order.walletReservationReleased) {
        if (!rider) { outcome='rider-not-found'; return; }
        const held = money(rider.walletReserved || 0);
        const amount = money(order.walletReservedAmount || order.need || 0);
        rider.walletReserved = Math.max(0, Math.round((held - amount) * 100) / 100);
        root.riders[uid] = rider;
        order.walletReservationReleased = true;
        order.walletReservationReleasedAt = now;
      }
      order.riderLoc = null;
      order.doneGps = req.data && req.data.doneGps === true;
      if (Number.isFinite(Number(req.data && req.data.doneDist))) order.doneDist = Math.max(0, Number(req.data.doneDist));
    }
    root.orders[orderId] = order; outcome='updated'; return root;
  });
  if (!tx.committed || outcome !== 'updated') {
    const msg = { 'not-found':'Pesanan tidak ditemui.', forbidden:'Pesanan ini bukan milik anda.', 'bad-transition':'Status pesanan telah berubah.', 'rider-not-found':'Rekod Rider tidak ditemui.' };
    throw new HttpsError('failed-precondition', msg[outcome] || 'Status gagal dikemas kini.');
  }
  return { ok:true, orderId, status: action === 'pickup' ? 'diambil' : 'selesai' };
});

/** Rider arrival timestamps are written only for the assigned rider. */
exports.riderMarkArrival = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const orderId = cleanId(req.data && req.data.orderId);
  const kind = String(req.data && req.data.kind || '');
  if (!['pickup','drop'].includes(kind)) throw new HttpsError('invalid-argument','Lokasi ketibaan tidak sah.');
  const ref = db.ref('orders/' + orderId);
  const tx = await ref.transaction(order => {
    if (!order || order.riderUid !== uid) return;
    if (kind === 'pickup' && order.status === 'diterima' && !order.arrivedAt) {
      order.arrivedAt = Date.now(); order.t = Object.assign({}, order.t || {}, { arrived: order.arrivedAt }); return order;
    }
    if (kind === 'drop' && order.status === 'diambil' && !order.arrivedDropAt) {
      order.arrivedDropAt = Date.now(); order.t = Object.assign({}, order.t || {}, { arrivedDrop: order.arrivedDropAt }); return order;
    }
    return;
  });
  if (!tx.committed) throw new HttpsError('failed-precondition','Ketibaan tidak dapat direkodkan. Semak pemilikan dan status pesanan.');
  return { ok:true, orderId, kind };
});

/** Customer receipt confirmation / non-receipt report.
 * Only the authenticated customer who created a completed order may submit it.
 * Uses Admin SDK so customers do not need direct write access to orders/{id}/conf.
 */
exports.customerConfirmReceipt = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const orderId = cleanId(req.data && req.data.orderId);
  const value = String(req.data && req.data.value || '');
  const message = String(req.data && req.data.message || '').trim().slice(0, 240);
  if (!['ok', 'issue'].includes(value)) {
    throw new HttpsError('invalid-argument', 'Pilihan pengesahan tidak sah.');
  }
  if (value === 'issue' && !message) {
    throw new HttpsError('invalid-argument', 'Sila pilih sebab laporan.');
  }
  const customerSnap = await db.ref('customers/' + uid).once('value');
  const customerProfile = customerSnap.val() || {};
  if (customerProfile.status === 'blocked') {
    throw new HttpsError('permission-denied', 'Akaun Customer disekat. Pengesahan pesanan tidak dibenarkan.');
  }
  const orderRef = db.ref('orders/' + orderId);
  const tx = await orderRef.transaction((order) => {
    if (!order) return;
    if (order.customerUid !== uid || order.status !== 'selesai') return;
    if (order.conf) return;
    order.conf = { v: value, t: Date.now() };
    if (value === 'issue') order.conf.m = message;
    return order;
  });
  if (!tx.committed) {
    const snap = await orderRef.once('value');
    const order = snap.val();
    if (order && order.customerUid !== uid) throw new HttpsError('permission-denied', 'Anda bukan pemilik pesanan ini.');
    if (order && order.conf) throw new HttpsError('already-exists', 'Pengesahan atau laporan telah dihantar.');
    if (order && order.status !== 'selesai') throw new HttpsError('failed-precondition', 'Pengesahan hanya tersedia selepas pesanan selesai.');
    throw new HttpsError('not-found', 'Pesanan tidak ditemui.');
  }
  if (value === 'issue') {
    const reportId = 'receipt_' + orderId;
    await db.ref('reports/' + reportId).set({
      type: 'customer', orderId, ref: String(tx.snapshot.val().ref || ''),
      from: 'customer', customerUid: uid,
      name: String(tx.snapshot.val().name || ''),
      msg: 'BELUM TERIMA: ' + message, status: 'baru', createdAt: Date.now()
    });
  }
  return { ok: true, orderId, value };
});


function safePhone(raw) { return normalizeMsisdn(raw); }

exports.getCustomerSession = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const snap = await db.ref("customers/" + uid).once("value");
  const p = snap.val() || {};
  if (p.status === "blocked") throw new HttpsError("permission-denied", "Akaun Customer disekat oleh Admin.");
  return { uid, phone: p.phone || "", verified: p.phoneVerified === true,
    profileComplete: p.profileComplete === true, status: p.status || "active",
    name: p.name || "", address: p.address || "" };
});

exports.saveCustomerProfile = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req), d = req.data || {};
  const name = String(d.name || "").trim().replace(/\s+/g, " ").slice(0,100);
  const address = String(d.address || "").trim().slice(0,300);
  if (name.length < 3 || address.length < 8) throw new HttpsError("invalid-argument", "Nama penuh dan alamat lengkap diperlukan.");
  const ref = db.ref("customers/" + uid), snap = await ref.once("value"), p = snap.val() || {};
  if (p.status === "blocked") throw new HttpsError("permission-denied", "Akaun Customer disekat.");
  if (p.phoneVerified !== true || !p.phone) throw new HttpsError("failed-precondition", "Sahkan nombor telefon dahulu.");
  await ref.update({ name, address, profileComplete: true, updatedAt: Date.now() });
  return { ok: true, profileComplete: true };
});

exports.adminListCustomers = onCall({ region: REGION }, async (req) => {
  if (!isAdmin(req)) throw new HttpsError("permission-denied", "Akses Admin sahaja.");
  const snap = await db.ref("customers").once("value");
  const data = snap.val() || {};
  return Object.entries(data).map(([uid,p]) => ({
    uid, name: p && p.name || "", phone: p && p.phone || "",
    address: p && p.address || "", status: p && p.status || "active",
    profileComplete: !!(p && p.profileComplete), createdAt: p && p.createdAt || 0,
    blockedAt: p && p.blockedAt || 0, blockReason: p && p.blockReason || ""
  })).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
});

exports.adminSetCustomerBlocked = onCall({ region: REGION }, async (req) => {
  if (!isAdmin(req)) throw new HttpsError("permission-denied", "Akses Admin sahaja.");
  const uid = String(req.data && req.data.uid || "");
  const blocked = req.data && req.data.blocked === true;
  const reason = String(req.data && req.data.reason || "").trim().slice(0,300);
  if (!/^[A-Za-z0-9_-]{6,128}$/.test(uid)) throw new HttpsError("invalid-argument", "ID pengguna tidak sah.");
  const ref = db.ref("customers/" + uid), snap = await ref.once("value"), p = snap.val();
  if (!p || !p.phoneVerified) throw new HttpsError("not-found", "Akaun Customer tidak ditemui.");
  await ref.update(blocked ? {
    status:"blocked", blockedAt:Date.now(), blockedBy:req.auth.uid,
    blockReason:reason || "Disekat oleh Admin"
  } : {
    status:"active", unblockedAt:Date.now(), unblockedBy:req.auth.uid,
    blockReason:null, blockedAt:null, blockedBy:null
  });
  if (blocked) {
    try { await getAuth().revokeRefreshTokens(uid); }
    catch (e) { console.error("Unable to revoke Customer refresh tokens", uid, e); }
  }
  return { ok:true, status:blocked?"blocked":"active" };
});

exports.createCustomerOrder = onCall({ region: REGION }, async (req) => {
  const uid=requireAuth(req), d=req.data||{}, src=d.order||{}, ci=d.contact||{}, orderId=cleanId(d.orderId);
  const text=(v,n)=>String(v==null?"":v).trim().slice(0,n);
  const point=p=>{const lat=Number(p&&p.lat),lng=Number(p&&p.lng);if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat < -90||lat > 90||lng < -180||lng > 180)throw new HttpsError("invalid-argument","Lokasi tidak sah.");return{lat,lng,addr:text(p.addr,200)};};
  const phone=text(ci.phone,20),km=Number(src.km),vehicle=text(src.vehicle,20),service=text(src.service,40),pay=text(src.pay,20);
  if(!phone||!Number.isFinite(km)||km<=0||km>250||!["Motor","Kereta"].includes(vehicle)||!["cash","online"].includes(pay)||!service)throw new HttpsError("invalid-argument","Maklumat tempahan tidak lengkap atau tidak sah.");
  const verifiedSnap = await db.ref("customers/" + uid).once("value");
  const customer = verifiedSnap.val() || {};
  if (customer.status === "blocked") throw new HttpsError("permission-denied", "Akaun Customer disekat oleh Admin.");
  if (customer.phoneVerified !== true || customer.profileComplete !== true || !customer.phone || normalizeMsisdn(phone) !== customer.phone) {
    throw new HttpsError("failed-precondition", "Lengkapkan login OTP, nama penuh dan alamat sebelum membuat tempahan.");
  }
  const pick=point(src.pick),drop=point(src.drop);if(!pick.addr||!drop.addr)throw new HttpsError("invalid-argument","Alamat ambil dan hantar diperlukan.");
  const itemEst=pay==="cash"?money(src.itemEst||0):0,rain=src.rain===true;
  const price=Math.round((5+Math.max(0,km-5)+(vehicle==="Kereta"?10:0)+(rain?2:0))*100)/100;
  const cfg=await db.ref("publicConfig/walletMinCash").once("value"),minCash=Math.max(0,Number(cfg.val())||0),need=pay==="cash"?Math.round((minCash+itemEst)*100)/100:0;
  const now=Date.now(),ref=text(src.ref,30)||("RKB-"+orderId.slice(0,4).toUpperCase());
  const order={ref,createdAt:now,status:"baru",customerUid:uid,service,vehicle,pick,drop,notes:text(src.notes,600),name:customer.name,km:Math.round(km*10)/10,rain,rainFee:rain?2:0,price,pay,itemEst,need,riderPay:Math.round(price*80)/100};
  const phoneKey=customer.phone.replace(/[^0-9]/g,"");
  const contact={customerUid:uid,phone:customer.phone,phoneKey,recv:text(ci.recv,100)};
  const limitRef=db.ref("ratelimit/"+phoneKey);
  const lock=await limitRef.transaction(last=>{
    if(last&&now-Number(last)<30000)return;
    return now;
  });
  if(!lock.committed)throw new HttpsError("resource-exhausted","Sila tunggu 30 saat sebelum menghantar tempahan baharu.");

  // Claim each order ID atomically; never overwrite an existing order.
  const orderRef=db.ref("orders/"+orderId);
  let orderClaimed=false;
  try{
    const claim=await orderRef.transaction(current=>{
      if(current!==null)return;
      return order;
    });
    if(!claim.committed){
      throw new HttpsError("already-exists","ID pesanan telah digunakan. Sila jana ID pesanan baharu.");
    }
    orderClaimed=true;
    await db.ref("orderContacts/"+orderId).set(contact);
  }catch(e){
    if(orderClaimed){
      try{
        await orderRef.transaction(current=>{
          if(current&&current.customerUid===uid&&current.createdAt===now&&current.status==="baru")return null;
          return;
        });
      }catch(cleanupError){
        console.error("Unable to roll back incomplete customer order",orderId,cleanupError);
      }
    }
    if(e instanceof HttpsError)throw e;
    console.error("Customer order persistence failed",orderId,e);
    throw new HttpsError("internal","Pesanan tidak dapat disimpan. Sila cuba semula.");
  }
  return{ok:true,orderId,ref,price,status:"baru"};
});



/**
 * Rider-safe dispatch feed.
 * Returns only fields needed to evaluate/operate a job; no customer name,
 * phone, receiver details, or orderContacts. Admin SDK reads the source.
 */
exports.listRiderOrders = onCall({ region: REGION }, async (req) => {
  const uid = requireAuth(req);
  const riderSnap = await db.ref("riders/" + uid).once("value");
  const rider = riderSnap.val() || {};
  if (rider.approved !== true || rider.suspended === true) {
    throw new HttpsError("permission-denied", "Akaun Rider belum diluluskan atau sedang digantung.");
  }
  const ordersSnap = await db.ref("orders").once("value");
  const all = ordersSnap.val() || {};
  const result = {};
  for (const [id, o] of Object.entries(all)) {
    if (!o || typeof o !== "object") continue;
    const available = o.status === "baru" && !o.riderUid;
    const assigned = o.riderUid === uid;
    if (!available && !assigned) continue;
    result[id] = {
      ref: String(o.ref || id).slice(0, 40),
      createdAt: Number(o.createdAt || 0),
      status: String(o.status || ""),
      riderUid: assigned ? uid : null,
      service: String(o.service || "").slice(0, 40),
      vehicle: String(o.vehicle || "").slice(0, 20),
      pick: o.pick && { lat: Number(o.pick.lat), lng: Number(o.pick.lng), addr: String(o.pick.addr || "").slice(0, 200) },
      drop: o.drop && { lat: Number(o.drop.lat), lng: Number(o.drop.lng), addr: String(o.drop.addr || "").slice(0, 200) },
      km: Number(o.km || 0),
      rain: o.rain === true,
      rainFee: Number(o.rainFee || 0),
      price: Number(o.price || 0),
      pay: String(o.pay || ""),
      itemEst: Number(o.itemEst || 0),
      need: Number(o.need || 0),
      riderPay: Number(o.riderPay || 0),
      notes: assigned ? String(o.notes || "").slice(0, 300) : "",
      t: o.t && typeof o.t === "object" ? o.t : {}
    };
  }
  return { orders: result, serverTime: Date.now() };
});

function normalizeMsisdn(raw) {
  let n = String(raw || "").replace(/[^\d]/g, "");
  if (n.startsWith("0")) n = "60" + n.slice(1);
  if (!n.startsWith("60") || n.length < 10 || n.length > 12) {
    throw new HttpsError("invalid-argument", "Masukkan nombor Malaysia yang sah, contoh 0123456789.");
  }
  return n;
}
function otpDigest(uid, phone, otp) {
  return crypto.createHmac("sha256", WA_OTP_PEPPER.value()).update(uid + "|" + phone + "|" + otp).digest("hex");
}

/** Sends a Meta-approved WhatsApp Authentication template OTP. */
exports.startWhatsAppOtp = onCall({
  region: REGION,
  secrets: [WA_ACCESS_TOKEN, WA_PHONE_NUMBER_ID, WA_OTP_PEPPER]
}, async (req) => {
  const uid = requireAuth(req);
  const phone = normalizeMsisdn(req.data && req.data.phone);
  const now = Date.now();
  const existingUid = (await db.ref("customerPhoneIndex/" + phone).once("value")).val();
  if (existingUid) {
    const existingProfile = (await db.ref("customers/" + existingUid).once("value")).val() || {};
    if (existingProfile.status === "blocked") throw new HttpsError("permission-denied", "Nombor ini disekat oleh Admin MYRIDERKU.");
  }
  const phoneCooldownRef = db.ref("privatePhoneOtpPhoneIndex/" + phone);
  const phoneCooldown = await phoneCooldownRef.transaction(v => {
    if (v && Number(v.lastSentAt) && now - Number(v.lastSentAt) < 60000) return;
    return { lastSentAt: now, uid };
  });
  if (!phoneCooldown.committed) {
    throw new HttpsError("resource-exhausted", "Nombor ini baru menerima OTP. Sila tunggu 60 saat.");
  }
  const ref = db.ref("privatePhoneOtp/" + uid);
  // Reserve cooldown atomically BEFORE contacting Meta to prevent parallel send spam.
  const reservation = await ref.transaction(v => {
    v = v || {};
    if (v.lastSentAt && now - Number(v.lastSentAt) < 60000) return;
    return { phone, lastSentAt: now, sending: true, attempts: 0, verified: false };
  });
  if (!reservation.committed) {
    throw new HttpsError("resource-exhausted", "Sila tunggu 60 saat sebelum meminta kod baharu.");
  }
  const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  const token = WA_ACCESS_TOKEN.value();
  const phoneNumberId = WA_PHONE_NUMBER_ID.value();
  const graphVersion = process.env.META_GRAPH_VERSION || "v27.0";
  const templateName = process.env.WA_OTP_TEMPLATE_NAME || "myriderku_otp";
  const templateLanguage = process.env.WA_OTP_TEMPLATE_LANGUAGE || "en";
  const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;
  // This payload is for an approved AUTHENTICATION template with a COPY_CODE OTP button.
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone,
    type: "template",
    template: {
      name: templateName,
      language: { code: templateLanguage },
      components: [
        { type: "body", parameters: [{ type: "text", text: otp }] },
        { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: otp }] }
      ]
    }
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("WhatsApp Cloud API send failed", response.status, result);
      await ref.update({ sending: false, sendFailedAt: Date.now() });
      throw new HttpsError("unavailable", "WhatsApp gagal menghantar kod. Semak nombor atau cuba sebentar lagi.");
    }
    await ref.update({
      digest: otpDigest(uid, phone, otp),
      expiresAt: now + 5 * 60 * 1000,
      sending: false,
      attempts: 0,
      verified: false,
      messageId: result.messages && result.messages[0] && result.messages[0].id || null
    });
    return { ok: true, expiresInSeconds: 300, retryAfterSeconds: 60 };
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    await ref.update({ sending: false, sendFailedAt: Date.now() });
    console.error("WhatsApp Cloud API request error", e);
    throw new HttpsError("unavailable", "Sambungan WhatsApp tidak berjaya. Cuba semula selepas 60 saat.");
  }
});

/** Verifies the OTP and records the verified phone against the authenticated UID. */
exports.verifyWhatsAppOtp = onCall({
  region: REGION,
  secrets: [WA_OTP_PEPPER]
}, async (req) => {
  const tempUid = requireAuth(req);
  const phone = normalizeMsisdn(req.data && req.data.phone);
  const otp = String(req.data && req.data.otp || "").replace(/\D/g, "");
  if (!/^\d{6}$/.test(otp)) throw new HttpsError("invalid-argument", "Kod OTP mesti 6 digit.");
  const otpRef = db.ref("privatePhoneOtp/" + tempUid);
  let outcome = "invalid";
  const tx = await otpRef.transaction(v => {
    if (!v || v.phone !== phone || v.verified || Number(v.expiresAt) < Date.now() || Number(v.attempts || 0) >= 5) {
      outcome = "expired"; return;
    }
    const expected = String(v.digest || ""), actual = otpDigest(tempUid, phone, otp);
    const ok = expected.length === actual.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
    if (!ok) { v.attempts = Number(v.attempts || 0) + 1; outcome = "wrong"; return v; }
    v.verified = true; v.verifiedAt = Date.now(); outcome = "verified"; return v;
  });
  if (outcome !== "verified" || !tx.committed) {
    const messages = { expired:"Kod tamat tempoh atau had cubaan dicapai. Minta kod baharu.", wrong:"Kod tidak tepat. Semak semula kod WhatsApp." };
    throw new HttpsError("failed-precondition", messages[outcome] || "Pengesahan gagal.");
  }

  // Claim the phone number exactly once. The index is the uniqueness lock.
  const indexRef = db.ref("customerPhoneIndex/" + phone);
  const claim = await indexRef.transaction(existing => existing || tempUid);
  if (!claim.committed) throw new HttpsError("aborted", "Nombor telefon sedang digunakan. Cuba semula.");
  const customerUid = String(claim.snapshot.val());
  const customerRef = db.ref("customers/" + customerUid);
  const existing = (await customerRef.once("value")).val() || {};
  if (existing.status === "blocked") {
    throw new HttpsError("permission-denied", "Nombor ini disekat oleh Admin MYRIDERKU. Hubungi Admin untuk semakan.");
  }
  if (existing.phone && existing.phone !== phone) {
    throw new HttpsError("failed-precondition", "Akaun ini telah dipautkan kepada nombor telefon lain.");
  }
  await customerRef.update({
    phone, phoneVerified:true, phoneVerifiedAt:Date.now(),
    status: existing.status || "active",
    createdAt: existing.createdAt || Date.now(),
    lastLoginAt:Date.now(),
    ...(existing.name ? {} : { profileComplete:false })
  });
  const customToken = await getAuth().createCustomToken(customerUid, { customer:true, phoneVerified:true });
  return { ok:true, verified:true, customToken, uid:customerUid, existingAccount:customerUid !== tempUid,
    profileComplete:existing.profileComplete===true, name:existing.name||"", address:existing.address||"" };
});

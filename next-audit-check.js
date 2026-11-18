const fs=require("fs"),path=require("path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const fn=read("functions/index.js"), bridge=read("v81-callables.js");
const files={customer:read("customer.html"),track:read("customer-track.html"),rider:read("rider.html"),vendor:read("vendor.html"),admin:read("admin.html")};
const calls=[...bridge.matchAll(/call\('([^']+)'\)/g)].map(m=>m[1]);
const exports=[...fn.matchAll(/exports\.([A-Za-z0-9_]+)\s*=/g)].map(m=>m[1]);
const missing=calls.filter(x=>!exports.includes(x));
const results=[
 ["Bridge callable exports",missing.length===0,missing.length?`Missing: ${missing.join(", ")}`:"All bridge endpoints exported"],
 ["Customer Functions bridge",files.customer.includes("v81-callables.js") && files.customer.includes("firebase-functions-compat.js"),"Customer page should load SDK and bridge"],
 ["Tracking bridge",files.track.includes("v81-callables.js"),"Tracking page should load bridge"],
 ["Rider legacy wallet writes",!(/function reserveWalletForOrder|function releaseWalletReservation/.test(files.rider)),"Legacy direct wallet reservation helpers should be removed after callable migration"],
 ["Vendor/Rider status separation",/deliveryStatus/.test(fn)&&/vendorStatus/.test(fn),"Separate vendor workflow state from delivery state"]
];
let fail=0;
for(const [name,ok,detail] of results){console.log(`${ok?"PASS":"GAP"}: ${name} — ${detail}`);if(!ok)fail++;}
console.log(`\\n${fail} integration gap(s) detected. Static audit only; no Firebase Emulator or production test.`);
process.exitCode=0;

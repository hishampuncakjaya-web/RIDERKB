#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const required = ["customer.html","customer-track.html","rider.html","vendor.html","admin.html","functions/index.js","functions/package.json"];
const missing = required.filter(p => !fs.existsSync(path.join(root,p)));
if (missing.length) { console.error("MISSING:", missing.join(", ")); process.exit(1); }
const fn = fs.readFileSync(path.join(root,"functions/index.js"),"utf8");
const endpoints = ["acceptOrder","releaseCodReservation","updateVendorOrderStatus","adminAdjustRiderWallet","riderUpdateOrderStatus"];
const absent = endpoints.filter(n => !fn.includes("exports."+n));
if (absent.length) { console.error("MISSING CALLABLES:", absent.join(", ")); process.exit(1); }
const pkg = JSON.parse(fs.readFileSync(path.join(root,"functions/package.json"),"utf8"));
if (pkg.engines?.node !== "20") { console.error("Expected Functions Node 20 runtime"); process.exit(1); }
console.log("PASS: required files, callable declarations and package metadata found.");
console.log("NOTE: this is a static check, not an Emulator or live Firebase test.");

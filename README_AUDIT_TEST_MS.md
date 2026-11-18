# MYRIDERKU V81 — Audit & Test Readiness

Status: static checks only. No Firebase Emulator run, no production deployment, no Blaze activation.

## What this package verifies
- JavaScript syntax for Cloud Functions and browser helper files.
- Presence of expected callable endpoints.
- Presence of the four role pages.
- Presence of Firebase project configuration and candidate migration rules, if supplied.
- A manual integration test matrix for Customer → Vendor → Rider → Admin.

## Important
This is not proof that Firebase integration works end-to-end. The current backend uses root-level Realtime Database transactions in several callables. This is atomic but can become expensive/contentious as the database grows. Review and test with Emulator before production.

## Required emulator test sequence
1. Install Firebase CLI and dependencies in a development environment.
2. Configure Auth and Realtime Database Emulator with a sanitized copy of the schema.
3. Seed test users: Customer (anonymous), approved Rider A/B, Vendor, Admin.
4. Run simultaneous `acceptOrder` calls from Rider A and B; exactly one may succeed.
5. Verify COD reservation is created once, wallet available balance never becomes negative, and completion releases reservation once.
6. Test Vendor transitions: baru → diterima → siap → selesai; invalid transitions must fail.
7. Test Customer confirmation and complaint ownership checks, duplicate submissions, and 30-minute auto-complete scheduler behavior (if enabled).
8. Test weather lookup failure and stale coordinates; no silent RM2 charge when weather cannot be verified.
9. Test admin wallet adjustments: unverified/non-admin denied; balance cannot fall below reserved amount; every successful adjustment has an audit record.
10. Verify role-specific reads and writes against candidate Rules.

## Manual acceptance matrix
- Customer: submit order, track order, confirm received, report not received.
- Rider: online/offline, accept one order, reject second concurrent claim, pickup, complete, COD reservation release.
- Vendor: edit store location, receive order, accept/reject, ready, complete/cancel.
- Admin: see full financial breakdown; non-admin roles must not see internal Dana Operasi or platform deductions.
- Marketplace: vendor retains original product price; platform markup 10% is added once; no second 10% vendor commission.
- Tips: 100% credited to Rider.
- Production safeguards: no deploy; no Blaze; no production Rules change until emulator tests pass.

## Known gaps to close before production
- Validate all browser pages call the matching callable endpoints (not merely that the helper exists).
- Add/test the Customer confirmation + complaint callable and its matching client wiring.
- Add/test the 30-minute scheduled auto-complete with complaint exclusion and idempotency.
- Confirm actual weather provider thresholds, API availability, caching, and timestamp freshness.
- Move proof media to Firebase Storage with explicit Storage Rules; avoid large base64 payloads in RTDB.
- Review root-level transactions and reduce contention where feasible without breaking atomic wallet/order claims.
- Run emulator tests and security-rule tests; then prepare a separate production release ZIP.

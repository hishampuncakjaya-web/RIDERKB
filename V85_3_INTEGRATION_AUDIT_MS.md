# MYRIDERKU V85.3 — Integrated candidate status

## Changes integrated into source copy
1. V85.2 candidate Rules copied into project as `database.rules.V85_3_CANDIDATE.json`. It does not overwrite Production Rules.
2. `functions/index.js`: added callable `listRiderOrders`, which requires an approved, non-suspended Rider and returns only job-operational fields for unassigned jobs plus that Rider's assigned jobs. It omits customer name, phone, receiver details and orderContacts.
3. `v81-callables.js`: added bridge method `listRiderOrders`.
4. `rider.html`: replaced direct global `/orders` listener with callable polling every 7 seconds. This prevents the Rider client from needing global `/orders` read access.

## Confirmed by static checks
- Rules candidate parses as JSON.
- Source assertions for callable, bridge and Rider listener pass.
- JavaScript syntax checks are recorded in `V85_3_STATIC_CHECKS.json`.

## Still NOT complete / do not release
1. Admin: parent reads candidate require Admin token `email_verified == true`. Verify the actual Admin Firebase Auth user is verified. This has not been tested against a live token.
2. Vendor: V85.2 adds vendor-owner read at `/vorders/{vendorUid}`; Vendor writes/status transitions still depend on existing callable and data shape.
3. Marketplace: V85.2 enables public parent reads for `/vshops` and `/vmenu`. Audit data stored under those paths to ensure no private fields (phone, bank, vendor cost, payout) are present before publishing.
4. Marketplace checkout: `customer-shop.html` still writes directly to `/vorders`, `/orders`, and `/orderContacts`; existing Rules deny these client writes. A secure `createMarketplaceOrder` callable and frontend integration are still required.
5. Customer tracking/receipt: `customer-track.html` still uses `ensureGuestAuth` and reads `/orders/{id}` directly. This can fail when the tracking link is opened with a different/anonymous UID. A hashed, expiring tracking token flow is still required; ownership checks must not be removed.
6. Admin report data paths and radar GPS freshness require real test data and Emulator/live testing.
7. The callable dispatch feed is a code candidate only. It reads `/orders` using Admin SDK and returns a limited projection; test load/performance and ensure the existing `acceptOrder` transaction remains the only claim path.

## Release gate
- No Firebase Emulator tests were run in this environment.
- No browser/device tests were run.
- No Firebase Production Rules/data were changed.
- No Functions deployed; no Blaze enabled.
- Do not upload this ZIP to Netlify as a production release until the remaining items are implemented and tested.

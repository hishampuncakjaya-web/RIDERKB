# MYRIDERKU MASTER BUILD — Consolidated package

This package consolidates the existing V49 project tree (which already contains the V45 role-install work, V46 anonymous guest-auth work, V48 vendor commission calculation and V49 delivery-finance snapshot) into one Netlify upload package. It is not a rebuild from zero. Existing Firebase project configuration and data paths are retained.

## Included roles and pages
- Customer: `index.html`
- Rider: `rider.html`
- Vendor: `vendor.html`
- Admin: `admin.html`
- Marketplace: `shop.html`
- Order tracking: `track.html`

## Consolidated finance logic
- Marketplace commission: per unit, `max(RM1.00, 10% × effective unit price) × quantity`. Delivery charges are not part of this item commission.
- Effective unit price uses the vendor promo price (`pp`) when it is lower than the regular price (`p`). The order line price submitted by the browser is checked against the current effective menu price; mismatches are marked for review rather than silently calculated.
- Delivery finance records the completed fare split for reconciliation only. No bank transfer, payment-gateway settlement, or payout is performed.
- Legacy automatic wallet settlement is now additionally gated by `settings.walletSettlementV2 === true`; setting `autoWallet` alone will not trigger balance movement. Do not enable the new flag until a separately audited settlement and reversal workflow is deployed.

## Critical Firebase security status — NOT READY FOR LIVE PUBLIC LAUNCH
The existing `database.rules.json` is retained unchanged to avoid breaking current order dispatch and tracking. Audit found public reads on `/orders/{id}`, `/proofs/{id}`, and `/proofsP/{id}`. These paths can expose personal details, delivery addresses/coordinates and payment-proof content. This is a release blocker. Do not assume this package has hardened Firebase access rules.

A safe rules migration cannot be applied as a one-line change: the current rider dispatch and customer tracking pages read the full order record directly. The next security migration must first introduce (1) a minimal, non-sensitive dispatch queue for approved riders, (2) assigned-rider-only access to full recipient/order details, and (3) high-entropy public tracking tokens that expose status and limited map data only. Customer ownership should use Firebase Auth UID. Existing historical records must remain intact. Only after the app readers are migrated and emulator tests pass should production rules be tightened.

## Deployment notes
1. Upload the ZIP contents to the existing Netlify site (do not create a new Firebase project).
2. In Firebase Authentication, enable Anonymous sign-in for the guest checkout/tracking flow.
3. Do not overwrite production Realtime Database rules with an untested rules file. The included `database.rules.json` is the current compatibility ruleset, not a secure final ruleset.
4. Cloud Functions require Firebase Blaze billing and deployment by the project owner. This package does not deploy functions automatically.
5. Test a complete customer order, rider claim, status changes, tracking, vendor promo order, vendor commission snapshot and admin review in a staging/test project before production use.

## Validation performed for this package
- JSON parse check for Firebase configuration files and rules.
- JavaScript syntax check for Cloud Functions (where Node.js is available).
- ZIP integrity check.

No live Firebase or Netlify deployment test was performed. A successful ZIP build does not mean the app is production-certified.

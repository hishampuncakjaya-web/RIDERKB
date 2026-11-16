# MYRIDERKU V49 — Finance & Wallet Reconciliation

## Delivery fare allocation
A completed delivery order creates an immutable reconciliation snapshot under `/deliveryFinance/{orderId}`:
- grossFare: final order fare
- riderEarning: stored `riderPay`, or configured `settings.riderShare` (default 80%)
- platformShare: grossFare minus riderEarning
- paymentMethod: order payment method
- status: `calculated_pending_reconciliation`

This preserves the established 80% rider / 20% platform model when the stored order uses that split. If `riderPay` is explicitly present, the snapshot preserves it and calculates the platform remainder rather than silently overriding it.

## Marketplace vendor commission
V48's `calculateVendorCommission` remains in place:
`max(RM1.00, 10% × unit price) × quantity`, per line item, based on the vendor menu price read server-side.

## Important limitations
- These functions calculate and record financial snapshots only.
- They do not initiate bank transfers, payment-gateway charges, refunds, or wallet payouts.
- Existing `settleOrder` remains unchanged and still depends on `settings.autoWallet === true`.
- Do not enable automatic wallet settlement until payment confirmation, cancellations, refunds, chargebacks, idempotency, negative balances, and atomic ledger/wallet updates have been tested.
- Firebase Rules for the new `/deliveryFinance` path must be reviewed and deployed separately. Admin SDK Cloud Functions bypass Realtime Database client rules.
- Deploy Cloud Functions separately from the static Netlify ZIP.
- No existing Firebase data is deleted or rewritten by this release.

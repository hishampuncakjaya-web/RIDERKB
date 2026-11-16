# MYRIDERKU MASTER BUILD — Rewards UI Preview

This package is based on the existing MYRIDERKU Master Build (V49 consolidated tree). It preserves the existing customer, rider, vendor, admin, marketplace and tracking pages, Firebase configuration, and existing data paths.

## New in this package
- Customer home link to `rewards.html`.
- New responsive Rewards & VIP preview page showing the approved design decisions: 100 Coins = RM1; 1 Coin per RM1 eligible purchase; Bronze/Silver/Gold/Diamond thresholds RM0/RM300/RM1,000/RM3,000; rolling 12-month eligibility; 30-day protection period; Platform, Store, Delivery and VIP voucher categories; and Flash Sale / missions / check-in / referral concepts.
- Platform + Store voucher combination is shown as the approved checkout model. Delivery voucher combination remains configurable per Admin campaign.

## Important implementation status
The new Rewards page is a front-end design preview only. Coins issuance/redemption, rolling VIP calculation, 30-day downgrade timer, voucher issuance/stacking, vendor promotion management, Flash Sale stock locking and finance-ledger posting are NOT connected to Firebase in this build. The preview uses illustrative values and must not be used for real transactions.

The existing master build's Firebase security and finance limitations remain unchanged. In particular, review `RELEASE-MASTER-BUILD.md` before public launch. Do not replace production Firebase rules with untested rules.

## Netlify upload
Upload the ZIP contents to the existing MYRIDERKU Netlify site. This updates the customer home with a link to the new preview page. It does not deploy Cloud Functions or change Firebase data.

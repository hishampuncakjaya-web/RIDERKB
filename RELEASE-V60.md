# MYRIDERKU V60 — PUBLIC CONFIG CLIENT MIGRATION (STAGING)

## Client changes
- `common.js`: introduces read-only helpers for `/publicConfig` and `/publicConfig/payment`.
- `common.js`: `loadShares()` no longer reads the whole `/settings` node; rider share and vendor markup stay on configured internal defaults.
- `index.html`: Customer pricing/payment bootstrap reads `/publicConfig`, and caches only the public allowlist under `rkb-public-config`.
- `track.html` and `shop.html`: payment display reads `/publicConfig/payment`.
- `V60-PUBLIC-CONFIG-RULES-CANDIDATE.json`: separate staging rules candidate copied from the V55 changeset; it does not replace `database.rules.json`.

## Required staging data
Populate `/publicConfig` in an isolated staging RTDB with the reviewed allowlist:
- `pricing`: base, freeKm, perKm, car, rain
- `payment`: bank, acc, name, optional QR image data URL

Do not copy riderShare, vendorMarkup, WhatsApp secrets, wallet/payout data, or internal settings into publicConfig.

## Important deployment gates
- This build assumes `/publicConfig` exists. If it is absent, the customer page retains hard-coded defaults and payment details may not display.
- Do not deploy the candidate rules until staging data exists and all app paths are verified.
- Admin continues to use `/settings`; no admin config editor was changed in this patch.
- No Firebase live writes, production rules changes, Netlify deployment, or data migration were performed.
- V56/V57 order privacy and tracking are still not fully integrated.
- Not production-ready; Firebase Emulator, checkout, role portals, Android and end-to-end tests remain outstanding.

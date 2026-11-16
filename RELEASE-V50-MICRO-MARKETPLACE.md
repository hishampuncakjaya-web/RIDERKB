# RELEASE V50 — Micro Business Marketplace

This release packages the existing MYRIDERKU Admin Live Order Monitor base with the Micro Business Vendor profile and Customer Local Business Discovery updates.

### UI changes
- Vendor profile now asks business type: physical shop, home-based business, or individual/service provider.
- Vendor category list expanded for local business diversity.
- Customer shop directory now supports keyword search and category filters.
- Service businesses can appear in the directory, but booking/quotation processing is not yet implemented by this release.

### Data compatibility
- Existing Firebase project and records are retained.
- Existing `vshops/{uid}` records remain readable. New profiles also store `businessType`.
- No database rules were changed.

### Verification
- ZIP integrity checked after packaging.
- Inline JavaScript syntax checked with Node.js for customer, vendor, rider, admin and shop pages.
- Live Firebase, Netlify deployment, Android device layout, real payments, QR identity and full production workflows have not been tested here.

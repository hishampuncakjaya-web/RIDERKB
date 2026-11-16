# MYRIDERKU — Micro Business Marketplace Update

## Included in this package
- Expanded Vendor business categories to cover food, retail, fashion, beauty, health, electronics, hardware, automotive, agriculture, gifts, laundry, home/furniture, services and other local businesses.
- Added Vendor business type: physical shop, home-based business, or individual/service provider.
- Saved `businessType` with the existing `vshops/{uid}` profile record; existing Firebase data is preserved.
- Added Customer Marketplace directory search and category filters using existing public `vshops` data.
- Retained the existing Admin live vendor-order monitor, Customer/Rider/Vendor/Shop/Tracking/Rewards pages and existing Firebase configuration files.

## Important limits — not production certification
- This update does not change Firebase Security Rules and does not create a new identity-verification service.
- Vendor registration still uses the existing email/password Firebase Authentication flow and existing Admin approval flag. The new business type/category are profile fields, not a new review workflow.
- No TNG QR / DuitNow QR login integration is included. A static payment QR is not proof of identity. Do not treat a QR image or payment screenshot as verified identity.
- SSM is not added as a universal form requirement in this UI. This does not waive permits, licences, food safety, regulated activity or other legal requirements that apply to a particular business.
- The new directory only displays businesses already present in `vshops`; it does not invent or seed merchant records.
- The existing marketplace checkout and order workflow remain unchanged and are not converted into generic service-booking workflows in this release.

## Deployment
Upload the ZIP contents to the existing Netlify site. Keep the existing Firebase project and data. Before public launch, test login, vendor approval, profile saving, directory reads and ordering with test accounts, and review Firebase Rules for privacy and least-privilege access.

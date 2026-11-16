# MYRIDERKU Midnight Sapphire — visual package update

- Shared stylesheet `myriderku-v38-design.css` now applies the official Midnight Sapphire palette to Customer, Rider, Vendor, Admin, Marketplace and Tracking.
- PWA manifest theme colours and browser theme-color metadata use Sapphire Navy.
- Service worker cache key is bumped to `myriderku-v40-midnight-sapphire` and precaches the shared stylesheet.
- Added Netlify `_redirects` and `netlify.toml`.
- This is a visual/theme update only. Firebase rules, Cloud Functions, fare formulas, dispatch and order workflows are not intentionally changed.
- Real-device and live-Firebase end-to-end tests have not been performed as part of this package build.

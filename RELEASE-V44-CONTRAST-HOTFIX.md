# MYRIDERKU V44 — Contrast hotfix

This is a focused follow-up to V43, based on the Customer booking screenshot.

## Fixed
- The “Tempat pantas & cari kedai berdekatan” accordion heading now uses high-contrast white text on a dark green surface.
- Accordion content and its labels now use readable light text; quick-choice chips use dark text on light surfaces.
- Address helper text and the footer language/theme controls use darker, higher-contrast text.
- Rain-fee checkbox copy is explicitly forced to a readable foreground color.

## Preserved
All V43 portal pages, Firebase configuration, database rules, functions, and business logic remain unchanged.

## Validation
ZIP integrity and required portal file presence checked. This CSS-only correction does not constitute live-device or Firebase end-to-end testing. After deployment, reload the site or clear the installed PWA cache if the old stylesheet remains visible.

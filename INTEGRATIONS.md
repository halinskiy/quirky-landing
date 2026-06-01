# Quirky — Integrations

External services and env-var placeholders. Phase 1 ships none wired (static
page only); this records the plan from system-distill.md.

## Forms (Phase 2)
- **Cloudflare Worker + Resend** (reuse the `apps/contact-worker` pattern).
  New Worker route + Resend audience for Quirky's newsletter / contact.
  Newsletter folds INTO the footer (inline), not a floating nag card.
- Env: `NEXT_PUBLIC_CONTACT_ENDPOINT` (Worker URL). Not set in Phase 1.

## Downloads
- **Direct DMG** (Developer ID signed, notarized) + **Sparkle** auto-update.
  Sparkle feed: `https://raw.githubusercontent.com/halinskiy/Quirky/main/appcast.xml`.
  Direct build = all 5 modes.
- **Mac App Store** build = OCR / HEX / SPX only (sandbox blocks DOM/SVG Apple
  Events). Both buttons shown; App Store honesty note required.
- Phase 2: pull `softwareVersion` from the appcast; hardcoded fallback URL.

## Analytics / consent (Phase 2)
- GDPR strict opt-in via the kit `CookieConsent` component (vendored).
  Analytics load only after Accept.

## Fonts / CDN
- Manrope via `next/font/google` (self-optimised, no runtime CDN call).
- Static export -> GitHub Pages. No server runtime.

## SEO
- JSON-LD SoftwareApplication + Organization in `layout.tsx`. softwareVersion
  "1.0", operatingSystem "macOS 13+", offers: Free + Pro one-time $16.99.
- og-image.png + favicons to be added to `public/` (Phase 2 / devops). The
  favicon `src/app/icon.svg` (coral blob + capture glyph) is already present.

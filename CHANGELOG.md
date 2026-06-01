# Quirky — Changelog

## 2026-06-01 — Fix morph M1: bookend forms opened as 0.32-opacity ghosts

Judge MORPH REVIEW found one blocking FAIL: the hero and final-CTA morph forms
(the two highest-conversion frames) sat at opacity 0.323 at rest, while the
static CaptureFan behind them was fully suppressed (data-morph=on) — so both
bookends opened as a one-third ghost. Cause: the StageForm opacity ramp
`[centre-half, centre-half*0.4, centre+half*0.4, centre+half] -> [0,1,1,0]`
never reached 1 at journey 0 (hero, index 0) or journey 1 (final, last index),
plus the `journey [0.04,0.92]` trim. Fix in MorphJourney.tsx StageForm: the
first stage now holds opacity 1 from journey 0 (stops pushed to -2/-1, vals 1/1),
and the last stage holds 1 through journey 1 (stops 2/3, vals 1/1). Other stages
unchanged. Verified via CDP at 1440 with motion ON: hero stage opacity = 1.0 at
scrollY 0 (stage set [1,0,0,0,0,0,0]); final stage = 1.0 at page bottom
([0,0,0,0,0,0,1]). Build green, tsc clean. Evidence: morph-hero-fixed.png.

## 2026-06-01 — Signature morph: one block flies + morphs across the whole page

Built the headline interactive piece the user asked for ("блок по всему сайту
летает и превращается в интерфейс и кнопки"): ONE Quirky block that flies the
whole page on scroll and morphs into each section's UI. Webflow dropped as a
target for this piece (per user); motion is NOT IX2-constrained.

New files (`src/components/morph/`):
- `useMorphEnabled.ts` — the gate (desktop >=768px AND not reduced-motion AND not
  `html[data-motion=off]`; re-evaluates on resize / media / attribute change).
- `MorphMount.tsx` — gate + `next/dynamic(ssr:false)` code-split boundary; sets
  `html[data-morph=on]` while live.
- `MorphJourney.tsx` — controller. Whole-page `useScroll()` -> journey 0..1;
  interpolates one fixed `pointer-events-none` block's x/y/scale between 7 stage
  anchors (right-side lane, never over the left-aligned copy) and cross-fades the
  active stage form. One easing (cubic-bezier(0.16,1,0.3,1)), no bounce.
- `MorphForms.tsx` — the 7 decorative (aria-hidden) shapes in the same
  blob/chip/coral vocabulary: hero Capture Fan -> single mode chip cycling
  OCR/HEX/DOM/SVG/SPX -> how-it-works steps window (keycaps) -> 5+1 features grid
  -> workflow deck-of-cards -> Pro pricing card with its coral CTA (the "turns
  into buttons" payoff) -> final dual-download form.

Wiring + handoff: `page.tsx` mounts `<MorphMount/>` after the footer. The static
hero + final Capture Fan get a plain inner `.morph-handoff` wrapper that fades out
under `:root[data-morph=on]` so the page shows ONE block, not a duplicate
(globals.css). HEX values stay the grabbed blue `#3D9DF2`, never coral; chrome is
the single coral accent throughout.

Motion-off / reduced-motion / mobile fallback: the overlay is NOT rendered at all;
the static sections (already judge-PASSED) are the whole experience. The morph is
an enhancement, never the content source (the forms are aria-hidden duplicates).

Verification (headless Chrome / CDP, dev server AND static `out/` export):
- `?motion=0` @ 1440 and @ 390: MorphJourney overlay absent, 0 blank sections, 0
  sub-16px body offenders, scrollWidth==clientWidth (overflow 0).
- motion ON @ 1440: overlay present, block transform visibly travels + scales
  across scroll (hero -> modes -> how -> features -> workflows -> pricing ->
  final); screenshots morph-desktop-{0,18,33,50,66,82,96}.png.
- mobile @ 390 motion ON: overlay absent, horizontal overflow 0; morph-mobile-390.png.
- CLS = 0 in both motion-on and motion-off (fixed overlay, no layout shift).
- `npx tsc --noEmit` clean; `rm -rf .next out && npm run build` green 3/3 clean
  runs; all routes export (/, /install, /privacy-policy, /terms, /refunds,
  /thanks, /404).

Promotion: generalized `useMorphEnabled` -> `useEnhancementEnabled` in the
Aisoldier ui-kit (motion primitives, INDEX.md + index.ts). Controller + forms
stay project-local (bespoke, like CaptureFan).

## 2026-06-01 — Fix judge Issue #1 (16px body minimum) + WARN #2 (ASCII separators)

Judge first-pass verdict was ISSUES with one blocking FAIL: body text under 16px
in ~16 places (template-design RETRO recurrence). Fixed: raised every sub-16
body utility to `text-[1rem]` (16px) across Features detail lines (was 14px),
Pricing notes/footnotes, Footer social pills + newsletter note, CookieConsent
Accept/Decline buttons, PageShell meta lines, /install file-size line (was
13.6px), Keycap chip, and the CaptureFan "Tab" SVG label (15 -> 16). The 12px
uppercase eyebrows are the one sanctioned exception and stay. Also cleared
WARN #2: replaced ASCII double-hyphen ` -- ` separators in hero.eyebrow,
hero.primaryCta.note, meta.titleTag, meta.ogTitle with commas/colons, and the
U+00B7 middle-dot title-template separator in layout.tsx with ` | `.

Verified by independent live CDP computed-font-size sweep over home + all 5
standalone pages + 404 (`?motion=0`): **0 sub-16px body elements on every route**
(only the 12px uppercase eyebrows remain, as allowed). Clean `next build` green,
`tsc --noEmit` clean. This clears the judge's blocking condition; awaiting
re-review verdict flip to PASSED before deploy.

## 2026-06-01 — Fix flaky `/404` static-export build (autonomous QA)

Clean `next build` (`output: export`) was failing intermittently (~30%, 2 in
6 clean runs) while prerendering `/404` with "<Html> should not be imported
outside of pages/_document" — Next's internal pages-router `/_error` fallback
racing into the `/404` slot during the parallel export workers. Cached `.next`
masked it, so in-session builds read green. Added `src/app/global-error.tsx`
(app-router top-level error boundary) which stops the pages `/_error` fallback
and removes the race. Verified: 8/8 clean builds pass, 0 errors. See
BUILD_FLAKE.md. Matters because GH Pages CI runs a clean build and would have
gone red roughly every 3rd-4th deploy.

## 2026-05-31 — Phase 2: all sections + standalone pages + consent + SEO (3mpq-soldier)

### Added (home sections, every string verbatim from content/copy.json)
- `ModeRail` (#modes) — "five in one": 5 mode blob-chips + a Tab switcher cell.
- `HowItWorks` (#how-it-works) — 3 steps with literal, visible keycaps
  (cmd+shift+1, Tab) via the new `Keycap` primitive.
- `Features` (#features) — 5+1 hairline-bordered grid, ONE BlobObject per cell,
  mono `detail` lines, switcher cell in accent-soft.
- `Workflows` — 3 audience micro-stories (frontend / designer / QA).
- `Fits` — trust row: offline, no account, notarized, menu-bar only, two
  permissions, and the honest Direct-vs-App-Store split (item 6).
- `Pricing` (#pricing) — 2 tiers (Quirky free / Quirky Pro $16.99 one-time), Pro
  highlighted (coral border + soft fill + "All five modes" badge), pill CTAs,
  comparison note + 3 footnotes. No subscription, no billing toggle.
- `Faq` (#faq) — project-local accordion, soft corners, height+opacity (no
  bounce), rotating +/- glyph, 8 Q/A, reduced-motion safe.
- `FinalCta` (#download) — loud bookend: keycap headline, dual download with
  honest notes, reused mini Capture Fan.
- `Footer` — 4-col (brand+slogan+social / Product / Download / Legal), inline
  newsletter (placeholder, no nag card), persistent "Cookie preferences" re-open
  button, first-person author line, copyright.

### Added (shared + consent + standalone)
- `Section` + `SectionHeader` shell; `Reveal` (one section-enter motion, EASE_OUT,
  renders final state instantly under reduced-motion AND html[data-motion=off]
  so ?motion=0 shows content, not the 0-opacity frame); `Keycap` primitive.
- `ConsentProvider` (context + localStorage, owns all storage) + project-local
  `CookieConsent` card (presentational, body-portaled, Esc = no-op). Mounted in
  root layout; footer button re-opens it on any page.
- One standalone shell family (`PageShell` + `LegalSections`): /privacy-policy,
  /terms, /refunds (GDPR-aware first-person bodies), /thanks, /install, friendly
  404 (not-found.tsx).

### Changed
- Hero + Nav now read copy.json verbatim (were placeholder). Nav anchors
  reconciled to copy.json hrefs (#how-it-works / #features / #pricing / #faq /
  #download) + mobile disclosure menu (no overflow at 390px). Root layout wraps
  children in ConsentProvider.

### Removed
- Dead duplicate `src/components/hero/CaptureFan.tsx`; `sections/Stubs.tsx`.

### Verified
- `npx tsc --noEmit` clean. `npm run build` green (static export, 10 pages).
- Routes in out/: / , /install/ , /privacy-policy/ , /refunds/ , /terms/ ,
  /thanks/ , /404.html (+ /404/index.html).
- Full-page screenshots at ?motion=0: home-desktop.png (1440x6519),
  home-mobile.png (390x6612), home-pricing.png, standalone-privacy.png.
  Overflow assertion at 390: scrollWidth == clientWidth == 390 (no h-scroll).
  All sections, blobs, grids reflow cleanly to single column on mobile.
- Home First Load JS 169KB parsed (Next's figure) / per-file gzip sum ~136KB,
  dominated by the shared React + framer-motion chunk (one chunk, not
  per-section). framer-motion imported only in client sections that need it.

## 2026-05-31 — Phase 1: scaffold + Nav + Hero (3mpq-soldier)

### Added
- Next.js 15 + React 19 + TS-strict scaffold at repo root, mirroring
  corder-landing: `package.json` (+ lenis), `next.config.ts` (static export,
  trailingSlash, unoptimized images), `tsconfig.json`, `postcss.config.mjs`,
  `.gitignore`, `.vercelignore`, `README.md`, `.github/workflows/deploy.yml`.
- Manrope (variable) via `next/font/google`, display swap, `--font-manrope`.
- `src/app/tokens.css` — `@theme` block: LOCKED coral 5-step scale, warm-paper
  neutrals (paper/ink/gray ramp), Manrope type scale, rounder radii (window 20
  / card 16 / button 14), captured-blue token.
- `src/app/globals.css` — Tailwind import + Lenis baseline + dot-grid +
  hero-device keyframes (quirky-marquee / quirky-float / quirky-pulse) +
  reduced-motion / `?motion=0` gating + focus-visible policy + pause-offscreen.
- `src/app/layout.tsx` — Manrope, MotionProvider (Lenis), Inspector (dev-only),
  JSON-LD (SoftwareApplication + Organization, v1.0, macOS 13+, Free + Pro
  one-time $16.99), metadata, pre-hydration motion bootstrap.
- `src/app/icon.svg` — favicon (coral blob squircle + dashed capture glyph).
- `src/components/providers/MotionProvider.tsx` — Lenis wiring + motion-off.
- `src/components/devtools/Inspector.tsx` — Cmd+click overlay.
- `src/components/blobs/BlobObject.tsx` — the single decorative blob set (8
  glyphs: ocr/hex/dom/svg/spx + capture/tab/check; coral-soft fill + ink stroke;
  nestable via x/y for the hero chips).
- `src/components/ui/Button.tsx` (pill CTA) + `ui/EyebrowLabel.tsx` (12px
  eyebrow, w-fit anti-stretch).
- `src/components/sections/Nav.tsx` — sticky nav, blob mark, coral pill CTA.
- `src/components/sections/CaptureFan.tsx` — bespoke hero device: region rect +
  dashed coral marquee + 5 fanned data-chips (Framer stagger + CSS float) +
  pulsing Tab keycap. <15KB inline SVG. motion-safe.
- `src/components/sections/Hero.tsx` — Section 1: eyebrow + headline + subhead +
  dual download CTAs (honest App-Store-modes note) + CaptureFan.
- `src/components/sections/{ModeRail,HowItWorks,Features,Workflows,Fits,Pricing,
  Faq,FinalCta,Footer}.tsx` — Phase-1 labelled placeholders, correct anchors,
  wired into page.tsx in the quirky-direction section order.
- `src/lib/cn.ts`.
- ui-kit promotion: `ui-kit/components/illustration/BlobObject.tsx` (the
  reusable blob shell) + new "Illustration" row in `ui-kit/INDEX.md`.
- Project dossier: CLAUDE, BRIEF, DESIGN_SYSTEM, ARCHITECTURE, COMPONENTS,
  INTEGRATIONS, DECISIONS, HANDOFF, CHANGELOG, CORRECTIONS, RETRO.

### Reconciled
- Two concurrent Phase-1 scaffolds were merged into one: the complete
  `sections/*` + `ui/*` + `blobs/BlobObject` set (already wired into page.tsx)
  was kept; duplicate `nav/`, `hero/`, `motion/BlurReveal`, `blobs/QuirkyBlob`,
  `sections/Stubs`, `providers/LenisProvider`, `providers/PauseOffscreen`,
  `lib/motion`, `content/copy.ts` were deleted. tokens/globals/layout aligned to
  the canonical paper/ink/gray naming. Fixed a `CaptureFan` build error
  (`m` import -> `motion`).

### Verified
- `npm install` clean. `npm run build` PASSES: compiled, typecheck + lint clean,
  static export emitted to `out/` (5 static pages).
- Home route JS = **61.0 KB gzipped** (budget <= 80KB). All-chunks 78.9KB.
- Hero renders (SSR-asserted: headline, Nav, Hero, CaptureFan, 4 BlobObject
  chips + 1 HEX swatch, dot-grid, dual CTAs). Screenshot at `?motion=0` saved to
  `hero-scaffold.png` (1440x2700, full page) and visually confirmed.

### Pending (Phase 2)
- Wire copy.json into sections 3-11; replace stubs.
- og-image + full favicon set + real app icon. Worker/Resend forms.
  CookieConsent. Standalone legal pages (copy already in copy.json `standalone`).
- Judge review before anything reaches the user.

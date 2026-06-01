# Quirky — Changelog

## 2026-06-01 — CAPITAL REBUILD: morph removed, three-section page, interactive ModeSwitcher

Third direction change (CORRECTIONS.md "CAPITAL REBUILD"). The user rejected the
flying morph block ("непонятно зачем тут летает этот блок", "бред какой-то"). The
page was rebuilt from a six-section + scroll-pinned-morph layout to a clean,
smart HEADER + 3 SECTIONS + FOOTER structure. Not a tweak.

Removed entirely:
- The whole morph system: deleted `src/components/morph/*` (MorphMount,
  MorphJourney, MorphForms, useMorphEnabled), the `.morph-handoff` CSS and the
  `:root[data-morph=on]` rules in globals.css, and every `.morph-handoff`
  wrapper. Grep across `src/` confirms ZERO `morph` / `data-morph` remnants (the
  only matches left are descriptive comments in page.tsx noting the removal).
- The Capture Fan hero device (`CaptureFan.tsx`) and its CSS loops
  (quirky-marquee / float / pulse keyframes + the pause-offscreen rule), plus the
  now-unused `PauseOffscreen` provider (no `[data-pauseable]` targets remain).
- Standalone sections folded out: `ModesShowcase`, `HowItWorks`, `TrustStrip`,
  `FinalCta`, `ModeRail`, `Features`, `Fits`, `Workflows`, `Faq` (deleted).

New page (page.tsx renders exactly): Nav, Hero (Section 1), Modes (Section 2),
Pricing (Section 3), Footer.
- SECTION 1 Hero: headline + tight subhead + dual download CTA (Direct all five
  modes / App Store OCR-HEX-SPX honest note) + the interactive ModeSwitcher.
- ModeSwitcher (new, promoted to ui-kit): one stylized capture scene (a browser
  with a dashed capture rectangle over a "Get started" button), five real
  `<button>` tabs (OCR/HEX/DOM/SVG/SPX) in a WAI-ARIA tablist with roving
  tabindex + Arrow/Home/End keyboard nav + aria-selected. Clicking a tab updates
  the output panel live from the SAME capture: OCR text + "Copied to clipboard",
  HEX #3D9DF2 swatch (sampled blue, NOT brand) + copied, DOM `button.cta` +
  inner text, SVG lifted glyph, SPX "184 x 48" with calipers. Default resolves
  the FIRST tab (OCR) so the panel is NEVER blank under ?motion=0 /
  reduced-motion; click switching still works with motion off (no cross-fade).
  Sits on a dark panel for contrast; the page stays mostly light.
- SECTION 2 Modes: informative. The 3-step strip (cmd+shift+1, drag a region,
  Tab to the mode) + five hairline-bordered rows, each with a real heading, one
  concrete sentence, a real example output, the audience/channel line, and a Pro
  badge on DOM/SVG. No chips, no captions under blobs.
- SECTION 3 Pricing: Free (OCR/HEX/SPX) vs Quirky Pro $16.99 one time (adds
  DOM/SVG, accent-highlighted), a download band with both buttons, the App-Store
  honesty + one time/refund footnotes, and a compact 4-item FAQ.
- Footer condensed to Product + Legal columns (anchors updated to #modes /
  #pricing / #download / #faq), kept the cookie-preferences re-open, author line.

Added `useMotionOff` hook (`src/components/motion/useMotionOff.ts`): reads the
`?motion=0` flag via a MutationObserver; used by the ModeSwitcher and the compact
FAQ so they short-circuit to static state under the QA flag.

Verification: tsc clean; `rm -rf .next out && npm run build` green twice; all
routes export (/ + /install + /privacy-policy + /terms + /refunds + /thanks +
/404), basePath /quirky-landing and favicon /quirky-landing/icon.svg intact. CDP
at 1440 and 390, motion=0 and motion ON: 3 sections in main + nav + footer, panel
non-blank (OCR resolved by default), 0 sub-16 body offenders, scrollWidth ==
clientWidth (no overflow), all five tabs switch + keyboard ArrowRight moves
selection. Screenshots: rebuild3-desktop-full.png, rebuild3-demo-{ocr,hex,dom,spx}.png,
rebuild3-mobile-{390,hero}.png. NOT deployed (devops after judge PASSED).

## 2026-06-01 — Fix redesign Issue #1: hyphen-as-dash compounds in visible prose

Judge V0.4 REDESIGN REVIEW: one blocking ISSUE. The no-dash rule (no hyphen used
as a dash/separator in visible prose) was violated by 5 compounds: "on-device"
and "click-through" (FAQ answers), "reverse-engineer" x2 (/terms intro + body),
and "mid-capture" (Features switcher body). Reworded all in copy.json without
hyphens: on-device -> "locally on your device", click-through -> "lets clicks
pass through it", reverse-engineer -> "take it apart to copy it" / "take Quirky
apart to copy it", mid-capture -> "while capturing". Verified: visible-text
hyphen-compound sweep across all 7 rendered routes returns ZERO; the only
remaining copy.json hyphens are href slugs (how-it-works, privacy-policy) and
metadata. JSON valid, clean build green. Clears the redesign's only blocker.

## 2026-06-01 — v0.4 REDESIGN: new accent, light/dark rhythm, fewer + bigger sections

Major visual overhaul per CORRECTIONS.md "REDESIGN REFINEMENT" (contrast, scale,
fewer sections, meaningful animation). Not a tweak.

- **New accent (replaces coral).** `tokens.css` accent 5-step swapped to the
  friendly warm red: `--color-accent #E63E2E / hover #CF3322 / pressed #B82C1D /
  soft #FCE6E2 / subtle #FEF3F0`. Swept ALL old coral hexes from src: `icon.svg`,
  `global-error.tsx`, the Inspector devtool chrome, and the `::selection` wash.
  Grep confirms zero `#FF7059` (and the old steps) remain in any rendered code.
  The HEX demo value stays grabbed-blue `#3D9DF2` (sampled data, not brand). One
  accent rule still holds.
- **Light/dark alternation.** New dark tokens: `--color-ink-surface #160C0A`
  (warm near-black), `--color-ink-raised #221513`, `--color-on-dark #FDFCFA`,
  plus `.dark-scope` + `.dot-grid-dark` in globals.css and an on-dark selection
  wash. Page rhythm is now light -> DARK -> light -> light -> light -> light -> DARK.
- **New DarkSection wrapper** (`src/components/section/DarkSection.tsx`), promoted
  to `ui-kit/components/section/DarkSection.tsx` + INDEX row + index.ts export.
- **ModesShowcase (new centerpiece, DARK).** Merges old ModeRail + Features into
  ONE oversize animated section. Giant red "5", five oversize panels each headed
  by its verb phrase (copy.json modeRail.modes[*].description) with a demo that
  ANIMATES what the mode does (OCR reads blurred text into a clean copied string;
  HEX locks in #3D9DF2; DOM pulls button.cta out of a highlighted element; SVG
  lifts the real star off the page; SPX extends calipers into 184 x 48). No
  chips, no captions. Closes with copy.json modes.proofLine at body scale.
- **TrustStrip (new).** Thin one-line band rendering copy.json fits.strip
  (offline, no account, notarized, App Store vs Direct honesty). Replaces the
  6-card Fits grid. App Store honesty stays visible.
- **FinalCta -> DARK.** Full-bleed near-black, oversize headline, ghost secondary
  on dark, honest App Store note, reused Capture Fan in the morph-handoff slot.
- **Hero / HowItWorks / Pricing scaled up** + spacing rhythm applied (tight
  heading->subhead read as one unit, generous air before the CTA). Hero headline
  clamp raised to 4.75rem; How-it-works step numbers now clamp(3rem,5vw,4.5rem);
  Pro price clamp(2.75rem,5vw,4rem).
- **Sections dropped from the page:** Workflows (proof line salvaged into Modes),
  Fits 6-card grid (demoted to TrustStrip), ModeRail chips + Features grid (merged
  into Modes). Their JSON stays in copy.json; the section files remain on disk,
  unimported.
- **Morph re-timed** over the new six-section rhythm. STAGE_ORDER trimmed to
  hero/modes/how/pricing/final (dropped features + workflows forms). Anchors
  retuned (modes flies far-right x=0.8 over the dark break). The bookend
  opacity-1-at-extremes fix is preserved.
- **Verification (CDP):** clean build x2 green, tsc clean, all 10 routes export
  incl /404. motion=0 @ 1440 and @ 390: overflow 0, 0 sub-16 body, both dark
  sections render full content, morph absent, both Capture Fans visible. motion
  ON @ 1440: morph present opacity 1, both handoff devices hidden (bookend
  takeover intact). Screenshots: redesign-desktop-motionoff.png,
  redesign-desktop-motionon.png, redesign-mobile-390.png, redesign-dark-modes.png,
  redesign-dark-finalcta.png.

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

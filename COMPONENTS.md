# Quirky — Components

## SOUL PASS (2026-06-01, 4th direction) — new + changed + promoted

| Component | Path | Purpose | Status |
|---|---|---|---|
| `Quirky` | `src/components/character/Quirky.tsx` | The mascot. Friendly blob creature (accent-soft body, ink hairline, paper eyes with cursor-tracking pupils, blink loop, smile + cheek blush on the happy reaction) plus a tiny optional bordered speech bubble. Props: `size`, `mood` (`idle`/`happy`/`peek`), `lookAt` (`"pointer"` \| fixed `{x,y}` \| `null`), `say`, `bubbleSide`, `decorative`, `label`. Reads reduced-motion + `?motion=0` (via `useReducedMotion` + `useMotionOff`) for a calm STATIC pose (no blink/track/bubble-anim). Disables pupil tracking on coarse (touch) pointers. | NEW (project-local: wires Quirky tokens + reactions + fixed-point look + speech bubble). |
| `Mascot` (kit) | `ui-kit/components/brand/Mascot.tsx` | The portable, token-driven, dependency-free shell of the character (blob + eyes + blink + cursor tracking + 3 moods, all colours as CSS vars, `still` prop for static). The project `Quirky` is the Quirky-specific wrapper around this shape; they are intentionally two files (standalone repo: kit is not symlinked here, same pattern as `Reveal` / `BlobObject` / FAQ). | NEW, PROMOTED to ui-kit + INDEX row + index.ts export, same session. |
| `ModeSwitcher` | `src/components/sections/ModeSwitcher.tsx` | REWRITTEN to be ALIVE: cursor glides in + capture rect draws itself on reveal, then tabs AUTO-CYCLE on a ~2.6s pneumatic timer with a progress underline. Pauses on click/keyboard/hover, resumes after ~7s idle. New `onGrab(index, viaInteraction)` + `onActiveChange(index)` callbacks so the parent drives the character reaction. WAI-ARIA tablist + roving tabindex + Arrow/Home/End kept. Static (reduced-motion / `?motion=0`): no autoplay, no cursor, resolved OCR state, clickable, never blank. | CHANGED (living-demo rewrite; output bodies + a11y unchanged). |
| `Hero` | `src/components/sections/Hero.tsx` | Louder typography (clamp to 5.5rem), bigger subhead, soft drifting accent-soft blob backdrop (`HeroBlobs`, motion-off static, pointer-events-none, clipped), asymmetric grid. Mounts `Quirky` on the demo card corner and wires `handleGrab` so the character pops happy + shows `reactionGrab` on each demo grab, settling to `greeting`. | CHANGED. |
| `Modes` | `src/components/sections/Modes.tsx` | Added an oversize decorative parallaxing "5" behind the header (`useScroll`/`useTransform`, static when motion off), a `hidden sm:block` peeking `Quirky` (`mood="peek"`, `reactionPeek`), a row hover wash, larger mode headings, and the `proofLine` rendered. | CHANGED. |
| `Pricing` | `src/components/sections/Pricing.tsx` | Added a `hidden sm:block` happy `Quirky` perched on the highlighted Pro card. Tiers/FAQ/download band unchanged. | CHANGED. |

## CAPITAL REBUILD (2026-06-01, third round) — new + changed + removed

| Component | Path | Purpose | Status |
|---|---|---|---|
| `ModeSwitcher` | `src/components/sections/ModeSwitcher.tsx` | The interactive centerpiece. A static capture scene (browser window + dashed accent capture rect over a "Get started" button) above a WAI-ARIA tablist of five real `<button>` tabs (OCR/HEX/DOM/SVG/SPX). Clicking a tab cross-fades the `role="tabpanel"` output to that mode's real result from the same capture: OCR text + "Copied to clipboard", HEX #3D9DF2 swatch + copied, DOM `button.cta` selector + inner text, SVG lifted glyph, SPX "184 x 48" with calipers. Roving tabindex + Arrow/Home/End keyboard nav + aria-selected. Default resolves the FIRST tab (OCR) so the panel is never blank under motion-off; reads reduced-motion + ?motion=0 (via `useMotionOff`) and swaps instantly. Dark `ink-surface` panel for contrast. | NEW, PROMOTED to `ui-kit/components/section/ModeSwitcher.tsx` (generic scene+tabs+outputs via props, token-driven, `tone` prop) + INDEX row + index.ts export, same session. |
| `Modes` | `src/components/sections/Modes.tsx` | Section 2, informative. 3-step strip (cmd+shift+1 / drag a region / Tab to the mode) + five hairline rows, each with a real heading (+ Pro badge on DOM/SVG), one concrete sentence, audience/channel line, and a real example output (`Example` renders text/selector/color/svg/measure shapes). No chips, no captions under blobs. | NEW (project-local; encodes Quirky's five modes + channel split). Replaces the dropped ModesShowcase. |
| `useMotionOff` | `src/components/motion/useMotionOff.ts` | Hook reading the `?motion=0` flag (`<html data-motion=off>`) via MutationObserver. Used by ModeSwitcher + the compact FAQ for static fallback. | NEW (project-local). |
| `Pricing` | `src/components/sections/Pricing.tsx` | Section 3. Two tiers + a download band (both buttons + App-Store note) + comparison + footnotes + a compact 4-item FAQ (`CompactFaq`, the #faq anchor now lives here). | CHANGED (absorbed the FAQ + download into one section). |
| `Hero` | `src/components/sections/Hero.tsx` | Section 1. Now renders the ModeSwitcher instead of the CaptureFan; the morph-handoff wrapper is gone; primary CTA note expanded to list all five modes inline. | CHANGED. |
| `Footer` | `src/components/sections/Footer.tsx` | Condensed to a 3-col grid (brand + Product + Legal); kept cookie re-open + author line. | CHANGED (was 4-col). |
| morph system + dead sections | `src/components/morph/*`, `CaptureFan`, `ModesShowcase`, `HowItWorks`, `TrustStrip`, `FinalCta`, `ModeRail`, `Features`, `Fits`, `Workflows`, `Faq`, `PauseOffscreen` | The flying morph + the six-section rhythm + their support files. | DELETED. globals.css morph CSS + hero-loop keyframes + pause rule also removed. Grep confirms zero morph/data-morph remnants. |

## v0.4 redesign (2026-06-01) — new + changed + promoted

| Component | Path | Purpose | Status |
|---|---|---|---|
| `DarkSection` | `src/components/section/DarkSection.tsx` | Full-bleed near-black break section: warm ink surface, `.dark-scope` on-dark text, `.dot-grid-dark`, white/10 hairlines. Token contract: `--color-ink-surface` / `--color-on-dark` / `--color-accent`. | NEW, PROMOTED to `ui-kit/components/section/DarkSection.tsx` (+ INDEX row + index.ts export) same session. |
| `ModesShowcase` | `src/components/sections/ModesShowcase.tsx` | The dark oversize centerpiece. Merges old ModeRail + Features. Giant red "5" + five oversize panels (verb-phrase heading + an in-view animated demo PER mode: OCR text-resolve, HEX swatch lock, DOM selector pull, SVG lift, SPX caliper measure) + modes.proofLine. No chips, no captions. Each demo renders its resolved final frame under motion-off. | NEW (project-specific, stays local: encodes Quirky's five modes). |
| `TrustStrip` | `src/components/sections/TrustStrip.tsx` | Thin one-line trust band from copy.json.fits.strip; facts separated by a rendered accent dot (not a typographic bullet). Replaces the 6-card Fits grid. | NEW (project-local). |
| `FinalCta` | `src/components/sections/FinalCta.tsx` | Rebuilt as a DARK full-bleed bookend (was light dot-grid). Oversize headline, ghost secondary on dark, honest App Store note, reused Capture Fan in the morph-handoff slot. | CHANGED. |
| `Hero` / `HowItWorks` / `Pricing` | `src/components/sections/*` | Scaled up + spacing rhythm (tight heading->subhead, generous air before CTA). Bigger headline / step numbers / price. | CHANGED. |
| `tokens.css` | `src/app/tokens.css` | Accent 5-step -> warm red #E63E2E family. Added `--color-ink-surface/-raised`, `--color-on-dark`, `--text-display-2xl`. | CHANGED. |
| `Workflows` / `Fits` / `ModeRail` / `Features` | `src/components/sections/*` | No longer imported by page.tsx (Workflows/Fits dropped, ModeRail+Features merged into ModesShowcase). Files retained on disk, copy retained in JSON. | RETIRED from page. |

## Kit reuse vs local

Quirky is a STANDALONE repo (`halinskiy/quirky-landing`), not inside
`Aisoldier/projects/`, so it cannot symlink `@aisoldier/ui-kit`. Kit components
Quirky needs are VENDORED (copied) into `src/components/`. This is the
documented exception to the "import from kit" rule for standalone repos. Net-new
reusable work built here is flagged for promotion back to the kit (see below).

## Built (Phase 1)
| Component | Path | Purpose | data-source |
|---|---|---|---|
| `Nav` | `src/components/sections/Nav.tsx` | Sticky nav, blur backdrop, blob mark + wordmark, coral pill CTA, flat link row. | sections/Nav.tsx |
| `Hero` | `src/components/sections/Hero.tsx` | Section 1: eyebrow + big headline + subhead + dual download CTAs (honest App-Store note) + CaptureFan. Framer rise entries. | sections/Hero.tsx |
| `CaptureFan` | `src/components/sections/CaptureFan.tsx` | Bespoke hero device: region rect + dashed coral marquee + 5 fanned data-chips (staggered Framer + CSS float) + pulsing Tab keycap. Inline SVG, <15KB. | sections/CaptureFan.tsx |
| `BlobObject` | `src/components/blobs/BlobObject.tsx` | The single decorative language: 8 soft monochrome blob glyphs (ocr/hex/dom/svg/spx + capture/tab/check). Coral-soft fill + ink 2px stroke. Accepts `x`/`y` so it nests inside another `<svg>` (the hero chips). | ui-kit/components/blobs/BlobObject.tsx (vendored) |
| `Button` | `src/components/ui/Button.tsx` | Pill CTA. primary = coral fill + paper text; secondary = paper + ink + gray-200 border. Renders as `<a>`. | ui-kit/components/ui/Button.tsx (vendored) |
| `EyebrowLabel` | `src/components/ui/EyebrowLabel.tsx` | 12px uppercase eyebrow, `w-fit self-start` (anti-stretch, RETRO lesson), accent-soft pill + accent-pressed text. | ui-kit/components/section/EyebrowLabel.tsx (vendored) |
| `MotionProvider` | `src/components/providers/MotionProvider.tsx` | Wires Lenis; disables Lenis + sets `html[data-motion=off]` under reduced-motion / ?motion=0. | providers/MotionProvider.tsx |
| `Inspector` | `src/components/devtools/Inspector.tsx` | Dev-only Cmd+click overlay reading data-component/source/tokens. | devtools/Inspector.tsx |
| Section stubs | `sections/{ModeRail,HowItWorks,Features,Workflows,Fits,Pricing,Faq,FinalCta,Footer}.tsx` | Phase-1 labelled placeholders, correct id anchors, correct order in page.tsx. Replaced in Phase 2. | each own file |

## Built (Phase 2)
| Component | Path | Purpose |
|---|---|---|
| `Section` + `SectionHeader` | `src/components/section/Section.tsx` | Shared marketing-section shell (max-width, rhythm, hairline border, Inspector attrs, paper/surface tones) + eyebrow/headline/intro header. |
| `Reveal` | `src/components/motion/Reveal.tsx` | The one section-enter motion (blur+y, EASE_OUT, no bounce). Renders final state instantly under reduced-motion AND `html[data-motion=off]` (so `?motion=0` shows content, not the 0-opacity frame). Project-local analogue of kit `BlurReveal`. |
| `Keycap` | `src/components/ui/Keycap.tsx` | Literal keystroke chip (cmd+shift+1, Tab). Mono font (sanctioned for code-like glyphs), hairline border, button radius. |
| `ModeRail` | `src/components/sections/ModeRail.tsx` | 5 mode blob-chips + Tab switcher cell. |
| `HowItWorks` | `src/components/sections/HowItWorks.tsx` | 3 steps, keycaps via Keycap. |
| `Features` | `src/components/sections/Features.tsx` | 5+1 hairline grid, one BlobObject per cell. |
| `Workflows` | `src/components/sections/Workflows.tsx` | 3 audience micro-stories. |
| `Fits` | `src/components/sections/Fits.tsx` | Trust row + Direct/App-Store honesty. |
| `Pricing` | `src/components/sections/Pricing.tsx` | 2 tiers, Pro highlighted, one-time, footnotes. |
| `Faq` | `src/components/sections/Faq.tsx` | Project-local accordion (kit FAQAccordion uses `--color-border`/`--color-text` which Quirky's token set lacks; rebuilt against gray-200/ink). |
| `FinalCta` | `src/components/sections/FinalCta.tsx` | Dual-download bookend + reused CaptureFan + keycap headline. |
| `Footer` | `src/components/sections/Footer.tsx` | 4-col + inline newsletter + cookie re-open + author line. |
| `ConsentProvider` | `src/components/consent/ConsentProvider.tsx` | GDPR strict opt-in state + localStorage + reopen(). |
| `CookieConsent` | `src/components/consent/CookieConsent.tsx` | Presentational consent card, project-local adaptation of the kit's (restyled to Quirky tokens; same host-owns-storage contract). |
| `PageShell` + `LegalSections` | `src/components/standalone/PageShell.tsx` | Single shell family for all standalone pages (privacy/terms/refunds/thanks/install/404). NOT a clone of Corder's legal class names. |

## Built (Signature morph — 2026-06-01)
The headline interactive piece: ONE Quirky block that flies the whole page
(scroll-linked) and morphs into each section's UI. Desktop/tablet enhancement
only; motion-off / reduced-motion / mobile fall back to the static sections.

| Component | Path | Purpose |
|---|---|---|
| `useMorphEnabled` | `src/components/morph/useMorphEnabled.ts` | The gate. Returns true only on viewport >= 768px AND not reduced-motion AND not `html[data-motion=off]`. Re-evaluates on resize / media change / `data-motion` mutation. Mirrors the promoted kit hook `useEnhancementEnabled` (vendored, standalone repo). |
| `MorphMount` | `src/components/morph/MorphMount.tsx` | Gate + code-split boundary. Renders nothing when disabled; `next/dynamic(ssr:false)` lazy-loads the controller so it never runs on the server and is split out of initial JS. Sets `html[data-morph=on]` while live so the static hero/final CaptureFan (`.morph-handoff`) hides under the flying block. |
| `MorphJourney` | `src/components/morph/MorphJourney.tsx` | The controller. Whole-page `useScroll()` -> a 0..1 journey (lead-in 0.04 / lead-out 0.92). Interpolates one fixed block's x/y/scale between 7 stage anchors (kept in a right-side lane so it never lands on the left-aligned copy) and cross-fades the active stage form. `pointer-events-none`, `position: fixed` (CLS 0). One easing, no bounce. |
| `MorphForms` | `src/components/morph/MorphForms.tsx` | The 7 shapes (decorative, aria-hidden) in the SAME blob/chip/coral vocabulary: HeroForm (capture fan) -> ModesForm (one chip cycling OCR/HEX/DOM/SVG/SPX) -> HowForm (steps window, keycaps) -> FeaturesForm (5+1 grid settling) -> WorkflowsForm (deck-of-cards) -> PricingForm (Pro card + coral CTA, the "turns into buttons" payoff) -> FinalForm (capture mark + dual download). Copy fragments come from copy.json; the readable copy lives in the static sections underneath. |

Notes:
- The forms are an ENHANCEMENT layer, never the source of content. The static
  sections render unconditionally; `?motion=0` shows them with NO overlay (CDP
  verified: overlay absent, no blank sections, no sub-16px, scrollWidth==clientWidth).
- `.morph-handoff` (globals.css) is a plain inner wrapper on the hero + final
  CaptureFan (NOT the framer motion.div, whose inline opacity framer owns), so
  the `:root[data-morph=on]` opacity rule actually wins.

## Promotion back to ui-kit
- **`BlobObject` shell promoted** to `ui-kit/components/illustration/BlobObject.tsx`
  (2026-05-31). The kit version is the reusable SHELL (soft blob silhouette +
  tinted fill + ink stroke, `BLOB_PATH`, children glyph slot). The project's
  `BlobObject` keeps the brand/product-specific mode GLYPHS local. Registered in
  `ui-kit/INDEX.md` under a new "Illustration" section.
- `CaptureFan`: NOT promoted — fully bespoke to Quirky's product thesis (like
  Corder's HeroLibraryDemo). Stays project-local.
- `Nav` / `Button` / `EyebrowLabel`: close to kit `NavSticky` / `Button` /
  `EyebrowLabel`; vendored copies for the standalone repo. Reconcile if the kit
  is ever published to npm.
- **`useEnhancementEnabled` promoted** to `ui-kit/components/motion/useEnhancementEnabled.ts`
  (2026-06-01). Generalized from this project's `useMorphEnabled` (added a
  `minWidth` option, token/consumer-agnostic). Registered in `ui-kit/INDEX.md`
  under Motion primitives and exported from `ui-kit/index.ts`. The project keeps
  its local `useMorphEnabled` copy (standalone repo cannot import the kit).
- `MorphJourney` / `MorphForms`: NOT promoted — the controller's anchor map and
  the seven forms are bespoke to Quirky's sections and product thesis (same call
  as CaptureFan). The reusable distillation is the GATE hook above plus the
  documented pattern (fixed overlay + whole-page useScroll + stage cross-fade +
  motion-off short-circuit).

## Inspector attributes
Every component carries `data-component`, `data-source`, `data-tokens`. The
overlay (`Inspector`) is mounted dev-only in `app/layout.tsx`.

## Phase 2 plan
Replace each stub with a real section built from copy.json, using BlobObject as
the shared decorative language. Candidates to vendor from the kit when those
sections land: FAQAccordion (Section 9), FooterEditorial (Section 11),
SectionHeader (multiple), CookieConsent (consent).

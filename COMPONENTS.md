# Quirky — Components

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

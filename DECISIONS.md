# Quirky — Decisions log

## 2026-06-01 — v0.4 redesign (3mpq-soldier)

- **Two dark breaks, not three.** Brief recommended Modes + FinalCTA, optionally
  How it works and/or Pricing. Chose ONLY Modes (the centerpiece) + FinalCTA (the
  closer) dark. Rationale: cleanest light -> dark -> light bookend rhythm with the
  dark exactly at the highest-energy moment (the modes payoff) and the conversion
  moment (the final CTA), without the page feeling like a stripe pattern. How it
  works and Pricing stay light so the big red numbers / big price read as accents
  on paper, not a third dark band. Rejected: dark Pricing (would split the two
  light sections between the two darks and muddy the rhythm).

- **Modes communicate by animated demo, not chips/captions.** Each of the five
  modes is an oversize panel: a verb-phrase heading + a demo that shows the mode
  DOING its job. No chip UI, no caption-scale label under anything, per the
  brief's explicit "NO chips, NO captions". Rejected: the old ModeRail tab-row of
  chips and the old Features per-cell caption text.

- **DarkSection promoted to the kit with a token contract, not baked colours.**
  The kit stays monochrome/theme-agnostic; the project supplies
  `--color-ink-surface` / `--color-on-dark` / `--color-accent` and the
  `.dark-scope` + `.dot-grid-dark` classes. quirky-landing is the reference impl.
  Rejected: hardcoding #160C0A into the kit (would couple the kit to one project).

- **TrustStrip splits on the sentence period, joins with a rendered accent dot.**
  The no-dash / no-bullet copy rule bans typographic separators in text, so the
  facts are split on "." (kept) and the gap between them is a 6px accent <span>
  element, not a bullet glyph.

- **Morph retimed to 5 stages over 6 sections.** Dropped the features-grid and
  workflow-deck forms with their sections; STAGE_ORDER is now
  hero/modes/how/pricing/final. The Modes anchor flies far-right (x=0.8) so the
  light morph chip floats cleanly over the dark break. The bookend
  opacity-1-at-extremes fix (hero at j=0, final at j=1) is preserved unchanged.

## 2026-05-31 — Phase 1 scaffold (3mpq-soldier)

- **Standalone repo, vendored kit.** Quirky lives at `~/quirky-landing`, not in
  `Aisoldier/projects/`, so the symlinked `@aisoldier/ui-kit` is unavailable.
  Decision: vendor the kit components into `src/components/`, document the
  exception in COMPONENTS.md, and flag net-new reusable work for promotion.
  Rejected: publishing the kit to npm just for this repo (overkill for Phase 1).

- **Token naming = paper / ink / gray-* / accent-*.** Defined in `tokens.css`
  inside `@theme` so Tailwind v4 generates `bg-accent`, `text-ink`,
  `border-gray-200`, etc. Chosen over the Corder `bg/text/border/surface`
  naming because the component set reads more legibly with semantic
  paper/ink and a gray ramp. Documented in DESIGN_SYSTEM.md.

- **Lenis kept (vs Corder dropping it).** Global doctrine says "Lenis is always
  wired", and the build brief mandates it. Wired in `MotionProvider` with a
  gentle damped config (cubic ease-out, no overshoot), disabled entirely under
  prefers-reduced-motion / `?motion=0`. Re-evaluate if a lag report appears.

- **Manrope font.** product-truth.md locks Manrope as the base font (a
  sanctioned deviation from the IBM Plex doctrine default). Loaded via next/font.

- **Rounder radii.** Window 20px (Corder 12), button 14px (Corder 8), card 16px.
  Justified by the "toy / blobby / friendly" override. CTAs use full pills.

- **Coral discipline.** Accent never used as body text on white (fails AA at
  ~2.4:1). `--color-accent-pressed` (#DB4733) is the text-safe coral step. The
  hero HEX chip uses `--color-captured-blue` (#3D9DF2), a grabbed colour, NOT
  the brand coral, so it reads as "a colour you took".

- **Hero device = Capture Fan, bespoke SVG.** Not a framed screenshot
  (forbidden), not Corder's recording window. A region rect + dashed coral
  marquee fanning 5 data-chips. Inline SVG + CSS, on the perf budget. The HEX
  chip carries a real colour swatch; the other four carry blob glyphs.

- **Decorative language = BlobObject (blobs), chosen over outline-icons and 3D.**
  Most on-brief ("blobby"), cheap (SVG), owned (not emoji). 8 glyphs: one per
  mode + capture/tab/check. Single coral-soft fill + ink 2px stroke. The shell
  is promoted to the kit; glyphs stay local.

- **Inspector mounted (vs Corder removing it).** Quirky keeps the dev-only
  Cmd+click overlay per the build brief and global doctrine section 6.

- **Static export to GitHub Pages.** Mirrors Corder's `output: "export"` +
  trailingSlash + unoptimized images + the deploy.yml workflow. No basePath.

### Reconciliation note (2026-05-31)
Two scaffolds were produced concurrently during Phase 1 (a partial set under
`nav/`, `hero/`, `motion/`, `blobs/QuirkyBlob` + `sections/Stubs`, and a
complete set under `sections/*` + `ui/*` + `blobs/BlobObject`). The complete
`sections/*` set was already wired into `page.tsx`, so it was adopted as
canonical; the partial duplicates were deleted and the tokens/globals/layout
aligned to the canonical naming. One build error (`m` import from framer-motion
without LazyMotion) in `CaptureFan` was fixed to `motion`.

## 2026-05-31 — Phase 2 build (3mpq-soldier)

- **Project-local `Reveal` honours `html[data-motion=off]`, not just
  `useReducedMotion()`.** First screenshot pass came back blank: framer's
  `whileInView` content stays at opacity 0 when captured beyond the viewport in
  headless Chrome, and `?motion=0` did not short-circuit it because headless
  Chrome does not report `prefers-reduced-motion`. Fix: `Reveal` also reads the
  `data-motion="off"` flag (set by the pre-hydration bootstrap + LenisProvider)
  and renders final state. This is the template-design RETRO "motion=0 must show
  final state" lesson applied to the in-view pattern. SSR HTML already contained
  the real copy with zero inline opacity:0, so it was a client-hydration-only
  display issue, but the fix also makes QA screenshots reliable.

- **FAQ + CookieConsent rebuilt project-local instead of vendoring the kit
  files.** The kit `FAQAccordion` and `CookieConsent` are token-bound to
  `--color-border` / `--color-text` / `--color-surface`, which Quirky's token
  set does not define (Quirky uses paper/ink/gray-*). Rather than alias a second
  token layer, both were rebuilt against Quirky tokens, keeping the kit
  contracts (multi-toggle accordion, host-owns-storage consent). Documented as
  the standalone-repo exception (see COMPONENTS.md).

- **Standalone shell = one `PageShell` family, deliberately NOT Corder's
  class names** (memory: Corder legal pages use `.legal-page`/`.legal-body`).
  Quirky's shell is its own soft, on-brand component: warm paper, left-aligned,
  a quiet Quirky mark linking home as the "back" affordance, `prose` tone for
  legal and `centered` tone for thanks/install/404.

- **Nav anchors = copy.json hrefs** (#how-it-works / #features / #pricing /
  #faq), with #modes (ModeRail) and #download (FinalCTA) added. Phase-1 Nav used
  #how / #modes; reconciled to copy.json as the source of truth so links resolve.

- **DMG size left as a marked TODO** (not invented). /install says "File size:
  to be confirmed"; hero note omits it. pricing-brief's 4.2 MB was a placeholder.

- **Newsletter is a non-wired placeholder form** (preventDefault). Devops/Webflow
  connects it to a provider (contact-worker pattern or Webflow forms). Flagged in
  HANDOFF.

### Rejected
- Native `scroll-behavior: smooth` only (Corder's approach): doctrine requires
  Lenis. Kept native `scroll-padding-top: 88px` for the anchor offset.
- IBM Plex Sans: overridden by the locked Manrope decision.
- Showing only the Direct download: both buttons shown, App Store honesty note.

## 2026-06-01 — Signature morph (one block flies + morphs across the whole page)

- **Webflow dropped as a target for the morph.** Per the user, the through-flying
  scroll-pinned morphing block is built for the React/Next build only and is NOT
  constrained to IX2-replicable motion. The static sections remain the content
  backbone; the morph is a custom React enhancement on top. HANDOFF flags this.

- **Approach = single fixed-overlay block driven by whole-page scroll, NOT
  per-section pinning.** A `position: fixed`, `pointer-events-none` block tracks
  `useScroll()` (whole document) and interpolates ONE element's x/y/scale between
  7 stage anchors, cross-fading the active stage form at each boundary.
  - Why not per-section `sticky`/pinned stages: pinning traps touch scroll, risks
    CLS from reserved tall stages, and reads as 7 separate reveals. A single fixed
    block whose position interpolates continuously reads as ONE object flying.
  - Why cross-fade between forms (not a true single-DOM morph): morphing one
    element through 7 distinct UIs is too costly/brittle; because POSITION is
    shared and continuous, a cross-fade at the boundary still reads as one block
    changing shape.
  - Why whole-page `useScroll()` not a `target` ref into page.tsx's `<main>`: the
    ref-into-another-component pattern can read an empty target on mount; the
    whole-page progress + a 0.04/0.92 lead-in/out band is robust and needs no DOM
    measurement.

- **Block stays in a right-side lane for the full-width content sections.** Early
  centered anchors put the forms on top of the left-aligned headlines (ghosting
  over "Three steps. Under two seconds."). Moved anchors to x ~0.5..0.78 of half
  the viewport (right column / right gutter) so the block never lands on copy. The
  hero and final CTA (which have a genuine right-column device slot) are where it
  is largest; content sections show it smaller as it "passes through".

- **Motion-off / reduced-motion / mobile = overlay not rendered at all.** Gated by
  `useMorphEnabled` (>=768px AND !reduced AND !data-motion=off). This is the
  load-bearing Reveal lesson: the morph never becomes the only way content
  renders. Static sections render unconditionally underneath. CDP-verified on
  both the dev server and the static `out/` export.

- **Static hero/final Capture Fan hides under the live block via `.morph-handoff`
  on a PLAIN inner wrapper**, not the framer `motion.div` (whose inline opacity
  framer owns and which would beat the stylesheet rule). `:root[data-morph=on]`
  fades those two devices so the page shows one block, not a duplicate.

- **Code-split + lazy.** `MorphMount` uses `next/dynamic(ssr:false)` so the
  controller is split out of the initial bundle and never runs on the server
  (home First Load JS moved 55.6kB -> 58.1kB; the controller lands in a lazy
  chunk). User prioritized wow over the strict JS cap, but initial paint stays
  fast and the motion-off path is zero-cost.

- **`useEnhancementEnabled` promoted to the kit.** The gate hook generalized
  (minWidth option) and registered in ui-kit; the controller + forms stay
  project-local (bespoke to Quirky's sections, like CaptureFan).

### Rejected (morph)
- GSAP / ScrollMagic / Rive / Babel-standalone: banned by doctrine + the project
  constraints. framer-motion `useScroll`/`useTransform` only.
- Spring physics on the travel: would bounce. Used a cubic ease-out on the
  position interpolation to match the pneumatic easing; nothing overshoots.
- Making the morph the renderer of section copy: rejected. Forms are decorative
  (aria-hidden); the static sections own all readable text.

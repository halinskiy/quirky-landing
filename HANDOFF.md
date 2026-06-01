# quirky-landing — Handoff (Webflow rebuild)

## SOUL PASS (2026-06-01) — character + living demo + scroll delight

Structure unchanged (HEADER + 3 sections + FOOTER). What the Webflow dev needs to
know about the new life:

- **Quirky character (`[data-component="Quirky"]`).** Three instances: hero demo
  corner, Modes top-right edge (peek), Pricing Pro card. It is an inline SVG with
  JS-driven eyes (cursor tracking) + a CSS blink. In Webflow IX2 this is hard to
  replicate 1:1. Recommended Webflow approach: a static friendly SVG pose for the
  three placements, then OPTIONAL light IX2 (blink = a 2-state interaction on a
  loop; a mouse-move interaction that nudges the pupils). The cursor tracking and
  the on-grab "happy + Got it." reaction are the parts IX2 cannot do cleanly. If
  the studio wants the full living character in Webflow, flag as a **custom code
  embed** (port `Quirky.tsx`); otherwise ship the static pose. It is decorative
  and the page reads fully without it (proven by the `?motion=0` static state).
- **Living ModeSwitcher autoplay.** The auto-cycle (OCR -> HEX -> DOM -> SVG ->
  SPX) + progress underline + pause-on-interaction is a small state machine.
  Webflow native: build the tablist with IX2 tab states; the AUTOPLAY loop needs
  a custom code embed (a `setInterval` advancing the active tab, cleared on
  click/focus). The static resolved OCR state must be the default so it is never
  blank if the embed is disabled.
- **Scroll delight.** The giant "5" parallax in Modes = an IX2 scroll interaction
  (move on scroll, small range, ease out, no bounce). The hero blob drift = a
  slow looped IX2 move (or just leave static; it is pure atmosphere). The Reveal
  blur-up on sections = the existing IX2 scroll-into-view pattern. All of it must
  degrade to the static final layout (the page never depends on scroll for
  content; CLS 0).
- **Easing everywhere stays `cubic-bezier(0.16, 1, 0.3, 1)`. Nothing bounces.**

The Webflow developer rebuilds this in Webflow IX2. This file tracks section
order, native-vs-custom flags, and animation notes. Use the dev-only Inspector
(Cmd+click any element) to map a visual element back to its source file + tokens.

## Stack
- Next.js 15 App Router, static export (trailingSlash). Tailwind v4 tokens.
  Framer Motion + Lenis. Single accent = friendly warm red `#E63E2E` (was coral
  `#FF7059`, fully replaced 2026-06-01). Warm paper bg `#FDFCFA`. Dark break
  surface = warm near-black `#160C0A` with paper-white text `#FDFCFA`. Manrope
  (the only font; mono only inside keycaps / code-like values).

## Section order (home, top to bottom) — CAPITAL REBUILD (2026-06-01, third round)
The morph and the six-section rhythm are GONE. The page is HEADER + 3 SECTIONS +
FOOTER. All light except the ModeSwitcher's dark demo panel inside the hero.
1. Nav — sticky, transparent to paper/85 + blur at scrollY > 8. Logo + Modes /
   Pricing / FAQ anchors + Download free pill. Mobile: a disclosure panel under
   the bar (not a fixed overlay). LIGHT.
2. Hero (#top) — Section 1. Left: eyebrow + big headline + tight subhead + dual
   download CTA with honest notes (Direct = all five modes / App Store = OCR,
   HEX, SPX). Right: the interactive ModeSwitcher on a dark panel. LIGHT page,
   dot-grid, dark demo panel inside.
3. Modes (#modes) — Section 2, informative. A 3-step strip (cmd+shift+1, drag a
   region, Tab to the mode) + five hairline-bordered rows. Each row: mode name
   (+ Pro badge on DOM/SVG), one concrete sentence, audience/channel line, and a
   real example output (OCR text / HEX swatch / DOM selector / SVG glyph / SPX
   calipers). NO chips, NO captions under blobs. LIGHT.
4. Pricing (#pricing) — Section 3. Two tiers (Free OCR/HEX/SPX vs Quirky Pro
   $16.99 one time, Pro accent-highlighted), a download band with both buttons,
   App-Store honesty + one time/refund footnotes, then a compact 4-item FAQ
   (#faq anchor lives here). LIGHT.
5. Footer — LIGHT. Brand + slogan + social, Product + Legal link columns, small
   inline newsletter, cookie-preferences re-open, author line, copyright.

Nav anchors (source of truth = copy.json.nav): #modes, #pricing, #faq. Plus
#download (the download band in Section 3) and #top (hero). scroll-mt-24 on the
anchored elements offsets the fixed nav; Lenis applies an 88px scrollTo offset.

## ModeSwitcher (the one clever interaction — Webflow rebuild notes)
- The hero demo is a WAI-ARIA tablist: a static capture scene (a browser window
  with a dashed accent capture rectangle over a "Get started" button) above five
  real `<button>` tabs (OCR/HEX/DOM/SVG/SPX). Clicking a tab cross-fades the
  output panel to that mode's real result from the SAME capture. It sits on a
  dark `--color-ink-surface #160C0A` panel (`.dark-scope` + `.dot-grid-dark`) for
  contrast; the rest of the page is light.
- Promoted to the kit as `ModeSwitcher` (generic scene + tabs + outputs via
  props; token-driven chrome, `tone="dark"` for the dark panel). Webflow IX2: a
  tabs widget where each tab swaps a content pane with a fade; the active tab uses
  the accent fill, inactive tabs use white/5 + white/15 border on dark. Keep the
  panel min-height fixed (CLS-neutral) and resolve the FIRST tab on load so the
  pane is never empty.
- Default tab = OCR resolves on first render, so under reduced-motion / ?motion=0
  / before JS the panel shows a real output, never blank. Click switching works
  with motion off (no cross-fade). This is the load-bearing accessibility rule.

## Animation notes (one easing everywhere: cubic-bezier(0.16,1,0.3,1), NO bounce)
- Section enter: `Reveal` = opacity 0->1, y 16->0, blur 8->0, 0.5s, whileInView
  once, optional per-item stagger (index * 0.06s). Webflow IX2: scroll-into-view
  + move/fade/blur, same easing, stagger children.
- ModeSwitcher output: cross-fade opacity/y/blur, 0.32s, same easing, on tab
  click. Tab background/border transition 150ms. Webflow IX2: tab-content fade.
- Compact FAQ: height + opacity expand/collapse, 0.3s, same easing. +/- glyph
  rotates 45deg.
- Nav background/blur transition 150ms.
- Reduced motion + `?motion=0`: the ModeSwitcher resolves the OCR tab statically
  (never blank) and swaps panels instantly on click; Reveal renders final state
  instantly (no blank/0 flash); the compact FAQ toggles instantly.

## Morph — REMOVED (2026-06-01, capital rebuild)
The scroll-pinned morphing block was deleted at the user's request (confusing,
not informative). No `morph` / `data-morph` anything remains in the codebase. The
old "signature morph" handoff note no longer applies. Everything above is
straightforwardly IX2-replicable.

What it is: ONE fixed-overlay Quirky block that tracks whole-page scroll and
morphs through 5 forms (re-timed for the v0.4 six-section page) as it flies the
right-side lane: hero Capture Fan -> single mode chip cycling OCR/HEX/DOM/SVG/SPX
(far-right over the dark Modes break) -> how-it-works steps window (keycaps) ->
Pro pricing card with its accent CTA (the "turns into buttons" beat) -> final
dual-download form. (The old features-grid and workflow-deck forms were retired
with their sections.)
Files: `src/components/morph/{MorphMount,MorphJourney,MorphForms,useMorphEnabled}`.

Hard guarantees (judge + CDP verified):
- Enhancement only. Mounts ONLY on desktop/tablet (>=768px), motion on, no
  reduced-motion. On `?motion=0` / reduced-motion / mobile it renders NOTHING and
  the static sections are the entire page (no overlay, no blank sections, no
  sub-16px text, scrollWidth==clientWidth at 390). CLS = 0 (fixed overlay,
  reserves no layout space). `pointer-events-none` (never blocks clicks/scroll).
- While live it sets `html[data-morph=on]`; the static hero + final Capture Fan
  carry `.morph-handoff` and fade out so the page shows ONE block, not a double.
- One easing (cubic-bezier(0.16,1,0.3,1)), no bounce. The forms are decorative
  (aria-hidden); all readable copy stays in the static sections.

## Custom (NOT native Webflow IX2 — needs custom embed or careful rebuild)
- Capture Fan SVG device + chip stagger (Hero + FinalCTA): custom inline SVG.
- BlobObject SVG set (the one decorative language): custom SVG assets, one per
  mode (ocr/hex/dom/svg/spx) + utility (capture/tab/check).
- Lenis smooth scroll: custom embed.
- Cookie consent (strict opt-in) + localStorage + footer re-open trigger: custom
  code (Webflow's native cookie banner can substitute, but it must be strict
  opt-in and re-openable from the footer button).
- Newsletter form: currently a non-wired placeholder (prevents default submit).
  Connect to a provider (e.g. the contact-worker pattern, or Webflow forms).

## App-Store honesty (must survive the rebuild — present at EVERY download CTA)
- Hero: primary note = all five modes (Direct); secondary note = OCR/HEX/SPX
  only on App Store.
- TrustStrip: the single line states the Direct-vs-App-Store split explicitly
  ("App Store ships OCR, HEX, SPX. The direct download adds DOM and SVG.").
- Pricing: Pro note (Direct only, sandbox blocks Apple Events) + footnote 1.
- FinalCTA: primary + secondary notes repeat the split.
- Footer Download column: "Direct download (all 5 modes)" / "Mac App Store
  (OCR, HEX, SPX)".
- /install hub: separate Direct vs App Store cards, honest line on each.

## SEO
- title / description / OG / Twitter from copy.json.meta in the root layout
  metadata; per-standalone-page metadata from copy.json.standalone.*.
- JSON-LD (root layout): SoftwareApplication (Free $0 + Quirky Pro $16.99,
  macOS 13.0, v1.0) + Organization. Confirmed correct.

## Open TODOs for Kostya (flagged by copywriter, carried forward)
- Real .dmg file size (omitted, not invented; /install says "to be confirmed";
  add to hero.primaryCta.note before launch).
- Real Mac App Store product URL (footer + CTAs currently point to
  apps.apple.com / #download).
- Real social profile URLs (footer.social placeholders).
- Confirm 30-day refund window + "England and Wales" governing law.

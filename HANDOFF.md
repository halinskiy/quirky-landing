# quirky-landing — Handoff (Webflow rebuild)

The Webflow developer rebuilds this in Webflow IX2. This file tracks section
order, native-vs-custom flags, and animation notes. Use the dev-only Inspector
(Cmd+click any element) to map a visual element back to its source file + tokens.

## Stack
- Next.js 15 App Router, static export (trailingSlash). Tailwind v4 tokens.
  Framer Motion + Lenis. Single coral accent `#FF7059`. Warm paper bg `#FDFCFA`.
  Manrope (the only font; mono only inside keycaps / code-like detail lines).

## Section order (home, top to bottom)
1. Nav — sticky, transparent to paper/85 + blur at scrollY > 8. Mobile: a
   disclosure panel under the bar (not a fixed overlay).
2. Hero — Capture Fan device, dual download CTA, honest App-Store note.
3. ModeRail (#modes) — five mode blob-chips + a Tab switcher cell.
4. HowItWorks (#how-it-works) — 3 steps, literal keycaps.
5. Features (#features) — 5+1 hairline grid, one blob per cell.
6. Workflows — 3 audience stories.
7. Fits — trust row + Direct/App-Store honesty.
8. Pricing (#pricing) — 2 tiers, Pro highlighted, one-time.
9. FAQ (#faq) — accordion.
10. FinalCTA (#download) — dual download bookend + mini Capture Fan.
11. Footer — 4-col, inline newsletter, cookie-preferences re-open, author line.

Nav anchors (source of truth = copy.json.nav): #how-it-works, #features,
#pricing, #faq, plus #modes (ModeRail) and #download (FinalCTA). scroll-mt-24 on
sections offsets the fixed nav; Lenis applies an 88px scrollTo offset.

## Animation notes (one easing everywhere: cubic-bezier(0.16,1,0.3,1), NO bounce)
- Section enter: `Reveal` = opacity 0->1, y 16->0, blur 8->0, 0.5s, whileInView
  once, optional per-item stagger (index * 0.06s). Webflow IX2: scroll-into-view
  + move/fade/blur, same easing, stagger children.
- Hero + FinalCTA Capture Fan: chips stagger in (Framer, 0.08s), then gently
  float (CSS loop, staggered delay). Marquee dashes march; Tab keycap pulses.
- FAQ: height + opacity expand/collapse, 0.3s, same easing. +/- glyph rotates
  45deg.
- Nav background/blur transition 150ms.
- Reduced motion + `?motion=0`: all loops freeze in final frame; Reveal renders
  final state instantly (no blank/0 flash); FAQ toggles instantly.

## Signature morph (2026-06-01) — WEBFLOW IS NO LONGER A TARGET FOR THIS PIECE
Per the user, the through-flying scroll-pinned morphing block is built for the
React/Next build only and is NOT constrained to IX2-replicable motion. Do not
attempt to rebuild it in Webflow; if a Webflow version is ever needed, ship the
static sections (the content backbone) and treat the morph as a custom React
embed or omit it. The rest of this HANDOFF still applies to the static sections.

What it is: ONE fixed-overlay Quirky block that tracks whole-page scroll and
morphs through 7 forms as it flies the right-side lane:
hero Capture Fan -> single mode chip cycling OCR/HEX/DOM/SVG/SPX -> how-it-works
steps window (keycaps) -> 5+1 features grid -> workflow deck -> Pro pricing card
with its coral CTA (the "turns into buttons" beat) -> final dual-download form.
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
- Fits: item 6 states the Direct-vs-App-Store split explicitly.
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

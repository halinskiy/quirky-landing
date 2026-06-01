# Quirky Landing — Brief

Distilled from `research/` (AUDIENCE, COMPETITORS, TRENDS, MOODBOARD,
product-truth, quirky-direction, voice, system-distill). Dated 2026-05-31.

## One line
Light warm-paper theme, single LOCKED warm-coral accent (#FF7059), Manrope, a
bespoke hero "Capture Fan" that fans one screen-capture into five soft blob
data-chips, a 5+1 features grid in a locked monochrome-blob language,
modes-first section order, workflows-as-trust instead of privacy-panic,
one-time-unlock pricing, dual download loud at the end, same pneumatic easing
and perf rigor Corder ships with.

## Goal
Get a developer/designer/QA to download Quirky. Lead with WHAT IT DOES (5 modes,
shown not told), reassure about workflow/offline LOWER on the page.

## Audience
Devs, designers, QA. Curious and busy, not anxious. Over-marketed-to, so a
concrete friendly voice (a sharp friend showing you a trick) cuts through.

## Voice frame-anchor
"Point at it, get the data." Sub-frames: "Five kinds of data, one hotkey",
"It is already on your screen. Just take it.", "Tab to switch."

## Accent
Warm coral `#FF7059` (5-step). Serves the FRIEND mandate hardest, on the
2025-2026 warm-coral trend line, distinct from every competitor (CleanShot
blue, Raycast red-on-dark, Sip neutral, Linear indigo).

## Decorative language (ONE, locked)
A system of monochrome blob-objects, one canonical object per mode (5 core +
capture / tab / check utility blobs = 8). Single coral tint + near-black 2px
stroke, rounded caps. SVG + CSS, cheap. Implemented as `BlobObject`.

## Hero device — the Capture Fan
A rounded region-selection rectangle with a dashed coral marquee that fans out
five soft blob data-chips, each showing the literal output of a mode: OCR
"Get started", HEX swatch + #3D9DF2 (a grabbed colour, NOT the brand coral),
DOM `button.cta`, SVG `icon.svg`, SPX `184 x 48`. Chip chrome neutral with the
blob glyph; the marquee + Tab keycap use coral. Chips enter with staggered
Framer Motion (0.08s, locked easing) then float gently (CSS). A pulsing Tab
keycap sits centre-bottom. prefers-reduced-motion / ?motion=0 safe. Inline SVG.

## Section order (quirky-direction section 4)
1. Nav (sticky, blur on scroll, blob mark, coral pill CTA) — built
2. Hero (Capture Fan + dual download CTAs) — built
3. ModeRail — stub
4. HowItWorks — stub
5. Features (5+1 blob grid) — stub
6. Workflows (audience micro-stories; replaces privacy block) — stub
7. Fits (offline, no account, notarized, menu-bar, Direct + App Store) — stub
8. Pricing (one-time unlock, 2 tiers, Pro highlighted) — stub
9. FAQ — stub
10. FinalCTA (bookend: headline + mini device + dual download) — stub
11. Footer ("Made in Leicester by Kostya") — stub

## Patterns / components to use (Phase 2)
- BlobObject (built) — the 8-glyph decorative blob set, one per mode + utility
- Button / EyebrowLabel (built) — pill CTA + 12px eyebrow
- ModeRail: hairline rows, one blob + one line per mode
- Features: 5+1 hairline grid, one blob per cell (re-skin of Corder C4)
- Workflows: per-segment micro-stories (re-skin of Corder two-card C3)
- Pricing: 2-tier, Pro highlighted, pill CTAs (one-time, C5 locked)
- FAQ accordion (C6, softened corners), FinalCTA bookend (C7), Footer 4-col (C8)

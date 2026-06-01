# quirky-landing — Project Rules

Inherits from `~/Aisoldier/CLAUDE.md` (global doctrine). Project-specific
overrides only. This repo is STANDALONE (`halinskiy/quirky-landing`), NOT
inside `Aisoldier/projects/`. The ui-kit is therefore vendored, not symlinked.

## Project identity
- **Product:** Quirky. A tiny macOS menu-bar tool (LSUIElement, no Dock icon).
  One hotkey captures a screen region; Tab switches between 5 extractors:
  OCR text, HEX colour, DOM element, SVG icon, SPX pixel measurement.
- **Audience:** developers, designers, QA. Curious and busy, not scared.
  Over-marketed-to: a concrete friendly voice cuts through.
- **Source of truth:** `research/product-truth.md` (locked facts; do not invent
  beyond it), `research/quirky-direction.md` (accent, type, hero spec, section
  order), `research/voice.md` (copy frame-anchor), `content/copy.json`.

## Creative override (the whole point)
Quirky is a FRIEND. Toy-like, soft, blobby, rounded everything. Push toward
playfulness / softness / blob-shapes ONLY. KEEP rigor: perf budget, pneumatic
easing (NO bounce/overshoot), borders as separators, pill CTAs only,
body >= 16px, ONE accent (coral), honest voice, ASCII only.

## Accent (LOCKED 2026-05-31)
- **Base:** `#FF7059` (warm coral). **Hover:** `#F25742`. **Pressed:** `#DB4733`.
- **Soft:** `#FFE9E4`. **Subtle:** `#FFF4F1`.
- **Banned colours:** forest green / any `#217a50` (Corder), rec-red `#b7443d`.
- **WCAG caveat:** coral on white is ~2.4:1 and FAILS as body text. Use coral
  for fills, dots, chip chrome, CTA backgrounds, and LARGE display accents only.
  For coral-coloured text use `--color-accent-pressed`. White on coral passes.

## Theme
- **Default:** light, warm off-white `#fdfcfa` (`--color-paper`, NOT pure white).
  Text `#1a1614` (`--color-ink`). Dark theme not built.

## Token naming
Components use Tailwind utilities `bg-accent / text-ink / bg-paper /
border-gray-200 / text-accent-pressed / text-gray-500 / ring-accent /
bg-accent-soft`. The matching `--color-*` are defined in `src/app/tokens.css`
inside an `@theme` block so Tailwind v4 generates those utilities. Do NOT
introduce `--color-bg` / `--color-text` style names; this project uses
paper/ink/gray-*.

## Stop-words / bans (from voice.md)
- No em-dash, en-dash, middle-dot, bullet in user copy. ASCII only, colon at most.
- No exclamation marks. No emoji in copy (blobs are illustration, not copy).
- Banned: seamless, powerful, robust, cutting-edge, supercharge, unlock,
  leverage, next-gen, redefine, revolutionary, magical, AI-powered, premium,
  enterprise-grade, industry-leading, best-in-class, harness, unleash, elevate,
  game-changer, swiss army knife.
- No fake social proof, no invented testimonials. No AI illustration / stock
  photos for the hero. The hero device is bespoke SVG.

## Honesty: App Store vs Direct
- **Direct** (DMG + Sparkle): all 5 modes.
- **Mac App Store:** OCR, HEX, SPX only (the sandbox blocks the Apple Events
  that drive DOM and SVG). Copy MUST say so. Show BOTH download buttons.

## Pricing (LOCKED)
- One-time unlock. Free core + Pro one-time (~$16.99). NO subscription.
  Frame: "a friend does not send you a monthly bill."

## Stack
- Next.js 15 App Router, React 19, TS strict. Static export to GH Pages.
- Tailwind v4 `@theme` tokens. Framer Motion 12 for entry only.
- **Lenis** wired in the root layout via `MotionProvider` (doctrine: always
  wired). Disabled under prefers-reduced-motion / `?motion=0`. NOTE: Corder
  dropped Lenis; Quirky keeps it per the build brief + global doctrine.
- **Font: Manrope** (variable, next/font). Mono = system stack, code only.
- No shadcn / Radix / MUI / GSAP / Rive. Blobs are SVG + CSS.

## Performance budget (hard)
| Metric | Target | Phase-1 |
|---|---|---|
| LCP | < 1.5s | n/a yet |
| INP | < 100ms | n/a yet |
| CLS | 0 | expected 0 |
| Total JS gz | <= 80KB | 61KB home route (measured) |

## Inspector
Mounted in `app/layout.tsx` behind `NODE_ENV === "development"`. Every
component carries `data-component` / `data-source` / `data-tokens`.

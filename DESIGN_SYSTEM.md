# Quirky — Design System snapshot

Token source of truth: `src/app/tokens.css` (an `@theme` block, so Tailwind v4
generates the matching utilities). Deltas from the Aisoldier kit / Corder below.

## Accent (single) — friendly warm red (replaced coral 2026-06-01)
| Token | Value | Utility | Use |
|---|---|---|---|
| `--color-accent` | `#e63e2e` | `bg-accent` `text-accent` `ring-accent` | fills, dots, CTA bg, LARGE display accents (the giant "5", demo accents) |
| `--color-accent-hover` | `#cf3322` | `bg-accent-hover` | CTA :hover |
| `--color-accent-pressed` | `#b82c1d` | `text-accent-pressed` | CTA :active AND accent TEXT on white (passes contrast) |
| `--color-accent-soft` | `#fce6e2` | `bg-accent-soft` | eyebrow pill, blob fill, hover bg |
| `--color-accent-subtle` | `#fef3f0` | `bg-accent-subtle` | faint wash, capture-rect fill |

White text on `#E63E2E` clears WCAG AA at button sizes (coral did not), so
white-on-accent CTAs are fine. Accent as small body text on white still fails;
use the `pressed` step for accent-coloured text. The HEX demo value stays the
grabbed-blue `#3D9DF2` (sampled data, not brand) and is the only non-accent,
non-neutral colour on the page.

## Dark break surface (light -> dark -> light rhythm)
| Token | Value | Utility / use |
|---|---|---|
| `--color-ink-surface` | `#160c0a` | warm near-black, full-bleed break sections (Modes, FinalCTA) |
| `--color-ink-raised` | `#221513` | faintly raised demo card on the dark surface |
| `--color-on-dark` | `#fdfcfa` | `text-on-dark` paper-white text on the dark surface |

`.dark-scope` sets on-dark text + an accent ::selection; `.dot-grid-dark` is the
white-at-8%-alpha dot atmosphere. Body on dark uses on-dark/70 or /60 (AA on
#160C0A). Hairlines on dark = white/10. Accent red reads at LARGE display only.

## Neutrals (warm paper)
| Token | Value | Utility |
|---|---|---|
| `--color-paper` | `#fdfcfa` | `bg-paper` `text-paper` (page bg / on-accent text) |
| `--color-ink` | `#1a1614` | `text-ink` |
| `--color-gray-200` | `#eceae6` | `border-gray-200` (hairline, primary separator) |
| `--color-gray-300` | `#ddd9d2` | stronger hairline |
| `--color-gray-500` | `#6c6660` | `text-gray-500` (muted body) |
| `--color-captured-blue` | `#3d9df2` | hero HEX chip swatch (a grabbed colour, NOT brand) |

## Typography
- **Font:** Manrope (variable, next/font), exposes `--font-manrope` -> `--font-sans`.
- **Mono:** system stack, code / selector / hex only.
- Display clamp scale (display-xl..md), H1/H2/H3, body-xl 22 / body-lg 18 /
  body 16 / eyebrow 12. Eyebrow 12px is the ONLY sub-16px text (uppercase,
  weight 600, ls 0.04em).

## Radii (rounder than Corder for the toy feel — documented deviation)
| Token | Value | vs Corder |
|---|---|---|
| `--radius-window` | `20px` | Corder 12px |
| `--radius-card` | `16px` | new |
| `--radius-button` | `14px` | Corder 8px (Quirky uses rounded-full pills on CTAs) |
| `--radius-pill` | `999px` | same |

## Easing
`cubic-bezier(0.16, 1, 0.3, 1)` everywhere (defined inline as `EASE` in the
motion components and in the Lenis easing). Nothing bounces. The playful
override does NOT add bounce (A4 kept strictly).

## Deltas from Corder / kit
- Accent: friendly warm red `#e63e2e` (was coral `#ff7059`, was forest green).
- Background: warm paper `#fdfcfa` (Corder pure white).
- Token naming paper/ink/gray-* (Corder used bg/text/border/surface).
- Radii rounder (window 20 vs 12, button 14 vs 8).
- Font: Manrope (Corder/kit use IBM Plex). Sanctioned in product-truth.md.
- Lenis re-added (Corder removed it).

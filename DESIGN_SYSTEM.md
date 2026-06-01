# Quirky — Design System snapshot

Token source of truth: `src/app/tokens.css` (an `@theme` block, so Tailwind v4
generates the matching utilities). Deltas from the Aisoldier kit / Corder below.

## Accent (single, LOCKED)
| Token | Value | Utility | Use |
|---|---|---|---|
| `--color-accent` | `#ff7059` | `bg-accent` `text-accent` `ring-accent` | fills, dots, chip chrome, CTA bg, large display accents |
| `--color-accent-hover` | `#f25742` | `bg-accent-hover` | CTA :hover |
| `--color-accent-pressed` | `#db4733` | `text-accent-pressed` | CTA :active AND coral TEXT (passes contrast) |
| `--color-accent-soft` | `#ffe9e4` | `bg-accent-soft` | eyebrow pill, blob fill, hover bg |
| `--color-accent-subtle` | `#fff4f1` | `bg-accent-subtle` | faint wash, capture-rect fill |

Coral as body text on white FAILS WCAG AA (~2.4:1). Forbidden. Use the
`pressed` step for coral text; white-on-coral fill passes.

## Neutrals (warm paper)
| Token | Value | Utility |
|---|---|---|
| `--color-paper` | `#fdfcfa` | `bg-paper` `text-paper` (page bg / on-coral text) |
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
- Accent: coral (was forest green).
- Background: warm paper `#fdfcfa` (Corder pure white).
- Token naming paper/ink/gray-* (Corder used bg/text/border/surface).
- Radii rounder (window 20 vs 12, button 14 vs 8).
- Font: Manrope (Corder/kit use IBM Plex). Sanctioned in product-truth.md.
- Lenis re-added (Corder removed it).

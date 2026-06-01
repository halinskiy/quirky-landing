# Quirky Trends Scan: playful-but-rigorous dev/SaaS tools

> Phase 3 deliverable. Scan date: 2026-05-31. EXPIRES 2026-06-30. Re-scan after.
> Author: 3mpq-researcher. Vertical: friendly Mac utility / dev-design tool landing.

## SOURCING DISCLAIMER

Live Awwwards / SOTM browsing was blocked in this sandbox on 2026-05-31 (WebFetch
empty on JS pages, WebSearch empty, no DNS). This scan is synthesized from the studio
base catalog (`/Users/3mpq/Aisoldier/research/awwwards-2024-2026-patterns.md`) plus
knowledge current to January 2026. Where a claim would normally carry a live SOTM URL,
it is flagged "verify". The patterns themselves are stable enough to act on; specific
2026 winners should be re-pulled when network is available.

---

## Dominant patterns right now (act on these)

### Hero
1. **Live/illustrated product diagram over framed screenshot.** The 2024-2026 winners
   show the product DOING its thing (Linear, Vercel, Raycast use live UI windows;
   base catalog item 2). For Quirky the on-brief evolution is an ILLUSTRATED device
   (the Capture Fan), since a static framed screenshot is both forbidden and dated.
2. **One bold accent on neutral** (base catalog item 14) is firmly the doctrine-aligned
   norm. Multicolor gradients are fading except as soft single-hue tints.
3. **Warm off-white backgrounds (#faf9f6 family)** over pure white (catalog item 15)
   are rising, especially for "honest/human software." Strongly supports Quirky's
   warm-paper base.

### Color (most relevant to accent choice)
4. **Warm corals and soft electric blues rising; acid/lime fading** (catalog item 16).
   This directly validates Quirky's LOCKED accent: warm coral `#FF7059`. Coral is on
   the rising edge of the 2025-2026 palette, reads friendly/warm, and is distinct from
   every competitor and from Corder's blood-red. (See product-truth.md for the lock.)
5. **Friendly violets/periwinkles** are also a 2025-2026 SaaS staple (Linear-adjacent
   indigo warmed up). Violet was the considered-but-not-chosen alternative; coral won
   the FRIEND mandate. Noted here only so the palette context is complete.
6. **Muted earth tones for "honest software"** (catalog item 17). Quirky uses warm
   neutrals (paper white, warm border) in this spirit while keeping one bright accent.

### Shape / decoration (the friendly axis)
7. **Soft blob shapes and rounded "toy" geometry** are the defining playful-but-premium
   move of 2024-2026 (Arc-lineage, Stripe-adjacent friendly landings, many SOTM picks).
   This validates Quirky's chosen decorative language (monochrome blob-objects).
8. **Bento/hairline grids** remain the default for feature sections (catalog items 7,
   19). Quirky keeps the hairline grid but fills cells with blobs.
9. **Squircle/superellipse everything** (app-icon corner language bleeding into UI).
   Aligns with Quirky's 22.4%-radius squircle logo convention.

### Motion
10. **Native `animation-timeline: view()` scroll-linked reveals** are now mainstream and
    perf-friendly (catalog item 6, scroll-fill text). Quirky uses this for everything
    scroll-linked; Framer Motion only for hero entry.
11. **Blur-to-sharp reveals, 600-800ms, ease cubic-bezier(0.16,1,0.3,1), staggered
    40-80ms** (catalog items 11-12). Quirky keeps exactly this. Crucially: even in the
    "playful" 2026 climate, the top tier does NOT bounce; restraint reads premium.
    Bouncy/elastic is a downmarket tell. Quirky's friendliness must come from shape and
    color, never from spring physics.
12. **Card "fan/deal" entry motion** (common in fintech card heroes) is a fresh, on-brief
    way to animate Quirky's five mode-chips fanning out of one capture. (verify SOTM
    examples; the mechanic is current.)

## Patterns fading / to avoid

- Acid-lime accents (dated to 2022-2023).
- Heavy WebGL/Spline 3D hero blobs as the LCP element (perf cost; also off-budget for
  Quirky's 80KB JS cap). Use SVG/CSS blobs instead.
- Bouncy/elastic/overshoot easing (reads cheap; banned by doctrine anyway).
- Framed flat screenshots as hero (the thing Corder does and Quirky is told NOT to do).
- Multicolor brand systems (fights one-accent doctrine; ColorSlurp does this, Quirky
  must not).
- Lottie animations layered over static screenshots (the research-prompt explicitly
  prefers real product recordings; for Quirky, SVG-driven illustration + short webm).
- Emoji-as-icon systems (read juvenile/unbranded; Quirky uses a bespoke blob set instead).

## Niche-specific observations (Mac utility landings)

- The strong ones (Raycast, CleanShot) show the actual UI and the actual keystroke.
  Quirky should keep `⌘⇧1` and `Tab` visible as literal, charming UI elements.
- Dual-distribution (Direct + Mac App Store) buttons shown side by side is the trust
  norm for notarized indie Mac apps (Raycast-style). Do not hide the App Store button.
- "Works offline / no account / notarized" is the current trust trinity for indie Mac
  utilities, replacing older "enterprise security" language.
- Solo-dev authorship as a trust signal (visible maker, "email me if it breaks") is a
  rising, well-received pattern for indie software in 2025-2026. Quirky should use it.

## What this means for Quirky (one paragraph)

Quirky sits exactly on the live trend line: warm off-white base, single friendly-violet
accent, soft blob decoration, hairline grids, squircle geometry, native scroll-timeline
motion with strictly non-bouncy pneumatic easing, an illustrated product-diagram hero
(the Capture Fan with a deal/fan motion), dual-distribution trust, and visible solo
authorship. It is current without chasing anything faddish, and its blob-friendly skin
plus the uncontested "five-data-types, one capture" position give it a distinct identity
on top of trend-safe foundations.

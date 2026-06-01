# Quirky Direction

> Phase 3 deliverable. Date: 2026-05-31. Author: 3mpq-researcher.
> Creative override in force: Quirky is a FRIEND, not a corporate tool. Toy-like,
> soft, blobby, friendly. Engineering rigor, perf budget, honest voice, no AI
> cliches, no em-dash all stay. Playful only in shape/color/warmth, never in motion
> (easing stays pneumatic) and never in honesty.

---

## 1. Accent — ALREADY LOCKED (see product-truth.md)

> CORRECTION 2026-05-31: the accent is NOT open. `research/product-truth.md`
> records the user's locked decision. Do not re-pick. This section now documents
> the LOCKED accent plus, for the record, the alternatives that were on the table.

### LOCKED accent: "warm coral" `#FF7059`

Full 5-step scale Quirky uses (derived to match Corder's discipline; base + hover +
soft are from product-truth, pressed + subtle derived):

```
--color-accent:         #FF7059   /* warm coral, LOCKED */
--color-accent-hover:   #F25742   /* LOCKED */
--color-accent-pressed: #DB4733   /* derived: hover darkened ~8% for :active */
--color-accent-soft:    #FFE9E4   /* LOCKED: tinted surface, hover bg, blob fill */
--color-accent-subtle:  #FFF4F1   /* derived: faint wash, lighter than soft */
```

Why coral is right for Quirky (post-hoc rationale, since it is locked): coral is the
friendliest, warmest, most "toy" hue available. It hits the FRIEND brief hardest, it
is firmly on the 2025-2026 trend line (warm corals rising, acid/lime fading, see
TRENDS.md item 4), and it is safely distinct from Corder's blood-red rec-red
`#b7443d` (coral is orange-forward and warmer/lighter) and from every competitor
(CleanShot blue `#0669FF`, Raycast red-on-dark, Sip neutral, ColorSlurp multicolor,
Linear indigo-noir). It pops against neutral macOS screen-capture UI so the mode
data-chips read clearly.

Discipline guardrails for the soldier (coral needs these):
- Coral at base saturation can drift toward "alert/warning" in big fills. Use it as
  accent dots / CTAs / chips / blob tints, NEVER as a full-bleed background wash.
- Text contrast: `#FF7059` on white is ~2.4:1, FAILS WCAG AA for body text. So coral
  is for fills, borders, dots, large display accents, and CTA backgrounds (white text
  on coral fill passes). For coral-colored TEXT, only use it at large display sizes
  (>=24px) or use the darker `--color-accent-pressed`/`hover` step, and verify per use.
- On the soft step `#FFE9E4`, always put `--foreground` text, never accent-on-soft.

### Alternatives that were considered (archived, NOT chosen)

For the record, before the lock the friendly-direction shortlist was:
- "Bubblegum Grape" soft violet `#7C5CFC`: friendly + credible, maximally distinct,
  but a very popular SaaS hue; would have needed blobs to avoid looking generic.
- "Sky Putty" soft cerulean `#3D9DF2`: safest/calmest, weakest on the playful
  mandate, risk of reading utility-cold.

Coral was chosen because it serves the FRIEND mandate harder than either.

---

## 2. Background + neutral recommendation

Keep light theme. Recommend a **warm off-white** base rather than pure white, to
support the friendly mood (Awwwards catalog item 15: warm off-whites over pure white).

```
--background: #FDFCFA   /* warm paper white */
--foreground: #1A1A1A
--color-border: #ECEAE6 /* warmer than Corder's #e5e5e5 to match the off-white */
```

Dot-grid stays available but recommend a softer dot color (`#E6E3DD`) on the warm base.

Dark theme: NOT recommended as default. Despite Raycast's dark-first norm, Quirky's
friendly/toy direction lives better on warm light. Dark would make blobs feel neon
and lose the soft paper-toy character. Offer dark only if Kostya insists, and only
as a secondary theme, never the default.

---

## 3. Section order (recommended, with rationale)

Quirky's audience is curious and busy, not scared. So: **show what it does first,
reassure about workflow later.** This inverts Corder's privacy-first order.

```
1.  Nav                  sticky, blur on scroll, squircle mark left, pill CTA right
2.  Hero                 the 5-mode capture device (see section 4), big Manrope headline
3.  ModeRail / "5 in one"  the five modes named, one line each, the core promise:
                         one hotkey, five kinds of data. (replaces Corder AudienceLine
                         position but more concrete)
4.  HowItWorks           3 steps: hotkey -> drag region -> Tab to pick mode. Demo GIF.
5.  Features (5+1 grid)   one cell per mode + one "switch with Tab" cell.
                         ONE decorative language (blobs, see section 5). hairline grid.
6.  Workflows            audience-specific micro-stories (frontend / designer / QA /
                         content). Replaces Corder's privacy block: shows it FITS.
7.  Fits-your-Mac trust  works offline, no account, notarized, menu-bar only,
                         Direct + App Store. (the demoted privacy/trust surface)
                         NOTE: App Store build = OCR/HEX/SPX only (no DOM/SVG, sandbox
                         blocks Apple Events). Be honest about this here and at CTAs.
8.  Pricing              ONE-TIME UNLOCK (locked, product-truth.md): Free core + Pro
                         one-time ~$16.99, NO subscription. Frame: "a friend does not
                         send you a monthly bill." 2 tiers, pill CTAs, Pro highlighted.
9.  FAQ                  accordion, soft corners.
10. FinalCTA             bookend: big Manrope headline + the mini 5-mode device again,
                         dual download buttons (DMG + Mac App Store).
11. Footer               4-col, squircle mark, slogan, social, cookie pref,
                         "Made in Leicester by Kostya, email me if it breaks."
12. (Newsletter)         fold into footer (inline), not a floating nag card.
```

Rationale highlights:
- **Modes before everything**: Quirky's whole pitch is "five tools, one hotkey."
  Lead with the demo, not with a fear. The hero device + ModeRail do this in the
  first two screens.
- **Workflows replace privacy at the high-trust slot**: Corder reassures "no bot."
  Quirky reassures "this slots into your day." Concrete per-segment workflows (from
  AUDIENCE.md) are the trust signal.
- **Trust/offline demoted to position 7**: it matters (offline, no account, notarized)
  but it is not the lead anxiety. State it confidently, move on.
- **Dual download is loud at FinalCTA**: both Direct and Mac App Store, never hidden.

---

## 4. Hero device (Quirky's own, NOT a framed screenshot)

**The "Capture Fan."**

Concept: a single rounded region-selection rectangle (the thing you draw with
`⌘⇧1`) sits center-stage over a soft, abstract macOS-ish surface. From the moment
of capture, the rectangle **fans out five soft blob-chips**, one per mode, each
showing the literal output of that mode for the captured region:

- OCR chip: a few words of recognized text ("Get started")
- HEX chip: a color swatch + a hex value (use a real captured color, e.g. `#3D9DF2`
  of some on-screen UI; do NOT show the brand accent `#FF7059` here, it would read as
  "Quirky's own color" rather than "a color you grabbed")
- DOM chip: a tiny CSS selector pill `button.cta`
- SVG chip: a small monochrome glyph outline
- SPX chip: a measurement readout `184 x 48`

Note on the five chips: each chip's content is real captured data, but the chip
CHROME (borders, the active-mode highlight, the "Tab to switch" cursor) uses the
single coral accent `#FF7059`. One accent across all five chips; the data values
inside are neutral/literal.

The five chips arc/fan around the capture rectangle like cards being dealt, entering
with the pneumatic ease (staggered 60ms, BlurReveal). A small floating "Tab to switch"
hint cursor sits at the left edge (mirroring the real floating mode-switcher button).
On scroll, the chips do NOT bounce; they settle. Friendliness comes from the soft
blob shapes of the chips and the warm palette, not from springy physics.

Why this is the right device:
- It encodes the entire product thesis in one image: **one capture -> five kinds of
  data**. No competitor hero does five-outputs-from-one-capture.
- It is explicitly NOT Corder's "recording window with a red dot."
- It is NOT a framed app screenshot (forbidden). It is a diagrammatic, toy-like,
  illustrated device that can be rendered in SVG + CSS (cheap, on-budget, no WebGL).
- It is demo-able: the static SVG version is the LCP-safe poster; an optional short
  `.webm` can animate the real capture -> fan for users who scroll/hover.

Fallback simpler version (if the fan is too busy): the capture rectangle with a
single vertical stack of the five chips appearing one by one as a tab cycles. Same
thesis, calmer composition.

The squircle Quirky logo (22.4% radius, no shadow) appears large but quiet above or
beside the headline, per brand convention.

Headline direction (copywriter owns final): big Manrope, warm and concrete, e.g.
the spirit of "Point at anything on screen. Get five kinds of data." (not final copy.)

---

## 5. Decorative language (pick ONE, locked)

The brief allows ONE consistent visual system. Three options were on the table:
outline-icons one stroke weight / monochrome 3D / a system of 6-8 emoji-or-blob objects.

**Chosen: a system of monochrome blob-objects (soft, rounded, single-accent-tinted),
one canonical object per mode, 5 core + a few utility blobs (7-8 total).**

Why blobs over the other two:
- The creative override literally says "blobby." Blobs are the most on-brief.
- Outline-icons one-stroke is what every dev tool does (Linear, Raycast). Too safe,
  not friendly enough, would make Quirky look like a Corder sibling.
- Monochrome 3D is expensive (render pipeline, asset weight) and fights the perf
  budget and the "toy paper" warmth. Blobs are SVG, cheap, on-budget.
- Emoji are banned in copy and read juvenile/unbranded; a bespoke blob set is owned.

The blob set (one visual metaphor per mode, all in the single accent + neutral,
all the same soft rounded language):
- OCR: a blob with little "text lines" carved into it (reading)
- HEX: a blob that is a paint droplet / swatch (color)
- DOM: a blob made of nested rounded brackets / a little node (structure)
- SVG: a blob with a clean vector glyph cut out (vector)
- SPX: a blob with a tiny ruler/measure notch (size)
- + utility blobs: the capture-rectangle blob, the "Tab switch" blob, a "checkmark/copied"
  blob (clipboard confirmation).

Rules to keep it disciplined (so playful never becomes messy):
- All blobs share one corner-softness language and one stroke weight if outlined.
- Only the single accent + neutral grays. No second color, ever (doctrine A1).
- Borders still present on cards (doctrine A5); blobs live INSIDE bordered cells.
- Blobs do not animate with bounce. Entry is BlurReveal + pneumatic ease only.

---

## 6. Mood references (NOT from Corder)

1. **Arc Browser (pre-rebrand, thebrowser.company / arc.net circa 2023-2024)** —
   the gold standard for "playful but premium" software marketing. Soft gradients,
   friendly rounded UI, confident but warm voice. Closest spiritual sibling for the
   toy-friendly-yet-credible target. (Reference for tone of warmth + premium balance.)
2. **Raycast (raycast.com)** — reference for menu-bar-utility premium-vibe and for
   how to present extensions/modes compactly. Quirky borrows the "multiple capabilities,
   one launcher" compositional clarity, but warms it up and lightens it (Raycast is
   dark; Quirky is warm-light + blobby).
3. **Linear (linear.app)** — reference for typographic density, hairline grids, and
   restrained scroll motion. Quirky keeps Linear's discipline in layout/borders while
   diverging hard on warmth, shape (blobs), and color (warm coral over indigo-noir).

(Live re-verification of these sites was blocked by the sandbox network on
2026-05-31; descriptions are from knowledge current to Jan 2026 plus the studio
Awwwards catalog. Re-check before pulling exact visuals.)

Supplementary texture references the soldier can pull later: warm paper-grain
backgrounds (ia.net restraint), soft blob illustration sets (the kind seen across
2024-2026 Stripe-adjacent and Vercel-adjacent friendly landings), and the deck-of-cards
"fan out" motion (common in fintech card heroes) repurposed for the 5 mode-chips.

---

## 7. One-line summary for the soldier

Light warm-paper theme, single LOCKED warm-coral accent (#FF7059, 5-step), Manrope, a
hero "Capture Fan" that fans one screen-capture into five soft blob data-chips, a 5+1
features grid using a locked monochrome-blob language, modes-first section order,
workflows-as-trust instead of privacy-panic, one-time-unlock pricing (no subscription),
dual download loud at the end (Direct = all 5 modes, App Store = OCR/HEX/SPX only),
and the exact same pneumatic easing + perf + honesty rigor Corder ships with.

# Quirky — Corrections

Cross-agent notes the soldier must honour. Researcher / economist / copywriter
write here; soldier reads before building.

## Locked, do not re-decide
- **Accent = friendly warm red `#E63E2E`** (5-step, see REDESIGN REFINEMENT below).
  SUPERSEDES the old coral `#FF7059`. One accent rule still holds. Banned: forest
  green / `#217a50`, Corder rec-red `#b7443d`, any second brand colour.
  (Old coral note kept for history only; do not use #FF7059 anymore.)
- **HEX chip uses a grabbed colour `#3D9DF2`, not coral**, so it reads as "a
  colour you took". (quirky-direction.md section 4, voice.md)
- **Pricing: one-time unlock, ~$16.99, NO subscription.** Frame: "a friend does
  not send you a monthly bill." (product-truth.md, pricing-brief.md)
- **App Store = OCR/HEX/SPX only** (sandbox blocks DOM/SVG). Copy must say so;
  show BOTH download buttons. (product-truth.md)
- **Font: Manrope.** Mono only inside code. (product-truth.md)
- **Easing stays pneumatic** `cubic-bezier(0.16,1,0.3,1)`; no bounce. (A4)
- **ASCII only**, no em-dash/en-dash/middle-dot/bullet, no exclamation marks,
  no emoji in copy, banned-words list. (voice.md section 5)
- **Token naming = paper / ink / gray-* / accent-*** (NOT bg/text/border).

## Section direction
- Modes-first order. Workflows replace privacy-panic at the high-trust slot.
  (quirky-direction.md section 3-4)

## CAPITAL REBUILD (user, 2026-06-01, THIRD round) — overrides earlier morph/section plans
User: the morphing flying block is confusing and not informative ("непонятно зачем
тут летает этот блок", "бред какой-то"). Wants a CAPITAL rebuild: a clean, simple,
SMART structure. This SUPERSEDES the morph journey and the 6-section layout.

NEW STRUCTURE (this is the whole page):
- HEADER (sticky nav: logo + a couple anchors + Download CTA)
- SECTION 1 = HERO with an INTERACTIVE mode switcher demo. ONE realistic capture
  scene on screen; visitor clicks tabs OCR / HEX / DOM / SVG / SPX and the OUTPUT
  panel updates live to show that mode's real result from the SAME one capture:
  OCR -> a copied text string, HEX -> #3D9DF2 swatch + "copied", DOM -> button.cta
  selector + inner text, SVG -> the lifted icon, SPX -> 184 x 48 measurement.
  The visitor DRIVES it (click/tab), so they immediately understand the product:
  one capture, five kinds of data. Headline + subhead + the two download CTAs
  (Direct all 5 modes / App Store OCR-HEX-SPX honest note) live here too.
- SECTION 2 = the five modes, INFORMATIVE. Each mode: name + what it does in one
  concrete line + its real output example. This is where "not informative" is
  fixed: say clearly what each mode returns and for whom. No chips, no captions
  under blobs; real headings + real example outputs.
- SECTION 3 = PRICING + DOWNLOAD. Free (OCR/HEX/SPX) vs Pro $16.99 one time (adds
  DOM/SVG), one time framing, both download buttons, App Store honesty footnote.
- FOOTER (condensed current footer: brand, a few links, FAQ link or inline,
  legal links, cookie preferences, author line, newsletter optional-inline).

REMOVE ENTIRELY:
- The whole morph system (MorphMount/MorphJourney/MorphForms/useMorphEnabled,
  the .morph-handoff handoff CSS, the data-morph attribute). Delete its mount in
  page.tsx and the handoff wrappers. No flying block anywhere.
- The standalone ModeRail / Features / Workflows / Fits / TrustStrip / HowItWorks
  / ModesShowcase as separate sections. Fold the useful content into SECTION 2.
  HowItWorks (3 steps) can become a small strip inside Hero or Section 2 if it
  helps comprehension, but NOT its own big section. Keep it tight: 3 sections total.
- FAQ as a big section: move FAQ either into the footer area (compact) or keep a
  short 3-4 Q/A block appended to Section 3; do not let it become a 4th heavy
  section. (Standalone /privacy /terms /refunds /thanks /install stay as routes.)

KEEP (still locked):
- Accent friendly warm red #E63E2E (5-step). One accent. #3D9DF2 is the sampled
  HEX demo value (allowed, not brand).
- No dashes in visible prose (no em/en/hyphen-as-separator/compound). ASCII.
- 16px min body (display can be large), pneumatic easing cubic-bezier(0.16,1,0.3,1)
  NO bounce, borders as separators, pill CTAs.
- ?motion=0 / reduced-motion: the interactive demo must have a sensible static
  default state (e.g. show the OCR/first tab's output) and remain fully usable by
  click even with motion off; no blank.
- App-Store honesty visible (Section 1 + Section 3). Pricing one time $16.99.
- Light theme base; ONE dark section is fine for contrast (e.g. the mode demo
  panel or Section 2) but do not require the old light/dark/light/dark rhythm.
  Keep it clean and "smart", not busy.
- Deployable: Next.js static export, basePath /quirky-landing, favicon
  /quirky-landing/icon.svg, build green.

## GIVE IT SOUL (user, 2026-06-01, 4th round) — "скучно"
The 3-section rebuild is structurally right but STERILE. The user said "скучно".
The original brief was Quirky = a FRIEND: toy-like, playful, blobby, warm, fun.
The clean rebuild scrubbed that personality out. Bring it BACK, keeping the
header + 3 sections + footer structure and the interactive switcher. The user
asked for ALL of these at once (keep structure, add life):

1. **A Quirky CHARACTER / mascot.** Give Quirky a face and personality: a small
   friendly blob creature (single accent + neutral, soft rounded, ONE consistent
   design) that lives on the page and REACTS: blinks, looks toward the cursor or
   the active element, looks delighted when you grab data (e.g. when you switch a
   mode in the demo it reacts), peeks in at section edges. It is a friend, not a
   corporate logo. Keep it tasteful and on-brand (not a clippy nuisance): subtle,
   charming, reduced-motion-safe (a calm static pose when motion is off).
2. **A LIVING hero demo.** The mode switcher must not sit dead waiting for a
   click. It should auto-play / breathe: a cursor visibly draws the capture
   rectangle, data flies out with delight, it auto-cycles OCR -> HEX -> DOM ->
   SVG -> SPX, AND the visitor can still grab control by clicking/keyboard (when
   they interact, auto-cycle pauses). The character reacts to each grab. Motion
   off = static resolved OCR state as today.
3. **Bold visual + scale.** Louder typography, confident scale, soft blob shapes,
   a bit of asymmetry and playfulness in layout. Stop looking like a dev-tool
   template. Warm, friendly, a little surprising. (One accent #E63E2E still; one
   dark moment is fine.)
4. **Living, friendly COPY with personality and a little humor.** Replace flat
   doc-speak ("Recognized text, copied to clipboard") with warm friend voice
   ("Boop. The text is already in your clipboard."). Quirky talks like a delighted
   friend showing you a trick. Still: ASCII only, NO dashes (no em/en/hyphen-as-
   separator/compound), no banned words, no exclamation marks (find energy without
   them), App-Store honesty + facts intact, pricing one time $16.99. Keep it tight.
5. **Surprising scroll.** Add tasteful scroll-driven delight: elements that
   reveal/parallax/assemble as you scroll, the character peeking or following,
   playful but MEANINGFUL motion (shows the product or rewards scrolling), never
   bounce, pneumatic ease only. Not the old confusing flying morph block: this is
   per-section scroll delight, legible and purposeful. Must degrade to static
   under ?motion=0 / reduced-motion (no blank, no scroll-trap), CLS 0, perf sane.

Hard guardrails unchanged: one accent #E63E2E, 16px min body, pneumatic easing no
bounce, no dashes, App-Store honesty, deployable static export, ?motion=0 static
on all routes, no horizontal overflow at 390. Make it fun WITHOUT breaking these.

## REDESIGN DIRECTIVE (user, 2026-06-01) — contrast + scale + cut text
User feedback on the v0.1 live site: "всего слишком много, выглядит несуразно,
читается тяжело, нужно больше контраста, скучно, много текста, нет масштаба чтоб
развлечь." The whole page was one flat beige wall, 9 near-identical
eyebrow+headline+paragraph+grid blocks at one type size. Fix with THREE moves:

1. **Light/dark alternation (chosen).** Warm paper stays the BASE, but 2-3 key
   sections become near-black full-bleed BREAK sections. Coral + white text fire
   on black. Rhythm light -> dark -> light gives breathing room and drama.
   Keep the friendly character (rounded, blobs); dark is for contrast, not a
   Raycast clone. Candidate dark sections: ModeRail ("five in one"), HowItWorks,
   and the FinalCTA bookend. Pricing may also go dark to make the Pro card pop.
   Add dark-surface tokens (e.g. --color-ink-surface near-black, white/80,/60,/40
   text ramp on dark, coral unchanged). Borders on dark = white/10 hairlines.
2. **Massive scale (chosen).** Introduce one or two oversize moments per major
   section: a giant "5" (the five modes), a huge #3D9DF2, a full-width "184 x 48"
   measurement, display headlines 96-140px. Scale IS the entertainment. Lots of
   air around the big elements; do not crowd them.
3. **Cut text HARD (chosen: one line per section).** Each section = ONE big claim
   line + the visual. REMOVE the descriptive paragraphs and REMOVE the per-card
   descriptions in Features/ModeRail/Workflows. Details move into FAQ. Copywriter
   trims copy.json accordingly; keep ASCII-only, no banned words, App-Store
   honesty stays (it can live as one tight line, not a paragraph).

Hard constraints unchanged: pneumatic easing no bounce, 16px min body (the big
display text is fine; just no sub-16 body), the morph journey stays (re-time it
over the new section rhythm). The dark sections must also pass ?motion=0 static
(no blank). Light text on dark must clear WCAG AA.

## REDESIGN REFINEMENT (user, 2026-06-01, second round)
The first redesign pass was still not it. Sharper direction:

1. **NEW ACCENT (replaces coral).** Darker and CLOSER TO RED, but still friendly
   (not aggressive, not Corder's muted brick). New 5-step (one accent rule still
   holds, this REPLACES #FF7059 everywhere):
   ```
   --color-accent:         #E63E2E   /* friendly warm red, darker + redder */
   --color-accent-hover:   #CF3322
   --color-accent-pressed: #B82C1D
   --color-accent-soft:    #FCE6E2
   --color-accent-subtle:  #FEF3F0
   ```
   Banned still: forest green/#217a50, Corder rec-red #b7443d (ours is brighter,
   more saturated, redder-orange, distinct). Bonus: white text on #E63E2E clears
   AA at button sizes (coral did not), so coral-text workarounds relax. The HEX
   demo value stays the grabbed-blue #3D9DF2 (that is sampled data, not brand).
2. **Darker dark sections.** The near-black break sections go properly dark for
   real contrast. --color-ink-surface ~ #160C0A (warm near-black). Accent red and
   white pop hard on it.
3. **NO chips, NO captions.** Remove the chip UI (ModeRail chips, Fits chips) and
   remove caption-scale label text under things. Modes communicate via ANIMATION
   of what they do, not via a text caption beneath a chip. Labels that remain are
   real headings/body, not tiny captions.
4. **NO dashes at all.** No em-dash, en-dash, AND no hyphen used as a separator or
   as a dash. Prefer "menu bar" not "menu-bar", "auto update" not "auto-update",
   rewrite rather than hyphenate. ASCII sentences with commas/periods only.
5. **Spacing rhythm.** Tight gap heading -> subheading (they read as one unit),
   GENEROUS gap before the CTA/button (let the action breathe). Apply this
   heading->subhead->(air)->button rhythm in every section.
6. **FEWER SECTIONS.** Consolidate 9 content sections to ~5-6. Suggested:
   - Hero (keep)
   - Modes showcase (MERGE ModeRail + Features into ONE big animated section: the
     5 modes shown by animation, no chips, no captions, oversize)
   - How it works (keep, 3 steps, animated)
   - Pricing (keep)
   - FAQ (keep; holds all detail)
   - Final CTA (keep)
   DROP Workflows as its own section (fold one proof line into Modes or cut), and
   DEMOTE Fits to a thin one-line trust strip (offline, no account, notarized,
   App Store vs Direct honesty) rather than a 6-card section. App-Store honesty
   MUST survive somewhere visible.
7. **MORE animation, all meaningful.** Every animation must SHOW something true
   about the product (a capture happening, a mode extracting its data, a number
   measuring). No motion for decoration's sake; no bounce; pneumatic ease. Bigger
   moments, clearer payoff. The morph journey is the spine; add purposeful
   in-section motion that demonstrates each mode.

## Open items for Phase 2 agents
- Economist to confirm the EXACT Pro price (currently $16.99 in copy.json).
- Copywriter owns final strings for sections 3-11 (copy.json is the source;
  Phase 1 hero uses lightly-paraphrased placeholder copy, Phase 2 wires the
  exact copy.json strings).
- Confirm the real .dmg size before publishing any "X MB" claim (voice.md).
- copy.json currently contains some `--` sequences in note fields (e.g. hero
  primaryCta.note "Apple Silicon and Intel  --  Direct download, DMG"). These
  are NOT em-dashes (ASCII double-hyphen) but the copywriter should review
  whether to replace with a colon or a period per the no-dash house style
  before Phase 2 wires them verbatim.

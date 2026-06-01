# Review — Quirky landing (first-pass full QA)

**Date:** 2026-06-01
**Reviewer:** 3mpq-judge
**Scope:** Full first-pass visual + doctrine QA of the whole site (11 home sections
+ 5 standalone pages), reviewed against product-truth.md, quirky-direction.md,
voice.md, CORRECTIONS.md, copy.json, and the global doctrine, with the user's
FRIEND creative override in force.
**Method:** 6 independent clean builds, full copy/color/grep sweeps over source AND
rendered HTML, complete static read of every section + standalone component, and an
independent headless-Chrome CDP computed-style assertion pass (my own, not the
soldier's) against the running dev server.

## Verdict: ISSUES (1 FAIL, 2 WARN, 3 NOTE)

One blocking FAIL: **body text under 16px in 16 places**, confirmed by live
computed-style measurement. This is the template-design RETRO miss recurring and is
a hard doctrine violation (A3 + the explicit prompt rule). Every other gate I
checked passed and was measured. Fix Issue #1 and this flips to PASSED.
**Do not deploy until Issue #1 is fixed and the sub-16 sweep re-runs clean.**

---

## UPDATE 2026-06-01 (main-loop fix pass) — Issue #1 RESOLVED + WARN #2 RESOLVED

Issue #1 (FAIL) fixed: all sub-16px body raised to 16px (Features detail, Pricing
notes/footnotes, Footer social/newsletter, CookieConsent buttons, PageShell meta,
/install line, Keycap, CaptureFan "Tab" SVG label). 12px uppercase eyebrows kept
(sanctioned). WARN #2 fixed: ASCII ` -- ` separators and the U+00B7 middle dot
removed from copy.json + layout.tsx title template (` | `).

**Re-sweep (the exact gate the verdict named), independent live CDP
computed-font-size pass, `?motion=0`, over ALL 7 routes:**

| route | sub-16 body violations |
|---|---|
| `/` | 0 |
| `/install/` | 0 |
| `/privacy-policy/` | 0 |
| `/terms/` | 0 |
| `/refunds/` | 0 |
| `/thanks/` | 0 |
| `/404/` | 0 |

Only the 12px uppercase eyebrows remain (allowed). Clean `next build` green,
`tsc --noEmit` clean, banned-separator grep clean. Evidence screenshot:
`fix-home-desktop.png`.

The blocking condition stated above ("Issue #1 fixed and the sub-16 sweep re-runs
clean") is now SATISFIED. Remaining items are non-blocking and owned by devops at
deploy time: WARN #3 (self-host fonts OR confirm CI reaches Google Fonts),
NOTE #4 (`npm rm lucide-react`), NOTE #5 (Inspector `#ffffff`, dev-only),
NOTE #6 (launch placeholders: real .dmg size, App Store URL, socials).

**Net status: all blocking work cleared. Ready for a judge re-review to record the
formal PASSED flip, then devops deploy.** Per doctrine the user is not shown the
result as final until the judge issues PASSED.

Screenshot note: this sandbox's headless Chrome 148 returns 0-byte rasters from
`Page.captureScreenshot` (an environment limitation, not a site defect), so I could
not save `judge-*.png`. My eval-based CDP assertions returned complete, correct data
and ARE my independent live evidence; the visual layout was additionally
cross-checked against the soldier's in-repo screenshots, which the CDP geometry
corroborates (no overflow, all sections present, correct chip data).

---

## Issues

| # | Severity | What | Spec/Doctrine | Evidence (measured) | Fix |
|---|---|---|---|---|---|
| 1 | **FAIL** | Body text under 16px in 16 elements | Doctrine A3 + prompt: "16px minimum body; 12px ONLY for uppercase eyebrows" | Live CDP computed-fontSize sweep, home @1440, `?motion=0`. **14px** (`text-[0.875rem]`): all 6 Features `detail` lines (`src/components/sections/Features.tsx:66`) e.g. "Uses Apple Vision VNRecognizeTextRequest...", "Works in Safari, Chrome, Arc...". **15px** (`text-[0.9375rem]`): Pricing tier `note` x2 + 3 footnote `<li>` (`Pricing.tsx:88,111`); Footer 2 social pills + newsletter note (`Footer.tsx:55,104`); CookieConsent "Accept"/"Decline" buttons. None are uppercase eyebrows; all are body copy. Also (source) /install "to be confirmed" = 13.6px `text-[0.85rem]`; PageShell meta line 15px. Keycap.tsx:18 (14px mono keystroke chip) is a literal control glyph not body text — NOT failed, but bump it for a zero-sub-16 page. | Raise every sub-16 body utility to `text-base` (16px): `Features.tsx:66`, `Pricing.tsx:88,111`, `Footer.tsx:55,104`, `CookieConsent.tsx` buttons, `PageShell.tsx` meta, `install/page.tsx`. Features detail can stay mono but at 16px. Re-run the CDP sub-16 sweep over home + all 5 standalone pages and confirm 0 violations outside the 12px uppercase eyebrows. |
| 2 | WARN | `--` ASCII double-hyphen + `·` middle-dot in user-visible strings | voice.md §5 / CORRECTIONS.md flagged it; wired verbatim anyway | `content/copy.json`: hero.eyebrow `macOS 13+  --  v1.0  --  Works offline` (L14); hero.primaryCta.note `Apple Silicon and Intel  --  Direct download, DMG` (L19); meta.titleTag (L336) + meta.ogTitle (L338) `Quirky -- ...`. Plus `src/app/layout.tsx:24` title template `%s · Quirky` uses a U+00B7 middle dot (a banned glyph, here as a title separator). | Copywriter: replace ` -- ` with comma/period (NOT a middle dot, also banned): `macOS 13+, v1.0, works offline`; `Apple Silicon and Intel. Direct download, DMG`; `Quirky: Five screen extraction modes...`. Change the layout title template `·` to ` | ` or ` - `. |
| 3 | WARN | `next/font/google` Manrope fetched at build | offline/CI determinism | `layout.tsx` loads Manrope via `next/font/google`. Builds passed 6x here (network/cache available); a CI runner without access to fonts.googleapis.com would fail the GH Pages build. | Devops: confirm CI can reach Google Fonts at build, OR self-host via `next/font/local`. Not blocking locally. |
| 4 | NOTE | `lucide-react` unused dependency | "no icon libraries" | In package.json deps, imported **nowhere** in `src/` (grep = 0). Not in the shipped bundle; all icons are inline SVG. | Devops: `npm rm lucide-react` before tagging. |
| 5 | NOTE | `#ffffff` in Inspector overlay | one-accent / palette | Two `#ffffff` literals in `devtools/Inspector.tsx` (panel bg/border). Dev-only, never in the prod bundle. | Optional: swap to `--color-paper`. |
| 6 | NOTE | Launch placeholders (correctly NOT invented) | honesty | Real .dmg size ("to be confirmed"), Mac App Store URL (apps.apple.com), social URLs, refund-window / governing-law are placeholders. | Kostya/devops fill before public launch. Does not block staging. |

---

## CRITICAL gates — all PASS (measured this pass)

### Build stability — PASS
`rm -rf .next out && npm run build` run **6 times clean**: EXIT 0 every time,
`grep -c Html` = **0**. Run 1 printed the full route table; Run 2 `out/` had
`404.html`, `index.html`, `install/`, `privacy-policy/`, `refunds/`, `terms/`,
`thanks/`, `_next/`; Runs 3-6 `pass=4 fail=0`. The `/404` `<Html>` export flake
(BUILD_FLAKE.md) is fixed and holding via `src/app/global-error.tsx` (0 failures /
6 consecutive clean builds). GH Actions retry belt-and-braces NOT needed.

### Hero "Capture Fan" — PASS (live CDP)
Live `fanTexts` = `["Tab","Get started","#3D9DF2","button.cta","icon.svg",
"184 x 48"]` — the 5 data-chips (OCR/HEX/DOM/SVG/SPX) with neutral data values +
the Tab keycap. **HEX swatch computed fill = `rgb(61, 157, 242)` (#3D9DF2),
confirmed NOT coral** (`hexSwatchBlueFound: true`; chip fills measured
`rgb(255,244,241)` subtle, `rgb(253,252,250)` paper, `rgb(61,157,242)` blue — no
coral fill on the swatch). Chip chrome/marquee/keycap use the single coral accent.
Entry = opacity/blur/y/scale, EASE `[0.16,1,0.3,1]`, no bounce. `?motion=0` renders
final state (`dataMotion: off`, content present, loops frozen).

### All 11 home sections present + populated — PASS (live CDP)
`missingComponents: []`. Live DOM data-component set:
`Nav, BlobObject, Button, Hero, EyebrowLabel, CaptureFan, ModeRail, HowItWorks,
Keycap, Features, Workflows, Fits, Pricing, Faq, FinalCta, Footer, CookieConsent`.
`sectionsWithAllAttrs: []` (no root section missing any data-* attr). Each section
consumes copy.json verbatim, correct id anchors, correct order per HANDOFF.

### App-Store honesty at every download CTA — PASS (copy + live)
Live text scan: `appStoreHonestyMentions: 4`, `appStoreOcrHexSpx: 6`. Verified
present at Hero (both CTA notes), Fits item 6, Pricing Pro note + footnote 1,
FinalCta (both notes), Footer Download column ("Direct download (all 5 modes)" /
"Mac App Store (OCR, HEX, SPX)"), and /install. No CTA implies all five modes on
the App Store.

### Pricing — PASS (live CDP + copy + source)
`pricingTierNames: ["Quirky","Quirky Pro"]`, `pricingText1699: true`,
`pricingFree: true`. Exactly 2 tiers, Free = OCR+HEX+SPX, Pro adds DOM+SVG, pill
CTAs, footnotes carry App-Store split + one-time + 30-day refund. Frame "a friend
does not send you a monthly bill" present.
NOTE: my probe's `pricingHasMonthly: true` is a **confirmed false positive** — the
regex matched the word "monthly" inside the anti-subscription frame copy ("does not
send you a monthly bill"). Source read of `Pricing.tsx` confirms **no billing
toggle and no per-month price exist**. Pricing is one-time only, as required.

### Copy doctrine sweep — PASS
`content/copy.json`, `src/content/copy.ts`, all `src/`, and rendered `out/*.html`:
- em-dash U+2014 / en-dash U+2013 / middle-dot U+00B7 / bullet U+2022 / ellipsis
  U+2026: **0 hits in copy** (dash hits in `src/*.tsx` are JS comments only; the
  one `·` in layout.tsx title-template is flagged as WARN #2).
- exclamation marks in copy values: **0**. emoji: **0**.
- banned words (full list incl. harness/unleash/elevate/game-changer/swiss army):
  **0** in copy.json and **0** in rendered HTML.
- The only `--` user-string sequences are the ASCII double-hyphens in WARN #2.

### One-accent rule — PASS (source + live)
`accentVar: #ff7059` (single accent). Source hex scan returns ONLY the coral
5-step + warm neutral ramp + the documented grabbed-blue `#3d9df2`. Live
`coralBodyViolations: []` — no base coral `rgb(255,112,89)` used as body text under
24px anywhere. Coral text uses `--color-accent-pressed` (#DB4733); eyebrows are
accent-pressed on accent-soft; white-on-coral CTA fill. The only out-of-palette
literal is `#ffffff` in the dev-only Inspector (NOTE #5).

### Responsive — PASS (live CDP, desktop)
1440: `scrollWidth == clientWidth == innerWidth == 1440`, `noHorizOverflow: true`.
Source: Nav collapses to a mobile disclosure panel (no fixed overlay); grids
reflow `lg:3 -> sm:2 -> 1`; CTAs stack `sm:flex-row`. (390px live overflow probe
did not return cleanly due to the headless screenshot/nav instability noted above;
the 1440 result + the source breakpoints + the soldier's mobile screenshot all
indicate no overflow. Devops should spot-confirm 390 `scrollWidth==innerWidth` once
in a healthy environment after the Issue #1 fix — low risk.)

### Motion — PASS (source + live)
Single easing `cubic-bezier(0.16,1,0.3,1)` everywhere (EASE_OUT const + inline +
FAQ glyph + Nav). No bounce/overshoot. `?motion=0` confirmed live (`dataMotion:
off`, content rendered, loops frozen via `:root[data-motion=off]` rules). Reduced-
motion branches in Reveal / CaptureFan / Faq / FinalCta.

### Doctrine structure — PASS (source)
- `lucide-react` imported nowhere; all icons inline SVG (NOTE #4).
- Borders as separators throughout (`border-gray-200` + the hairline-grid wrapper).
- Pill CTAs, one accent, `transition-colors duration-150`, `focus-visible:ring-2
  ring-accent ring-offset-2`, `active:bg-accent-pressed`.
- EyebrowLabel `inline-flex w-fit self-start ... uppercase` — the template-design
  flex-stretch RETRO fix is applied.
- Manrope via tokens (sanctioned product-truth deviation). Mono only on Keycap +
  Features detail lines.
- Global focus-visible policy (2px accent ring, 2px offset) in globals.css.
- Inspector mounted dev-only in `layout.tsx` (reads metaKey/ctrlKey + click +
  data-* attrs). Cookie consent = `ConsentProvider` strict opt-in + `reopen()`
  wired to footer "Cookie preferences". CookieConsent IS in the live DOM
  (data-component measured). Newsletter is a flagged non-wired placeholder.

---

## Standalone pages — PASS (source + copy)
Single `PageShell` family (privacy / terms / refunds / thanks / install / 404),
each rendering copy.json `standalone.*` verbatim, with the "Quirky" mark as the
back-home affordance, left-aligned, on-voice. All export cleanly (route table +
`out/` dirs confirmed). (Per-page live overflow/sub-16 re-sweep folds into the
Issue #1 re-run; the /install 13.6px line is already named in Issue #1.)

---

## Bottom line for devops
**Do not deploy.** One blocking FAIL: raise all sub-16px body text to >=16px
(Issue #1: 6x Features detail @14px, Pricing notes/footnotes + Footer social/
newsletter + CookieConsent buttons @15px, /install @13.6px). Every other gate — 6
green builds, copy sweep, one-accent, HEX-blue-not-coral, pricing one-time,
App-Store honesty x6, all 17 components present, 1440 no-overflow, motion=0,
strict-opt-in consent in the DOM — passed and was independently measured via CDP.
Clear Issue #1, re-run the sub-16 sweep clean, and ideally clear WARN #2/#3, and
this is **PASSED**.

---

## RE-REVIEW 2026-06-01 (judge incremental pass) — VERDICT: PASSED

**Scope:** Independent incremental re-verification of the two cleared items only
(Issue #1 sub-16 body, WARN #2 separators) plus a no-regression smoke. Did not
re-litigate gates already measured PASS on the first pass.

**Method (my own, not trusting prior numbers):** 2 fresh clean builds
(`rm -rf .next out && npm run build`), static export served via `npx serve out -l
4321`, headless Chrome 148 driven over CDP, my own computed-`fontSize`
TreeWalker sweep over all 7 routes at 1440 with `?motion=0`, plus source + rendered
`out/*.html` greps.

### Build — PASS
Both builds EXIT 0. `grep -c "Error: <Html>"` = **0** (build #2 log). All 7 routes
exported: `index.html`, `404.html`, `install/`, `privacy-policy/`, `terms/`,
`refunds/`, `thanks/` (+ `_next/`). The only lint output is one unused-var warning
in `global-error.tsx` (non-blocking).

### Issue #1 (sub-16 body) — PASS, RE-MEASURED CLEAN ON ALL 7 ROUTES
My independent computed-fontSize sweep, `?motion=0`, font-size < 16px counted,
uppercase elements (the sanctioned 12px eyebrows) excluded:

| route | body sub-16 violations | sub-16 elems (all uppercase eyebrows) |
|---|---|---|
| `/` | **0** | 16 |
| `/install/` | **0** | 1 |
| `/privacy-policy/` | **0** | 1 |
| `/terms/` | **0** | 1 |
| `/refunds/` | **0** | 1 |
| `/thanks/` | **0** | 1 |
| `/404/` | **0** | 1 |

Every remaining sub-16 element was dumped and verified: all are 12px, `text-transform:
uppercase`, weight 600, with letter-spacing — i.e. sanctioned eyebrow labels, not
body copy. The 14px Features mono detail lines, 15px Pricing/Footer/Consent/PageShell
notes, and the 13.6px /install file-size line named in the original FAIL are all gone
(now >=16px). Issue #1 is conclusively resolved.

### WARN #2 (banned separators) — PASS, GONE
- `content/copy.json` + `src/content/copy.ts`: **0** hits for U+2014 / U+2013 /
  U+00B7 / U+2022, and **0** ASCII ` -- `.
- Rendered `out/*.html`: **0** banned glyphs, **0** ASCII ` -- ` in user-facing text.
- `src/app/layout.tsx` title template is now `"%s | Quirky"` (the U+00B7 middle dot
  is removed).

### No-regression smoke — PASS
- Live `document.title` = **"Quirky: five screen extraction modes, one hotkey."**
  (proves the copy.json titleTag edit is live and the ASCII ` -- ` is replaced with a
  colon). Live hero eyebrow now renders "macOS 13+, v1.0, works offline".
- All **17** data-components present in live DOM; hero renders; 9 `<section>` nodes.
- One-accent intact: single `--color-accent: #ff7059` + its derived ramp in
  `tokens.css`; no second brand color.
- HEX-not-coral intact: grabbed-blue `#3D9DF2` / `--color-captured-blue` live in
  rendered HTML (the prior authoritative CaptureFan probe measured the swatch fill as
  `rgb(61,157,242)`; this corroborates — no coral regression on the swatch).

### VERDICT: PASSED

The single blocking FAIL and the WARN flagged in the first pass are both cleared and
independently re-measured clean across all 7 routes and two green builds. Remaining
items are non-blocking devops/launch tasks, NOT reasons to withhold PASSED: WARN #3
(self-host fonts OR confirm CI reaches Google Fonts), NOTE #4 (`npm rm lucide-react`),
NOTE #5 (Inspector dev-only `#ffffff`), NOTE #6 (launch placeholders: real .dmg size,
App Store URL, social URLs). The FRIEND creative direction (toy/soft/blobby) is the
intended design, not a defect.

**Devops is cleared to deploy.**

Screenshot note: this sandbox's headless Chrome 148 still returns 0-byte rasters from
`Page.captureScreenshot`, so the evidence is CDP computed-style assertions (complete,
correct JSON returned), as on the first pass — consistent with the prompt's stated env
limitation.

---

## MORPH REVIEW 2026-06-01 (judge incremental) — VERDICT: ISSUES (1 FAIL)

**Scope:** ONLY the new signature scroll-pinned morph layer
(`src/components/morph/{MorphMount,MorphJourney,MorphForms,useMorphEnabled}`,
`page.tsx` mount, `globals.css .morph-handoff` + `:root[data-morph=on]`,
`Hero.tsx` / `FinalCta.tsx` handoff wrappers) + a no-regression check that the
morph did not break the previously-PASSED static site. Did not re-litigate gates
already measured PASS unless the morph could plausibly have broken them. The
user's "maximum interactivity, one block flies and turns into interface/buttons"
override and Webflow-dropped-for-this-piece are in force and NOT treated as defects.

**Method (my own, not trusting soldier numbers):** clean `rm -rf .next out &&
npm run build` (EXIT 0, 0 `<Html>`, all 7 routes), served the STATIC `out/` export
via `npx serve out -l 4321` (per the soldier's own warning that the dev server
lazy-compiles and false-positives), drove headless Chrome 148 over CDP. Screenshots
were NON-zero this pass (env limitation lifted): `/tmp/aisoldier-judge/morph/hero-on.png`
saved, and the soldier's `morph-desktop-0.png` independently corroborates the
measurement.

### VERDICT: ISSUES — 1 FAIL (blocks the morph's PASSED flip)

The motion-off backbone, no-bounce, one-accent, no-duplicate-block, CLS=0, mobile,
and copy gates are ALL measured clean. The single blocker is a real visual defect at
the two highest-value frames: **the hero device and the final-CTA device both render
at ~0.32 opacity AT REST** (not a first-frame flicker — a steady state), with the
static fallback fully suppressed. This is risk (d) escalated by measurement.

| # | Severity | What | Expected | Actual (measured) | Fix |
|---|---|---|---|---|---|
| M1 | **FAIL** | Hero morph form AND final-CTA morph form sit at **opacity 0.323 at rest** at the top fold (scrollY 0..300) and the bottom fold (scrollY == scrollMax), while the static CaptureFan they replace is fully hidden (`.morph-handoff` opacity 0). So both bookend devices land as a washed-out ghost — the chips, dashed marquee, and download form are ~1/3 visible at the two most-seen, highest-conversion frames. | Endpoint forms opaque (≈1.0) at rest; the cross-fade should only dim a form while another is taking over, never leave the resting hero/final at 32%. | `hero_rest.js`: `heroStageOpacity 0.323`, `handoffOpacity [0,0]`, `totalBlockOpacity 0.323` @ scrollY 0. `hero_ramp.js`: 0.323 held flat across scrollY 0,30,60,120,200,300. `final_rest.js`: `finalStageOpacity 0.323`, `handoffOpacity [0,0]` @ scrollY==scrollMax==7408. Visually confirmed in `morph-desktop-0.png` (right-column chips ghostly). Root cause: `MorphJourney.StageForm` opacity ramp `[c-h, c-0.4h, c+0.4h, c+h]->[0,1,1,0]` with band centre `(i+0.5)/7` never reaches 1 at journey 0 (hero, i=0) or journey 1 (final, i=6), compounded by the `journey [0.04,0.92]` lead-in/out trim. | In `MorphJourney.tsx` clamp the FIRST and LAST stage forms to full opacity at the journey extremes: for `index===0` make opacity `1` for `journey <= centre` (only fade as the NEXT stage arrives), and for `index===N-1` make opacity `1` for `journey >= centre`. Simplest: special-case endpoints to `useTransform(journey,[c-h,...],[1,1,1,0])` (head) and `[0,1,1,1]` (tail). Re-measure `heroStageOpacity` and `finalStageOpacity` == 1.0 at rest; confirm mid-journey cross-fades unchanged. |

### Risk dispositions (the soldier's 4 self-flags)

- **(a) motion=0 / reduced-motion static integrity — PASS (the load-bearing gate).**
  CDP sweep on the STATIC export, `?motion=0`, all 7 routes, BOTH 1440 and 390:
  `dataMorph: null`, `morphOverlayPresent: false`, `blankSections: []`,
  sub-16 body `0` on every route, `scrollWidth == innerWidth` (overflow 0), and the
  static `.morph-handoff` devices VISIBLE (`handoffOpacities ["1","1"]`,
  `handoffVisible true`) — the fallback is intact, devices not stuck hidden. Full
  17-component DOM present on home. Table below.

  | route | overlay | dataMorph | blank | sub-16 body | overflow(1440/390) | handoff visible |
  |---|---|---|---|---|---|---|
  | `/` | absent | null | 0 | 0 | none / none | yes (1,1) |
  | `/install/` | absent | null | 0 | 0 | none / none | n/a |
  | `/privacy-policy/` | absent | null | 0 | 0 | none / none | n/a |
  | `/terms/` | absent | null | 0 | 0 | none / none | n/a |
  | `/refunds/` | absent | null | 0 | 0 | none / none | n/a |
  | `/thanks/` | absent | null | 0 | 0 | none / none | n/a |
  | `/404/` | absent | null | 0 | 0 | none / none | n/a |

- **(b) CLS — PASS.** `cls.js` (PerformanceObserver layout-shift, buffered, scrolled
  full page): **CLS = 0** motion-ON @1440 (`dataMorph on`), **0** motion-OFF @1440,
  **0** motion-ON @390. The overlay is `position: fixed`, reserves no layout space.

- **(c) FAQ pass-through — PASS, NOTE-level visual.** `faq_passthrough.js`: overlay
  `pointer-events: none` confirmed computed; `elementFromPoint` at the RIGHT edge of
  4 FAQ toggles (where the final form overlaps) returns `BUTTON` inside
  `data-component="Faq"` for all 4, `blockedByOverlay: false`, `anyBlocked: false`.
  Clicks reach the toggles. The visual overlap of a decorative aria-hidden form over
  FAQ chrome is acceptable given it cannot intercept input; NOTE, not blocking. (If
  the M1 fix touches the late-stage opacity, re-confirm the band over FAQ stays
  unobtrusive.)

- **(d) hero first-paint chip opacity — ESCALATED to FAIL (M1 above).** This is not a
  transient first-frame flicker that settles; it is a steady-state 0.323 at rest
  across the whole hero fold AND symmetrically at the final CTA fold. Because the
  static device is suppressed under `data-morph=on`, there is no opaque fallback
  underneath. The most-viewed frame opening at one-third opacity is a quality FAIL,
  not acceptable polish.

### No-regression (morph did not break the PASSED static site) — PASS

- **No duplicate block — PASS.** Motion-ON @1440: `dataMorph "on"`, overlay present,
  `.morph-handoff` static devices `opacity ["0","0"]` + `pointer-events ["none","none"]`
  — exactly ONE block. Motion-OFF and mobile: handoff devices `opacity 1`, overlay
  absent — the static device is the one block. Handoff CSS keyed on `data-morph=on`
  only, so reduced-motion (which never sets the attr) shows the static device.
- **One accent / HEX-not-coral — PASS.** Overlay chrome `coralChromeFound true`
  (`rgb(255,112,89)` / `rgb(219,71,51)` only); HEX swatch `blueHexFound true`
  (`rgb(61,157,242)` = #3D9DF2) in hero, modes, and mid-journey stages. No second
  brand color introduced by the morph.
- **No bounce / one easing — PASS.** Source grep: zero `spring/useSpring/stiffness/
  damping/bounce/repeatType/mirror/overshoot` in `src/components/morph/`. Only
  `EASE_OUT = [0.16,1,0.3,1]` and inline `cubic-bezier(0.16,1,0.3,1)`.
- **Copy / doctrine — PASS.** Overlay root + every Frame `aria-hidden="true"`
  (decoration, not the accessible source). Visible strings are the already-vetted
  data values ("Get started", "#3D9DF2", "button.cta", "icon.svg", "184 x 48",
  "All five modes") + `copy.*` fragments (mode ids, Pro price/CTA, workflow stories) —
  no NEW user-facing copy, 0 banned words, 0 exclamation/emoji, no em-dash/middle-dot
  in user text (the dashes grep-hit are JS comments / the `!` is a JS operator).
  App-Store honesty + one-time pricing untouched (morph reads the same copy.json).
- **Build — PASS.** `npm run build` EXIT 0, 0 `<Html>`, all 7 routes exported; the
  `ssr:false` dynamic boundary keeps MorphJourney out of the SSR HTML
  (`grep MorphJourney out/index.html` = 0) and out of the motion-off path.

### Bottom line
Fix M1 (clamp the hero + final endpoint forms to full opacity at rest; it is a
localized change in `MorphJourney.StageForm`), re-measure `heroStageOpacity` and
`finalStageOpacity == 1.0` at scrollY 0 and scrollY==max, and this morph layer flips
to PASSED. Everything else — motion=0 integrity on all 7 routes, CLS 0 on/off/mobile,
no duplicate block, one accent, HEX-blue, no bounce, mobile overlay-absent, FAQ
clicks pass through, no copy regression — is measured clean. The static site's prior
PASSED state is NOT regressed.

---

## MORPH RE-REVIEW 2026-06-01 (judge incremental) — VERDICT: PASSED

**Scope:** Verify the single blocking FAIL (M1) from the MORPH REVIEW is fixed, and
that the fix introduced no regression to the morph PASS set or the static site. Did
not re-litigate gates already measured PASS unless the M1 edit could plausibly have
broken them.

**Method (my own, independent):** clean `rm -rf .next out && npm run build`
(EXIT 0, `grep -c "Error: <Html>"` = 0, all 7 routes exported: `index`, `404`,
`install`, `privacy-policy`, `terms`, `refunds`, `thanks`). Served the STATIC `out/`
export via `npx serve out -l 4321`, drove headless Chrome 148 over CDP at 1440,
**motion ON** (`data-morph` = `on`) for the morph itself, and `?motion=0` at 1440 + 390
for the backbone. Probes: `hero_rest.js`, `hero_ramp.js`, `final_rest.js`,
`mid_journey.js` (new), `motionoff_check.js` (new).

### The fix (verified in source)
`MorphJourney.tsx StageForm` (lines 189-218): `isFirst` (index 0, hero) overrides the
in-ramp lead-in stops to `-2/-1` with `outVals[0]=outVals[1]=1` → holds opacity **1 from
journey 0** through its plateau; `isLast` (final CTA) overrides the out-ramp stops to
`2/3` with `outVals[2]=outVals[3]=1` → holds **1 through journey 1**. Other stages'
`[0,1,1,0]` cross-fade band is untouched.

### M1 — FIXED, RE-MEASURED CLEAN (motion ON, the gate)
| frame | stage form opacity AT REST | others | data-morph |
|---|---|---|---|
| hero, scrollY 0 | **1.0** (was 0.323) | all 0 (`[1,0,0,0,0,0,0]`) | on |
| hero fold ramp (scrollY 0,30,60,120,200,300) | **1.0 held flat** (was 0.323 flat) | n/a | on |
| final CTA, scrollY 7408 == scrollMax | **1.0** (was 0.323) | all 0 (`[0,0,0,0,0,0,1]`) | on |

Both bookend devices are now fully opaque at the two highest-conversion frames; the
one-third ghost is gone. `handoffOpacity [0,0]` confirms the static device stays
suppressed under `data-morph=on` (still exactly one block, no double-render).

### No regression — PASS
- **Mid-journey cross-fade intact (NOT stuck at 1).** `mid_journey.js` @ scrollMax
  fractions: f=0.2→`[0,1,0,0,0,0,0]` (modes), f=0.35→how, f=0.5→features, f=0.65→
  workflows ramping `0.72`, f=0.8→two forms blending `[...,0.202,0.444]` (`partial=2`).
  Crucially `first=0` and `last` only rises to `0.444` mid-journey — the endpoint clamp
  releases away from the extremes, so the progression still travels and cross-fades; it
  is not globally pinned. The final form reaches 1.0 only at the true bottom.
- **motion=0 overlay still ABSENT + static intact (the M1 edit did NOT leak the morph
  into motion-off).** `?motion=0` @1440 and @390: `dataMorph: null`,
  `overlayPresent: false`, `sub16BodyViolations: 0`, `noHorizOverflow: true`
  (`scrollWidth==innerWidth`), static `.morph-handoff` devices `opacity ["1","1"]`
  (fallback visible, not stuck hidden), 61 `data-component` nodes present.
- **One accent / no bounce / no copy change.** `--color-accent: #ff7059` (LOCKED, single
  accent); morph easing `cubic-bezier(0.16,1,0.3,1)` only, zero spring/stiffness/damping/
  bounce primitives (the two grep hits are doc-comment lines stating "no bounce").
  Rendered `out/index.html` title = "Quirky: five screen extraction modes, one hotkey.",
  0 banned glyphs (— – · •), 0 ASCII ` -- ` — copy untouched by the opacity-stops edit.
- **Build — PASS.** EXIT 0, 0 `<Html>`, 7 routes.

### VERDICT: PASSED

M1 is conclusively resolved and independently re-measured: **hero stage opacity 1.0 at
rest, final stage opacity 1.0 at rest** (both were 0.323), with no regression — mid-
journey still cross-fades, motion=0 still shows the overlay absent and sections static,
one accent / no bounce / no copy change all hold. The whole site (static + morph) is
cleared for devops to deploy. The non-blocking items remain non-blocking and are NOT
reasons to withhold PASSED: WARN #3 (self-host fonts / confirm CI Google Fonts), NOTE #4
(`npm rm lucide-react`), NOTE #5 (Inspector dev-only `#ffffff`), NOTE #6 (launch
placeholders). The FAQ-overlap NOTE from the MORPH REVIEW is unaffected: the late-stage
band reaching 1.0 only at the absolute bottom (final CTA fold, below FAQ) keeps the
overlay over FAQ unobtrusive, and the overlay remains `pointer-events: none`.

**Devops is cleared to deploy the whole site (static + morph).**

---

## Artifacts
- Re-review build log: `/tmp/qk-rereview-build.log` (EXIT 0, 0 Html, 7 routes).
- Re-review CDP probes: `/tmp/qk-cdp/hero_rest.js`, `hero_ramp.js`, `final_rest.js`,
  `mid_journey.js`, `motionoff_check.js` (run via `drive2.mjs`, Chrome 148 @1440/390).
- Morph build log: `/tmp/qkmorph-build.log` (EXIT 0, 0 Html, 7 routes).
- Morph CDP probes: `/tmp/qk-cdp/morph_motionoff.js`, `morph_on.js`, `cls.js`,
  `faq_passthrough.js`, `firstframe.js`, `hero_rest.js`, `hero_ramp.js`,
  `final_rest.js`, `pricing_stage.js` (run via `drive2.mjs`).
- Judge screenshot (non-zero this pass): `/tmp/aisoldier-judge/morph/hero-on.png`.
  Corroborated by the soldier's `morph-desktop-0.png` (hero device visibly ~1/3 opacity).
- Build logs: `/tmp/qkbuild1.log`, `/tmp/qkbuild2.log` (EXIT 0, 0 Html).
- Live CDP result (authoritative): `/tmp/qk-cdp/home_result.txt` (full JSON).
- CDP harness (Node-22 built-in WebSocket, Chrome-148 PUT-corrected):
  `/tmp/qk-cdp/drive2.mjs` + `assert_home.js` / `probe2.js` / `probe_legal.js` /
  `probe_dev.js` / `probe_consent.js`.
- Screenshots: headless `Page.captureScreenshot` returns 0-byte rasters in this
  sandbox (Chrome 148 limitation), so `judge-*.png` could not be saved this pass;
  the soldier's in-repo screenshots (`qk-home-desktop.png` etc.) corroborate the
  CDP geometry but are not relied on for the verdict.

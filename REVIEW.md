# Review — Quirky landing (first-pass full QA)

> SOUL PASS S1 RESOLVED 2026-06-01 (main-loop): the SOUL PASS REVIEW's single
> blocker (visible hyphen-compounds right-click + mid-capture) is fixed in
> copy.json (right-click -> digging, mid-capture -> while capturing). Independent
> re-verification: visible-text hyphen-compound sweep across all 7 rendered routes
> returns ZERO; 0 exclamation marks in visible prose; JSON valid; clean build
> green. Everything else in the SOUL PASS REVIEW already measured PASS. Cleared
> for redeploy.

> REDESIGN ISSUE #1 RESOLVED 2026-06-01 (main-loop): the V0.4 REDESIGN REVIEW's
> single blocker (hyphen-as-dash compounds in visible prose: on-device,
> click-through, reverse-engineer x2, mid-capture) is fixed in copy.json.
> Independent re-verification: a visible-text hyphen-compound sweep (scripts/style
> stripped) across all 7 rendered routes returns ZERO compounds; remaining
> copy.json hyphens are href slugs + metadata only. JSON valid, clean next build
> green. Everything else in the V0.4 REDESIGN REVIEW already measured PASS (zero
> old coral, dark sections AA-legible 4.67-18.77, motion=0 static on all 7 routes,
> App-Store honesty visible, $16.99, massive scale, no chips, build green). The
> redesign blocking condition is now SATISFIED. Cleared for redeploy.

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

---

# V0.4 REDESIGN REVIEW 2026-06-01

**Reviewer:** 3mpq-judge
**Scope:** full review of the v0.4 REDESIGN (new accent, light/dark rhythm, fewer
+ bigger sections, meaningful animation) against CORRECTIONS.md "REDESIGN
DIRECTIVE" + "REDESIGN REFINEMENT", CHANGELOG v0.4 entry, COPY_AUDIT, copy.json.
**Method:** two clean `rm -rf .next out && npm run build` runs, static `out/`
served under `/quirky-landing` basePath (symlink) on :4321, independent Playwright
CDP over all 7 routes at `?motion=0` (390 + 1440), dark-section computed-color
contrast, morph motion-ON, plus rendered-HTML / CSS / JS-bundle greps. Own
screenshots saved (non-zero rasters this pass).

## VERDICT: ISSUES (1 item, severity FAIL by the brief's own PASSED bar)

Everything the user asked for in the redesign is delivered and measures clean,
**except the "NO dashes at all, no hyphen used as a separator or as a dash"
requirement** (REFINEMENT item 4), which is violated in user-visible prose by
hyphenated compound modifiers the copy sweep missed. The brief lists "no dashes
in prose" as a hard PASSED condition, so this blocks. It is a one-string-each
copy fix, not a build defect; once copy.json is corrected and rebuilt, this
flips to PASSED (no other blocker found).

---

## Per-route motion=0 static integrity (PASS on all 7)

| Route | vw | overflow | sub-16 body | 12px eyebrows | blank sections | morph |
|---|---|---|---|---|---|---|
| / | 390 | 0 | 0 | 10 | 0 | none |
| / | 1440 | 0 | 0 | 10 | 0 | none |
| /install | 390/1440 | 0 | 0 | 1 | 0 | none |
| /privacy-policy | 390/1440 | 0 | 0 | 1 | 0 | none |
| /terms | 390/1440 | 0 | 0 | 1 | 0 | none |
| /refunds | 390/1440 | 0 | 0 | 1 | 0 | none |
| /thanks | 390/1440 | 0 | 0 | 1 | 0 | none |
| /404.html | 390/1440 | 0 | 0 | 1 | 0 | none |

- `scrollWidth == clientWidth` at BOTH 390 and 1440 on every route (overflow 0).
- 0 sub-16px body offenders anywhere; the only <16px text is the sanctioned 12px
  uppercase eyebrows.
- 0 blank sections; both DARK sections (#modes, #download) render full content
  with motion off (OCR demo shows resolved "Copied to clipboard", SVG star lifted,
  SPX "184 x 48", HEX "#3D9DF2", proof line, headings, CTAs).
- Morph overlay ABSENT under `?motion=0` on every route (`html[data-morph]=none`,
  no fixed pointer-events-none block).

## Dark-section contrast (home, 1440, computed colors composited over #160C0A)

| Element | color | contrast | bar | result |
|---|---|---|---|---|
| #modes h2 heading | #FDFCFA on #160C0A | 18.77 | >=3 large | PASS |
| #download h2 heading | #FDFCFA on #160C0A | 18.77 | >=3 large | PASS |
| FinalCta secondary GHOST button text ("Get it on the Mac App Store", 16px) | #FDFCFA on #160C0A | 18.77 | >=4.5 body | PASS |
| FinalCta App-Store note (on-dark/60, 16px) | composited 161,156,154 | 7.08 | >=4.5 body | PASS |
| Modes intro / proof (on-dark/70-80, 18px) | composited 184.. / 207.. | 9.35 / 12.04 | >=4.5 body | PASS |
| accent #E63E2E on #160C0A (giant "5" 140px, mode-number labels) | - | 4.67 | >=3 large | PASS |

The two specifically-flagged risks (the ghost/secondary button and its App-Store
note) clear AA comfortably (18.77 and 7.08). The new accent on near-black is
4.67, used only for large display (giant 5, the `0N / id` labels) per tokens.css
discipline note. No dark-text legibility failure anywhere.

## Old coral: GONE (confirmed at every layer)

- `src/` grep for `#FF7059 / #F25742 / #DB4733 / #FFE9E4 / #FFF4F1`: ZERO hits.
  The word "coral" survives only in code comments/docstrings, never as a value.
- Rendered `out/*.html`: ZERO old-coral hexes. CSS bundle: ZERO. JS chunks: ZERO.
- New accent `#E63E2E` present 6x in the CSS bundle; the 5-step (e63e2e/cf3322/
  b82c1d/fce6e2/fef3f0) is the only brand ramp.
- The `#3D9DF2` grabbed-blue sample is present (18 src refs, in HEX demo + morph)
  and correctly retained as sampled data, not brand.
- Banned second colors (forest #217a50, Corder brick #b7443d): ZERO in src + bundles.
- ONE accent rule holds.

## Dash grep result

- Rendered HTML, all 7 routes: ZERO U+2014 em-dash, U+2013 en-dash, U+00B7
  middle-dot, U+2022 bullet. copy.json: ZERO of those + ZERO ` -- ` + ZERO ` - `
  separators. TrustStrip uses a decorative rounded `<span>` accent dot element,
  not a bullet glyph (OK).
- **FAIL source:** hyphen-as-compound-modifier in user-VISIBLE prose, which the
  REFINEMENT explicitly bans ("prefer 'menu bar' not 'menu-bar', rewrite rather
  than hyphenate"):
  - `on-device` -- copy.json:263, faq pair "How does OCR work" answer. CDP
    confirmed VISIBLE on FAQ expand (`on-device visible in FAQ: true`).
  - `click-through` -- copy.json:267, faq pair "Can I measure inside interactive
    UI" answer. CDP confirmed VISIBLE on expand (`click-through visible: true`).
  - `reverse-engineer` x2 -- copy.json:394 + 402, /terms intro + "What you may
    not do". CDP confirmed VISIBLE in rendered /terms (2 occurrences).
  - `mid-capture` -- copy.json:127, features.cells[switcher].body. Bundled but
    NOT rendered (Features grid dropped); not user-visible -> NOTE only, fix for
    hygiene since the key still ships in the page chunk.

## Requirement-by-requirement (the user's explicit redesign asks)

1. New accent, zero old coral: **PASS** (see above).
2. Light/dark alternation, AA-legible: **PASS**. Rhythm reads light(Hero) ->
   DARK(Modes) -> light(How/Trust/Pricing/FAQ) -> DARK(FinalCta). Near-black
   #160C0A. All dark text clears AA.
3. Massive scale: **PASS**. Giant "5" = 140px accent; "#3D9DF2" leaf span = 72px;
   "184 x 48" giant readout with calipers; display headlines clamp to ~104-140px;
   "extraction modes, one capture." and "Press cmd+shift+1 and just take it." land
   oversize with generous air (not crowded).
4. Fewer sections (~5-6): **PASS**. Rendered: Hero, ModesShowcase, HowItWorks,
   TrustStrip, Pricing, Faq, FinalCta. Workflows DROPPED (not imported in
   page.tsx, proof line salvaged into Modes). Fits 6-card grid GONE -> one-line
   TrustStrip. ModeRail chips + Features grid GONE -> merged into ModesShowcase.
5. NO chips, NO captions: **PASS**. Modes shown by animated demos + real verb-
   phrase headings ("Lift the real SVG.", "Measure in pixels.") + `0N / id`
   accent labels. No chip UI, no caption-scale text under elements.
6. NO dashes in prose: **FAIL** (the 1 blocking item above).
7. Spacing rhythm (tight heading->subhead, air before CTA): **PASS** on spot
   checks (Hero: headline->subhead gap tight, `mt-10` before CTA row; FinalCta:
   `mt-4` subhead, `mt-10` before buttons; Modes: tight number->heading).
8. Meaningful animation + resolved motion-off frame: **PASS**. Each demo shows the
   mode doing its job (OCR resolves blurred lines -> Copied; HEX locks #3D9DF2;
   DOM pulls button.cta; SVG lifts the star; SPX extends calipers to 184 x 48).
   Motion ON they animate; motion OFF they render the resolved final frame (CDP:
   0 blank, all demo text present static).

## Guardrails (no regression)

- motion=0 static integrity all 7 routes: **PASS** (table above).
- Build green + stable: **PASS**. Two clean `rm -rf .next out && npm run build`
  runs both green, 10 routes export incl /404 (+ /404.html), 0 Html errors (only
  two non-blocking lint warnings: unused `error` in global-error.tsx, unused
  `Keycap` import in ModesShowcase.tsx -- NOTE, not blocking). basePath
  /quirky-landing intact in asset URLs; favicon `href="/quirky-landing/icon.svg"`.
- Morph motion-ON: **PASS**. `html[data-morph]=on`, 1 fixed pointer-events-none
  overlay block present; bookend child opacity = 1 at TOP (scrollY 0) AND at
  BOTTOM (scrollY 6264) -- the opacity-1-at-extremes fix holds, no one-third
  ghost. Hero + FinalCta static CaptureFan fade under data-morph=on (no duplicate).
- App-Store honesty: **PASS** and visible. Hero note ("Includes OCR, HEX, SPX.
  DOM and SVG require the direct download."), TrustStrip strip line, Pricing Pro
  note + footnote, FinalCta note, /install, FAQ "Why does the App Store version
  not have DOM and SVG". Survived the section cuts.
- Pricing $16.99 one time: **PASS** (rendered in #pricing; "One time. No
  subscription." present). 16px min body: **PASS** (0 offenders). Pneumatic
  easing cubic-bezier(0.16,1,0.3,1), no bounce: **PASS** (EASE_OUT used, no
  spring/overshoot in demos or Reveal).
- Doctrine: data-component/source/tokens on every section root (PASS); Inspector
  dev-gated `process.env.NODE_ENV === "development"` (PASS); borders on dark via
  white/10 hairlines (PASS).

## Issues requiring fix

| # | Severity | What | Expected | Actual | Fix |
|---|---|---|---|---|---|
| 1 | FAIL | Hyphenated compounds used as dashes in user-VISIBLE prose (REFINEMENT item 4 bans these) | "rewrite rather than hyphenate" | `on-device` (copy.json:263, FAQ, visible on expand), `click-through` (267, FAQ, visible), `reverse-engineer` x2 (394+402, /terms, rendered) | Copywriter edits copy.json: "on-device" -> "on device" (or rewrite to "runs on your Mac at high accuracy"); "click-through" -> "click through" (or "the overlay lets your clicks pass through"); "reverse-engineer" -> "reverse engineer" (both lines). Then `rm -rf .next out && npm run build`. Re-grep `grep -noE '[a-z]+-[a-z]+' content/copy.json` -> only href anchors (#how-it-works, /privacy-policy) and `cmd+shift+1` plus-strings may remain. |
| 2 | NOTE | `mid-capture` (copy.json:127, features switcher) ships in the page JS chunk though the Features grid is unrendered | dash-free everywhere | bundled, not visible | Same fix ("mid capture") while in copy.json, so the page chunk is clean too. |
| 3 | NOTE | Two non-blocking build lint warnings | clean | unused `error` (global-error.tsx:21), unused `Keycap` import (ModesShowcase.tsx:7) | Drop the unused `Keycap` import; prefix `_error` or consume it. Not blocking. |

## Single most important issue

**Issue #1** -- the no-dash directive is violated by `on-device`, `click-through`
(FAQ answers, visible on expand) and `reverse-engineer` x2 (/terms, rendered).
This is the only thing standing between the redesign and PASSED. It is a copy.json
fix (copywriter), one string each, then a rebuild; no layout, color, motion, or
contrast work is required.

## Screenshots (own, non-zero rasters this pass)

- /tmp/quirky-judge/dark-modes.png (Modes header: giant red "5", oversize
  headline, OCR resolved demo)
- /tmp/quirky-judge/dark-finalcta.png (FinalCta: cmd+shift+1 keycap headline,
  ghost button legible, CaptureFan handoff device)
- /tmp/quirky-judge/modes-deep.png (SVG lift + giant "184 x 48" SPX readout)
- /tmp/quirky-judge/hero.png (light hero)
- /tmp/quirky-judge/mobile-hero.png (390, single column, no overflow)

## CDP harness

- /tmp/quirky-judge/probe.mjs (7-route motion=0 + dark contrast + morph)
- /tmp/quirky-judge/probe2.mjs (FAQ-expand dash visibility + morph bookend opacity)
- /tmp/quirky-judge/probe3.mjs + probe4.mjs (scale moments, eyebrow contrast, $16.99)

---

# CAPITAL REBUILD REVIEW 2026-06-01

**Reviewer:** 3mpq-judge
**Scope:** from-scratch restructure to HEADER + 3 sections + FOOTER, morph removed,
interactive ModeSwitcher hero (CORRECTIONS.md "CAPITAL REBUILD" spec).
**Method:** independent clean build x2 + tsc + headless Chrome CDP over the static
`out/` export served under basePath, 7 routes, motion=0 and motion ON, 1440 + 390.
**VERDICT: PASSED** — gate cleared for redeploy.

## Headline answers

- **Section count:** exactly 3 content `<section>` in `<main>` (#top Hero, #modes
  Modes, #pricing Pricing) + `<nav>` header + `<footer>`. CDP `main > section`
  count = 3 at both 1440 and 390. Not 6. page.tsx renders Nav, Hero, Modes,
  Pricing, Footer only.
- **Switcher motion-off non-blank:** at `?motion=0`, panel default textContent =
  `"Get started / Copied to clipboard / Recognized text, copied to clipboard"`
  (len 69) at **1440 AND 390**. Clicking HEX with motion off switches the panel to
  `#3D9DF2 / Copied to clipboard / Sampled pixel color...` and aria-selected moves.
  `prefers-reduced-motion: reduce` emulation: panel len 69, same OCR default. Zero
  blank in every motion-off condition.
- **Morph gone:** `grep -rn "morph|data-morph|MorphJourney|MorphMount|MorphForms|
  morph-handoff" src/` returns only 3 descriptive COMMENT lines (globals.css:97,
  page.tsx:9, page.tsx:19) noting removal. ZERO functional references. `src/components/morph/`
  dir does not exist. `CaptureFan` gone. Runtime: `html[data-morph]` = null on
  every route; `[data-morph],[data-component*="Morph"]` element count = 0 on every
  route/viewport. No flying/fixed overlay block.
- **Per-route motion=0 (all 7):** /, /install, /privacy-policy, /terms, /refunds,
  /thanks, /404.html — every route overflow 0 (scrollWidth == clientWidth) at BOTH
  390 and 1440; sub-16px body offenders = 0 on every route (only 12px uppercase
  eyebrows remain, allowed); body content non-empty on every route; morph absent.

## Checklist

### Structure (CRITICAL)
- [x] PASS — page.tsx = Nav + main(Hero, Modes, Pricing) + Footer. 5 section files
  total (Nav, Hero, Modes, ModeSwitcher, Pricing, Footer); no ModeRail/Features/
  Workflows/Fits/TrustStrip/HowItWorks/FinalCta/Faq/ModesShowcase/DarkSection-as-section.
- [x] PASS — exactly 3 content sections in main (CDP verified, both viewports).

### Morph removal (CRITICAL)
- [x] PASS — zero functional morph refs in src (comments only). No morph dir.
- [x] PASS — no data-morph on html, 0 morph elements at runtime, no overlay.

### Interactive ModeSwitcher (CRITICAL centerpiece)
- [x] PASS — real WAI-ARIA tablist: role="tablist", 5 role="tab" (OCR/HEX/DOM/SVG/SPX),
  aria-selected on active, roving tabindex (`["0","-1","-1","-1","-1"]` at rest),
  aria-controls -> role="tabpanel".
- [x] PASS — keyboard nav: ArrowRight from OCR moves selection + focus to HEX and
  (after cross-fade) the panel reads `#3D9DF2 / Sampled pixel color, copied`. Home
  returns to OCR. ArrowLeft/Right/Up/Down/Home/End all wired with preventDefault.
- [x] PASS — each tab renders its real result from the same capture: OCR text
  "Get started" + copied; HEX `#3D9DF2` swatch (the sampled blue, NOT brand red) +
  copied; DOM `button.cta` selector + inner text "Get started"; SVG lifted
  `icon.svg` glyph; SPX `184 x 48` with calipers. All confirmed via per-tab CDP click.
- [x] PASS — default resolves first tab (useState(0)); never null; static fallback
  branch (`staticMode = reduce || motionOff`) renders OutputBody directly (no
  AnimatePresence) so motion-off shows real output and click still switches.

### Section 2 informative
- [x] PASS — 5 hairline-bordered rows, each: real `<h3>` name + concrete sentence
  (mode.line) + audience line + real example output (color swatch / measure
  calipers / svg glyph / selector code). DOM + SVG carry "Pro" badge (channel="pro").
  3-step strip (cmd+shift+1, drag a region, Tab) at top. No chips, no captions under blobs.

### Section 3 pricing
- [x] PASS — Free tier (OCR/HEX/SPX, 6 feats) vs Quirky Pro $16.99 (adds DOM/SVG,
  5 feats, accent-highlighted "All five modes" badge). "one time / No subscription"
  framing present. Download band has BOTH buttons (Direct + Mac App Store), CDP
  count = 2. App-Store footnote present. Compact 4-item FAQ ("Before you download")
  appended, not a heavy 4th section. CDP: free=true, pro16=true, oneTime=true,
  appStoreFootnote=true, downloadButtons=2, faqPresent=true.

### App-Store honesty (both sections)
- [x] PASS — Section 1 (#top) contains "App Store" (secondaryCta note: OCR/HEX/SPX
  on App Store, DOM/SVG need direct download). Section 3 (#pricing) contains 5
  "App Store" mentions (download band + footnotes). Visible in both as required.

### Accent / one color
- [x] PASS — `--color-accent` computed = `#e63e2e`; `--color-captured-blue` = `#3d9df2`
  (used only as the sampled HEX swatch, not as brand chrome). grep src for old coral
  #FF7059/#F25742/#DB4733/#FFE9E4/#FFF4F1 = ZERO. One accent rule holds.

### No dashes in visible prose
- [x] PASS — copy.json prose sweep (skipping href/id/slug keys): zero em/en-dash,
  middle-dot, bullet, spaced-hyphen, hyphen-compound. Rendered HTML visible-text
  sweep over all 7 routes (scripts/styles stripped): 0 unicode-dash, 0 spaced-hyphen.
  Visible hyphen-compound sweep on home = [] (the prior on-device/click-through/
  reverse-engineer/mid-capture fixes hold). Remaining hyphens are slugs only.

### Guardrails
- [x] PASS — clean `rm -rf .next out && npm run build` GREEN twice; `tsc --noEmit`
  clean; all 7 routes export to out/ (+ 404.html and 404/); 0 "Html should not be
  imported" errors in any out/*.html; basePath `/quirky-landing/_next` + favicon
  `/quirky-landing/icon.svg` intact in out/index.html.
- [x] PASS — overflow 0 at 390 and 1440 on all 7 routes (motion=0).
- [x] PASS — 0 sub-16px body offenders on all 7 routes (12px uppercase eyebrows only).
- [x] PASS — pneumatic easing cubic-bezier(0.16,1,0.3,1) on tab/FAQ transitions;
  tab transitionDuration 0.15s; no bounce keywords. CTA has transition.
- [x] PASS — pricing one time $16.99 rendered (CDP hasPricing16 + hasOneTime true).
- [x] PASS — mobile 390 clean single-column stack, tabs usable (5 tabs flex-wrap),
  no horizontal overflow; switcher non-blank at 390.

### UX / a11y
- [x] PASS — tabs have focus-visible ring (ring-accent, offset on dark panel),
  hover border/text states; FAQ buttons aria-expanded/aria-controls + region;
  CTA pill buttons with transitions.

## Notes (non-blocking)

- NOTE — In the motion=0 full-page screenshot the CookieConsent card overlays the
  lower-left of the hero. That is the consent gate behaving as designed (first
  visit, no choice stored), not a layout defect; it dismisses on Accept/Decline and
  the footer re-open button persists. No action required.
- NOTE — ArrowRight panel text lags ~200ms behind selection during the cross-fade
  under motion ON (selection + aria-selected update instantly; panel settles after
  the 0.32s fade). Verified the panel does resolve to the new mode at 700ms. Correct
  behavior, recorded for completeness.

## Screenshots (this review, independent)

- /tmp/aisoldier-judge/quirky-rebuild/desktop-hero.png (1440, motion=0)
- /tmp/aisoldier-judge/quirky-rebuild/desktop-full.png (1440 full page, motion=0)
- /tmp/aisoldier-judge/quirky-rebuild/mobile-full.png (390 full page, motion=0)
- /tmp/aisoldier-judge/quirky-rebuild/desktop-hero-motion.png (1440, motion ON)

## CDP harness (this review)

- /tmp/quirky-cdp/driver.mjs (7-route motion=0 guardrails + switcher interaction +
  motion-off non-blank + reduced-motion + accent/dash sweep)
- /tmp/quirky-cdp/driver2.mjs (ArrowRight full settle + App-Store section location +
  interactive states + pricing completeness)
- /tmp/quirky-cdp/shot.mjs (screenshots)

---

# SOUL PASS REVIEW 2026-06-01

**Reviewer:** 3mpq-judge
**Scope:** the SOUL PASS (CORRECTIONS "GIVE IT SOUL", 4th direction): a Quirky
character/mascot, a living auto-playing hero demo, bold visuals, and per-section
scroll delight added to the existing HEADER + 3 sections + FOOTER. Verified as a
finished pass (the soldier's connection dropped before returning a report; the work
is on disk and builds green).
**Method (my own, independent):** two clean `rm -rf .next out && npm run build`
(both EXIT 0, 0 `<Html>`, all 7 routes), `tsc --noEmit` clean, static `out/` served
under the `/quirky-landing` basePath, headless Chrome 148 over CDP at 1440 + 390,
motion ON and `?motion=0` + reduced-motion, plus source + rendered-HTML greps.
Screenshots non-zero this pass.

## VERDICT: ISSUES (1 FAIL)

The soul pass DELIVERS what the user asked for and every soul-specific behaviour
measures clean: the character is present, reacts under motion-on, and falls back to
a calm static pose under motion-off; the hero demo autoplays, pauses on interaction,
and is non-blank under motion-off on all routes at 1440 AND 390; scroll delight is
real and degrades to static; accent is clean; build is green; no 390 overflow; no
exclamation marks; App-Store honesty + $16.99 intact. The user's "make it not
boring" ask is met without breaking the structural or motion guardrails.

The single blocker is the **no-dashes guardrail**: two hyphen-compounds are visibly
rendered in prose (`right-click`, `mid-capture`). The prompt names "no dashes in
visible prose (... hyphen-compound)" as a hard PASSED condition, and the prior V0.4
REDESIGN REVIEW blocked PASSED on this exact class of issue (`on-device`,
`click-through`, `reverse-engineer`). Consistency requires the same bar. These are
NOT soul-pass regressions (they predate this pass, in `modes.list[dom].line` and
`pricing.tiers[pro].features`, and were missed by the CAPITAL REBUILD review which
reported the home hyphen-compound sweep as empty), but they ARE live and visible, so
the guardrail is not met. Fix is one word each, then rebuild + re-grep, and this
flips to PASSED. No layout, color, motion, character, or structure work is required.

**Gate before redeploy: HOLD.** Clear Issue S1, re-run the visible-text grep clean,
and this is PASSED.

## Requested answers (headline)

- **VERDICT:** ISSUES (1 FAIL).
- **Section count:** exactly 3 content sections. `page.tsx` = Nav + main(Hero,
  Modes, Pricing) + Footer. Morph functional refs = ZERO (`grep morph|data-morph|
  MorphJourney|MorphMount|MorphForms|morph-handoff src/` returns only 3 descriptive
  comment lines; no `src/components/morph/` dir; runtime `morphElements` = 0 on every
  route/viewport). No extra heavy sections, no flying block.
- **Character motion-ON vs motion-OFF:** motion ON the mascot blinks, tracks the
  cursor/active element, pops to a delighted "happy" reaction with a speech bubble on
  every demo grab (autoplay tick OR click), and peeks over the Modes edge; 3
  instances live (hero, Modes peek, Pricing Pro), all `pointer-events: none` (cannot
  block content). Motion OFF / reduced-motion the SVG renders with `transform: none`,
  pupils centred (cx 38/62, looking straight ahead), no blink, no tracking, no bubble
  animation: a calm static pose, present and charming, not blank.
- **Demo autoplay + motion-off non-blank:** motion ON the tabs auto-cycle
  OCR -> HEX -> DOM -> SVG (measured distinct tabs advancing on the ~2.6s timer);
  clicking SPX pauses autoplay (still SPX after 3.2s, longer than one cycle) with the
  live hint "You are driving. It picks back up in a moment."; pneumatic ease
  `cubic-bezier(0.16,1,0.3,1)`, no bounce. WAI-ARIA tablist + roving tabindex +
  ArrowRight moves selection AND focus to HEX with the panel updating. Motion OFF:
  NO autoplay, panel resolves OCR by default, non-blank at **1440 (len 67)** AND
  **390 (len 67)**: "Get started / Copied to clipboard / Boop. That text is in your
  clipboard.", tabs still clickable, no JS error.
- **Per-route motion=0 (all 7, 1440 + 390):** overflow 0 (scrollWidth==clientWidth),
  sub-16 body 0 (only 12px uppercase eyebrows remain), 0 blank, morphElements 0,
  body content present on every route. Table below.
- **Dash + exclamation grep:** rendered visible text, all 7 routes: **0 exclamation
  marks, 0 unicode dash/bullet/middle-dot/ellipsis, 0 spaced hyphens**. copy.json
  same. **2 visible hyphen-compounds** (`right-click`, `mid-capture`) — the FAIL.
- **Accent clean:** computed `--color-accent: #e63e2e`; old coral
  (#FF7059/#F25742/#DB4733/#FFE9E4/#FFF4F1) = ZERO in src AND in rendered
  HTML/CSS/JS; `#3D9DF2` retained only as the sampled HEX demo value. One accent.

## Per-route motion=0 (CDP, my own, ?motion=0)

| route | 1440 overflow | 390 overflow | sub-16 body | blank | morphEl | bodyLen |
|---|---|---|---|---|---|---|
| `/` | 0 | 0 | 0 | 0 | 0 | 14093 |
| `/install/` | 0 | 0 | 0 | 0 | 0 | 14143 |
| `/privacy-policy/` | 0 | 0 | 0 | 0 | 0 | 15985 |
| `/terms/` | 0 | 0 | 0 | 0 | 0 | 14452 |
| `/refunds/` | 0 | 0 | 0 | 0 | 0 | 13134 |
| `/thanks/` | 0 | 0 | 0 | 0 | 0 | 12004 |
| `/404.html` + `/404/` | 0 | 0 | 0 | 0 | 0 | 12132 |

Hero demo panel at `?motion=0` (1440 AND 390): OCR resolved, textContent len 67,
never blank. Quirky present on home (3), static pose. (404 sets `data-motion=null`
because the static error doc does not run the param hook, but every guardrail metric
is clean and content is present.)

## Soul-pass checklist

### Structure intact (CRITICAL) — PASS
- [x] 3 content sections (Nav + Hero + Modes + Pricing + Footer). No morph, no extra
  heavy section. Morph functional refs = 0 (comments only), no morph dir, 0 runtime
  morph elements on every route.

### Quirky character — PASS
- [x] Single consistent blob mascot (accent-soft body + ink hairline + accent tummy +
  cheek blush), ONE design, `src/components/character/Quirky.tsx`.
- [x] Motion ON shows life: randomized blink, cursor/element pupil tracking, "happy"
  squish + blush + wider smile + "Got it." bubble on demo grab, "peek" tilt at the
  Modes edge. Greeting/peek bubbles live ("Oh, you can just grab that.", "Psst.
  There is data in there.").
- [x] Motion OFF + reduced-motion: calm STATIC pose (transform none, pupils centred,
  no blink/track/bubble anim), present, not blank, not broken.
- [x] Does NOT block content or cause overflow: all 3 instances `pointer-events:
  none`; peek/Pro characters `hidden sm:`; overflow 0 at 390. Charming, subtle, does
  not cover text (verified on screenshot).
- [x] Promoted to `ui-kit/components/brand/Mascot.tsx` (token-driven, dependency-free)
  + INDEX.md row + `index.ts` export + types, same session.

### Living hero demo (ModeSwitcher) — PASS
- [x] Motion ON: auto-cycles OCR -> HEX -> DOM -> SVG -> SPX on the ~2.6s timer with a
  progress underline; output panel updates each cycle; pneumatic ease, no bounce.
- [x] Interacting (click / keyboard) PAUSES autoplay and shows the chosen mode (SPX
  held > one cycle); resumes after inactivity; live hint reflects "you are driving".
- [x] Real WAI-ARIA tablist: role tablist/tab/tabpanel, aria-selected, roving
  tabindex, ArrowLeft/Right/Up/Down/Home/End (ArrowRight moves selection + focus +
  panel to HEX, measured).
- [x] Motion OFF + reduced-motion: NO autoplay, panel = OCR resolved (never blank,
  len 67 at 1440 AND 390), tabs still clickable, no JS error.

### Scroll delight — PASS
- [x] Per-section scroll-driven motion is real and meaningful (not the old morph):
  the giant "5" parallaxes (transform 24.28 -> -17.29 across scroll), Quirky peeks in
  at the Modes edge, rows assemble via staggered Reveal.
- [x] Degrades to static under motion=0/reduced-motion: sections fully readable,
  top-anchored content present at load, no scroll dependency, no scroll-trap,
  overflow 0. (Per-section CLS was clean in the prior pass; this pass measured 0
  overflow + full content at load on all routes, no layout depends on scroll.)

### Bold visual + copy voice — PASS
- [x] Warmer copy live: "Boop. That text is in your clipboard.", hero subhead names
  the five data types, mode captions re-voiced ("Grabbed it. That blue is yours.").
- [x] Bold scale: clamp headline to 5.5rem, oversize "5", soft drifting blobs,
  asymmetric grid, one dark demo panel. Friendly without breaking the rules.

### Guardrails — mostly PASS, 1 FAIL
- [x] PASS — `?motion=0` over all 7 routes: full content, 0 blank, 0 sub-16 body
  (12px uppercase eyebrows only), scrollWidth==clientWidth at 390 AND 1440. Character
  static, demo OCR resolved.
- [x] PASS — one accent computed `#e63e2e`; old coral 5 hexes = 0 in src + rendered
  HTML/CSS/JS; `#3D9DF2` only as the sampled HEX value.
- [x] PASS — NO exclamation marks: 0 in copy.json AND 0 in rendered visible text on
  all 7 routes.
- [x] PASS — no em/en-dash, middle-dot, bullet, ellipsis, spaced hyphen in rendered
  prose on all 7 routes; 0 ASCII ` -- ` in copy.json.
- [ ] **FAIL** — visible hyphen-compounds in prose: `right-click` (Modes DOM line,
  visible) and `mid-capture` (Pricing Pro feature, visible). See Issue S1.
- [x] PASS — 16px min body; pneumatic easing `cubic-bezier(0.16,1,0.3,1)` on tabs/
  FAQ, no bounce; App-Store honesty visible (6 mentions, OCR/HEX/SPX honest note,
  "DOM and SVG require the direct download"); pricing one time $16.99.
- [x] PASS — build green: two clean `rm -rf .next out && npm run build` EXIT 0, 0
  `<Html>`, all 7 routes export; basePath `/quirky-landing/_next` + favicon
  `/quirky-landing/icon.svg` intact; `tsc --noEmit` clean.
- [x] PASS — mobile 390 clean, character causes no horizontal overflow (peek/Pro
  hidden < sm, pupil tracking off on coarse pointer), tabs usable.

### Dark demo panel contrast (composited over #160C0A, computed)
- Demo caption (on-dark/60): composited rgb(161,156,154), contrast **7.09** — AA body PASS.
- Live hint (on-dark/50): composited rgb(138,132,130), contrast **5.23** — AA body PASS.
- Active tab label white on accent #e63e2e: 4.02 — AA large/UI PASS (16px semibold pill).

## Issues requiring fix

| # | Severity | What | Spec | Evidence (measured) | Fix |
|---|---|---|---|---|---|
| S1 | **FAIL** | Two hyphen-compounds rendered in VISIBLE prose | Prompt guardrail + CORRECTIONS REFINEMENT item 4: "no hyphen used as a separator or as a dash; rewrite rather than hyphenate"; PASSED requires "no dashes" | `innerText` of `/` contains `right-click` ("No DevTools, no right-click, no guessing.") from `content/copy.json` modes.list[dom].line (L133) AND `mid-capture` ("active and switchable mid-capture") from pricing.tiers[pro].features (L320). Both confirmed visible (not aria-hidden) via `document.body.innerText`. | Copywriter edits copy.json: `right-click` -> `right click`; `mid-capture` -> `mid capture`. Then `rm -rf .next out && npm run build` and re-grep `document.body.innerText` for `[a-z]+-[a-z]+` = only slugs. |

## Single most important issue

**Issue S1** — the no-dash guardrail is violated by two visible hyphen-compounds
(`right-click`, `mid-capture`). It is the only thing between this soul pass and
PASSED, it is a one-word-each copy.json fix plus a rebuild, and it requires no
layout/color/motion/character/structure change.

## Notes (non-blocking)

- NOTE — the cookie consent card overlays the lower hero on first visit; that is the
  strict-opt-in gate behaving as designed, not a layout defect.
- NOTE — `/404.html` reports `data-motion=null` (the static error document does not
  run the `?motion=0` hook); all guardrail metrics on it are still clean. No action.
- NOTE — WARN #3/#4/#5/#6 from the first-pass review (self-host fonts or confirm CI
  Google Fonts; `npm rm lucide-react`; Inspector dev-only `#ffffff`; launch
  placeholders) remain non-blocking devops/launch tasks.

## Screenshots (own, non-zero this pass)

- /tmp/aisoldier-judge/quirky-soul/hero-1440-motion-on.png (Quirky + bubble, living
  demo, OCR resolved, dark panel)
- /tmp/aisoldier-judge/quirky-soul/hero-390-motion-off.png (390 single column, no
  overflow, static)

## CDP harness (this review)

- /tmp/qk-cdp/drive.mjs (CDP WebSocket driver, Chrome 148)
- /tmp/qk-cdp/test-motionoff.mjs (7-route motion=0 guardrails + panel non-blank)
- /tmp/qk-cdp/test-motionon.mjs (autoplay cycle + pause-on-grab + character + kbd)
- /tmp/qk-cdp/test-kbd.mjs (ArrowRight selection+focus+panel)
- /tmp/qk-cdp/test-static-contrast.mjs (static character pose + dark contrast + 404)
- /tmp/qk-cdp/test-final.mjs (App-Store honesty + $16.99 + parallax + pointer-events)
- /tmp/qk-cdp/test-hyphen.mjs (innerText hyphen-compound visibility)
- /tmp/qk-cdp/shot.mjs (screenshots)
- Build logs: /tmp/qk-soul-build1.log, /tmp/qk-soul-build2.log (EXIT 0, 0 Html, 7 routes)

---

# MOTION PASS REVIEW 2026-06-01

**Reviewer:** 3mpq-judge
**Scope:** AWWWARDS MOTION PASS (5th direction, "удивить") — 4 heavy GSAP/scroll-driven set-pieces.
**Build reviewed:** clean `npm run build` x2, served via `serve` under basePath /quirky-landing, headless Chrome 148 over CDP.
**VERDICT: PASSED.** Gate cleared for redeploy. The accessibility/perf fallbacks all hold under independent CDP measurement; the wow is real and meaningful.

## The 4 load-bearing checks (verified independently, did not trust soldier)

### 1. Scroll-trap under motion-off — PASS
Tested all 7 routes in THREE fallback configs: `?motion=0` @1440, `prefers-reduced-motion:reduce` @1440, `?motion=0` @390. Every route scrolls fully to the bottom (reached === maxScroll, gap = 0). NO pin/ScrollTrigger trap anywhere.
- Home `/`: under BOTH motion=0 and reduced, `.hero-spacer` height = **776px** (auto/content, NOT the 520vh = 4680px pin reservation). Scroll reaches bottom, footer visible. The CSS media-query gate `@media (min-width:769px) and (prefers-reduced-motion:no-preference) html:not([data-motion=off])` collapses the reservation exactly as designed.
- Standalone routes (/install /privacy-policy /terms /refunds /thanks) have no `<footer>` element (legal-page shell), so the first heuristic flagged "footerVis=false" — that was a false alarm in my harness, NOT a trap: every one reports `reached === maxScroll`, `gap = 0`, `bodyBottomReached = true`. Confirmed via a second probe (/tmp/qk-footer.mjs).
- /404.html reports `data-motion=null` under motion=0 (the static error doc does not run the pre-hydration hook) but maxScroll=0, no trap. Consistent with the standing NOTE; no action.

### 2. CLS — PASS (~0 in all three modes)
Measured with a buffered layout-shift PerformanceObserver installed pre-navigation, then scrubbed the full page:
| Mode | CLS | spacerH | data-motion |
|---|---|---|---|
| MOTION-ON | **0.0015** | 4680 (pin reservation ACTIVE) | null |
| REDUCED | **0.0000** | 776 (collapsed) | off |
| MOTION=0 | **0.0000** | 776 (collapsed) | off |
The regression path the soldier flagged (JS height toggle -> 0.14) is gone. The two micro-shifts in motion-on are 0.0007 each (negligible, far under the 0.1 budget). The CSS media-query reservation holds CLS at effectively zero.

### 3. Mobile @390 — PASS
At 390 with motion ON: `.hero-spacer` = null (NO pin), the desktop `.hero-stage` is absent (`stagePresent=false`), the interactive `ModeSwitcher` fallback IS rendered (`hasSwitcher=true`). The DOM swap causes no overflow: `scrollWidth == clientWidth == 390`, `overflowX = 0`, scroll reaches bottom (no trap). The lighter switcher fallback fires on small screens exactly as specified. No jump, no horizontal scroll.

### 4. LCP / first paint + code-split — PASS
- **GSAP is code-split off the shared chunk.** Shared chunks (255, 4bd1b696 = 102 kB) contain NO gsap/ScrollTrigger/DrawSVG. GSAP lives in async chunks `580.*.js` (44 kB) + `c15bf2b0.*.js` (52 kB) loaded only via the home page chunk. Home First Load = 181 kB vs 115 kB for every other route — the ~66 kB delta is the home-only motion payload. Other 6 routes never load GSAP.
- **Static SVG poster paints first.** Sampling chip opacity over time on motion-on home: t=50ms -> all 5 chips visible (poster painted), t>=120ms -> chips go to 0 (GSAP initialized and set the scrub start-state). The poster IS the LCP frame; GSAP takes over only after mount. Headline text present immediately (non-blank). Under motion=0 the poster is permanent: all 5 chips visible with real outputs.

## Per-route motion=0 result (non-blank, overflow, sub-16) — ALL PASS
@1440 and @390, all 7 routes: substantial text (home ~4.3k chars), `overflowX = 0` (scrollWidth==clientWidth), `sub16 = 0` (no body text under 16px except the sanctioned 0.75rem uppercase eyebrows). Home motion=0 poster shows the full informative end-state: OCR "Get started", HEX #3D9DF2, DOM button.cta, SVG icon.svg, SPX "184 x 48", headline, poster hint, Quirky mascot. Non-blank everywhere.

## Accent / dash / exclamation grep — ALL PASS
- **Accent:** zero old coral (#FF7059/#F25742/#DB4733/#FFE9E4/#FFF4F1) in src; zero banned brick/green (#b7443d/#217a50). `#E63E2E` is the accent, `#3D9DF2` present as the sampled HEX demo (allowed).
- **Dashes:** visible-prose sweep of rendered HTML across all 7 routes (head/script/style/svg/aria stripped): em-dash 0, en-dash 0, middle-dot/bullet 0.
- **Exclamations:** 0 across all 7 routes.

## App-Store honesty + pricing — PASS
`$16.99` present on home. App-Store honesty visible: "App Store and as a direct DMG download", "App Store sandbox does not allow", "Direct download only. DOM and SVG use Apple Events..." — OCR/HEX/SPX vs DOM/SVG framing intact. One-time pricing.

## Build / deploy integrity — PASS
`rm -rf .next out && npm run build` x2: EXIT 0 both, 0 Html errors, all routes exported (index, install, privacy-policy, terms, refunds, thanks, 404). basePath `/quirky-landing/_next` and favicon `/quirky-landing/icon.svg` intact. `tsc --noEmit` clean. Inspector dev-only (absent from static export), hero root carries data-component/data-source/data-tokens.

## The wow — REAL and MEANINGFUL
- **Pinned scrub hero:** drove scroll under motion-on. Stage stays PINNED (stageTop=0, fixed in viewport) through ~frac 0.0-0.45 while scroll advances, then releases. Chips RESOLVE progressively with scroll: 0 -> 2 -> 4 -> 5 visible. "One capture, five modes" advances under the user's own scroll. This is the awwwards mechanic and it is literally the product demo. Screenshot: hero-1440-scrub-mid.png.
- **Character physics — no overshoot (PASS by spring math):** pupil spring zeta = 26/(2*sqrt(200*0.5)) = 1.30 (overdamped); body lean zeta = 18/(2*sqrt(120*0.7)) = 0.98 (critically damped); magnetic CTA zeta = 30/(2*sqrt(220*0.6)) = 1.31 (overdamped). All zeta >= ~0.98 -> mathematically cannot meaningfully overshoot; settles, never bounces. The sanctioned damped lean honours the no-bounce rule. (Runtime synthetic-pointer sampling returned zeros — pointer-capability gating defeats headless synthetic events; the spring config is the authoritative proof.)
- **Native scroll-timeline reveals:** 8 `.st-reveal` elements, 0 hidden under motion=0 (triple-gated @supports + reduced-motion + data-motion). Content is never hidden when unsupported/reduced.
- **Magnetic CTAs + kinetic headline:** magnetic spring transform-only, clamped 10px, critically damped; SplitText headline skew clamped 6deg, GSAP dynamic-imported, never blocks paint, disabled under motion=0/reduced.

## Most important issue
None blocking. Minor NOTEs only:
- NOTE — /404.html runs without the motion hook (data-motion=null); harmless, maxScroll=0, no trap.
- NOTE — runtime spring-overshoot sampling could not be driven via headless synthetic pointer events; verified by spring math instead. A real on-page assertion harness for the character spring would let future passes confirm settle-without-overshoot at runtime rather than analytically. (Logging as a self-deferral against my next motion review.)
- NOTE — cookie consent card overlays the lower hero on first paint (designed strict-opt-in gate, not a defect).

## Screenshots (own, non-zero)
- /tmp/aisoldier-judge/quirky-motion/hero-1440-motion0.png (motion=0 poster, all 5 chips fanned, non-blank)
- /tmp/aisoldier-judge/quirky-motion/hero-1440-scrub-mid.png (motion-on, chips resolving mid-scrub, character reacting)
- /tmp/aisoldier-judge/quirky-motion/hero-390-motion-on.png (390 single column, switcher fallback, no overflow)

## CDP harness (this review, independent)
- /tmp/qk-judge-scrolltrap.mjs (7 routes x 3 fallback modes: spacer height, scroll-reach-bottom, overflow)
- /tmp/qk-cls.mjs (buffered layout-shift CLS x3 modes + spacer reservation)
- /tmp/qk-mobile-paint.mjs + /tmp/qk-poster0.mjs + /tmp/qk-paint2.mjs (mobile fallback, first-paint poster timing)
- /tmp/qk-scrub.mjs (pinned stage + progressive chip resolution under scroll)
- /tmp/qk-allroutes-blank.mjs (motion=0 non-blank + overflow + sub-16 x2 widths)
- /tmp/qk-textcheck.mjs (visible-prose dash/exclamation sweep)
- Build logs: /tmp/qk-build1.log, /tmp/qk-build2.log (EXIT 0, 0 Html, tsc clean)

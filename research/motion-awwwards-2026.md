# Quirky — Award-Level Motion Research

> Date: 2026-06-01. Author: 3mpq-researcher. EXPIRES 2026-07-01 (motion trends move fast).
> Vertical: friendly macOS capture utility landing. Accent: warm coral #FF7059. Font: Manrope.
> Deploy target: Next.js 15 STATIC EXPORT on GitHub Pages. Hard constraint: no server,
> no Vercel functions, must work as flat files. JS budget is tight (TRENDS.md cites ~80KB).
> Mandate from client: "не вижу ничего крутого, ни анимаций" — current fade-ins are boring.
> He wants awwwards-level motion and "безумно красивые фреймворки и решения". Surprise him.

> RELATION TO EXISTING RESEARCH: this is the DELTA. `TRENDS.md` (2026-05-31) flagged that
> live Awwwards browsing was network-blocked and that its motion section was synthesized.
> Network is live again as of 2026-06-01, so this file supplies the concrete award examples,
> the specialist-framework comparison, and the buildable set-pieces TRENDS.md could not.
> TRENDS.md's verdict "non-bouncy pneumatic easing reads premium" STILL HOLDS and is
> reconciled below in §3 (we get drama from scrubbing/scale/draw-on, not from springs).

---

## 0. TL;DR for the impatient (read §5 for the full plan)

The single most impressive moment to build: **a sticky, scroll-scrubbed "one capture, five
modes" hero sequence.** The cursor draws the capture marquee (SVG path draw-on), the region
locks, and as you keep scrolling the page PINS and scrubs through all five extraction modes
(OCR → HEX → DOM → SVG → SPX), each mode's real output flying into a blob-chip. Scroll is not
moving the page; it is advancing a timeline. This is the exact mechanic behind 2025-2026
Awwwards winners, and it literally IS the product ("scrolling does not move the scene, it
advances time inside it" — Codrops, Sticky Grid Scroll, 2026-03).

Stack: **GSAP ScrollTrigger (pin + scrub) + DrawSVG + Lenis** for the hero sequence;
**Framer Motion useSpring** for the blob character physics and magnetic CTAs; **native CSS
`animation-timeline: view()`** for all the cheap below-the-fold reveals (replace the boring
fade-ins, zero JS cost). Reduced-motion: `gsap.matchMedia()` swaps the whole pinned sequence
for a static labelled diagram. Perf: lazy-init GSAP below the fold, pin via transform, the
hero LCP poster is a static SVG so heavy motion never blocks the paint.

---

## 1. Awwwards / current motion trends (2025-2026): what actually wins, and the motion behind it

Verified against live Awwwards/Codrops/Web Design Awards as of 2026-06-01.

### The macro pattern: "scroll advances time, it does not move the page"
The defining award-winning move of 2025-2026 is the **pinned, scroll-scrubbed scene**. The
section sticks to the viewport while the scroll position drives a timeline through discrete
phases. Codrops' March 2026 "Sticky Grid Scroll" teardown states the philosophy outright:
"Scrolling does not move the scene, it advances time inside it." Implementation there: a
sticky wrapper (`position: sticky; top:0; overflow:hidden`) inside a tall parent (425vh), a
GSAP timeline split into phases (reveal 0-45%, expand 45-90%, settle 90-100%), Lenis synced
to GSAP via `gsap.ticker` with `lagSmoothing(0)`.
Source: https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/

### Concrete award winners and the SPECIFIC motion they use

- **Lando Norris official site — Awwwards Site of the Year 2025** (studio OFF+BRAND).
  Bold oversized lime typography, cinematic scroll-driven sequences, a 3D helmet that rotates
  on scroll. Stack: Webflow + WebGL for the 3D, **Rive** for the motion-design layer. Lesson:
  the wow is cinematic SCROLL CHOREOGRAPHY plus one hero 3D object, not a hundred little
  effects. Source: https://www.webdesignawards.io/top-100-websites-2025
- **Bruno Simon portfolio 2025 — Awwwards Site of the Month, Jan 2026.** Drivable browser 3D
  world. Outlier (full Three.js game), NOT a B2B/utility model — listed so we explicitly do
  NOT copy it. Source (trend mention): https://www.awwwards.com/
- **Made With GSAP** (Michaël Garcia + Florent Roux-Durraffourt, 27 combined Awwwards SOTD,
  eCommerce Site of the Year 2023, Developer Site of the Year nominee 2025): a reference
  library of 50 premium GSAP effects — scroll, drag, mouse-move, infinite loops. This is the
  closest thing to a canonical "what motion specialists ship" catalogue.
  Source: https://madewithgsap.com/  and https://www.awwwards.com/websites/gsap/
- **follow.art — Awwwards Site of the Day**: scroll-triggered card STACKING (cards pile/peel
  as you scroll). The same "deck" mechanic TRENDS.md already flagged for Quirky's five chips.
- Recent SOTD roster on Awwwards (Zwart Techniek, Inter Inter, FANDOM, Katana Traffic, The
  Ringer, Kinetics): the recurring techniques are kinetic type reacting to scroll velocity,
  Gaussian-blur depth/"looking through glass," and choreographed scroll reveals.
  Source: https://www.awwwards.com/websites/sites_of_the_day/

### The named techniques that read "wow" right now (and whether they fit Quirky)
| Technique | What it is | Fits Quirky static-export + perf budget? |
|---|---|---|
| **Sticky pinned scrubbed sequence** | Section pins, scroll scrubs a timeline | YES — the hero. This is THE move. |
| **SVG path draw-on** | stroke-dashoffset reveals a line being "drawn" | YES — the capture marquee literally draws itself. Cheap. |
| **Kinetic type reacting to scroll velocity** | letters skew/scale with how fast you scroll | YES, in moderation — one oversized headline. |
| **Magnetic buttons** | CTA leans toward cursor, springs back | YES — already in our PATTERNS.md. |
| **Cursor-reactive / eye-tracking character** | element follows pointer with damping | YES — the blob character. High charm-per-byte. |
| **Hero WebGL / 3D object** | shader/Three.js hero | NO by default — perf + bundle cost, off-budget. SVG/canvas instead. |
| **View Transitions API page swaps** | animated route transitions | PARTIAL — single-page landing has little to transition; nice-to-have only. |
| **FLIP layout morphs** | element animates between two layout states | OPTIONAL — good for the mode-switch chip morph. |

---

## 2. The frameworks motion specialists actually use (practical, with perf + static-export fit)

Performance grounding (Motion's official tier list, motion.dev/magazine):
- **S-tier (compositor thread, free):** `transform`, `opacity`, `filter`, `clip-path`. Animate
  these and nothing else when you can.
- **C-tier (forces paint):** `background-color`, `color`, `border-radius`, AND **CSS custom
  properties** — changing a CSS variable always triggers paint, and inherited globals can
  force whole-tree style recalc. Relevant to us: do not animate `--color-accent` per-frame.
- **D-tier (forces layout):** `width`, `height`, `margin`, `top/left`. Never animate these.
  Pin and scale with `transform: scale()`, not `width`.
- **F-tier:** read/write DOM in alternating cycles (layout thrash). GSAP avoids this by
  caching measurements at startup.
Source: https://motion.dev/magazine/web-animation-performance-tier-list

### GSAP (core ~23KB gz; ScrollTrigger adds ~the scroll engine) — the specialist default
As of April 2025 **the entire GSAP library, including the premium plugins (SplitText,
DrawSVG, MorphSVG, ScrollTrigger, Flip), is FREE** (Webflow acquired and freed it). This is
the single biggest reason award sites lean on GSAP in 2025-2026.
Source: https://gsap.com/  and Codrops free-plugins demos https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/
- **ScrollTrigger** — best-in-class for pin + scrub + parallax + multi-step scroll
  choreography. `pin: true` freezes a section; `scrub: 1` ties timeline progress to scroll
  with 1s catch-up smoothing. This is the hero engine.
  Source: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **DrawSVG** — progressively reveals an SVG stroke by tweening `stroke-dasharray` /
  `stroke-dashoffset`. Exactly how you "draw" the capture marquee.
  Source: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
- **SplitText** — splits a heading into chars/words/lines for staggered reveals; always
  `revert()` on cleanup. Use for the one kinetic headline.
  Source: https://www.annnimate.com/blog/gsap-text-animation-splittext-guide
- **Flip** (First-Last-Invert-Play, Paul Lewis technique) — animates an element between two
  DOM/layout states (B-tier: one upfront measurement then transform-only). Optional for the
  "Tab to switch" chip morph.
  Source: https://gsap.com/docs/v3/Plugins/Flip/
- **MotionPath** — moves elements along an SVG path; could fan the five chips along an arc.
- **gsap.matchMedia()** — the accessibility workhorse: register animations inside a
  `(prefers-reduced-motion: reduce)` condition and GSAP auto-reverts them when the query
  flips. This is how award sites do reduced-motion cleanly.
  Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- **Static-export fit:** GSAP is 100% client-side, no server, works perfectly on GitHub
  Pages. Cost is bundle weight — mitigate by dynamic-importing ScrollTrigger only on the
  hero route and only above a viewport-width / no-reduced-motion gate.

### Lenis (already in this project) — smooth scroll foundation
Award sites pair Lenis WITH GSAP, syncing them through `gsap.ticker.add(time => lenis.raf(...))`
and `gsap.ticker.lagSmoothing(0)` so the scrub is frame-perfect. We already ship Lenis per
doctrine §3, so this is free. Source: https://github.com/thounny/DAY_015 (GSAP+Lenis pattern)

### Framer Motion / Motion (~32KB gz) — best React DX, weaker at long timelines
Best at: spring physics (`useSpring`), pointer-reactive values (`useMotionValue`),
`useScroll`/`useTransform` scroll-linked transforms, `layout` animations. Weakness: layout
work is tied to React's render cycle, so heavy state churn drops frames; long multi-phase
scroll timelines are awkward vs GSAP. Verdict for Quirky: use it for the BLOB CHARACTER
physics and MAGNETIC CTA (short, spring-y, pointer-driven) — NOT for the pinned hero
sequence. Source: https://motion.dev/docs/gsap-vs-motion

### Native CSS scroll-driven animations (`animation-timeline: scroll()/view()`, `@property`) — FREE perf
Runs entirely on the COMPOSITOR thread, off the main thread — zero jank regardless of JS
load. `view()` = element's progress through viewport (the gold standard for reveal-on-scroll);
`scroll()` = page scroll progress (progress bars). Support in 2026: Chromium 115+ and Safari
18+; Firefox behind a flag (~85% coverage). Gate behind `@media (prefers-reduced-motion:
no-preference)`; non-supporting browsers just show the end state (graceful).
Sources: https://www.joshwcomeau.com/animation/scroll-driven-animations/  and
https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
**This is the single best upgrade for the "boring fade-ins" complaint at ZERO JS cost.**
Replace every current fade-in with `animation-timeline: view()` reveals (blur-to-sharp,
clip-path wipe, slight scale). Same pneumatic feel, compositor-cheap, no library.

### The rest (and why they're mostly NOT for Quirky)
- **Theatre.js** — visual keyframe editor for code animation. Powerful but larger bundle,
  thin docs, small community, overkill for one landing. Skip.
  Source: https://www.theatrejs.com/
- **Rive** — interactive vector runtime (~tiny runtime, designer-authored state machines).
  This is what powered Lando Norris's motion layer. GREAT fit for the blob character IF we
  want a designed, state-machine character (idle / blink / look-at-cursor / capture-react).
  Doctrine §3 lists Rive as a sanctioned second-tier tool but requires an explicit go and a
  HANDOFF flag ("custom embed required"). Recommend as the AMBITIOUS upgrade path for the
  character; the Framer-Motion spring version is the shippable default.
- **Lottie** — JSON animation player. TRENDS.md already rejected "Lottie over screenshots."
  Fine for one tiny looping accent (e.g. the menu-bar blink) but not a centerpiece. Heavy
  for complex scenes. Low priority.
- **WebGL stacks (Three.js / R3F / OGL / shaders)** — highest ceiling, highest cost. R3F
  pulls Three (~150KB+). Off-budget for an 80KB static landing and overkill for a 2D blobby
  capture tool. The ONE place a tiny shader could earn its weight: a subtle animated grain/
  glass shimmer on the capture surface via raw OGL (~10KB) — optional, not core.

---

## 3. Reconciling "wow" with the no-bounce doctrine (important)

TRENDS.md and CLAUDE.md §2.5 forbid bounce/overshoot and mandate
`cubic-bezier(0.16, 1, 0.3, 1)`. That is NOT in tension with award-level motion — the wow on
the best 2025-2026 sites comes from **scrubbing, pinning, draw-on, scale and blur depth**, not
from springy overshoot. So:
- The pinned hero sequence: all easing is the pneumatic curve or linear-while-scrubbing
  (scrub motion has no "ease" — it tracks the scrollbar). No bounce, full drama.
- The ONE sanctioned exception: the BLOB CHARACTER may use a gentle critically-damped spring
  (`useSpring` with stiffness ~120, damping ~18, **no overshoot** — tuned so it settles, not
  wobbles). This is "physics" without "bounce." It reads alive without reading cheap. Flag it
  to the soldier explicitly: damping high enough that it never overshoots past target.
- Magnetic CTA: spring return with damping that settles cleanly, not elastic.

---

## 4. Six concrete set-pieces for Quirky (technique + library + sketch + perf/a11y)

Ranked by impact-per-effort. Each is meaningful for THIS product, not decoration.

### SET-PIECE A (THE HERO, highest impact): Scroll-scrubbed "one capture → five modes"
**The idea:** The product thesis as a scrollable film. Phase 1: cursor moves in and DRAWS the
capture marquee (SVG rectangle stroke draws on). Phase 2: region locks (corner handles snap,
SPX-style). Phases 3-7: the page PINS and each scroll step scrubs to the next extraction mode
— the marquee's contents resolve into that mode's real output flying into a blob-chip:
OCR → recognized words; HEX → swatch + `#3D9DF2`; DOM → `button.cta`; SVG → glyph outline;
SPX → `184 x 48`. A coral "Tab to switch" cursor hint advances each step. Final phase:
all five chips fan out (deck-of-cards "deal," the follow.art mechanic) and settle.
**Library:** GSAP ScrollTrigger (`pin: true`, `scrub: 1`) + DrawSVG (marquee) + Lenis (synced).
**Sketch:**
```
parent: 500vh tall. child: position:sticky; top:0; height:100vh; overflow:hidden.
tl = gsap.timeline({ scrollTrigger:{ trigger:parent, start:'top top',
       end:'bottom bottom', pin:child, scrub:1 }})
tl.from('#marquee', { drawSVG:'0%' })          // phase 1: draw the region
  .from('.handle', { scale:0, stagger:0.05 })   // phase 2: lock corners
  .addLabel('ocr').from('#chip-ocr', {opacity:0, y:20, filter:'blur(8px)'})
  ... hex, dom, svg, spx ...
  .to('.chip', { /* fan to arc positions via x/y/rotate */ }, 'fan')
sync: gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)
```
**Perf:** animate only transform/opacity/filter/drawSVG (S-tier + DrawSVG). The visible-at-
load frame is a STATIC SVG poster (region + first chip) so LCP paints instantly and GSAP
inits after. Dynamic-import ScrollTrigger. Cache all chip refs once.
**A11y:** `gsap.matchMedia({ reduce:'(prefers-reduced-motion: reduce)' })` → in reduce mode,
render the END state (all five chips shown, labelled, no pin, normal document flow). The
sequence becomes a static annotated diagram. No information is motion-only.

### SET-PIECE B: The blob character with cursor-magnetism + eye-tracking + capture-react
**The idea:** Quirky's friendly blob is genuinely alive. It idles (slow breathe), its eyes
TRACK the cursor (pupils translate toward pointer, clamped inside the eye), it leans slightly
toward the cursor (magnetism), and when the hero capture fires it does a one-shot reaction
(squash-and-settle, NO bounce-back). Highest charm-per-byte on the page.
**Library:** Framer Motion `useMotionValue` (pointer) + `useTransform` (map pointer→pupil
offset, clamped) + `useSpring` (critically damped, no overshoot). OR, ambitious path: **Rive**
state machine (idle/blink/look/react) for designer-authored richness — flag as custom embed.
**Sketch:** track `mouseX/Y` motion values; pupil `x = useSpring(useTransform(mouseX,[0,vw],
[-4,4]))`; body lean `rotate = useTransform(...)/clamped`. Capture event triggers a `.start()`
keyframe (scaleY 0.9→1 settle).
**Perf:** transform/opacity only; throttle pointer via rAF; pause tracking when off-screen
(IntersectionObserver). **A11y:** reduce-motion → static blob, eyes centered, no tracking.

### SET-PIECE C: Kinetic oversized headline reacting to scroll velocity
**The idea:** One giant Manrope headline ("Point at anything. Get five kinds of data.").
Per-word reveal on entry (SplitText), and a subtle skew/scale tied to SCROLL VELOCITY — fast
scroll = slight horizontal skew, settling to upright when scroll stops. Personality without
gimmick. Apply to the hero headline ONLY, never body/nav (per kinetic-type best practice).
**Library:** GSAP SplitText (reveal) + ScrollTrigger velocity (`self.getVelocity()`) mapped to
`skewX`, clamped and eased back to 0. Source: Awwwards kinetic-type trend +
https://www.annnimate.com/blog/gsap-text-animation-splittext-guide
**Perf:** transform only; clamp skew to ~6deg max so it never looks broken.
**A11y:** reduce-motion → words appear, no velocity skew.

### SET-PIECE D: Magnetic CTAs (download buttons)
**The idea:** The primary download CTA leans toward the cursor within ~120px and springs back
cleanly on leave. We already have the pattern (PATTERNS.md "Magnetic CTA", MagneticButton).
**Library:** Framer Motion `useMotionValue` + `useSpring` (settle, no overshoot). Already
doctrine-sanctioned. **Perf:** transform only. **A11y:** reduce-motion → disable the magnet,
keep hover color. Use on the hero + final-CTA download buttons (both Direct and App Store).

### SET-PIECE E: Below-the-fold reveals via NATIVE scroll-timeline (kills the "boring fade-in")
**The idea:** Every feature cell, workflow story, and mode row reveals on scroll with a
blur-to-sharp + slight clip-path wipe + 2-3% scale, staggered — but driven by native CSS
`animation-timeline: view()`, not JS. This directly answers "ни анимаций": the page comes
alive everywhere as you scroll, at ZERO JS cost and on the compositor thread.
**Library:** pure CSS, no library. `animation-timeline: view(); animation-range: entry 0% cover 40%;`
**Sketch:**
```css
@media (prefers-reduced-motion: no-preference){
  .reveal{ animation: rise both; animation-timeline: view(); animation-range: entry 5% cover 35%; }
  @keyframes rise{ from{opacity:0; filter:blur(8px); transform:translateY(16px) scale(.98)}
                   to  {opacity:1; filter:blur(0);   transform:none} }
}
```
**Perf:** compositor-thread, off main thread. **A11y:** non-supporting browsers + reduce-motion
show the end state (visible, no motion). Source: Josh Comeau + MDN (see §2).

### SET-PIECE F (optional, ambitious): "Tab to switch" chip morph via FLIP
**The idea:** In the features grid, pressing/hovering the "Tab to switch" control morphs the
active chip from one mode card to the next — the chip physically flies between grid slots
(FLIP), mirroring the real in-app Tab behavior.
**Library:** GSAP Flip (`Flip.getState` → reorder DOM → `Flip.from`). B-tier (one measurement
then transform-only). Source: https://gsap.com/docs/v3/Plugins/Flip/
**Perf:** transform-only after measure. **A11y:** reduce-motion → instant swap, no flight.

---

## 5. Accessibility + perf reality (how the award sites stay shippable)

- **Reduced motion is non-negotiable.** ~70M+ people are affected by motion sensitivity
  (vestibular). Standard: gate ALL non-essential motion behind
  `@media (prefers-reduced-motion: no-preference)` (CSS) and `gsap.matchMedia({reduce:...})`
  (JS). In reduce mode, every set-piece collapses to its informative END STATE — no
  information is ever motion-only. Sources: web.dev prefers-reduced-motion, Smashing Mag,
  gsap.matchMedia docs. Consider also an on-page motion toggle (some award sites add one).
- **LCP:** the hero's first painted frame must be a STATIC SVG poster (region + first chip +
  headline). Never let GSAP/ScrollTrigger init block paint. Dynamic-import the motion libs
  AFTER first paint, below the fold, and only when not reduced-motion.
- **CLS:** pin via `transform`/`position:sticky`, never by mutating height/layout mid-scroll.
  The tall parent reserves the scroll space up front so nothing reflows. Reserve chip/space
  dimensions so fan-out doesn't shift surrounding content.
- **Main thread:** prefer native `animation-timeline: view()` (compositor) for the many small
  reveals; reserve GSAP for the ONE pinned hero. Never animate D-tier (width/margin/top) or
  per-frame CSS variables (C-tier paint).
- **Bundle / static export:** everything here is client-side and GitHub-Pages-safe. Code-split
  ScrollTrigger+DrawSVG (load on hero only). Native scroll-timeline and Framer springs are
  cheap. Keep WebGL/Three out of the core path. Budget order of cost (lightest→heaviest):
  native CSS scroll-timeline (≈0) < Framer springs < GSAP ScrollTrigger+DrawSVG < Rive < WebGL.

---

## 6. RECOMMENDATION (opinionated): the 3-4 to build, exact stack, build order

Build these four. They are the highest impact, they all MEAN something for a capture tool, and
they ship on a static GitHub Pages export within budget.

1. **THE HERO — scroll-scrubbed "one capture → five modes" pinned sequence** (Set-piece A).
   Stack: **GSAP ScrollTrigger (pin + scrub) + DrawSVG + Lenis (synced via gsap.ticker)**.
   This is the single most impressive moment and it is literally the product demo. Build first.
2. **The living blob character** (Set-piece B). Stack: **Framer Motion useMotionValue +
   useSpring** (critically damped, no overshoot). Eye-tracking + cursor lean + capture-react.
   Highest charm-per-byte. (Ambitious upgrade later: Rive state machine — flag as custom embed.)
3. **Native scroll-timeline reveals everywhere below the fold** (Set-piece E). Stack: **pure
   CSS `animation-timeline: view()`**. This is what kills "ни анимаций" across the whole page
   at zero JS cost. Cheapest big win — do this in parallel with #1.
4. **Magnetic download CTAs + one kinetic hero headline** (Set-pieces D + C). Stack: **Framer
   Motion springs** (magnetic) + **GSAP SplitText/velocity** (headline, reusing the GSAP we
   already loaded for the hero).

Build order: (3) native reveals first — instant site-wide life, no dependencies → (1) the
pinned hero sequence, the centerpiece → (2) the blob character → (4) CTAs + kinetic headline
polish. Keep Set-piece F (FLIP chip morph) and the Rive/WebGL upgrades as stretch goals after
judge PASS.

**The single most impressive "hero" moment:** the pinned scrub where the cursor draws the
capture marquee and, as the user scrolls, the SAME region resolves into OCR text, then a hex
swatch, then a DOM selector, then an SVG glyph, then a pixel measurement — five real outputs
from one capture, scrubbing under the user's own scroll. That is awwwards-grade AND it is the
entire pitch of Quirky in one gesture. No competitor hero does five-outputs-from-one-capture,
and doing it as a scrubbed film (not a static diagram) is the "удивить."

**Perf/reduced-motion plan in one line:** static SVG hero poster for LCP → dynamic-import GSAP
after paint → all heavy motion behind `gsap.matchMedia` + `prefers-reduced-motion` (reduce =
static labelled end-states) → native compositor-thread `view()` reveals for the rest →
transform/opacity/filter/drawSVG only, never layout or per-frame CSS vars → pin via
sticky/transform so CLS stays zero.

---

## 7. Sources
- Codrops, Sticky Grid Scroll (pinned scrub philosophy + GSAP/Lenis sync): https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/
- Codrops, free GSAP plugin demos (SplitText→MorphSVG): https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/
- Motion performance tier list (S→F tiers, transform vs layout, CSS-var paint): https://motion.dev/magazine/web-animation-performance-tier-list
- GSAP vs Motion (DX vs timeline strength): https://motion.dev/docs/gsap-vs-motion
- GSAP ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP DrawSVG docs: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/
- GSAP Flip docs: https://gsap.com/docs/v3/Plugins/Flip/
- GSAP matchMedia (reduced motion): https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- GSAP SplitText guide: https://www.annnimate.com/blog/gsap-text-animation-splittext-guide
- Made With GSAP (specialist effect catalogue): https://madewithgsap.com/
- Awwwards GSAP gallery: https://www.awwwards.com/websites/gsap/
- Awwwards Sites of the Day: https://www.awwwards.com/websites/sites_of_the_day/
- Web Design Awards, Top 100 2025 (Lando Norris SOTY, Rive+WebGL): https://www.webdesignawards.io/top-100-websites-2025
- Josh Comeau, scroll-driven animations (native view()/scroll()): https://www.joshwcomeau.com/animation/scroll-driven-animations/
- MDN, CSS scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- web.dev, prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
- Theatre.js: https://www.theatrejs.com/

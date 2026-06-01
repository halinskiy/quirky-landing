# Quirky Voice

> Phase 3 deliverable. Date: 2026-05-31. Author: 3mpq-researcher.
> Copywriter owns final strings; this is the brief that constrains them.

---

## 1. The voice in one sentence

Quirky talks like a sharp friend who shows you a trick over your shoulder:
**warm, plain-spoken, specific, a little delighted, never salesy.**

Corder is the quiet engineer in the corner ("no bot in the call"). Quirky is the
friend who taps your screen and says "you can just grab that, you know." Same honesty,
same precision, opposite temperature.

## 2. Why warm-and-friendly is correct for Quirky (not just the override)

The override mandates it, but it is also the right read of the audience and product:

- **The product is small, instant, and low-stakes.** You press a hotkey, grab a thing,
  done in under two seconds. There is no anxiety to soothe (unlike Corder's "is a bot
  recording me"). The natural emotion is mild delight: "oh nice, that just worked."
  Warm voice matches the actual feeling of using it.
- **The audience (devs/designers/QA) is over-marketed-to.** They tune out "boost your
  workflow." A concrete, friendly, slightly informal voice cuts through precisely
  because it sounds like a person, not a funnel. (See AUDIENCE.md lexicon.)
- **It is a solo product made by one person.** Friendly first-person ("I made this,
  email me if it breaks") is both honest and a trust signal. Corporate voice would be
  a lie. Warm voice is the true voice.
- **Friendly is not fluffy.** Every Quirky line still carries a fact: a mode, a number,
  a keystroke, a real output. Warmth is the temperature; specificity is the spine.

## 3. Frame-anchor (Quirky's own, not "no bot in the call")

**"Point at it, get the data."**

This is Quirky's equivalent of Corder's "no bot in the call." Every section, every
headline, every feature should be expressible as a variant of this gesture:
you point your capture at something on screen, and you get the data you actually want.

Sub-frames that ladder off it:
- "Five kinds of data, one hotkey." (the breadth)
- "It is already on your screen. Just take it." (the insight: the data exists, you
  shouldn't have to retype/eyedrop/inspect by hand)
- "Tab to switch." (the speed)

Use "point at it, get the data" as the spine of the hero and the FinalCTA bookend.

## 4. Tone dials

- Warmth: 8/10 (high, but never cutesy or babyish)
- Formality: 3/10 (informal, contractions welcome: "you'll", "it's", "here's")
- Energy: 6/10 (delighted, not hyped; no exclamation marks ever)
- Technical precision: 9/10 (real selectors, real hex, real keystrokes, real numbers)
- First-person presence: 5/10 (Kostya is visible in footer + a few asides, not everywhere)

## 5. Hard bans (inherited + reinforced)

- No em-dash, en-dash, middle-dot, bullet in user-facing copy. ASCII only. Rewrite
  the sentence, or use a colon at most.
- No exclamation marks.
- No emoji in copy. (Blob-objects in the visual system are illustration, not copy.)
- Banned words: seamless, powerful, robust, cutting-edge, supercharge, unlock,
  leverage, next-gen, redefine, revolutionary, magical, AI-powered, premium,
  enterprise-grade, industry-leading, best-in-class, harness, unleash, elevate,
  game-changer, swiss army knife, "in today's fast-paced world."
- No fake social proof, no "used at Google/Apple", no invented testimonials.
- No generic benefit lists without a concrete object ("extract any element" is banned;
  "click the heading on a Linear page, get `h1.title` and its text" is the standard).

## 6. Do / Don't string examples

### Hero
- DO: "Point at anything on your screen. Get five kinds of data back."
- DON'T: "Quirky supercharges your screen-capture workflow." (banned words, vague)

### Mode: OCR
- DO: "Drag over a screenshot of a receipt. The text lands in your clipboard, ready to paste."
- DON'T: "Powerful OCR engine extracts text seamlessly." (banned words, no object)

### Mode: HEX
- DO: "Hover any pixel, get its hex. `#3D9DF2`, copied. No eyedropper math." (use a neutral grabbed-color example, not the brand coral, so it reads as "a color you took" not "Quirky's color")
- DON'T: "Grab colors effortlessly with our advanced color picker." (vague, salesy)

### Mode: DOM
- DO: "Click a button on a Comet, Chrome, or Safari tab. Quirky reads the live page and hands you the selector and the text inside."
- DON'T: "Extract any element from any website instantly." (no object, overclaim)

### Mode: SVG
- DO: "See an icon you like on a page? Grab the actual SVG, not a screenshot of it."
- DON'T: "Unlock vector assets from the web." (banned word, vague)

### Mode: SPX
- DO: "Measure the gap between two cards in pixels. Edge detection finds the neighbours for you."
- DON'T: "Pixel-perfect measurements at your fingertips." (cliche, no specifics)

### Switching
- DO: "Mid-capture, hit Tab. Same region, different data. Or tap the button by your cursor."
- DON'T: "Switch modes seamlessly." (banned word)

### Trust / offline
- DO: "Works offline. No account. It lives in your menu bar, not your Dock, and notarized by Apple before it reaches you."
- DON'T: "Enterprise-grade security and privacy." (banned words, hollow)

### Pricing CTA microcopy
- DO: "Download for macOS 13+ (Apple Silicon or Intel). .dmg." and a second button "Get it on the Mac App Store." (.dmg size: confirm the real number before publishing; do not invent it.)
- DON'T: "Download now." (bare)
- HONESTY NOTE: the App Store build is OCR/HEX/SPX only (no DOM/SVG, sandbox blocks Apple Events). The App Store button or a footnote must say so, e.g. "App Store: OCR, HEX, SPX. For DOM and SVG, grab the direct download." Do not imply all five modes ship on the App Store.

### Pricing frame (one-time, locked)
- DO: "Pay once. It is yours. No, really, a friend does not send you a monthly bill."
- DON'T: imply a subscription, a trial that converts, or "free for now." It is a free core plus a one-time Pro unlock (~$16.99, confirm the figure).

### Footer authorship line
- DO: "Made in Leicester by Kostya. If it breaks, email me: hegona3@gmail.com"
- DON'T: "Built with love by the Quirky team." (fake team, fluffy)

### FinalCTA bookend
- DO: "It is already on your screen. Press ⌘⇧1 and just take it."
- DON'T: "Ready to transform how you work?" (cliche, no object)

## 7. Rhythm notes for the copywriter

- Lead with the gesture/verb ("Drag", "Click", "Hover", "Press"), then the payoff.
- Keep the keystroke `⌘⇧1` and `Tab` visible and literal; they are part of the charm.
- Allow one short warm aside per major section max (a friend's tone), e.g. "No, really,
  the SVG, not a PNG of it." Used sparingly it lands; overused it grates.
- Numbers earn trust: "five modes", "one hotkey", "two seconds", "4.2 MB", "macOS 13+".
- End sections on the concrete object, not on a feeling.

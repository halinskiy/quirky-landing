# Quirky Audience

> Phase 3 deliverable. Date: 2026-05-31. Author: 3mpq-researcher.

## Product recap

> Ground truth for product facts is `research/product-truth.md` (verified from the
> installed app + sources). This recap defers to it. Two facts the copy MUST get right
> that an earlier draft understated: (1) DOM/SVG support 8 browsers, not 3 (Safari,
> Chrome, Arc, Brave, Edge, Comet, Vivaldi, Opera); (2) the Mac App Store build has
> only OCR/HEX/SPX (no DOM/SVG, the sandbox blocks Apple Events). Direct = all 5.

macOS menu-bar utility (LSUIElement, no Dock icon). `⌘⇧1` captures a screen region.
`Tab` (or a floating glass mode-switcher pill that auto-parks to the screen edge)
cycles 5 extraction modes: OCR (Apple Vision text), HEX (eyedropper color), DOM
(browser element via Apple Events, 8 browsers), SVG (icon source from the page), SPX
(pixel measurement, edge-detect magnetic snap, ghost click-through). Swift/AppKit,
Carbon hotkey, Sparkle auto-update, notarized + Mac App Store. Works offline (OCR/HEX/
SPX local; DOM/SVG need the browser, not the network). No account. v1.0, min macOS 13.
Solo dev: Kostya (halinskiy), Leicester UK, hegona3@gmail.com.

## Who this is for (top line)

Mac-using people who look at other people's screens/UIs all day and constantly need
to pull a fact OUT of what they are looking at: a color, a measurement, a string of
text, a selector, a vector. Today they do this with five different tools, or by hand,
or by retyping. Quirky collapses that into one hotkey.

## Segments + one concrete workflow each

### 1. Frontend developers (primary)
Rebuilding a UI from a reference (a Figma export, a live competitor page, a Dribbble shot).
Modes they live in: DOM, SVG, HEX.
- Workflow: "You are cloning a pricing card you saw on a SaaS site. Capture the button,
  Quirky (DOM) gives you `button.cta-primary` and the inner text. Tab to HEX, grab the
  exact background color. Tab to SVG, lift the little check icon as a real vector. Three
  facts, one region, no DevTools spelunking."
Pains: copying selectors out of DevTools is slow; eyedropping color across apps is fiddly;
SVGs are buried in the DOM or shipped as sprites.

### 2. Web / product designers
Auditing or redoing an interface, spec'ing a redesign, matching brand colors.
Modes: HEX, SPX, OCR.
- Workflow: "Reviewing a dev build against the design. Capture the gap between two cards,
  SPX says `24 px` with edge detection picking the neighbours automatically. Tab to HEX
  to confirm the heading color shipped right. Tab to OCR to pull the body copy into a doc
  for a content pass."
Pains: measuring on screen with a ruler tool is tedious; reading exact spacing off a build
is guesswork; retyping copy from a screenshot is dead time.

### 3. QA engineers and product managers
Filing precise bug reports, documenting states.
Modes: OCR, SPX.
- Workflow: "A button is misaligned. Capture it, SPX gives the exact pixel offset to drop
  into the ticket. OCR the error toast so the exact string is in the report, not a
  paraphrase. The dev gets numbers, not 'it looks a bit off.'"
Pains: vague bug reports cause back-and-forth; transcribing on-screen text by hand
introduces typos.

### 4. Content managers / ops
Getting text out of images, PDFs-as-images, or screenshots fast.
Modes: OCR.
- Workflow: "A spec arrived as a screenshot. Drag over it, the text is in your clipboard,
  paste into the CMS. No retyping, no 'can you send the actual file.'"
Pains: text trapped in images; copy-paste from screenshots is impossible without OCR.

## Secondary / opportunistic

- Indie devs and designers who already pay for one-trick tools (a color picker, a
  measure tool) and would happily consolidate.
- Technical writers, support engineers (OCR + DOM for docs/screenshots).

## Where Quirky wins (state these, don't oversell)

- Five data types in one utility, one hotkey, `Tab` to switch. No competitor combines
  OCR + HEX + DOM + SVG + SPX.
- Sandbox-safe Carbon hotkey, notarized, ships both Direct (DMG + Sparkle) and Mac App Store.
- Works offline, no account, menu-bar only (no Dock clutter).

## Where Quirky is behind (be honest, do not hide)

- No team features, no SSO, no annual brand machine (solo product, v1.0).
- No integrations/extensions ecosystem (unlike Raycast).
- Younger than CleanShot X; smaller brand recognition.
- DOM/SVG depend on Apple Events + a supported browser (8 browsers; see product-truth).
  And DOM/SVG are absent from the Mac App Store build (sandbox blocks Apple Events), so
  App Store users get OCR/HEX/SPX only. The frontend segment's killer modes (DOM/SVG)
  require the Direct download. Copy must steer that segment to Direct, honestly.

## Emotional register

Curious, slightly delighted, time-pressed. They are NOT anxious (that is Corder's
audience). The feeling Quirky should evoke: "oh, I can just grab that?" Relief plus a
small grin. Voice and visuals lean into that (see voice.md, quirky-direction.md).

## Lexicon (use these words)

capture, region, drag, grab, hotkey, `⌘⇧1`, Tab, switch, clipboard, paste, hex,
selector, element, vector, SVG, pixels, measure, edge detection, menu bar, offline,
notarized, macOS 13+, Apple Silicon, Intel, Mac App Store, DMG.

## Stop-words (never in copy)

seamless, powerful, robust, supercharge, unlock, leverage, next-gen, revolutionary,
magical, AI-powered, premium, enterprise-grade, industry-leading, best-in-class,
harness, unleash, elevate, game-changer, swiss army knife, productivity boost,
"in today's fast-paced world." No em-dash, no exclamation marks, no emoji in copy.

## Out of scope

No Windows/Linux (macOS only). No new modes beyond the five that ship. No fabricated
logos/testimonials/case studies. No stock photos of people in headphones. No AI
illustration for the hero.

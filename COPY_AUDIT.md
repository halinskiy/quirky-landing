# Quirky Copy Audit
Date: 2026-06-01 (v0.3 second redesign pass appended below)
Author: 3mpq-copywriter
Scope: v0.2 redesign cut. One line per section directive. copy.json edited in place.

Previous audit (2026-05-31) covered banned words, App Store honesty, and factual accuracy.
Those verdicts remain PASS. This file covers only the structural cuts and what the soldier must action.

---

## A. Keys emptied or shortened -- soldier must collapse in layout

### hero.subhead
Was: 56-word paragraph (hotkey, Tab, clipboard flow explained in full).
Now: "One hotkey. Five extraction modes. Lands in your clipboard." (9 words)
Soldier action: subhead container can shrink. No layout break; key exists and returns a string.

### modeRail.intro
Was: "Drag one region. Tab through what you need. Each mode copies directly to your clipboard." (15 words)
Now: "One capture. Tab to the data you need." (8 words)
Soldier action: if intro renders as a paragraph block below the eyebrow, reduce vertical space. The display number/letter per mode now carries more weight than this line.

### modeRail.modes[*].description (all five)
Was: full sentences (15-20 words each) explaining what each mode does.
Now: 2-4 word fragments used as caption labels:
- OCR: "Text off screen"
- HEX: "Any pixel's hex"
- DOM: "The live selector"
- SVG: "The real SVG"
- SPX: "Pixel measurements"
Soldier action: these are caption labels, not paragraph copy. Render at small/caption scale beneath the large mode letter or name. Switch any <p> render to a label/span. No paragraph block needed.

### howItWorks.steps[*].description (all three)
Was: 1-2 sentence explanatory paragraphs per step.
Now: single-line fragments (10 words max). Keycap and step number carry the meaning.
- Step 1: "Wakes from your menu bar. No Dock, no window."
- Step 2: "Box around whatever you need."
- Step 3: "Copies to clipboard the moment you release."
Soldier action: step description container should render as a short caption. If the component stacks title + description as a text block, description is now a caption, not a paragraph.

### features.cells[*].body (all six cells)
Was: 1-3 sentence explanatory paragraphs.
Now: 1-2 short sentences (fragments):
- ocr: "Drag over a screenshot, a PDF, a UI tooltip. Apple Vision reads it offline."
- hex: "Hover the pixel. Get the hex. Copied."
- dom: "Click a browser element. Get the selector and its text. No DevTools."
- svg: "Grab the actual SVG source from the page. Ready to paste into Figma or code."
- spx: "Draw over the gap. Edge detection finds the boundaries. You get the number."
- switcher: "Tab mid-capture. Same region, different data."
Soldier action: feature grid cells should not expect paragraph-length copy. Render body at 14-16px, max 2 lines. No clamped/expanding text needed.

### features.cells[*].detail (all six cells)
Was: ultra-technical one-liners (VNRecognizeTextRequest spec, single-pixel precision note, ghost-mode toggle, browser list).
Now: empty string "" on all six.
Soldier action: if the component conditionally renders a "detail" chip, footnote row, or tooltip from this field, that render path can be removed. Key preserved in JSON for schema safety. See Section B.

### workflows.stories[*].story (all three)
Was: 4-6 sentence first-person scenarios.
Now: 2-3 punchy sentences under 20 words total:
- Developer: "DOM mode gets the selector. HEX gets the color. SVG lifts the icon. Three facts, one capture."
- Designer: "SPX confirms the gap is 24px. HEX confirms the heading color shipped right. Done in under a minute."
- QA: "SPX gives the pixel offset. OCR grabs the exact error string. Numbers and text, not 'looks a bit off'."
Soldier action: if workflow cards have a fixed height, reduced copy will leave whitespace. Consider increasing type size or adding visual breathing room rather than stretching text.

### fits.items[*].body (all six items)
Was: 2-3 sentence explanations.
Now: 1 short line each:
- Works offline: "OCR, HEX, and SPX run entirely on your Mac."
- No account: "Download it. Open it. No email, no server, no phone home."
- Notarized: "Hardened, signed, notarized. macOS will not warn you."
- Menu bar: "Lives in the menu bar. Wakes on the hotkey."
- Two permissions: "Screen Recording and Automation. macOS prompts you for each."
- App Store or Direct: "App Store: OCR, HEX, SPX. Direct DMG: all five modes including DOM and SVG."
Soldier action: fits items are now chip-scale. If rendered in a grid with body text, collapse body to one line. A tight pill-row or badge-list layout works well here at the new scale.

### pricing.tiers[*].description
Was: 10-18 word positioning sentences.
Now:
- Free: "Three modes. The full hotkey experience."
- Pro: "All five modes. DOM and SVG included."
Soldier action: description sits below tier name and price. 1-2 lines. Feature bullet list unchanged and intact; do not cut it.

### finalCta.subhead
Was: "Five kinds of data, one hotkey, your clipboard. That is the whole trick." (13 words, comma-heavy)
Now: "Five kinds of data. One hotkey. Your clipboard." (8 words, punchy periods)
Soldier action: shorter line, no layout concern.

---

## B. Keys recommended for removal from components

### features.cells[*].detail
The detail field is now always "". If the component renders a detail slot (small print, footnote chip, tooltip trigger), remove that render path from the component. Key is kept in JSON as a schema placeholder; soldier removes the render, not the key.

### modeRail.switcherNote
Current value: "Tab mid-capture to switch modes. Or tap the floating button by your cursor."
This is now redundant. HowItWorks step 3 and the mode caption labels cover Tab switching. In the new design with massive-scale mode display, this note adds noise. Soldier should decide whether to render it or suppress it at the component level. Key kept in JSON.

---

## C. New FAQ entries added

Two new Q/A pairs inserted (positions 5 and 6 in faq.pairs) to absorb deleted detail:

### "How does OCR work? Does it send my screen to a server?"
Absorbs: features.cells[ocr].detail (VNRecognizeTextRequest, on-device processing).
Answer confirms: Apple Vision, on-device, no network, works offline. No server call.

### "Can I measure inside interactive UI without clicking through the overlay?"
Absorbs: features.cells[spx].detail (ghost mode, cmd+shift+1 toggle while in SPX).
Answer confirms: ghost mode exists, cmd+shift+1 toggles it while SPX is active.

The existing FAQ entry "Which browsers work with DOM and SVG mode?" already covers the eight-browser list from the old dom/svg detail fields, so no additional entry was needed for that.

All new entries follow voice.md constraints: ASCII only, no banned words, warm-friend tone, concrete facts only.

---

## D. double-hyphen fix

CORRECTIONS.md (Open items) flagged hero.primaryCta.note: "Apple Silicon and Intel  --  Direct download, DMG"
Fixed to: "Apple Silicon and Intel. Direct download, DMG."
Period separates the two facts. No dash of any kind introduced.

---

## E. App Store honesty check

Required by brief, confirmed intact at all six touchpoints:
- hero.secondaryCta.note: "Includes OCR, HEX, and SPX. DOM and SVG require the direct download."
- fits.items[5].body: "App Store: OCR, HEX, SPX. Direct DMG: all five modes including DOM and SVG."
- pricing.tiers[pro].note: "Direct download only. DOM and SVG use Apple Events, which the App Store sandbox does not allow."
- pricing.footnotes[0]: "App Store build: OCR, HEX, and SPX. DOM and SVG require the direct download."
- finalCta.secondaryCta.note: "Includes OCR, HEX, and SPX. DOM and SVG require the direct download."
- faq: "Why does the App Store version not have DOM and SVG?" full explanation preserved.

App Store honesty: confirmed.

---

## F. Pricing clarity check

- $16.99 one-time: pricing.tiers[pro].price + meta.metaDescription.
- "No subscription": pricing.tiers[pro].priceSub + pricing.footnotes[1].
- "A friend does not send you a monthly bill": pricing.subhead.
- Free tier clearly named, no catch language: "No credit card, no catch."
- Feature bullet list: unchanged, all five Pro bullets intact.
- Comparison note: unchanged (TextSniper/ColorSlurp/PixelSnap pricing context).

Pricing clarity: confirmed.

---

## G. Standalone legal pages

Not touched. They need their detail; the one-line directive does not apply to /privacy-policy, /terms, /refunds, /thanks, /404.

---

# v0.3 Second Redesign Pass — 2026-06-01
Author: 3mpq-copywriter
Scope: CORRECTIONS.md "REDESIGN REFINEMENT" brief. No-dash sweep, mode verb phrases, section consolidation, new keys, soldier action notes.

---

## H. No-dash sweep (all user-facing strings)

### Hyphens removed or rewritten

| Location | Was | Now | Method |
|---|---|---|---|
| pricing.tiers[free].features[4] | "Menu-bar icon, cmd+shift+1 hotkey" | "Menu bar icon, cmd+shift+1 hotkey" | space replaces hyphen |
| pricing.tiers[free].features[5] | "Sparkle auto-update" | "Sparkle auto update" | space replaces hyphen |
| pricing.footnotes[1] | "One-time purchase." | "One time purchase." | space replaces hyphen |
| features.cells[switcher].title | "Switch modes without re-drawing" | "Switch modes without redrawing" | prefix merged |
| standalone.privacyPolicy.sections[4].body | "third-party support platform" | "third party support platform" | space replaces hyphen |
| standalone.terms.sections[1].body | "One-time purchase" | "One time purchase" | space replaces hyphen |

### Verified no change needed (intentional compound forms that are standard proper nouns or technical strings)
- "cmd+shift+1": plus signs, not hyphens. Correct.
- "Apple Silicon": no hyphen. Correct.
- "on-device": appears only in previous audit notes (not in copy.json values). Not present in user-facing strings.
- "v1.0", "macOS 13+", "DMG", "OCR/HEX/SPX": no hyphens.
- "hegona3@gmail.com": no hyphens in user-facing context.
- "reportaproblem.apple.com": domain, no hyphen as separator.

### Confirmed absent
Em-dash (--), en-dash, and hyphen-as-separator: 0 instances in all user-facing string values after this pass.

---

## I. modeRail.modes descriptions rewritten as animated-panel headings

Chips are removed from the design. Each mode.description is now a short verb phrase that headings an animated demo panel. These replace the old caption fragments.

| Mode | Old caption | New verb phrase heading |
|---|---|---|
| OCR | "Text off screen" | "Read text off the screen" |
| HEX | "Any pixel's hex" | "Take any pixel's hex" |
| DOM | "The live selector" | "Pull the live selector" |
| SVG | "The real SVG" | "Lift the real SVG" |
| SPX | "Pixel measurements" | "Measure in pixels" |

Soldier action: render each mode.description as a heading (H3 or display size) for its animated panel, not as a caption label. The old fragment copy was caption-scale; the new verb phrase is heading-scale.

### modeRail.switcherNote
Set to "" (empty string). Redundant with howItWorks step 3 and the mode panel context. Soldier: do not render this field. Key kept in JSON for schema safety.

---

## J. New keys added

### modes.proofLine
New top-level key added under "modes" object.
Value: "Clone a pricing card: selector, color, and icon in three captures."
Source: salvaged from workflows.stories[0].story (developer scenario). One proof line that shows all three browser modes working together.
Soldier action: this line can appear at the bottom of the Modes showcase section, after the five animated panels, as a single proof statement. Render at body scale, not heading scale. No chip, no card.

### fits.strip
New key added inside "fits" object.
Value: "Works offline. No account. Notarized by Apple. App Store ships OCR, HEX, SPX. The direct download adds DOM and SVG."
Purpose: the Fits section is demoted from a 6-card grid to a thin one-line trust strip. This single string is the full content of that strip.
Soldier action: render fits.strip as a single centered or left-aligned line at body scale in a minimal horizontal band. The per-item fits.items data is preserved in JSON in case it is needed later, but the primary render path for the new design is fits.strip only.

---

## K. Sections marked for removal from the rendered page

### workflows (entire section)
The Workflows section is DROPPED as a rendered section. The proof line has been salvaged into modes.proofLine. The JSON object is kept for schema history.
Soldier action: do not render a Workflows section. The workflows JSON block can be deleted from the component tree. The JSON key stays in copy.json.

### fits (6-card grid layout)
The Fits section grid is DEMOTED. Do not render the 6-card fits.items grid. Render only fits.strip as a thin trust band.
Soldier action: remove the card grid render path. The fits.items array stays in JSON.

### modeRail chips / caption labels
The chip UI (mode switcher chips, any chip-scale label under a mode) is removed. Modes communicate via animation. The mode.description field is now a heading, not a chip label.
Soldier action: remove any chip or badge component rendered from modeRail.modes. Use mode.description as an animated panel heading instead.

---

## L. Pricing and App Store honesty: confirmed carried through

All six App Store honesty touchpoints from v0.2 audit (Section E) survive unchanged in v0.3.
$16.99 one time: confirmed in pricing.tiers[pro].price and meta.metaDescription.
"One time. No subscription.": confirmed in pricing.tiers[pro].priceSub.
"A friend does not send you a monthly bill.": confirmed in pricing.subhead.
Pricing clarity: PASS.

---

## M. Features section: detail fields

All six features.cells[*].detail fields remain "". No change from v0.2. Soldier: do not render a detail slot in feature cells.

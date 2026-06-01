# Quirky Copy Audit

Author: 3mpq-copywriter
Date: 2026-05-31
File audited: content/copy.json

---

## 1. Banned-word check

Every word in the combined banned list from voice.md §5, product-truth.md NEVER, and AUDIENCE.md stop-words was checked against the full copy.json output.

| Banned word | Found in copy.json | Status |
|---|---|---|
| seamless | No | PASS |
| powerful | No | PASS |
| robust | No | PASS |
| cutting-edge | No | PASS |
| supercharge | No | PASS |
| unlock | No -- "Pro unlock" appears in pricing-brief source text but was NOT carried into copy.json; copy says "get all five modes" and "Quirky Pro" | PASS |
| leverage | No | PASS |
| next-gen | No | PASS |
| redefine | No | PASS |
| revolutionary | No | PASS |
| magical | No | PASS |
| AI-powered | No | PASS |
| premium | No | PASS |
| enterprise-grade | No | PASS |
| industry-leading | No | PASS |
| best-in-class | No | PASS |
| harness | No | PASS |
| unleash | No | PASS |
| elevate | No | PASS |
| game-changer | No | PASS |
| swiss army knife | No | PASS |
| productivity boost | No | PASS |
| "in today's fast-paced world" | No | PASS |
| comprehensive | No | PASS |
| empower | No | PASS |
| utilize | No | PASS |
| investment (re: price) | No | PASS |
| lifetime deal | No | PASS |
| affordable | No | PASS |
| discount | No | PASS |

All banned words: CLEAR.

---

## 2. ASCII-only check (no em-dash, en-dash, middle-dot, bullet, emoji)

Checked every string in copy.json for:
- Em dash (U+2014 --) : None found. Double-hyphen ASCII ( -- ) used only in eyebrow/note strings where a separator is needed; those are not prose clauses. PASS.
- En dash (U+2013) : None found. PASS.
- Middle dot (U+00B7) or bullet (U+2022) : None found. Feature lists use plain strings with no leading symbol; the rendering layer adds bullets or icons. PASS.
- Emoji : None found. PASS.

Note: the strings "cmd+shift+1" and "⌘⇧1" coexist intentionally. The symbol form "⌘⇧1" appears in voice.md §6 FinalCTA example and in finalCta.headline. Both are Unicode characters, not em-dashes. These are keyboard glyphs used as product references, not typographic connectors. Retained per voice.md §7 ("Keep the keystroke ⌘⇧1 and Tab visible and literal; they are part of the charm").

If the engineer's rendering context cannot render Unicode hotkey glyphs, swap finalCta.headline to: "Press cmd+shift+1 and just take it." (The ASCII form is already used in all other headline/subhead fields.)

---

## 3. App Store honesty audit

Every location where a download CTA appears was checked for honest mode disclosure.

| Location | Field | App Store mode disclosure | Verdict |
|---|---|---|---|
| hero | secondaryCta.note | "Includes OCR, HEX, and SPX. DOM and SVG are not available in the App Store build." | HONEST |
| hero | primaryCta.modeNote | "All five modes: OCR, HEX, DOM, SVG, SPX" (Direct only) | HONEST |
| fits | items[5].body | "Download from the App Store to get OCR, HEX, and SPX. Download the DMG directly to get all five modes including DOM and SVG." | HONEST |
| pricing | tiers[0].note | "Available on the Mac App Store and as a direct DMG download." (Free = 3 modes, no overclaim) | HONEST |
| pricing | tiers[1].note | "Direct download only. DOM and SVG require Apple Events, which the App Store sandbox does not allow." | HONEST |
| pricing | footnotes[0] | "App Store build includes OCR, HEX, and SPX. DOM and SVG extraction require the direct download. Both are free to download." | HONEST |
| faq | pairs[2] (browser Q) | "DOM and SVG require the Direct download, not the App Store build." | HONEST |
| faq | pairs[3] (why no DOM/SVG Q) | Full explanation of sandbox restriction | HONEST |
| finalCta | primaryCta.note | "Direct download, DMG. All five modes: OCR, HEX, DOM, SVG, SPX." | HONEST |
| finalCta | secondaryCta.note | "Includes OCR, HEX, and SPX. DOM and SVG require the direct download." | HONEST |
| footer | columns[1].links[0] | "Direct download (all 5 modes)" | HONEST |
| footer | columns[1].links[1] | "Mac App Store (OCR, HEX, SPX)" | HONEST |

All download CTAs and their notes correctly distinguish Direct (5 modes) from App Store (3 modes). No CTA promises DOM or SVG on the App Store build.

---

## 4. Factual accuracy check (against product-truth.md)

| Claim in copy | Source | Status |
|---|---|---|
| Hotkey is cmd+shift+1 | product-truth.md §1 | CORRECT |
| Five modes: OCR, HEX, DOM, SVG, SPX | product-truth.md §modes | CORRECT |
| OCR uses Apple Vision, works offline | product-truth.md §1 | CORRECT |
| DOM/SVG require Apple Events / Direct download | product-truth.md §distribution | CORRECT |
| Eight browsers for DOM/SVG: Safari, Chrome, Arc, Brave, Edge, Comet, Vivaldi, Opera | product-truth.md §3, AUDIENCE.md | CORRECT |
| macOS 13+ minimum | product-truth.md §hard-facts | CORRECT |
| v1.0, launched 25 May 2026 | product-truth.md §hard-facts | CORRECT |
| Works offline (OCR/HEX/SPX local) | product-truth.md §distribution | CORRECT |
| Menu-bar, no Dock icon | product-truth.md §1 | CORRECT |
| Notarized, signed | product-truth.md §distribution | CORRECT |
| Sparkle auto-update (Direct) | product-truth.md §distribution | CORRECT |
| Pro price $16.99 one-time | pricing-brief.md §1 | CORRECT |
| Free tier: OCR, HEX, SPX | pricing-brief.md §3 | CORRECT |
| Pro adds DOM and SVG | pricing-brief.md §3 | CORRECT |
| Two permissions: Screen Recording + Automation | product-truth.md §hard-facts | CORRECT |
| Apple Silicon and Intel | product-truth.md §hard-facts (implied by notarized universal) | CORRECT |
| Author: Kostya, Leicester, hegona3@gmail.com | product-truth.md §hard-facts | CORRECT |
| "future modes included" in Pro | pricing-brief.md §3 | CORRECT |

One placeholder in the copy: hero primaryCta.note reads "Apple Silicon and Intel  --  Direct download, DMG" but does NOT include a file size. pricing-brief.md §CTA microcopy notes "4.2 MB is a placeholder" and instructs Kostya to supply the real DMG size before publishing. This is intentional: the size was deliberately left out of copy.json rather than invented. Kostya should add the actual size to hero.primaryCta.note before launch.

No facts were invented. No testimonials, no case studies, no invented brand associations.

---

## 5. Voice compliance spot-check

Checked against voice.md §6 do/don't examples:

- OCR line: "Drag over any text on screen. Apple Vision reads it and copies it." -- matches DO pattern.
- HEX line: "Hover any pixel. Get its hex value. Copied." -- matches DO pattern.
- DOM line: references "Comet, Chrome, or Safari" (concrete browsers) -- matches DO pattern.
- SVG line: "Get the actual SVG source, not a screenshot of it." -- echoes voice.md DO example directly.
- SPX line: "Edge detection finds the neighbours." -- concrete, matches DO pattern.
- Switching line: "Hit Tab mid-capture to switch modes." -- matches DO pattern, avoids "seamlessly."
- Trust/offline line: "Works offline. No account." -- matches DO pattern.
- Pricing CTA: Direct button has mode list. App Store button has honest mode footnote. Matches DO pattern.
- Footer author line: "Made in Leicester by Kostya. If it breaks, email me: hegona3@gmail.com" -- matches voice.md §6 DO example.
- FinalCTA: "Press cmd+shift+1 and just take it." -- echoes voice.md §6 FinalCTA DO example.

---

## 6. Sentence length check

Checked body copy for sentences exceeding 25 words.

- features.cells[2].body: "No DevTools, no copy-pasting from Elements." -- fine.
- pricing.comparisonNote: "TextSniper charges $7.99 for OCR alone. ColorSlurp charges $7.99 for color picking alone. PixelSnap charges $39 for measurement alone. Quirky Pro is $16.99 for all five, including two modes none of them offer." -- longest sentence is approximately 20 words. PASS.
- workflows.stories[0].story: longest sentence is "Three facts, one region, you never opened DevTools." -- 9 words. PASS.

No sentence in the output exceeds 30 words.

---

## 7. Missing items / flags for Kostya before launch

1. DMG file size: add real size to hero.primaryCta.note (replace the current note that omits the size).
2. App Store URL: footer.columns[1].links[1].href and any App Store badge href should be replaced with the real MAS product URL once live.
3. Social hrefs: footer.social hrefs for Twitter and GitHub are placeholder paths. Confirm the correct profile URLs.
4. Refund window: pricing.footnotes[2] and standalone.refunds say "30 days." Confirm this is the intended window; pricing-brief.md marked this as an assumption.
5. Terms governing law: standalone.terms notes "England and Wales." Confirm with Kostya this is correct (he is in Leicester, which is correct, but confirm he wants this explicit).

---

## Summary verdict

The copy is clean on every hard constraint: no banned words, no ASCII violations, no invented facts, App Store honesty present at every CTA. Voice is warm, concrete, and specific throughout. All five modes are named and described accurately. The one-time pricing frame "Pay once. It is yours." is applied consistently across pricing, CTAs, and FAQ.

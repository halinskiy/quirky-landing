# Quirky — product truth (ground spec)

Single source of factual product behavior. Copywriter and soldier must not invent
beyond this. Verified from `/Applications/Quirky.app/Contents/Info.plist`,
`/tmp/Quirky-rename/Quirky/*.swift`, appcast, and memory `quirky-project.md`.
Snapshot: 2026-05-31.

## What it is
macOS menu-bar utility (LSUIElement, no Dock icon) for developers and designers.
One hotkey `cmd+shift+1` captures a screen region. While capturing, `Tab` switches
between 5 extraction modes. A floating glass mode-switcher pill appears when 2+ modes
are enabled, and auto-parks to the nearest screen edge as an arrow tab.

## The 5 modes (exact behavior)
1. **OCR** — Apple Vision (`VNRecognizeTextRequest`, `.accurate`, language correction
   on). Recognizes text in the captured region, copies to clipboard. Works offline.
2. **HEX** — eyedropper. Grabs the pixel color, copies the hex value.
3. **DOM** — extracts the DOM element from the browser under the capture via AppleScript.
   Supported browsers (exact list from `DOMExtractor.swift`): Safari, Google Chrome,
   Arc, Brave, Microsoft Edge, Comet, Vivaldi, Opera. Returns the element / selector.
4. **SVG** — extracts the SVG source of an icon from the page (same browser bridge).
5. **SPX** — pixel measurement, PixelSnap-style. Edge detection (`SPXAnalyzer`,
   Vision) auto-snaps measurement bounds to nearby UI element edges. Free-drag then
   magnetic snap, edge/corner resize handles, hover-reveal close, ghost-mode click-through
   (`cmd+shift+1` toggles ghost mode while in SPX). SPX coexists with the other 4 modes
   (no longer exclusive as of 1.0).

## Distribution (offer BOTH, do not hide App Store)
- **Direct**: Developer ID signed, hardened runtime, Apple notarized, DMG via site,
  Sparkle auto-update. Install without quarantine warnings. **All 5 modes.**
- **Mac App Store**: MAS_BUILD target exists. **IMPORTANT: DOM and SVG modes are NOT
  in the App Store build** — they drive the browser via Apple Events, which the MAS
  sandbox does not grant. So App Store = OCR + HEX + SPX (3 modes); Direct = all 5.
  Copy must be honest about this (e.g. App Store button noted "OCR, HEX, SPX" or a
  footnote; do not promise DOM/SVG on the App Store build).
- Sparkle feed: `https://raw.githubusercontent.com/halinskiy/Quirky/main/appcast.xml`

## Hard facts for copy / CTA microcopy
- Version: **1.0** (CFBundleShortVersionString), build 5. Launched 25 May 2026.
- Min OS: **macOS 13.0** (Ventura). Category: productivity.
- Bundle id: `com.threempq.quirky`.
- Permissions requested: Screen Recording (capture), Automation/AppleEvents (DOM + SVG
  from browser). Honest copy: these are the two prompts a user will see.
- Works offline (OCR/HEX/SPX are local; DOM/SVG need the browser, not the network).
- Author: Kostya (halinskiy), solo dev, Leicester UK. Contact: hegona3@gmail.com.

## DECIDED (locked by user, 2026-05-31)
- **Accent: warm coral `#FF7059`** (hover `#F25742`, soft `#FFE9E4`). One accent rule.
  Banned: forest green, any `#217a50`, Corder rec-red `#b7443d`.
- **Pricing: one-time unlock.** Free core + Pro one-time (~$16.99, economist confirms
  exact figure). No subscription. Frame: "a friend does not send you a monthly bill."
- **Creative override: Quirky is a FRIEND.** Toy-like, soft, blobby, friendly. Allowed
  to leave Corder's austerity toward playfulness/softness/blob-shapes ONLY in that
  direction. Keep: engineering rigor, perf budget, honest voice, zero AI cliches, no
  em-dash, ASCII only.
- **Font: Manrope** (base). Mono only inside code blocks.

## NEVER (from research-prompt + main-prompt)
- Do not rename, do not change the icon, do not invent modes not listed above.
- No fake case studies (Google/Apple/Stripe), no invented testimonials.
- No AI illustration for hero. No stock photos of people in headphones.
- Banned words: seamless, powerful, robust, cutting-edge, supercharge, unlock, leverage,
  next-gen, redefine, revolutionary, magical, AI-powered, premium, enterprise-grade,
  industry-leading, best-in-class. No em-dash/en-dash/middle-dot/bullet in user copy.

# System Distill: Corder -> Quirky

> Phase 2 deliverable. Date: 2026-05-31. Author: 3mpq-researcher.
> Source: `research/corder-teardown.md`. Three buckets: A Principles, B Decisions, C Techniques.

The rule for reading this file: **A and B carry over to Quirky unchanged in quality.
C carries over in spirit but gets re-skinned for Quirky's friendly direction.**

---

## A. PRINCIPLES (transfer with identical rigor, do not water down)

| # | Principle | Quirky note |
|---|---|---|
| A1 | **One accent only.** 5-step scale: base / hover / pressed / soft / subtle. Never a second brand color. | Pick Quirky's hue; build the same 5 steps. |
| A2 | **Light theme by default.** White `#ffffff` bg, `#161616` fg. | Keep. Quirky's playful direction reads warmer on light. A warm off-white (`#fdfcfa`) is allowed and recommended (see quirky-direction). |
| A3 | **16px body floor.** 12px only on uppercase eyebrow with `ls 0.04em`, weight 600. | Keep. Manrope at 16px reads softer than Plex Sans; good. |
| A4 | **Easing `cubic-bezier(0.16, 1, 0.3, 1)` on ALL entry animations.** No bounce, no overshoot, nothing elastic. | KEEP STRICTLY. This is the one place the "playful" override does NOT get to add bounce. Friendly comes from shape and color, not from springy motion. Pneumatic feel stays. |
| A5 | **Borders are the primary separator.** Hairline `1px #e5e5e5`. Shadows secondary, light-theme only. | Keep, but Quirky can use slightly softer/larger radii so the bordered surfaces feel rounder and friendlier. |
| A6 | **Pill CTAs only.** Square buttons forbidden. | Keep. Pills already read friendly, which suits Quirky. |
| A7 | **Dot-grid atmosphere, 24px.** | Keep as a base option. Quirky may swap to a softer grid or a blob field on hero (see quirky-direction). Dot-grid stays for standalone pages and quieter sections. |
| A8 | **Editorial copy voice. Zero AI cliches. No em-dash, en-dash, middle-dot, bullet in user-facing copy. ASCII only.** | KEEP STRICTLY. Quirky is warmer than Corder but still honest and concrete. Friendly is not the same as fluffy. |
| A9 | **Frame discipline.** Corder = "no bot in the call". Quirky needs its own single frame-anchor. | See `voice.md`. Recommended: "point at it, get the data." |
| A10 | **Performance budget.** LCP < 1.5s, INP < 100ms, CLS = 0, JS gz <= 80KB. | KEEP STRICTLY. Blobs and friendliness must be cheap: CSS/SVG, not heavy WebGL or Lottie everywhere. |
| A11 | **Standalone pages are one family.** Shared shell, single back affordance, same top offset, left-aligned headings. | Keep the family idea. Rename classes (no `legal-page` / `install-page__*` copying). |
| A12 | **Inspector data-attrs** (`data-component`, `data-source`, `data-tokens`) on every component for Webflow handoff. | Keep. |
| A13 | **Honest authorship signal.** "Made in Leicester by Kostya. Email me if it breaks: hegona3@gmail.com." | Keep, and lean in: this fits the friendly voice perfectly. |

## B. DECISIONS (stack and tooling, reuse as-is)

| # | Decision | Quirky note |
|---|---|---|
| B1 | **Next.js 15** (App Router, React 19, TS strict). | Same. |
| B2 | **Tailwind CSS v4** with `@theme` token blocks. | Same. Define Quirky tokens in `@theme`. |
| B3 | **Framer Motion 12 for hero entry only.** All scroll-linked motion uses native `animation-timeline: view()`. | Same. This is how the JS budget stays under 80KB. |
| B4 | **Static export or Vercel SSG.** `output: "export"` for GH Pages, or Vercel SSG when headers/redirects needed. | Quirky repo is `halinskiy/quirky-landing` open-source, mirroring corder-landing. Likely GH Pages static or Vercel. Default to Vercel SSG (needs headers for video + JSON-LD friendliness). |
| B5 | **Cloudflare Worker + Resend** for contact, sales, newsletter forms. | Reuse the `apps/contact-worker` pattern. New Worker route + Resend audience for Quirky. |
| B6 | **GDPR cookie consent with persistent re-open.** | Reuse the `CookieConsent` kit component. Quirky may reposition the re-open trigger (brief allows: e.g. in a shell menu instead of bottom-left ghost circle). |
| B7 | **JSON-LD: SoftwareApplication + Organization**, with `softwareVersion` pulled from appcast. | Same. Pull version from `halinskiy/Quirky/appcast.xml`. |
| B8 | **Sparkle release pattern**: GitHub Releases API + hardcoded fallback download URL. | Same. Quirky ships Direct (DMG + Sparkle) AND Mac App Store. Show BOTH buttons (Raycast-style), never hide App Store. |
| B9 | **No shadcn / Radix / MUI / GSAP / Babel-standalone / React UMD / Rive in production.** | Same. Blob shapes via SVG + CSS, not a 3D engine. |
| B10 | **`cn()` (clsx + tailwind-merge), React Context only, no state lib.** | Same. |

## C. TECHNIQUES (structural patterns: keep the bones, re-skin for friendly)

| # | Corder technique | Quirky re-skin |
|---|---|---|
| C1 | Hero = live UI demo in glass window + recording dot. | REPLACE. Quirky needs its own hero device: a region-capture cursor that fans out into 5 data chips (OCR / HEX / DOM / SVG / SPX). See quirky-direction "Hero device". Not a framed screenshot, not a recording window. |
| C2 | AudienceLine = scroll-fill word-by-word statement (section 2). | KEEP the mechanic (`animation-timeline: view()`), warm up the copy. Great friendly moment: the words "arrive" softly. |
| C3 | Two-card privacy/trust block (high position). | DEMOTE / RE-PURPOSE. Quirky's audience cares less about privacy panic than Corder's. Repurpose this two-card surface into a "fits your workflow" / "works offline, no account needed" reassurance, placed lower. |
| C4 | 6-cell features grid, hairline, NO icons. | RE-SKIN. Quirky's 5 modes are inherently iconic. Use a 5-cell (or 5+1) grid with ONE consistent decorative language (recommended: a system of monochrome blob-objects, one per mode). Still hairline grid, still tight. |
| C5 | 3+1 pricing (Free / Pro / Team + Lifetime), Pro highlighted, pill CTAs. | LOCKED to ONE-TIME UNLOCK (product-truth.md): Free core + Pro one-time ~$16.99, NO subscription, no team tier. 2 tiers, pill CTAs, Pro highlighted. Friendly frame: "a friend does not send you a monthly bill." This is also a real differentiator vs CleanShot's update-treadmill and Raycast/Sip subscriptions. |
| C6 | FAQ accordion, no decorations. | KEEP, soften the corners. |
| C7 | FinalCTA centered + big serif + pill (bookends hero). | KEEP the bookend idea. Quirky's display font is Manrope (not serif), so the final CTA echoes the hero's big Manrope headline and re-shows the 5-mode device small. |
| C8 | Footer 4-col + brand + slogan + social + cookie pref. | KEEP structure. Add the honest "made by Kostya, email me" line. Squircle mark. |
| C9 | Newsletter floating card bottom-right, Worker submit. | KEEP or fold into footer. For a solo utility a quieter newsletter is fine; floating card can feel pushy. Recommend footer-inline newsletter to stay friendly, not naggy. |
| C10 | Standalone shell family + single back arrow + cookie trigger. | KEEP the family discipline, new class names, friendlier heading style. |

### Net structural verdict for Quirky

Corder leads with privacy because its audience is scared of bots. Quirky's audience
is not scared, it is curious and busy. So Quirky should lead with **what it does**
(the 5 modes, shown not told) and reassure about workflow/offline LOWER on the page.
Full recommended order lives in `quirky-direction.md`.

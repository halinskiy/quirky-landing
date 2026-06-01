# Corder Teardown (getcorder.com)

> Phase 1 deliverable. Snapshot date: 2026-05-31.
> Author: 3mpq-researcher.

## Method note (honest sourcing)

getcorder.com is a client-rendered SPA. In this sandbox, live DOM/CSS inspection
was blocked (WebFetch returns empty on JS-rendered pages, curl has no DNS).
Rather than guess at rendered output, this teardown is built from the
**authoritative source of truth**: the actual Corder landing codebase that lives
in this monorepo at `/Users/3mpq/Aisoldier/projects/corder-landing/`, plus the
studio memory notes for Corder conventions. This is strictly better than scraping
the rendered page, because it gives the real tokens and component structure rather
than minified computed styles.

Files read:
- `projects/corder-landing/DESIGN_SYSTEM.md` (token snapshot)
- `projects/corder-landing/src/app/globals.css` (@theme block)
- `projects/corder-landing/src/app/page.tsx` (section order)
- `projects/corder-landing/src/components/sections/Hero.tsx`
- `projects/corder-landing/HANDOFF.md` (Webflow section map)
- memory: `feedback_corder_standalone_page_offsets.md`, `feedback_corder_logo_canonical.md`, `project_corder_feature_inventory.md`

Anything below quoted as code is verbatim from those files.

---

## 1. Section order (homepage, top to bottom)

From `src/app/page.tsx`:

```
Nav
Hero
AudienceLine      (scroll-fill word-by-word statement)
Privacy           (two-card trust block)
HowItWorks        (3-step)
Features          (6-cell grid, no icons)
Pricing           (3+1 tiers)
FAQ               (accordion)
FinalCTA
Footer
Newsletter        (floating card, bottom-right)
```

Key structural decision Corder makes: **Privacy sits at position 4, ABOVE Features.**
This is deliberate per the brief: Corder's audience (skeptical founders worried about
meeting bots and cloud upload) needs the privacy reassurance before they care about
the feature list. The frame "no bot in the call" is doing the heavy lifting here.

## 2. Navigation + CTA style

From `HANDOFF.md`:
> Nav — sticky, blur backdrop on scroll, logo left, links center, CTA pill right

- Sticky nav, transparent at top, gains a blur backdrop once the user scrolls (scroll-state nav, confirmed in commit `f079872`).
- Squircle logo mark left (22.4% corner radius, Apple superellipse, no drop shadow). Same mark reused in nav, footer, and standalone-page headers (memory: `feedback_corder_logo_canonical.md`).
- Links centered.
- CTA is a **pill** (rounded-full), right-aligned. Square buttons are forbidden by doctrine.

## 3. Hero

From `Hero.tsx` and `HANDOFF.md`:

```tsx
<section className="relative dot-grid pt-32 pb-24">
  <div className="mx-auto max-w-[1080px] px-6">
    <BlurReveal>
      <h1 className="font-serif text-[clamp(3.5rem,7vw,6rem)] font-semibold leading-[1.0] tracking-[-0.02em]">
        Record and transcribe
        <br />
        meetings on your Mac
      </h1>
    </BlurReveal>
    {/* live UI demo window with recording dot */}
  </div>
</section>
```

- Background: dot-grid (`.dot-grid`).
- Headline: IBM Plex Serif, `clamp(3.5rem, 7vw, 6rem)` (so 56px to 96px), weight 600, line-height 1.0, letter-spacing -0.02em. Two lines, hard `<br>` split.
- Entry motion: `BlurReveal` (blur-to-sharp, opacity, 600-800ms, ease `cubic-bezier(0.16,1,0.3,1)`). Framer Motion, entry only.
- Hero visual: **a live UI demo window** (the actual app UI, not a static screenshot) with a **pulsing red recording dot**. This is the signature Corder hero device. The recording dot is literally the accent color (`#b7443d` = "rec-red").

This is the single most important thing for Quirky to NOT copy: Corder's hero is "an app window that is recording, with a red dot." Quirky must invent its own hero device.

## 4. Color tokens (verbatim from globals.css @theme)

```css
@theme {
  /* Accent — rec-red */
  --color-accent: #b7443d;
  --color-accent-hover: #a23a34;
  --color-accent-pressed: #8f322d;
  --color-accent-soft: #f5e3e1;
  --color-accent-subtle: #fbf2f1;

  /* Borders */
  --color-border: #e5e5e5;
  --color-border-dark: #393939;

  /* Radii */
  --radius-window: 12px;
  --radius-button: 8px;

  /* Easing */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Fonts */
  --font-serif: "IBM Plex Serif", Georgia, serif;
  --font-sans: "IBM Plex Sans", system-ui, sans-serif;
}

:root {
  --background: #ffffff;
  --foreground: #161616;
}
```

Accent is a 5-step scale: base / hover / pressed / soft (tinted surface) / subtle (faint wash). Quirky must reproduce this 5-step discipline with its own hue.

Background is pure white `#ffffff`, foreground near-black `#161616`. Light theme by default.

## 5. Radii

```
--radius-window: 12px;   cards, modals, large surfaces
--radius-button: 8px;    small surfaces (but CTAs are pill rounded-full)
--radius-pill: 9999px;   CTAs, badges, dots, avatars
```

## 6. Borders + dot-grid

```
--color-border: #e5e5e5  (gray-200, light)
--color-border-dark: #393939 (dark surfaces)
hairline: 1px solid var(--color-border)
```

Borders are the **primary** separator. Shadows are secondary and light-theme only.

Dot-grid utility (verbatim):
```css
.dot-grid {
  background-image: radial-gradient(circle, #e5e5e5 1px, transparent 1px);
  background-size: 24px 24px;
}
```

## 7. Type scale (from DESIGN_SYSTEM.md)

```
display / h0 : clamp(3.5rem, 7vw, 6rem)   600 serif, lh 1.0, ls -0.02em
h1          : clamp(2.5rem, 5vw, 3.5rem)  600 serif, lh 1.05
h2          : clamp(2rem, 4vw, 2.75rem)   600 serif
h3          : 1.5rem (24px)               600 sans
body-lg     : 1.25rem (20px)              400 sans, lh 1.6
body        : 1rem (16px)                 400 sans, lh 1.6
eyebrow     : 0.75rem (12px)              600 sans, uppercase, ls 0.04em
```

Headings = IBM Plex Serif. Body/UI = IBM Plex Sans. 16px body floor; 12px only on uppercase eyebrow. (Note: booquarium later raised the floor to 14px-min in another project, but Corder itself uses 16px body / 12px eyebrow.)

## 8. Easing + motion + transitions

```
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)   ALL entry animations
durations: 150ms interactive, 600-800ms entry reveals
```

Nothing bounces. Nothing overshoots. The feel is pneumatic (fast-in, gentle-out).
Every interactive element has a transition, minimum `duration-150`.

## 9. Scroll behavior

- Smooth scroll via Lenis wired in root layout (CSS `scroll-behavior: smooth` as fallback in globals.css).
- Scroll-linked section animations (the AudienceLine fill) use native **`animation-timeline: view()`**, not JS. Framer Motion is reserved for the hero entry only. This keeps the JS budget low.

## 10. AudienceLine (scroll-fill word-by-word)

Second section. A single audience statement where each word fills from muted to full
foreground as it scrolls into view, driven by `animation-timeline: view()`. Pure CSS,
no JS scroll listeners. This is a signature 2024-2026 pattern (Awwwards catalog item 6).

## 11. Privacy two-card trust block

Position 4. Two cards on a hairline-bordered surface, communicating local-first /
no-cloud / no-bots. This is where the "no bot in the call" frame is hammered home.

## 12. Features grid

6-cell grid with hairline dividers. **No decorative pictograms** at all: text only.
The aesthetic is austere and engineering-honest. (For Quirky, the brief explicitly
allows breaking this asceticism IF a single consistent visual language is chosen.)

## 13. Pricing

3+1 tiers: Free / Pro / Team + Lifetime. Pro is the highlighted tier.
Pricing tested at $10/mo and $14/mo annual variants (volatile, memory flags it).
Pill CTAs on each tier. Card styling: hairline borders, one highlighted with accent.

## 14. FAQ

Accordion, no decorations, hairline dividers between rows.

## 15. FinalCTA

Centered, dot-grid background, big serif headline + single pill CTA. Mirrors the hero
mood to bookend the page.

## 16. Footer

From `HANDOFF.md`:
> Footer — 4-col grid, brand mark + slogan, social row, cookie pref button

- 4-column grid.
- Brand mark (the squircle) + slogan.
- Social row.
- A "Cookie preferences" button to re-open the consent dialog (GDPR requirement).
- Honest trust line in Corder voice (the studio convention: "Made in [city] by [name], email me if it breaks").

## 17. Newsletter floating card

Floating card pinned bottom-right, dismissible, submits via Cloudflare Worker.
Wired to a Worker that forwards to Resend (commit `f079872`: "wire newsletter -> Worker").

## 18. Standalone-page shell convention

From memory `feedback_corder_standalone_page_offsets.md`:

> /404 /thanks /privacy-policy /terms /refunds /signup /login /verify /account ALL
> use a shared `.legal-page` + `.legal-body` shell. No centred brand mark.
> Left-aligned. Same top offset as the main page nav. Single floating back arrow
> top-left, cookie trigger bottom-left.

So every non-home page is one family:
- `.legal-page` outer shell, `.legal-body` inner.
- Single `max-w-[1080px]` container, matching the home grid.
- Left-aligned heading (NOT centered, no brand mark floating in the middle).
- Same top offset as the home nav (visual continuity).
- One floating back arrow, top-left.
- One cookie trigger, bottom-left.
- Heading style class `install-page__heading` shared across these pages.

## 19. Contact + forms architecture

- Static site on the host (GH Pages / Vercel SSG).
- Contact form and sales form POST to a **Cloudflare Worker**.
- Worker forwards to **Resend** for transactional email (`apps/contact-worker/` in this repo, commit `881f7b6`).
- Newsletter uses the same Worker pattern + Resend Audience.
- Contact hub `/contact/` is a two-card page (general contact vs sales), each card a hairline-bordered surface; `/contact/sales` is the actual form with a pill submit.

## 20. Cookie consent

GDPR strict opt-in (commit `2a68ca7`: "CookieConsent — GDPR strict opt-in consent gate").
- Consent gate on first visit.
- Persistent re-open affordance: a bottom-left ghost circle / footer "Cookie preferences" button, reachable from any page including standalone shells.

## 21. Release + JSON-LD

- Sparkle auto-update. Download URL resolved via GitHub Releases API with a hardcoded fallback URL.
- `<head>` carries JSON-LD: `SoftwareApplication` (with `softwareVersion`) + `Organization`.

## 22. CTA / install microcopy convention

Per research-prompt voice rules: CTAs are specific, not bare "Download". Example pattern:
"Download for macOS 13+" with .dmg size and Apple Silicon / Intel note. Distribution
offers BOTH Direct (DMG + Sparkle) and Mac App Store buttons, shown explicitly (Raycast-style).

---

## What Quirky inherits unchanged (quality bar)

Tokens discipline (5-step accent), 16px body floor, single accent, light default,
pill CTAs, hairline borders, dot-grid atmosphere, `cubic-bezier(0.16,1,0.3,1)` easing,
native scroll-timeline for scroll-linked motion, Framer Motion for hero entry only,
Worker+Resend forms, GDPR consent with persistent re-open, standalone-shell family,
JSON-LD, Sparkle release pattern, squircle logo (22.4% radius, no shadow), perf budget
(LCP < 1.5s, JS <= 80KB gz, CLS 0).

## What Quirky MUST diverge on (per brief + creative override)

Accent hue (not rec-red, not forest green), font family (Manrope not IBM Plex),
hero device (not a recording window with a red dot), voice (warm/friendly not
quiet-engineer), section order (serve Quirky's audience, likely features-first),
decorative language (Quirky may add ONE visual system; Corder uses none),
emotional register (toy-like, soft, blobby, friend-not-tool).

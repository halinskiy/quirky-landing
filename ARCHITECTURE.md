# Quirky — Architecture

## Stack
- Next.js 15 (App Router, React 19), TypeScript strict.
- Tailwind CSS v4 (`@tailwindcss/postcss`), `@theme` token block in tokens.css.
- Framer Motion 12 (entry motion only), Lenis (smooth scroll, via MotionProvider).
- clsx + tailwind-merge via `cn()`. No state lib, no component library.
- Static export (`output: "export"`, `trailingSlash: true`, images unoptimized).

## Folder layout
```
quirky-landing/
  next.config.ts          static export config
  tsconfig.json           strict, @/* + @content/* aliases
  postcss.config.mjs      tailwind v4 plugin
  .github/workflows/      deploy.yml (GH Pages static)
  content/
    copy.json             all copy (copywriter owns; Phase 2 wires sections)
    pricing-brief.md      economist pricing brief
  src/
    app/
      layout.tsx          Manrope font, MotionProvider (Lenis), Inspector (dev),
                          JSON-LD, metadata, pre-hydration motion bootstrap
      page.tsx            home composition (section order)
      globals.css         Tailwind import, Lenis baseline, dot-grid, hero device
                          keyframes (quirky-marquee/float/pulse), motion-off gating
      tokens.css          @theme token source of truth (paper/ink/gray/accent)
      icon.svg            favicon: coral blob squircle + capture glyph
    components/
      sections/
        Nav.tsx           sticky nav, blob mark, coral pill CTA
        Hero.tsx          Section 1 (copy + CaptureFan + dual CTAs)
        CaptureFan.tsx    the bespoke 5-chip capture-fan hero device
        ModeRail / HowItWorks / Features / Workflows / Fits / Pricing /
        Faq / FinalCta / Footer.tsx   Phase-1 labelled placeholders
      blobs/BlobObject.tsx    the single decorative blob-object set (8 glyphs)
      ui/Button.tsx           pill CTA (primary coral / secondary ghost)
      ui/EyebrowLabel.tsx     12px uppercase eyebrow (w-fit, anti-stretch)
      providers/MotionProvider.tsx   Lenis + reduced-motion / ?motion=0 gating
      devtools/Inspector.tsx  dev-only Cmd+click overlay
    lib/cn.ts               clsx + tailwind-merge
```

## Routing
Single page (`/`) in Phase 1. Future standalone pages (privacy, terms,
refunds, thanks, 404 — copy already in copy.json `standalone`) follow the
doctrine "one family" shell with `trailingSlash`.

## Motion architecture
- Entry: Framer Motion in Hero + CaptureFan (chip stagger, copy rise).
- Smooth scroll: Lenis in MotionProvider (rAF loop), disabled under
  reduced-motion / `?motion=0`.
- The pre-hydration bootstrap in layout sets `<html data-motion="off">` before
  first paint for reduced-motion / `?motion=0`; CSS freezes the hero loops
  (marquee/float/pulse) in their final frame and Framer renders chips statically.

## Build / deploy
`npm run build` emits `out/` (static export). GitHub Actions (`deploy.yml`)
builds and pushes to GitHub Pages on `main`. Devops deploys after judge PASSED.
Home route JS measured at 61KB gzip (budget <= 80KB).

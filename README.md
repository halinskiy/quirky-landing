# quirky-landing

Marketing landing page for **Quirky**, a tiny macOS menu-bar tool. Press one
hotkey, drag a box around anything on screen, and pick what you want out of it:
OCR text, HEX colour, DOM element, SVG icon, or a pixel measurement. One capture,
five kinds of data.

This is a standalone open-source repo (`halinskiy/quirky-landing`). It is built
and maintained with the 3mpq studio design system.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript strict)
- **Tailwind CSS v4** with an `@theme` token block
- **Framer Motion 12** for hero entry motion only
- **Lenis** for smooth scroll (wired in the root layout, respects `prefers-reduced-motion`)
- Static export (`output: "export"`) to GitHub Pages

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run typecheck
```

Add `?motion=0` to any URL to disable all entry/scroll motion (final state
renders synchronously). Used for visual QA.

## Design

- Single accent: **warm coral** `#FF7059`. Light, warm-paper theme.
- Font: **Manrope** (variable, self-hosted via `next/font`). System mono for code.
- Decorative language: a set of soft monochrome **blob-objects**, one per mode.
- Easing is always `cubic-bezier(0.16, 1, 0.3, 1)`. Nothing bounces.

Made in Leicester by Kostya. If it breaks, email me: hegona3@gmail.com

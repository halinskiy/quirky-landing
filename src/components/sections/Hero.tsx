"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ModeSwitcher, type SwitcherTab } from "@/components/sections/ModeSwitcher";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * Hero (Section 1). Left: eyebrow + big Manrope headline + tight subhead, then
 * air, then the dual download CTA (Direct macOS 13+ all five modes / App Store
 * OCR-HEX-SPX honest note). Right: the interactive ModeSwitcher demo, the
 * centerpiece of the page.
 *
 * App-Store honesty: the secondary CTA note states OCR/HEX/SPX only; the primary
 * CTA note states all five modes. Both render.
 *
 * Motion-off safe: the ModeSwitcher resolves the OCR tab by default (never
 * blank); the entry reveals collapse to final state under reduced-motion/motion=0.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const c = copy.hero;
  const s = copy.switcher;

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16, filter: "blur(8px)" },
    animate: reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.5, delay, ease: EASE_OUT },
  });

  return (
    <section
      id="top"
      data-component="Hero"
      data-source="src/components/sections/Hero.tsx"
      data-tokens="paper,ink,accent,gray-200,display"
      className="dot-grid relative overflow-hidden border-b border-gray-200"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-28 lg:grid-cols-2 lg:pb-28 lg:pt-36">
        {/* Left: copy. eyebrow -> (tight) headline -> (tight) subhead as one unit,
            then GENEROUS air before the CTA. */}
        <div className="flex flex-col items-start">
          <motion.div {...rise(0)}>
            <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
          </motion.div>

          <motion.h1
            {...rise(0.06)}
            className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.03] tracking-tight text-ink"
          >
            {c.headline}
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-4 max-w-xl text-[1.1875rem] leading-relaxed text-ink/70"
          >
            {c.subhead}
          </motion.p>

          <motion.div
            {...rise(0.18)}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Button href="#download">{c.primaryCta.label}</Button>
            <Button href="#download" variant="secondary">
              {c.secondaryCta.label}
            </Button>
          </motion.div>

          <motion.div {...rise(0.24)} className="mt-5 flex flex-col gap-1.5">
            <p className="text-[1rem] text-gray-500">
              All five modes, OCR, HEX, DOM, SVG, SPX. Apple Silicon and Intel. Direct download, DMG.
            </p>
            <p className="text-[1rem] text-gray-500">
              {c.secondaryCta.note}
            </p>
          </motion.div>
        </div>

        {/* Right: the interactive ModeSwitcher. */}
        <motion.div {...rise(0.1)} className="w-full">
          <p className="mb-3 text-[1rem] font-medium text-ink/60">
            {s.intro}
          </p>
          <ModeSwitcher
            tabs={s.tabs as SwitcherTab[]}
            sceneAlt={s.sceneAlt}
            copiedLabel={s.copiedLabel}
            dataSource="src/components/sections/ModeSwitcher.tsx"
          />
        </motion.div>
      </div>
    </section>
  );
}

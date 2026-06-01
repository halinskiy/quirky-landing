"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { CaptureFan } from "@/components/sections/CaptureFan";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * Hero. All strings verbatim from copy.json (hero.*). Left column: eyebrow +
 * big Manrope headline + subhead + dual download CTA (Direct macOS 13+ / App
 * Store) with the honest App-Store-modes note under each. Right column: the
 * Capture Fan device on a dot-grid.
 *
 * App-Store honesty (COPY_AUDIT §3): the secondary CTA note states OCR/HEX/SPX
 * only; the primary CTA note states all five modes. Both are rendered.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const c = copy.hero;

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
      data-tokens="paper,ink,accent,accent-soft,gray-200,display"
      className="dot-grid relative overflow-hidden border-b border-gray-200"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-28 md:grid-cols-2 md:pb-28 md:pt-36">
        {/* Left: copy. Spacing rhythm: eyebrow -> (tight) headline -> (tight)
            subhead read as one unit, then GENEROUS air before the CTA. */}
        <div className="flex flex-col items-start">
          <motion.div {...rise(0)}>
            <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
          </motion.div>

          <motion.h1
            {...rise(0.06)}
            className="mt-6 text-[clamp(2.5rem,6.4vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight text-ink"
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
              {c.primaryCta.note}
            </p>
            <p className="text-[1rem] text-gray-500">
              {c.secondaryCta.note}
            </p>
          </motion.div>
        </div>

        {/* Right: the Capture Fan device. The plain inner `morph-handoff` wrapper
            (not the motion.div, whose inline opacity framer owns) lets the flying
            morph overlay take over this device when it is live (globals.css);
            when the morph is off this renders normally. */}
        <motion.div {...rise(0.1)} className="flex items-center justify-center">
          <div className="morph-handoff flex items-center justify-center">
            <CaptureFan />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

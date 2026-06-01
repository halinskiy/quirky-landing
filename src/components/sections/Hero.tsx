"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Quirky } from "@/components/character/Quirky";
import { ModeSwitcher, type SwitcherTab } from "@/components/sections/ModeSwitcher";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * Hero (Section 1). Left: eyebrow + big Manrope headline + tight subhead, then
 * air, then the dual download CTA. Right: the LIVING ModeSwitcher demo with the
 * Quirky character perched beside it.
 *
 * SOUL PASS:
 *  - Quirky the mascot lives at the top-right of the demo card. It blinks, its
 *    eyes follow the cursor, and on every demo grab (autoplay tick OR a visitor
 *    click) it pops to a delighted reaction with a tiny speech line
 *    (character.reactionGrab). At rest after a beat it shows the greeting.
 *  - Soft blob shapes drift behind the headline for warmth + scale.
 *
 * App-Store honesty: the secondary CTA note states OCR/HEX/SPX only; the primary
 * CTA note states all five modes. Both render.
 *
 * Motion-off safe: the ModeSwitcher resolves the OCR tab statically (never
 * blank); Quirky holds a calm static pose; entry reveals collapse to final state.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const c = copy.hero;
  const s = copy.switcher;
  const ch = copy.character;

  const [mood, setMood] = useState<"idle" | "happy">("idle");
  const [say, setSay] = useState<string | null>(ch.greeting);
  const happyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // React to a demo grab: pop happy + show "Got it." briefly, then settle to the
  // idle greeting. Skipped under reduced motion (mood stays idle, line steady).
  function handleGrab() {
    if (reduce) return;
    setMood("happy");
    setSay(ch.reactionGrab);
    if (happyTimer.current) clearTimeout(happyTimer.current);
    happyTimer.current = setTimeout(() => {
      setMood("idle");
      setSay(ch.greeting);
    }, 1500);
  }

  useEffect(() => {
    return () => {
      if (happyTimer.current) clearTimeout(happyTimer.current);
    };
  }, []);

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
      {/* Soft blob backdrop: two large accent-soft blobs for warmth + scale. */}
      <HeroBlobs reduce={reduce} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-36">
        {/* Left: copy. */}
        <div className="flex flex-col items-start">
          <motion.div {...rise(0)}>
            <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
          </motion.div>

          <motion.h1
            {...rise(0.06)}
            className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink"
          >
            {c.headline}
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 max-w-xl text-[1.25rem] leading-relaxed text-ink/70"
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
            <p className="text-[1rem] text-gray-500">{c.secondaryCta.note}</p>
          </motion.div>
        </div>

        {/* Right: the living ModeSwitcher with Quirky perched on its corner. */}
        <motion.div {...rise(0.1)} className="relative w-full">
          {/* Quirky sits on the top-right edge of the demo card. Bubble points
              left so it never pushes the layout wider on the right edge. */}
          <div className="pointer-events-none absolute -right-2 -top-12 z-20 sm:-right-3 sm:-top-14">
            <Quirky
              size={84}
              mood={mood}
              lookAt="pointer"
              say={say}
              bubbleSide="left"
              label={ch.altText}
            />
          </div>

          <p className="mb-3 text-[1rem] font-medium text-ink/60">{s.intro}</p>
          <ModeSwitcher
            tabs={s.tabs as SwitcherTab[]}
            sceneAlt={s.sceneAlt}
            copiedLabel={s.copiedLabel}
            dataSource="src/components/sections/ModeSwitcher.tsx"
            onGrab={handleGrab}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* Two large soft blobs drifting behind the hero. Pure decoration, motion-off
 * safe (they hold a static position), pointer-events-none, never overflow the
 * section (clipped by the section's overflow-hidden). */
function HeroBlobs({ reduce }: { reduce: boolean | null }) {
  const drift = (x: number, y: number) =>
    reduce
      ? {}
      : {
          animate: { x: [0, x, 0], y: [0, y, 0] },
          transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const },
        };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        {...drift(20, -16)}
        className="absolute -left-24 top-10 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--color-accent-soft)" }}
      />
      <motion.div
        {...drift(-24, 18)}
        className="absolute right-[-6rem] top-1/3 h-96 w-96 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--color-accent-subtle)" }}
      />
    </div>
  );
}

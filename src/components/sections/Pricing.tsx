"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { Quirky } from "@/components/character/Quirky";
import { useMotionOff } from "@/components/motion/useMotionOff";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * Pricing + Download (Section 3). Two tiers, one-time frame (no subscription).
 * Quirky free (OCR + HEX + SPX) and Quirky Pro $16.99 one-time (adds DOM + SVG).
 * Pro is highlighted with the accent. Both download buttons present in the
 * download band below the tiers. Footnotes carry the App-Store honesty + refund
 * + one-time lines. A compact 4-item FAQ is appended so detail exists without a
 * separate heavy section.
 *
 * Strings from copy.json.pricing (+ a 4-item slice of copy.json.faq.pairs).
 */

// The four download-relevant questions surfaced here; the rest live nowhere
// heavier than this (the page is intentionally three sections).
const COMPACT_FAQ_INDEXES = [3, 1, 7, 0];

export function Pricing() {
  const c = copy.pricing;
  const hero = copy.hero;
  const faqPairs = COMPACT_FAQ_INDEXES.map((i) => copy.faq.pairs[i]).filter(Boolean);

  return (
    <Section
      id="pricing"
      component="Pricing"
      source="src/components/sections/Pricing.tsx"
      tokens="paper,ink,accent,accent-soft,gray-200"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} intro={c.subhead} />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {c.tiers.map((tier, i) => {
          const highlight = Boolean(tier.highlight);
          return (
            <Reveal key={tier.id} index={i} className="h-full">
              <article
                className={[
                  "relative flex h-full flex-col gap-6 rounded-window border p-7 md:p-8",
                  highlight
                    ? "border-accent bg-accent-soft"
                    : "border-gray-200 bg-paper",
                ].join(" ")}
              >
                {highlight && (
                  <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-accent px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.062em] text-paper">
                    All five modes
                  </span>
                )}
                {/* Quirky perches happily on the Pro card corner: it knows this is
                    the good one. Static-safe (rests when motion is off). */}
                {highlight && (
                  <div className="pointer-events-none absolute -left-3 -top-10 z-10 hidden sm:block">
                    <Quirky size={64} mood="happy" lookAt={null} label="Quirky, delighted, next to the Pro plan" />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <h3 className="text-[1.375rem] font-extrabold tracking-tight text-ink">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[clamp(2.75rem,5vw,4rem)] font-extrabold leading-none tracking-tight text-ink">
                      {tier.price}
                    </span>
                    <span className="text-[1rem] text-gray-500">
                      {tier.priceSub}
                    </span>
                  </div>
                  <p className="text-[1rem] leading-relaxed text-gray-500">
                    {tier.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[1rem] leading-relaxed text-ink/80"
                    >
                      <Check highlight={highlight} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3">
                  <Button
                    href={tier.cta.href}
                    variant={highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {tier.cta.label}
                  </Button>
                  <p className="text-[1rem] leading-relaxed text-gray-500">
                    {tier.note}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Download band: both channels present, App-Store honesty inline. */}
      <Reveal>
        <div
          id="download"
          className="mt-8 flex scroll-mt-24 flex-col gap-4 rounded-window border border-gray-200 bg-gray-50 p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div className="flex flex-col gap-1">
            <p className="text-[1.125rem] font-bold text-ink">
              Download Quirky for macOS 13 or later.
            </p>
            <p className="text-[1rem] text-gray-500">
              {hero.secondaryCta.note}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="#download">{hero.primaryCta.label}</Button>
            <Button href="#download" variant="secondary">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Comparison note */}
      <Reveal>
        <p className="mt-8 max-w-3xl text-[1rem] leading-relaxed text-gray-500">
          {c.comparisonNote}
        </p>
      </Reveal>

      {/* Footnotes */}
      <Reveal>
        <ul className="mt-6 flex flex-col gap-2 border-t border-gray-200 pt-6">
          {c.footnotes.map((note, i) => (
            <li key={i} className="text-[1rem] leading-relaxed text-gray-500">
              {note}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Compact FAQ */}
      <CompactFaq pairs={faqPairs} />
    </Section>
  );
}

function CompactFaq({ pairs }: { pairs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();
  const motionOff = useMotionOff();
  const staticMode = reduce || motionOff;
  const baseId = useId();

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div id="faq" className="mt-14 scroll-mt-24">
      <h3 className="text-[1.375rem] font-extrabold tracking-tight text-ink">
        Before you download
      </h3>
      <div className="mt-6 overflow-hidden rounded-window border border-gray-200 bg-paper">
        {pairs.map((pair, i) => {
          const isOpen = open.has(i);
          const panelId = `${baseId}-panel-${i}`;
          const btnId = `${baseId}-btn-${i}`;
          return (
            <div key={i} className="border-b border-gray-200 last:border-b-0">
              <h4>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-150 hover:bg-accent-subtle md:px-6"
                >
                  <span className="text-[1.0625rem] font-semibold text-ink">
                    {pair.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gray-300 text-ink transition-transform duration-150 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
              </h4>

              {staticMode ? (
                isOpen && (
                  <div id={panelId} role="region" aria-labelledby={btnId} className="px-5 pb-5 md:px-6">
                    <p className="max-w-2xl text-[1rem] leading-relaxed text-gray-500">
                      {pair.a}
                    </p>
                  </div>
                )
              ) : (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 md:px-6">
                        <p className="max-w-2xl text-[1rem] leading-relaxed text-gray-500">
                          {pair.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Check({ highlight }: { highlight: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={highlight ? "var(--color-accent)" : "var(--color-accent-soft)"}
      />
      <polyline
        points="6,10.5 9,13.5 14,7"
        fill="none"
        stroke={highlight ? "var(--color-paper)" : "var(--color-accent-pressed)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

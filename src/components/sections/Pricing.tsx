"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/section/Section";
import { useMotionOff } from "@/components/motion/useMotionOff";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * Pricing + Download (Section 3) — VISUAL rebuild. The character, the long
 * descriptions, the multi line footnotes and the comparison paragraph are gone.
 * Each tier carries a row of five mode chips that light up for what is included
 * (Free lights three, Pro lights five): the difference is shown, not narrated.
 * Three short feature lines per tier, one honesty footnote, a compact FAQ with
 * one line answers. This is the "five times less text" pass.
 */

const MODE_ORDER = [
  { id: "ocr", label: "OCR" },
  { id: "hex", label: "HEX" },
  { id: "dom", label: "DOM" },
  { id: "svg", label: "SVG" },
  { id: "spx", label: "SPX" },
];

type Tier = {
  id: string;
  name: string;
  price: string;
  priceSub: string;
  modes: string[];
  features: string[];
  highlight?: boolean;
  cta: { label: string; href: string };
};

export function Pricing() {
  const c = copy.pricing;
  const hero = copy.hero;
  const faqPairs = copy.faq.pairs;

  return (
    <Section
      id="pricing"
      component="Pricing"
      source="src/components/sections/Pricing.tsx"
      tokens="paper,ink,accent,accent-soft,gray-200"
    >
      <Reveal>
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-gray-400">
            {c.eyebrow}
          </span>
          <h2 className="max-w-2xl text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-ink">
            {c.headline}
          </h2>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {(c.tiers as Tier[]).map((tier, i) => {
          const highlight = Boolean(tier.highlight);
          return (
            <div key={tier.id} className={`st-reveal st-reveal-${i + 1} h-full`}>
              <article
                className={[
                  "relative flex h-full flex-col gap-6 rounded-window border bg-paper p-7 md:p-8",
                  highlight ? "border-gray-300" : "border-gray-200",
                ].join(" ")}
              >
                {highlight && (
                  <span className="absolute right-6 top-6 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    all five
                  </span>
                )}

                <div className="flex flex-col gap-3">
                  <h3 className="font-mono text-[1.0625rem] font-bold uppercase tracking-[0.08em] text-ink">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[clamp(2.5rem,4.6vw,3.5rem)] font-bold leading-none tracking-tight text-ink">
                      {tier.price}
                    </span>
                    {tier.priceSub && (
                      <span className="font-mono text-[1rem] text-gray-500">
                        {tier.priceSub}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mode chips: filled = included. Restrained palette (no accent). */}
                <div className="flex flex-wrap gap-2">
                  {MODE_ORDER.map((m) => {
                    const on = tier.modes.includes(m.id);
                    return (
                      <span
                        key={m.id}
                        className={[
                          "inline-flex items-center rounded-button border px-3 py-1.5 font-mono text-[1rem] font-semibold",
                          on
                            ? "border-gray-300 bg-gray-50 text-ink"
                            : "border-gray-200 text-gray-300",
                        ].join(" ")}
                      >
                        {m.label}
                      </span>
                    );
                  })}
                </div>

                <ul className="flex flex-col gap-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[1rem] leading-relaxed text-ink/80"
                    >
                      <Check />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button
                    href={tier.cta.href}
                    variant={highlight ? "primary" : "secondary"}
                    className="w-full"
                    data-capture
                  >
                    {tier.cta.label}
                  </Button>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* Download band: both channels present, App Store honesty inline. */}
      <Reveal>
        <div
          id="download"
          className="mt-8 flex scroll-mt-24 flex-col gap-4 rounded-window border border-gray-200 bg-gray-50 p-6 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <p className="font-mono text-[1.0625rem] font-bold text-ink">
            download / macOS 13+
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="#download" data-capture>{hero.primaryCta.label}</Button>
            <Button href="#download" variant="secondary" data-capture>
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Single honesty footnote. */}
      <Reveal>
        <p className="mt-6 text-[1rem] leading-relaxed text-gray-500">
          {c.footnote}
        </p>
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

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 shrink-0">
      <polyline
        points="4,10.5 8.5,15 16,5"
        fill="none"
        stroke="var(--color-gray-500)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

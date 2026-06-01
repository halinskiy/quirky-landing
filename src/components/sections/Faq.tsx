"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * Faq — accordion with soft corners and NO bounce (one easing, height+opacity
 * exit). 8 Q/A from copy.json.faq.pairs. Multi mode (panels toggle
 * independently). Rotating +/- glyph. Respects prefers-reduced-motion (panel
 * appears/disappears instantly, no height animation).
 *
 * Project-local accordion (kit FAQAccordion uses --color-border / --color-text
 * which do not exist in Quirky's token set; Quirky uses gray-200 / ink). Mono
 * font is reserved for code snippets only; the FAQ copy carries none, so no
 * mono here.
 */
export function Faq() {
  const c = copy.faq;
  const [open, setOpen] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();
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
    <Section
      id="faq"
      component="Faq"
      source="src/components/sections/Faq.tsx"
      tokens="paper,ink,accent,gray-200"
      tone="surface"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} />
      </Reveal>

      <Reveal className="mt-10">
        <div className="overflow-hidden rounded-window border border-gray-200 bg-paper">
          {c.pairs.map((pair, i) => {
            const isOpen = open.has(i);
            const panelId = `${baseId}-panel-${i}`;
            const btnId = `${baseId}-btn-${i}`;
            return (
              <div
                key={i}
                className="border-b border-gray-200 last:border-b-0"
              >
                <h3>
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
                </h3>

                {reduce ? (
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
      </Reveal>
    </Section>
  );
}

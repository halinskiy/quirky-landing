"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { Keycap } from "@/components/ui/Keycap";
import { copy } from "@/content/copy";

/**
 * HowItWorks — three steps, under two seconds. Keystrokes are literal and
 * visible: step 1 surfaces a cmd+shift+1 keycap, step 3 a Tab keycap. Numbered
 * coral markers, hairline-bordered step cards, copy verbatim from
 * copy.json.howItWorks.
 */
export function HowItWorks() {
  const c = copy.howItWorks;

  return (
    <Section
      id="how-it-works"
      component="HowItWorks"
      source="src/components/sections/HowItWorks.tsx"
      tokens="paper,ink,accent,gray-200"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} />
      </Reveal>

      <ol className="mt-14 grid gap-4 md:grid-cols-3">
        {c.steps.map((step, i) => (
          <Reveal key={step.number} index={i}>
            <li className="flex h-full flex-col gap-5 rounded-card border border-gray-200 bg-paper p-7">
              <span
                aria-hidden="true"
                className="font-extrabold leading-none text-accent"
                style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
              >
                {step.number}
              </span>
              <h3 className="flex flex-wrap items-center gap-1.5 text-[1.25rem] font-bold tracking-tight text-ink">
                {renderTitleWithKeycaps(step.title)}
              </h3>
              <p className="text-[1.0625rem] leading-relaxed text-gray-500">
                {step.description}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/**
 * Splits a step title so the literal keystrokes (cmd+shift+1, Tab) render as
 * Keycap chips while the rest stays plain text. Keeps the keystrokes visible
 * and literal per voice.md §7.
 */
function renderTitleWithKeycaps(title: string) {
  const tokens = title.split(/(cmd\+shift\+1|\bTab\b)/g);
  return tokens.map((t, i) => {
    if (t === "cmd+shift+1" || t === "Tab") {
      return <Keycap key={i}>{t}</Keycap>;
    }
    return <span key={i}>{t}</span>;
  });
}

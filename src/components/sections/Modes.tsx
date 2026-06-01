"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { copy } from "@/content/copy";

/**
 * Modes (Section 2) — the informative section. Fixes the "not informative"
 * complaint: each of the five modes gets a real heading, one concrete sentence
 * of what it does and returns, a small real example output, and (where true) who
 * it is for plus the channel (free vs direct download only).
 *
 * Stacked hairline-bordered rows, no chips, no captions under blobs. A tight
 * 3-step strip sits at the top to aid comprehension (press cmd+shift+1, drag a
 * region, Tab to the mode) without becoming its own heavy section.
 *
 * Strings from copy.json.modes. Motion via Reveal (motion-off safe).
 */
export function Modes() {
  const c = copy.modes;

  return (
    <Section
      id="modes"
      component="Modes"
      source="src/components/sections/Modes.tsx"
      tokens="paper,ink,accent,gray-200,captured-blue"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} intro={c.intro} />
      </Reveal>

      {/* 3-step strip */}
      <Reveal className="mt-8">
        <ol className="flex flex-col gap-3 rounded-card border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:gap-0">
          {c.steps.map((step, i) => (
            <li
              key={step}
              className="flex flex-1 items-center gap-3 sm:px-4 sm:first:pl-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-gray-200"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[1rem] font-bold leading-none text-paper">
                {i + 1}
              </span>
              <span className="text-[1rem] font-medium text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* The five modes as readable rows */}
      <div className="mt-10 overflow-hidden rounded-window border border-gray-200">
        {c.list.map((mode, i) => (
          <Reveal key={mode.id} index={i}>
            <article className="grid items-start gap-5 border-b border-gray-200 bg-paper p-6 last:border-b-0 md:grid-cols-[120px_1fr_220px] md:gap-8 md:p-8">
              {/* name */}
              <div className="flex items-center gap-3">
                <h3 className="text-[1.5rem] font-extrabold tracking-tight text-ink">
                  {mode.name}
                </h3>
                {mode.channel === "pro" && (
                  <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.062em] text-accent-pressed">
                    Pro
                  </span>
                )}
              </div>

              {/* description + audience */}
              <div className="flex flex-col gap-2">
                <p className="text-[1.0625rem] leading-relaxed text-ink/80">
                  {mode.line}
                </p>
                <p className="text-[1rem] text-gray-500">{mode.audience}</p>
              </div>

              {/* example output */}
              <div className="flex md:justify-end">
                <Example kind={mode.exampleKind} value={mode.example} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* Real example output per mode, rendered in the project token language. */
function Example({ kind, value }: { kind: string; value: string }) {
  if (kind === "color") {
    return (
      <span className="inline-flex items-center gap-3 rounded-button border border-gray-200 bg-gray-50 px-3 py-2.5">
        <span
          className="h-7 w-7 rounded-md border border-gray-300"
          style={{ background: "var(--color-captured-blue)" }}
          aria-hidden="true"
        />
        <code className="font-mono text-[1.0625rem] font-semibold text-ink">
          {value}
        </code>
      </span>
    );
  }

  if (kind === "measure") {
    return (
      <span className="inline-flex items-center gap-3 rounded-button border border-gray-200 bg-gray-50 px-3 py-2.5">
        <svg width="40" height="20" viewBox="0 0 40 20" aria-hidden="true">
          <line x1="4" y1="10" x2="36" y2="10" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="4" x2="4" y2="16" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="4" x2="36" y2="16" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <code className="font-mono text-[1.0625rem] font-semibold text-ink">
          {value}
        </code>
      </span>
    );
  }

  if (kind === "svg") {
    return (
      <span className="inline-flex items-center gap-3 rounded-button border border-gray-200 bg-gray-50 px-3 py-2.5">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.6 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16.9 6.5 19l1.4-6.1L3.2 8.8l6.2-.6L12 2.5z"
            fill="var(--color-accent)"
            stroke="var(--color-ink)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
        <code className="font-mono text-[1.0625rem] font-semibold text-ink">
          {value}
        </code>
      </span>
    );
  }

  // text / selector
  return (
    <span className="inline-flex items-center rounded-button border border-gray-200 bg-gray-50 px-3 py-2.5">
      <code className="font-mono text-[1.0625rem] font-semibold text-ink">
        {value}
      </code>
    </span>
  );
}

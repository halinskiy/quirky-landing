"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { copy } from "@/content/copy";

/**
 * Workflows — three audience micro-stories (frontend / designer / QA), copy
 * verbatim from copy.json.workflows. This is Quirky's trust signal: it shows
 * the tool slots into a real day, rather than reassuring about a fear (the
 * inversion of Corder's privacy block, per quirky-direction §3).
 *
 * Each story is a bordered card: segment eyebrow + scenario title + the story.
 */
export function Workflows() {
  const c = copy.workflows;

  return (
    <Section
      component="Workflows"
      source="src/components/sections/Workflows.tsx"
      tokens="paper,ink,accent,gray-200"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} />
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {c.stories.map((story, i) => (
          <Reveal key={story.segment} index={i} className="h-full">
            <article className="flex h-full flex-col gap-3 rounded-card border border-gray-200 bg-paper p-6">
              <span className="text-[0.75rem] font-semibold uppercase tracking-[0.062em] text-accent-pressed">
                {story.segment}
              </span>
              <h3 className="text-[1.1875rem] font-bold tracking-tight text-ink">
                {story.scenario}
              </h3>
              <p className="text-[1rem] leading-relaxed text-gray-500">
                {story.story}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

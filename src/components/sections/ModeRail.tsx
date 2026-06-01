"use client";

import { BlobObject, type BlobMode } from "@/components/blobs/BlobObject";
import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { copy } from "@/content/copy";

/**
 * ModeRail — "five in one". The five capture modes as soft blob-chips, one line
 * each from copy.json.modeRail. Each chip pairs a BlobObject (the ONE
 * decorative language) with the mode label and its one-line description.
 *
 * The switcher note sits below as a friendly aside, with the Tab blob.
 */
export function ModeRail() {
  const c = copy.modeRail;

  return (
    <Section
      id="modes"
      component="ModeRail"
      source="src/components/sections/ModeRail.tsx"
      tokens="paper,ink,accent,accent-soft,gray-200"
      tone="surface"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.intro} />
      </Reveal>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.modes.map((mode, i) => (
          <Reveal key={mode.id} index={i}>
            <li className="flex h-full items-start gap-4 rounded-card border border-gray-200 bg-paper p-5 transition-colors duration-150 hover:border-gray-300">
              <BlobObject
                mode={mode.id as BlobMode}
                size={48}
                decorative
                className="shrink-0"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[1.0625rem] font-bold tracking-tight text-ink">
                  {mode.label}
                </span>
                <p className="text-[1rem] leading-relaxed text-gray-500">
                  {mode.description}
                </p>
              </div>
            </li>
          </Reveal>
        ))}

        {/* Switcher note as the 6th cell, accent-soft to set it apart */}
        <Reveal index={c.modes.length}>
          <li className="flex h-full items-start gap-4 rounded-card border border-gray-200 bg-accent-soft p-5">
            <BlobObject mode="tab" size={48} decorative className="shrink-0" />
            <p className="text-[1rem] leading-relaxed text-ink/80">
              {c.switcherNote}
            </p>
          </li>
        </Reveal>
      </ul>
    </Section>
  );
}

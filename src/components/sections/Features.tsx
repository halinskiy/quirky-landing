"use client";

import { BlobObject, type BlobMode } from "@/components/blobs/BlobObject";
import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { copy } from "@/content/copy";

/**
 * Features — the 5+1 grid. One cell per mode (ocr/hex/dom/svg/spx) plus a sixth
 * "switcher / Tab" cell, all in a hairline-bordered grid. ONE blob per cell
 * (the locked monochrome-blob language, no pictogram zoo). Text verbatim from
 * copy.json.features. The `detail` line is the small technical note under each.
 *
 * The switcher cell maps to BlobObject mode="tab". All copy.json cell ids
 * (ocr/hex/dom/svg/spx) and "switcher" are valid BlobModes (switcher -> tab).
 */
const BLOB_FOR_CELL: Record<string, BlobMode> = {
  ocr: "ocr",
  hex: "hex",
  dom: "dom",
  svg: "svg",
  spx: "spx",
  switcher: "tab",
};

export function Features() {
  const c = copy.features;

  return (
    <Section
      id="features"
      component="Features"
      source="src/components/sections/Features.tsx"
      tokens="paper,ink,accent,accent-soft,gray-200"
      tone="surface"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} />
      </Reveal>

      {/* Hairline grid: gap-0 + shared borders so the grid reads as one block.
          Cells carry their own border; negative-margin trick avoided by using
          border on each cell and a wrapping rounded clip. */}
      <div className="mt-12 grid overflow-hidden rounded-card border border-gray-200 bg-paper sm:grid-cols-2 lg:grid-cols-3">
        {c.cells.map((cell, i) => {
          const isSwitcher = cell.id === "switcher";
          return (
            <Reveal key={cell.id} index={i} className="h-full">
              <article
                className={[
                  "flex h-full flex-col gap-3 border-b border-gray-200 p-6 sm:border-r",
                  isSwitcher ? "bg-accent-soft" : "bg-paper",
                ].join(" ")}
              >
                <BlobObject
                  mode={BLOB_FOR_CELL[cell.id]}
                  size={52}
                  decorative
                />
                <h3 className="text-[1.1875rem] font-bold tracking-tight text-ink">
                  {cell.title}
                </h3>
                <p className="text-[1rem] leading-relaxed text-gray-500">
                  {cell.body}
                </p>
                <p className="mt-auto pt-2 font-mono text-[1rem] leading-relaxed text-gray-500">
                  {cell.detail}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

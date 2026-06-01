"use client";

import { BlobObject, type BlobMode } from "@/components/blobs/BlobObject";
import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { copy } from "@/content/copy";

/**
 * Fits — "works the way a Mac app should". Offline, no account, notarized,
 * menu-bar only, two permissions, and the Direct-vs-App-Store split. Copy
 * verbatim from copy.json.fits. The sixth item carries the honest App Store
 * line: "App Store = OCR/HEX/SPX; DMG = all five including DOM and SVG"
 * (COPY_AUDIT §3, fits.items[5]).
 *
 * Each item gets a small check blob to keep the ONE decorative language; the
 * App-Store/Direct item gets the capture blob to read as the "two builds" note.
 */
const ITEM_BLOBS: BlobMode[] = [
  "check",
  "check",
  "check",
  "check",
  "check",
  "capture",
];

export function Fits() {
  const c = copy.fits;

  return (
    <Section
      component="Fits"
      source="src/components/sections/Fits.tsx"
      tokens="paper,ink,accent,accent-soft,gray-200"
      tone="surface"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} />
      </Reveal>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.items.map((item, i) => {
          const isStoreNote = i === c.items.length - 1;
          return (
            <Reveal key={item.title} index={i} className="h-full">
              <li
                className={[
                  "flex h-full items-start gap-4 rounded-card border border-gray-200 p-5",
                  isStoreNote ? "bg-accent-soft" : "bg-paper",
                ].join(" ")}
              >
                <BlobObject
                  mode={ITEM_BLOBS[i] ?? "check"}
                  size={40}
                  decorative
                  className="shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[1.0625rem] font-bold tracking-tight text-ink">
                    {item.title}
                  </span>
                  <p className="text-[1rem] leading-relaxed text-gray-500">
                    {item.body}
                  </p>
                </div>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

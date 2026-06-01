"use client";

import { Reveal } from "@/components/motion/Reveal";
import { copy } from "@/content/copy";

/**
 * TrustStrip — the demoted Fits section. One thin horizontal band, one line of
 * trust copy from copy.json.fits.strip (offline, no account, notarized, and the
 * honest App Store vs Direct split). No 6-card grid. The App Store honesty lives
 * here as a visible line, which the brief requires to survive somewhere.
 *
 * The single string is split on its sentence stops into quiet inline segments so
 * the band reads as a rhythmic row of facts rather than one long run, separated
 * by a small accent dot (decorative, not a text character, so the no-dash /
 * no-bullet copy rule is not touched).
 */
export function TrustStrip() {
  const strip = copy.fits.strip;
  // Split into facts on the sentence period. Keep ASCII; the separator between
  // facts is a rendered accent dot element, never a typographic bullet glyph.
  const facts = strip
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      data-component="TrustStrip"
      data-source="src/components/sections/TrustStrip.tsx"
      data-tokens="paper,ink,accent,gray-200,gray-500"
      className="border-b border-gray-200 bg-paper"
    >
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Reveal>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-center text-[1.0625rem] leading-relaxed text-gray-600">
            {facts.map((fact, i) => (
              <span key={i} className="inline-flex items-center gap-4">
                <span>{fact}.</span>
                {i < facts.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                )}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

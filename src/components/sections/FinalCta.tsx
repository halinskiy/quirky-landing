"use client";

import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Keycap } from "@/components/ui/Keycap";
import { CaptureFan } from "@/components/sections/CaptureFan";
import { Reveal } from "@/components/motion/Reveal";
import { copy } from "@/content/copy";

/**
 * FinalCta — the loud bookend. Big Manrope headline (with a literal cmd+shift+1
 * keycap), dual download (Direct = all five / App Store = OCR+HEX+SPX) with the
 * honest mode notes, and a reused mini Capture Fan. Strings verbatim from
 * copy.json.finalCta.
 *
 * The Capture Fan is reused (cheap: it is inline SVG already on the page). On
 * the home id="download" anchor so nav + CTAs land here.
 */
export function FinalCta() {
  const c = copy.finalCta;

  return (
    <section
      id="download"
      data-component="FinalCta"
      data-source="src/components/sections/FinalCta.tsx"
      data-tokens="paper,ink,accent,accent-soft,gray-200"
      className="dot-grid border-b border-gray-200 bg-paper scroll-mt-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2">
        <Reveal className="flex flex-col items-start gap-6">
          <EyebrowLabel>{c.eyebrow}</EyebrowLabel>

          <h2 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            {renderHeadline(c.headline)}
          </h2>

          <p className="max-w-xl text-[1.1875rem] leading-relaxed text-ink/70">
            {c.subhead}
          </p>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href="#download">{c.primaryCta.label}</Button>
            <Button href="#download" variant="secondary">
              {c.secondaryCta.label}
            </Button>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-[1rem] text-gray-500">{c.primaryCta.note}</p>
            <p className="text-[1rem] text-gray-500">{c.primaryCta.subNote}</p>
            <p className="text-[1rem] text-gray-500">{c.secondaryCta.note}</p>
          </div>
        </Reveal>

        <Reveal className="flex items-center justify-center" delay={0.1}>
          <div className="morph-handoff flex items-center justify-center">
            <CaptureFan />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function renderHeadline(headline: string) {
  const tokens = headline.split(/(cmd\+shift\+1)/g);
  return tokens.map((t, i) =>
    t === "cmd+shift+1" ? (
      <Keycap key={i} className="text-[0.7em]">
        {t}
      </Keycap>
    ) : (
      <span key={i}>{t}</span>
    ),
  );
}

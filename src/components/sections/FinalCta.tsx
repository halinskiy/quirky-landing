"use client";

import { Button } from "@/components/ui/Button";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Keycap } from "@/components/ui/Keycap";
import { CaptureFan } from "@/components/sections/CaptureFan";
import { Reveal } from "@/components/motion/Reveal";
import { copy } from "@/content/copy";

/**
 * FinalCta — the loud dark bookend. Full-bleed near-black break: an oversize
 * Manrope headline (with a literal cmd+shift+1 keycap), tight subhead, then
 * GENEROUS air before the dual download (Direct = all five / App Store =
 * OCR+HEX+SPX) with the honest mode notes. Strings verbatim from
 * copy.json.finalCta.
 *
 * Dark scope: text inherits paper-white; the single accent fires on the primary
 * CTA and the keycap underline. The reused Capture Fan keeps the right-column
 * device slot the morph overlay lands on (morph-handoff). On id="download" so
 * nav + CTAs land here.
 *
 * Motion-off safe: Reveal renders the final state; the dark surface is fully
 * readable static. WCAG: white headline + white/70 subhead on #160c0a pass AA.
 */
export function FinalCta() {
  const c = copy.finalCta;

  return (
    <section
      id="download"
      data-component="FinalCta"
      data-source="src/components/sections/FinalCta.tsx"
      data-tokens="ink-surface,on-dark,accent,gray-200"
      className="dark-scope dot-grid-dark relative overflow-hidden border-y border-white/10 scroll-mt-24"
      style={{ background: "var(--color-ink-surface)" }}
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:py-32 lg:grid-cols-2">
        <Reveal className="flex flex-col items-start">
          <EyebrowLabel className="bg-accent text-paper">{c.eyebrow}</EyebrowLabel>

          <h2 className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[clamp(2.25rem,5.2vw,4rem)] font-extrabold leading-[1.02] tracking-tight text-on-dark">
            {renderHeadline(c.headline)}
          </h2>

          <p className="mt-4 max-w-xl text-[1.1875rem] leading-relaxed text-on-dark/70">
            {c.subhead}
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href="#download">{c.primaryCta.label}</Button>
            <Button href="#download" variant="secondary" className="border-white/20 bg-transparent text-on-dark hover:border-on-dark/50 active:bg-white/10">
              {c.secondaryCta.label}
            </Button>
          </div>

          <div className="mt-5 flex flex-col gap-1.5">
            <p className="text-[1rem] text-on-dark/60">{c.primaryCta.note}</p>
            <p className="text-[1rem] text-on-dark/60">{c.primaryCta.subNote}</p>
            <p className="text-[1rem] text-on-dark/60">{c.secondaryCta.note}</p>
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
      <Keycap key={i} className="border-white/25 bg-white/10 text-[0.7em] text-on-dark">
        {t}
      </Keycap>
    ) : (
      <span key={i}>{t}</span>
    ),
  );
}

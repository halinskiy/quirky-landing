"use client";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "@/components/section/Section";
import { copy } from "@/content/copy";

/**
 * Pricing — two tiers, one-time frame (no subscription, no billing toggle).
 * Quirky free (OCR + HEX + SPX) and Quirky Pro $16.99 one-time (adds DOM + SVG).
 * Pro is highlighted (coral border + soft fill + a "highlight" affordance). Pill
 * CTAs on both. Footnotes carry the App Store honesty + refund + one-time lines.
 * The comparison note frames value against single-mode competitors.
 *
 * All strings verbatim from copy.json.pricing. Same $16.99 on both channels;
 * tier notes disclose channel-specific mode availability (COPY_AUDIT §3).
 */
export function Pricing() {
  const c = copy.pricing;

  return (
    <Section
      id="pricing"
      component="Pricing"
      source="src/components/sections/Pricing.tsx"
      tokens="paper,ink,accent,accent-soft,gray-200"
    >
      <Reveal>
        <SectionHeader eyebrow={c.eyebrow} headline={c.headline} intro={c.subhead} />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {c.tiers.map((tier, i) => {
          const highlight = Boolean(tier.highlight);
          return (
            <Reveal key={tier.id} index={i} className="h-full">
              <article
                className={[
                  "relative flex h-full flex-col gap-6 rounded-window border p-7 md:p-8",
                  highlight
                    ? "border-accent bg-accent-soft"
                    : "border-gray-200 bg-paper",
                ].join(" ")}
              >
                {highlight && (
                  <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-accent px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.062em] text-paper">
                    All five modes
                  </span>
                )}

                <div className="flex flex-col gap-2">
                  <h3 className="text-[1.375rem] font-extrabold tracking-tight text-ink">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[clamp(2.25rem,4vw,3rem)] font-extrabold tracking-tight text-ink">
                      {tier.price}
                    </span>
                    <span className="text-[1rem] text-gray-500">
                      {tier.priceSub}
                    </span>
                  </div>
                  <p className="text-[1rem] leading-relaxed text-gray-500">
                    {tier.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[1rem] leading-relaxed text-ink/80"
                    >
                      <Check highlight={highlight} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-3">
                  <Button
                    href={tier.cta.href}
                    variant={highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {tier.cta.label}
                  </Button>
                  <p className="text-[1rem] leading-relaxed text-gray-500">
                    {tier.note}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Comparison note */}
      <Reveal>
        <p className="mt-8 max-w-3xl text-[1rem] leading-relaxed text-gray-500">
          {c.comparisonNote}
        </p>
      </Reveal>

      {/* Footnotes */}
      <Reveal>
        <ul className="mt-6 flex flex-col gap-2 border-t border-gray-200 pt-6">
          {c.footnotes.map((note, i) => (
            <li
              key={i}
              className="text-[1rem] leading-relaxed text-gray-500"
            >
              {note}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

function Check({ highlight }: { highlight: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={highlight ? "var(--color-accent)" : "var(--color-accent-soft)"}
      />
      <polyline
        points="6,10.5 9,13.5 14,7"
        fill="none"
        stroke={highlight ? "var(--color-paper)" : "var(--color-accent-pressed)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

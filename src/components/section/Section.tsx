import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";

/**
 * Section — the shared marketing-section shell. Consistent max-width, gutters,
 * vertical rhythm, hairline bottom border (the primary separator, doctrine A5),
 * and Inspector attributes. Every home section composes inside this.
 *
 * `tone="paper"` (default) or `tone="surface"` (faint warm fill) lets adjacent
 * sections alternate without a hard background flash on scroll (RETRO: section
 * bg-flash on transitions — both tones share the warm palette).
 */
type SectionProps = {
  id?: string;
  component: string;
  source: string;
  tokens?: string;
  tone?: "paper" | "surface";
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

export function Section({
  id,
  component,
  source,
  tokens = "paper,ink,gray-200",
  tone = "paper",
  className,
  innerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      data-component={component}
      data-source={source}
      data-tokens={tokens}
      className={cn(
        "border-b border-gray-200 scroll-mt-24",
        tone === "surface" ? "bg-gray-50" : "bg-paper",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-6xl px-5 py-20 md:py-28",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * SectionHeader — eyebrow + serif-free Manrope headline + optional intro.
 * Headings use Manrope extrabold (project font is Manrope, no IBM Plex).
 */
export function SectionHeader({
  eyebrow,
  headline,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  headline: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
      <h2 className="max-w-3xl text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.1] tracking-tight text-ink">
        {headline}
      </h2>
      {intro && (
        <p
          className={cn(
            "max-w-2xl text-[1.0625rem] leading-relaxed text-gray-500",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * DarkSection — a full-bleed near-black break section for the light -> dark ->
 * light page rhythm. Sets the warm ink surface, the on-dark text scope (so child
 * text inherits paper-white), and the dark dot-grid atmosphere. Hairlines on the
 * dark surface are white at low alpha. The single accent (warm red) pops on it.
 *
 * Doctrine: borders everywhere (top + bottom hairline), one easing, Inspector
 * attributes on the root. Shadows are a light-theme device, so the dark surface
 * relies on the accent + opacity ramp, not drop shadows.
 *
 * Motion-off safe: this is a static surface; any child motion gates itself.
 */
type DarkSectionProps = {
  id?: string;
  component: string;
  source: string;
  tokens?: string;
  /** soft dark dot-grid atmosphere behind the content */
  grid?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
};

export function DarkSection({
  id,
  component,
  source,
  tokens = "ink-surface,on-dark,accent",
  grid = true,
  className,
  innerClassName,
  children,
}: DarkSectionProps) {
  return (
    <section
      id={id}
      data-component={component}
      data-source={source}
      data-tokens={tokens}
      className={cn(
        "dark-scope relative overflow-hidden border-y border-white/10 scroll-mt-24",
        grid && "dot-grid-dark",
        className,
      )}
      style={{ background: "var(--color-ink-surface)" }}
    >
      <div className={cn("relative mx-auto max-w-6xl px-5 py-24 md:py-32", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

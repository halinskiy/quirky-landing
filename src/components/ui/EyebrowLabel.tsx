import { cn } from "@/lib/cn";

/**
 * Uppercase eyebrow label. 12px is the ONLY sub-16px text allowed (doctrine A3).
 *
 * RETRO fix (template-design): inside a flex container an inline/block span
 * stretches to fill the cross axis and the coral pill looks broken. Always
 * render inline-flex + w-fit + self-start so it hugs its content in any context.
 */
export function EyebrowLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-component="EyebrowLabel"
      data-source="src/components/ui/EyebrowLabel.tsx"
      data-tokens="accent,accent-soft,text-eyebrow"
      className={cn(
        "inline-flex w-fit self-start items-center rounded-full bg-accent-soft px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.062em] text-accent-pressed",
        className,
      )}
    >
      {children}
    </span>
  );
}

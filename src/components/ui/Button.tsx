import { cn } from "@/lib/cn";

type ButtonProps = React.ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "secondary";
};

/**
 * Pill CTA. Doctrine A6: every button is a full pill. One accent.
 *   primary   = coral fill, paper text (white-on-coral passes AA at the CTA size).
 *   secondary = paper fill, ink text, hairline border.
 * Renders as <a> (the landing's CTAs are anchors to #download / app store).
 */
export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      data-component="Button"
      data-source="src/components/ui/Button.tsx"
      data-tokens={
        variant === "primary"
          ? "accent,accent-hover,accent-pressed,radius-pill"
          : "paper,ink,gray-200,radius-pill"
      }
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[1rem] font-semibold leading-none transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        variant === "primary" &&
          "bg-accent text-paper hover:bg-accent-hover active:bg-accent-pressed",
        variant === "secondary" &&
          "border border-gray-200 bg-paper text-ink hover:border-ink/30 active:bg-accent-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

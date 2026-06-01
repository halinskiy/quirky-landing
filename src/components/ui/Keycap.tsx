import { cn } from "@/lib/cn";

/**
 * Keycap — a literal keyboard keystroke rendered as a soft, bordered key
 * (cmd+shift+1, Tab). Mono font for the glyph, hairline border, button radius,
 * faint surface fill. Keeps the keystroke visible and literal per voice.md §7.
 * Inline so it sits mid-sentence inside a heading or paragraph.
 *
 * Mono font here is sanctioned: a keystroke is code-like, the same allowance
 * the brief grants for code snippets in FAQ.
 */
export function Keycap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      data-component="Keycap"
      data-source="src/components/ui/Keycap.tsx"
      data-tokens="gray-100,gray-300,ink,radius-button,font-mono"
      className={cn(
        "inline-flex items-center rounded-button border border-gray-300 bg-gray-100 px-2 py-0.5 font-mono text-[1rem] font-semibold text-ink",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

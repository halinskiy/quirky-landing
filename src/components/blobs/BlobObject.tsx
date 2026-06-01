"use client";

import { cn } from "@/lib/cn";

/**
 * BlobObject — Quirky's decorative icon system, the ONE visual language.
 *
 * One component, friendly rounded blob glyphs for each of the five capture
 * modes plus a few utility marks. Monochrome: a single coral-soft tint fill
 * with a 2px near-black (ink) stroke, rounded caps + joins, no gradients, no
 * shadows. Inline SVG, cheap. The shell is promoted to ui-kit
 * (illustration/BlobObject); the per-mode GLYPHS stay project-local because
 * they encode Quirky's specific modes.
 *
 * Doctrine: data-component / data-source / data-tokens on the root. Colours via
 * tokens only (currentColor for ink + var(--color-accent*)). No hardcoded hex.
 *
 * `x` / `y` let the SVG nest inside another <svg> (the hero capture chips).
 */
export type BlobMode =
  | "ocr"
  | "hex"
  | "dom"
  | "svg"
  | "spx"
  | "capture"
  | "tab"
  | "check";

type BlobObjectProps = {
  mode: BlobMode;
  className?: string;
  size?: number;
  /** Accessible label; falls back to mode name. Set decorative for aria-hidden. */
  label?: string;
  decorative?: boolean;
  /** SVG x/y when nested inside another <svg> (e.g. the hero device). */
  x?: number | string;
  y?: number | string;
};

/** Soft, hand-drawn-ish blob outline shared by every mode glyph. */
const BLOB_PATH =
  "M50 6 C72 6 92 18 95 42 C98 66 86 90 60 95 C34 100 12 86 7 60 C2 34 16 10 50 6 Z";

function Glyph({ mode }: { mode: BlobMode }) {
  // All glyphs drawn in a 100x100 viewBox, centred. Stroke = ink
  // (currentColor); accent fills come from CSS variables so Inspector resolves
  // the tokens.
  switch (mode) {
    case "ocr":
      return (
        <g stroke="currentColor" strokeWidth={4} strokeLinecap="round" fill="none">
          <line x1="34" y1="42" x2="66" y2="42" />
          <line x1="34" y1="52" x2="66" y2="52" />
          <line x1="34" y1="62" x2="54" y2="62" />
        </g>
      );
    case "hex":
      return (
        <circle
          cx="50"
          cy="50"
          r="16"
          fill="var(--color-accent)"
          stroke="currentColor"
          strokeWidth={4}
        />
      );
    case "dom":
      return (
        <g
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <polyline points="42,40 32,50 42,60" />
          <polyline points="58,40 68,50 58,60" />
        </g>
      );
    case "svg":
      return (
        <path
          d="M50 32 L56 46 L71 47 L59 57 L63 71 L50 63 L37 71 L41 57 L29 47 L44 46 Z"
          fill="var(--color-accent)"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
      );
    case "spx":
      return (
        <g stroke="currentColor" strokeWidth={4} strokeLinecap="round" fill="none">
          <line x1="32" y1="58" x2="68" y2="58" />
          <line x1="32" y1="52" x2="32" y2="64" />
          <line x1="68" y1="52" x2="68" y2="64" />
          <line x1="44" y1="55" x2="44" y2="61" />
          <line x1="56" y1="55" x2="56" y2="61" />
        </g>
      );
    case "capture":
      return (
        <rect
          x="34"
          y="36"
          width="32"
          height="28"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeDasharray="6 5"
          strokeLinecap="round"
        />
      );
    case "tab":
      return (
        <g
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <line x1="36" y1="50" x2="64" y2="50" />
          <polyline points="56,42 64,50 56,58" />
          <line x1="64" y1="40" x2="64" y2="60" />
        </g>
      );
    case "check":
      return (
        <polyline
          points="38,52 47,61 64,40"
          fill="none"
          stroke="currentColor"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
  }
}

export function BlobObject({
  mode,
  className,
  size = 56,
  label,
  decorative = false,
  x,
  y,
}: BlobObjectProps) {
  return (
    <svg
      data-component="BlobObject"
      data-source="ui-kit/components/illustration/BlobObject.tsx"
      data-tokens="accent,accent-soft,ink"
      width={size}
      height={size}
      x={x}
      y={y}
      viewBox="0 0 100 100"
      className={cn("text-ink", className)}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (label ?? mode)}
    >
      <path
        d={BLOB_PATH}
        fill="var(--color-accent-soft)"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Glyph mode={mode} />
    </svg>
  );
}

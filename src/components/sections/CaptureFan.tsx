"use client";

/**
 * Capture Fan — the hero centerpiece. "One capture, five kinds of data."
 *
 * A rounded screen-region selection rect sits centre with a dashed coral
 * marquee. Five blob data-chips fan outward (OCR / HEX / DOM / SVG / SPX),
 * each entering with a staggered Framer reveal. A Tab keycap cursor pulses near
 * centre-bottom (mirrors the real floating mode-switcher). Inline SVG,
 * monochrome coral + ink, no gradients/shadows, well under 15KB.
 *
 * Motion:
 *  - chip entry: opacity 0->1, blur 8->0, y 12->0, scale .96->1; 0.4s each,
 *    0.08s stagger, ease cubic-bezier(0.16,1,0.3,1). Framer Motion.
 *  - after entry chips gently float (CSS quirky-float, staggered delay).
 *  - marquee dashes march (CSS quirky-marquee), Tab keycap pulses (quirky-pulse).
 *  - ALL loops gated by prefers-reduced-motion AND html[data-motion=off]
 *    (globals.css) + paused off-screen via data-pauseable. With reduced motion
 *    chips render in their final state via the Framer `reduce` branch (no
 *    "0"/blank fallback).
 *
 * The HEX chip shows a grabbed colour (#3D9DF2 via --color-captured-blue), NOT
 * the brand coral, so it reads as "a colour you took" (quirky-direction section 4).
 */

import { motion, useReducedMotion } from "framer-motion";
import { BlobObject, type BlobMode } from "@/components/blobs/BlobObject";

type Chip = {
  mode: BlobMode;
  label: string;
  /** chip box top-left in the 600x420 viewBox */
  x: number;
  y: number;
  floatDelay: string;
};

const CHIPS: Chip[] = [
  { mode: "ocr", label: "Get started", x: 28, y: 52, floatDelay: "0s" },
  { mode: "hex", label: "#3D9DF2", x: 392, y: 44, floatDelay: "0.8s" },
  { mode: "dom", label: "button.cta", x: 428, y: 176, floatDelay: "1.6s" },
  { mode: "svg", label: "icon.svg", x: 392, y: 300, floatDelay: "2.4s" },
  { mode: "spx", label: "184 x 48", x: 36, y: 288, floatDelay: "3.2s" },
];

const CHIP_W = 148;
const CHIP_H = 56;
const EASE = [0.16, 1, 0.3, 1] as const;

export function CaptureFan() {
  const reduce = useReducedMotion();

  return (
    <svg
      data-component="CaptureFan"
      data-source="src/components/sections/CaptureFan.tsx"
      data-tokens="accent,accent-subtle,accent-soft,ink,gray-200,captured-blue"
      data-pauseable
      viewBox="0 0 600 420"
      role="img"
      aria-label="One capture fanning out into five kinds of data: text, color, DOM selector, SVG, and a pixel measurement"
      className="h-auto w-full max-w-[600px] text-ink"
    >
      {/* Center capture rect with marching marquee */}
      <rect
        x="190"
        y="120"
        width="220"
        height="150"
        rx="16"
        fill="var(--color-accent-subtle)"
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeDasharray="8 6"
        strokeLinecap="round"
        className="marquee"
        style={{ animation: "quirky-marquee 3s linear infinite" }}
      />
      {/* faint screen lines inside the capture, suggesting "any pixels" */}
      <g
        stroke="var(--color-accent)"
        strokeOpacity="0.35"
        strokeWidth={3}
        strokeLinecap="round"
      >
        <line x1="214" y1="150" x2="330" y2="150" />
        <line x1="214" y1="168" x2="386" y2="168" />
        <line x1="214" y1="186" x2="300" y2="186" />
      </g>

      {/* Tab keycap cursor — pulsing, near centre-bottom */}
      <g
        className="quirky-pulse"
        aria-hidden="true"
        style={{ animation: "quirky-pulse 1.6s ease-in-out infinite" }}
      >
        <rect
          x="268"
          y="284"
          width="64"
          height="36"
          rx="9"
          fill="var(--color-paper)"
          stroke="currentColor"
          strokeWidth={2.5}
        />
        <text
          x="300"
          y="307"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="16"
          fontWeight="600"
          fill="var(--color-ink)"
        >
          Tab
        </text>
      </g>

      {/* Five data-chips fanning out */}
      {CHIPS.map((chip, i) => {
        const cx = chip.x + CHIP_W / 2;
        const cy = chip.y + CHIP_H / 2;
        return (
          <motion.g
            key={chip.mode}
            aria-hidden="true"
            initial={
              reduce
                ? false
                : { opacity: 0, y: 12, scale: 0.96, filter: "blur(8px)" }
            }
            animate={
              reduce
                ? undefined
                : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: EASE }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            {/* float loop wrapper (CSS, gated) */}
            <g
              className="quirky-float"
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transformBox: "fill-box",
                animation: `quirky-float 4s ease-in-out ${chip.floatDelay} infinite`,
              }}
            >
              {/* connector line from capture centre to chip */}
              <line
                x1="300"
                y1="195"
                x2={cx}
                y2={cy}
                stroke="var(--color-gray-200)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <rect
                x={chip.x}
                y={chip.y}
                width={CHIP_W}
                height={CHIP_H}
                rx="16"
                fill="var(--color-paper)"
                stroke="var(--color-gray-200)"
                strokeWidth={2}
              />
              {/* HEX chip carries a real colour swatch; others a blob glyph */}
              {chip.mode === "hex" ? (
                <rect
                  x={chip.x + 12}
                  y={chip.y + 16}
                  width={24}
                  height={24}
                  rx={6}
                  fill="var(--color-captured-blue)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                />
              ) : (
                <BlobObject
                  mode={chip.mode}
                  size={40}
                  decorative
                  x={chip.x + 8}
                  y={chip.y + 8}
                />
              )}
              <text
                x={chip.x + 48}
                y={chip.y + 35}
                fontFamily="var(--font-sans)"
                fontSize="16"
                fontWeight="600"
                fill="var(--color-ink)"
              >
                {chip.label}
              </text>
            </g>
          </motion.g>
        );
      })}
    </svg>
  );
}

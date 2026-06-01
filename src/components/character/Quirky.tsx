"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useMotionOff } from "@/components/motion/useMotionOff";
import { EASE_OUT } from "@/lib/motion";

/**
 * Quirky — the mascot. ONE small friendly blob creature: a soft rounded body in
 * accent-soft with an ink hairline, two big simple eyes with tracking pupils, a
 * tiny mouth that curves up when delighted, and two little cheek blush dots that
 * appear on the happy reaction.
 *
 * Personality (the "FRIEND, not Clippy" rule):
 *  - Blinks on a randomized timer (~3 to 6s) so it never feels metronomic.
 *  - Pupils track a target on desktop: either the live pointer position OR a
 *    supplied focus point (e.g. the active demo element). Touch / coarse pointers
 *    never get tracking (no hover on touch), so it cannot wobble or cause layout
 *    cost on mobile.
 *  - `mood` drives the expression: "idle" rests, "happy" squishes up with a
 *    little bounce-free squash and blush, "peek" tilts in curiously.
 *  - Optional tiny speech line (`say`) renders a small bordered bubble that
 *    fades out on its own. Kept short, never blocks content.
 *
 * Motion-off / reduced-motion (load-bearing): a calm STATIC friendly pose. No
 * blinking, no pupil tracking, no entrance, no bubble auto-hide animation. The
 * creature is still present and charming, eyes centred, faint smile.
 *
 * Promoted to ui-kit/components/brand/Mascot.tsx as a token-driven shell; this
 * project-local copy wires the Quirky tokens + mode-specific reactions.
 */

export type QuirkyMood = "idle" | "happy" | "peek";

type QuirkyProps = {
  size?: number;
  /** Expression. Defaults to idle. */
  mood?: QuirkyMood;
  /**
   * Where the eyes look. "pointer" follows the cursor (desktop only). A point
   * follows a fixed spot in viewport coords. undefined = look straight ahead.
   */
  lookAt?: "pointer" | { x: number; y: number } | null;
  /** Optional tiny speech line. Renders a small bubble; auto-clears after a bit. */
  say?: string | null;
  /** Position of the speech bubble relative to the body. */
  bubbleSide?: "top" | "right" | "left";
  className?: string;
  decorative?: boolean;
  label?: string;
};

export function Quirky({
  size = 96,
  mood = "idle",
  lookAt = "pointer",
  say = null,
  bubbleSide = "top",
  className,
  decorative = false,
  label = "Quirky, a small friendly blob creature, looking delighted",
}: QuirkyProps) {
  const reduce = useReducedMotion();
  const motionOff = useMotionOff();
  const staticMode = reduce || motionOff;

  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Pupil offset in viewBox units (range roughly -3.2..3.2 from centre).
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const [coarse, setCoarse] = useState(false);

  // Detect coarse pointer (touch) once: no tracking on touch devices.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Blink loop: randomized cadence, a quick close+open. Off in static mode.
  useEffect(() => {
    if (staticMode) return;
    let timeout: ReturnType<typeof setTimeout>;
    let openTimeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const wait = 2600 + Math.random() * 3400;
      timeout = setTimeout(() => {
        setBlink(true);
        openTimeout = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, wait);
    };
    schedule();
    return () => {
      clearTimeout(timeout);
      clearTimeout(openTimeout);
    };
  }, [staticMode]);

  // Eye tracking. Pointer mode listens to mousemove; a fixed point recomputes on
  // change. Disabled entirely in static mode or on coarse pointers.
  useEffect(() => {
    if (staticMode || coarse || lookAt === null) return;

    function aimAt(clientX: number, clientY: number) {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.42; // eyes sit a little above centre
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      // Normalise and clamp to a gentle range so pupils never leave the eye.
      const max = 3.0;
      const reach = Math.min(dist / 220, 1);
      setPupil({
        x: (dx / dist) * max * reach,
        y: (dy / dist) * max * reach,
      });
    }

    if (lookAt === "pointer") {
      const onMove = (e: MouseEvent) => aimAt(e.clientX, e.clientY);
      window.addEventListener("mousemove", onMove, { passive: true });
      return () => window.removeEventListener("mousemove", onMove);
    } else {
      aimAt(lookAt.x, lookAt.y);
    }
  }, [staticMode, coarse, lookAt]);

  const happy = mood === "happy" && !staticMode;
  const peek = mood === "peek";

  // Eye geometry. viewBox 0..100. Eyes centred around y=42.
  const eyeY = 42;
  const lEyeX = 38;
  const rEyeX = 62;
  const eyeR = 8;
  const pupilR = 3.6;

  // In static mode pupils rest centred; happy mood lifts them slightly.
  const px = staticMode ? 0 : pupil.x;
  const py = staticMode ? 0 : happy ? pupil.y - 0.6 : pupil.y;

  return (
    <div
      ref={wrapRef}
      data-component="Quirky"
      data-source="src/components/character/Quirky.tsx"
      data-tokens="accent,accent-soft,accent-pressed,ink,paper"
      className={["relative inline-block", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
    >
      {/* Speech bubble. Tiny, bordered, optional. Never blocks the page. */}
      {say && (
        <SpeechBubble side={bubbleSide} staticMode={staticMode}>
          {say}
        </SpeechBubble>
      )}

      <motion.svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role={decorative ? "presentation" : "img"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : label}
        className="overflow-visible"
        animate={
          staticMode
            ? undefined
            : peek
              ? { rotate: -8, y: 0 }
              : happy
                ? { rotate: 0, y: -3, scaleY: 1.04, scaleX: 0.98 }
                : { rotate: 0, y: 0, scaleY: 1, scaleX: 1 }
        }
        transition={{ duration: 0.45, ease: EASE_OUT }}
        style={{ transformOrigin: "50% 80%" }}
      >
        {/* Body: soft rounded blob, accent-soft fill + ink hairline. */}
        <path
          d="M50 8 C72 8 90 20 92 44 C94 68 82 90 50 92 C18 90 6 68 8 44 C10 20 28 8 50 8 Z"
          fill="var(--color-accent-soft)"
          stroke="var(--color-ink)"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* A little accent tummy patch so the single accent reads on the body. */}
        <ellipse cx="50" cy="64" rx="20" ry="14" fill="var(--color-accent)" opacity={0.16} />

        {/* Cheek blush, only on the happy reaction. */}
        <g
          style={{
            opacity: happy ? 1 : 0,
            transition: staticMode ? undefined : "opacity 250ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <circle cx="26" cy="54" r="5" fill="var(--color-accent)" opacity={0.4} />
          <circle cx="74" cy="54" r="5" fill="var(--color-accent)" opacity={0.4} />
        </g>

        {/* Eyes. The whites are paper, lid is the body fill closing on blink. */}
        {[lEyeX, rEyeX].map((ex, i) => (
          <g key={i}>
            <circle cx={ex} cy={eyeY} r={eyeR} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={1.6} />
            {/* Pupil tracks the target. */}
            <circle
              cx={ex + px}
              cy={eyeY + py}
              r={pupilR}
              fill="var(--color-ink)"
              style={{
                transition: staticMode ? undefined : "cx 120ms linear, cy 120ms linear",
              }}
            />
            {/* tiny catchlight */}
            <circle cx={ex + px - 1.1} cy={eyeY + py - 1.1} r={1.1} fill="var(--color-paper)" />
            {/* Blink lid: a rounded rect that drops over the eye. */}
            <rect
              x={ex - eyeR - 1.4}
              y={eyeY - eyeR - 1.4}
              width={(eyeR + 1.4) * 2}
              height={(eyeR + 1.4) * 2}
              rx={eyeR}
              fill="var(--color-accent-soft)"
              style={{
                transformOrigin: `${ex}px ${eyeY - eyeR}px`,
                transform: blink ? "scaleY(1)" : "scaleY(0)",
                transition: staticMode ? undefined : "transform 90ms linear",
              }}
            />
          </g>
        ))}

        {/* Mouth: a gentle smile that widens when happy. */}
        <path
          d={happy ? "M40 70 Q50 80 60 70" : "M42 70 Q50 75 58 70"}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={2.4}
          strokeLinecap="round"
          style={{ transition: staticMode ? undefined : "d 250ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </motion.svg>
    </div>
  );
}

function SpeechBubble({
  children,
  side,
  staticMode,
}: {
  children: React.ReactNode;
  side: "top" | "right" | "left";
  staticMode: boolean;
}) {
  const pos =
    side === "right"
      ? "left-full top-1/2 ml-3 -translate-y-1/2"
      : side === "left"
        ? "right-full top-1/2 mr-3 -translate-y-1/2"
        : "bottom-full left-1/2 mb-3 -translate-x-1/2";

  const Tag = staticMode ? "div" : motion.div;
  const motionProps = staticMode
    ? {}
    : {
        initial: { opacity: 0, scale: 0.92, y: 4 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.92 },
        transition: { duration: 0.28, ease: EASE_OUT },
      };

  return (
    <Tag
      {...motionProps}
      className={`pointer-events-none absolute z-10 w-max max-w-[180px] rounded-2xl border border-gray-200 bg-paper px-3 py-1.5 text-[1rem] font-medium leading-snug text-ink shadow-sm ${pos}`}
      role="status"
    >
      {children}
    </Tag>
  );
}

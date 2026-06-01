"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

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

  // Pupil + body-lean physics via motion values (NO per-frame React re-render).
  // Raw pointer-derived targets; springs give a critically-damped, no-overshoot
  // settle (research §3: "physics without bounce"). pupil range ~ -3..3 viewBox
  // units; lean is a small rotate/translate of the whole body toward the cursor.
  const pupilXRaw = useMotionValue(0);
  const pupilYRaw = useMotionValue(0);
  const pupilX = useSpring(pupilXRaw, { stiffness: 200, damping: 26, mass: 0.5 });
  const pupilY = useSpring(pupilYRaw, { stiffness: 200, damping: 26, mass: 0.5 });

  // Body lean: rotate + small x toward the cursor. Critically damped, clamped.
  const leanXRaw = useMotionValue(0); // -1..1 horizontal pointer offset
  const leanYRaw = useMotionValue(0);
  const leanXs = useSpring(leanXRaw, { stiffness: 120, damping: 18, mass: 0.7 });
  const leanYs = useSpring(leanYRaw, { stiffness: 120, damping: 18, mass: 0.7 });
  // Map normalised lean to a gentle rotate (max 5deg) and a few px of shift.
  const bodyRotate = useTransform(leanXs, [-1, 1], [-5, 5]);
  const bodyTx = useTransform(leanXs, [-1, 1], [-4, 4]);
  const bodyTy = useTransform(leanYs, [-1, 1], [-3, 3]);

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

  // Eye tracking + body lean. Pointer mode listens to mousemove and feeds the
  // raw motion values; the springs do the damped settle. A fixed point recomputes
  // on change. Disabled entirely in static mode or on coarse pointers. Writing to
  // motion values does NOT trigger a React re-render (compositor-friendly).
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
      // Pupils: clamped reach so they never leave the eye.
      const max = 3.0;
      const reach = Math.min(dist / 220, 1);
      pupilXRaw.set((dx / dist) * max * reach);
      pupilYRaw.set((dy / dist) * max * reach);
      // Body lean: normalised horizontal/vertical offset, clamped to -1..1 over
      // a 520px reach so the whole creature tilts toward the cursor a little.
      leanXRaw.set(Math.max(-1, Math.min(1, dx / 520)));
      leanYRaw.set(Math.max(-1, Math.min(1, dy / 520)));
    }

    if (lookAt === "pointer") {
      let frame = 0;
      let lastX = 0;
      let lastY = 0;
      const onMove = (e: MouseEvent) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          aimAt(lastX, lastY);
        });
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        if (frame) cancelAnimationFrame(frame);
      };
    } else {
      aimAt(lookAt.x, lookAt.y);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticMode, coarse, lookAt]);

  const happy = mood === "happy" && !staticMode;
  const peek = mood === "peek";

  // Eye geometry. viewBox 0..100. Eyes centred around y=42.
  const eyeY = 42;
  const lEyeX = 38;
  const rEyeX = 62;
  const eyeR = 8;
  const pupilR = 3.6;

  // Pupils are driven by the springs (motion values). Per-eye x is the eye centre
  // plus the spring offset; a small "happy" lift is folded into the y spring base.
  // In static mode the springs sit at 0 (no listeners ever write to them).
  const lPupilCx = useTransform(pupilX, (v) => lEyeX + (staticMode ? 0 : v));
  const rPupilCx = useTransform(pupilX, (v) => rEyeX + (staticMode ? 0 : v));
  const pupilCy = useTransform(pupilY, (v) =>
    eyeY + (staticMode ? 0 : happy ? v - 0.6 : v),
  );
  const lLightCx = useTransform(lPupilCx, (v) => v - 1.1);
  const rLightCx = useTransform(rPupilCx, (v) => v - 1.1);
  const lightCy = useTransform(pupilCy, (v) => v - 1.1);

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
        // Outer layer carries the critically-damped BODY LEAN toward the cursor
        // (spring motion values). Static mode = no lean (springs sit at 0).
        style={
          staticMode
            ? { transformOrigin: "50% 80%" }
            : {
                transformOrigin: "50% 80%",
                rotate: bodyRotate,
                x: bodyTx,
                y: bodyTy,
              }
        }
      >
        {/* Mood layer: peek tilt / happy squash. Separate group so it does not
            fight the lean rotate on the outer svg. */}
        <motion.g
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

        {/* Eyes. The whites are paper, lid is the body fill closing on blink.
            Pupils are driven by the spring motion values (no per-frame React
            re-render); they settle with no overshoot. */}
        {[
          { ex: lEyeX, cx: lPupilCx, lcx: lLightCx },
          { ex: rEyeX, cx: rPupilCx, lcx: rLightCx },
        ].map(({ ex, cx, lcx }, i) => (
          <g key={i}>
            <circle cx={ex} cy={eyeY} r={eyeR} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth={1.6} />
            {/* Pupil tracks the target via the spring. */}
            <motion.circle cx={cx} cy={pupilCy} r={pupilR} fill="var(--color-ink)" />
            {/* tiny catchlight */}
            <motion.circle cx={lcx} cy={lightCy} r={1.1} fill="var(--color-paper)" />
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
        </motion.g>
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

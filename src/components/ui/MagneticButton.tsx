"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { useMotionOff } from "@/components/motion/useMotionOff";
import { cn } from "@/lib/cn";

/**
 * MagneticButton — a pill CTA that leans toward the cursor within a small radius
 * and springs back cleanly on leave (set-piece D, research/motion-awwwards-2026).
 *
 * The pull is transform-only (S-tier) and uses a CRITICALLY-DAMPED spring
 * (stiffness 220, damping 30, no overshoot) so it settles, never bounces. Pull is
 * clamped to a few px so it stays tasteful and never breaks layout.
 *
 * Motion-off / reduced-motion (load-bearing): the magnet is disabled, the button
 * is a plain static pill identical to Button. Touch / coarse pointers also get no
 * magnet (no hover on touch). Hover colour states are kept in all cases.
 *
 * Visual styling mirrors ui/Button exactly (one pill system, one accent).
 */

type MagneticButtonProps = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> & {
  variant?: "primary" | "secondary";
  /** Max pull distance in px. Kept small so it never looks broken. */
  strength?: number;
};

export function MagneticButton({
  variant = "primary",
  strength = 10,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const motionOff = useMotionOff();
  const staticMode = Boolean(reduce) || motionOff;

  const ref = useRef<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Critically-damped settle. No overshoot.
  const sx = useSpring(x, { stiffness: 220, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 30, mass: 0.6 });

  function onMove(e: React.MouseEvent) {
    if (staticMode) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    // Pull a fraction of the offset, clamped to strength.
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    x.set(Math.max(-strength, Math.min(strength, dx)));
    y.set(Math.max(-strength, Math.min(strength, dy)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      data-component="MagneticButton"
      data-source="src/components/ui/MagneticButton.tsx"
      data-tokens={
        variant === "primary"
          ? "accent,accent-hover,accent-pressed,radius-pill"
          : "paper,ink,gray-200,radius-pill"
      }
      onMouseMove={staticMode ? undefined : onMove}
      onMouseLeave={staticMode ? undefined : onLeave}
      style={staticMode ? undefined : { x: sx, y: sy }}
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
    </motion.a>
  );
}

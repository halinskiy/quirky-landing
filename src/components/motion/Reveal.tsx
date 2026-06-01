"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

/**
 * Reveal — the one section-enter motion for the whole site.
 *
 * Wraps children, transitions from {opacity 0, y 16, blur 8} to resting state
 * when scrolled into view. ONE easing (EASE_OUT, no bounce).
 *
 * Renders the FINAL state instantly (no blur, no offset, no whileInView) when
 * ANY of these hold (template-design RETRO: motion=0 must show final state, not
 * the initial animation frame):
 *   - prefers-reduced-motion is set, OR
 *   - html[data-motion="off"] is set (the ?motion=0 QA flag + the pre-hydration
 *     bootstrap). useReducedMotion() does NOT cover ?motion=0 on browsers that
 *     do not report reduced-motion (e.g. headless QA), so we read the flag too.
 *
 * This is the project-local equivalent of ui-kit BlurReveal. quirky-landing is a
 * standalone repo (kit copied in, not symlinked) and uses Quirky tokens, so a
 * project-local copy is correct rather than importing the kit file.
 */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** stagger index helper: multiplies a small per-item delay */
  index?: number;
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  className,
  index,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const [motionOff, setMotionOff] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    setMotionOff(document.documentElement.dataset.motion === "off");
  }, []);

  const computedDelay = delay + (index !== undefined ? index * 0.06 : 0);

  if (reduce || motionOff) {
    // Reduced motion / ?motion=0: render final state, no animation, no flash.
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10%" }}
      transition={{ duration: 0.5, delay: computedDelay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

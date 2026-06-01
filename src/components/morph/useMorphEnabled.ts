"use client";

import { useEffect, useState } from "react";

/**
 * useMorphEnabled — the single gate for the scroll-pinned morph overlay.
 *
 * The morph is an ENHANCEMENT layered on top of the static sections. It must be
 * DISABLED (and the overlay not rendered at all) when any of these hold, so the
 * static content backbone is the only thing the user sees:
 *   - prefers-reduced-motion is set, OR
 *   - html[data-motion="off"] is set (the ?motion=0 QA flag + pre-hydration
 *     bootstrap in layout.tsx), OR
 *   - the viewport is narrow (< 768px): mobile falls back to the calm per-section
 *     Reveal animations the page already ships; no fixed overlay, no scroll trap.
 *
 * This is the load-bearing Reveal lesson (template-design RETRO): never let the
 * morph become the only way content renders. Returns false during SSR and the
 * first client frame, then resolves after mount so the overlay only ever mounts
 * when it is truly safe. Re-evaluates on resize and on the motion flag changing.
 */
const DESKTOP_MIN = 768;

export function useMorphEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideQuery = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);

    const evaluate = () => {
      const motionOff = document.documentElement.dataset.motion === "off";
      const reduce = reduceQuery.matches;
      const wide = wideQuery.matches;
      setEnabled(wide && !reduce && !motionOff);
    };

    evaluate();

    reduceQuery.addEventListener("change", evaluate);
    wideQuery.addEventListener("change", evaluate);

    // The motion flag is set on <html> pre-hydration and does not emit an event;
    // observe the attribute so a late ?motion=0 toggle disables the overlay.
    const observer = new MutationObserver(evaluate);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });

    return () => {
      reduceQuery.removeEventListener("change", evaluate);
      wideQuery.removeEventListener("change", evaluate);
      observer.disconnect();
    };
  }, []);

  return enabled;
}

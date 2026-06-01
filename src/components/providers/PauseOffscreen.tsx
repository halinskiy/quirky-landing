"use client";

import { useEffect } from "react";

/**
 * PauseOffscreen — single global IntersectionObserver that toggles
 * `data-anim-paused` on every `[data-pauseable]` root when it leaves the
 * viewport. The matching CSS rule in globals.css pauses every CSS animation in
 * that subtree, so off-screen loops (the hero marquee / float / Tab-pulse) stop
 * paying paint cost while invisible, then resume on re-entry.
 */
export function PauseOffscreen() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          el.dataset.animPaused = entry.isIntersecting ? "false" : "true";
        }
      },
      { rootMargin: "120px 0px 120px 0px", threshold: 0 },
    );

    const observed = new Set<Element>();
    function scan() {
      for (const el of document.querySelectorAll("[data-pauseable]")) {
        if (observed.has(el)) continue;
        observed.add(el);
        io.observe(el);
      }
    }
    scan();
    const interval = window.setInterval(scan, 2000);

    return () => {
      window.clearInterval(interval);
      io.disconnect();
    };
  }, []);

  return null;
}

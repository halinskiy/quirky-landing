"use client";

import { useEffect, useState } from "react";

/**
 * useMotionOff — reads the `?motion=0` QA flag, surfaced by LenisProvider as
 * <html data-motion="off">. Returns true only after mount when the flag is set.
 *
 * useReducedMotion() does NOT cover ?motion=0 on browsers that do not report
 * reduced-motion (e.g. headless CDP QA), so any component that must render its
 * static fallback under the flag reads this in addition to useReducedMotion().
 *
 * Returns false during SSR and the first client frame (no document), then
 * resolves on mount and re-evaluates if the attribute changes.
 */
export function useMotionOff(): boolean {
  const [off, setOff] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () =>
      setOff(document.documentElement.dataset.motion === "off");
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    return () => observer.disconnect();
  }, []);

  return off;
}

"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * LenisProvider — wires Lenis smooth scroll into the app, per doctrine
 * ("Lenis is always wired into the root layout").
 *
 * Behaviour:
 *  - Disabled entirely under prefers-reduced-motion OR `?motion=0`: the page
 *    scrolls natively, no rAF loop runs, anchor jumps are instant. It also sets
 *    <html data-motion="off"> so the hero CSS loops freeze in their final frame
 *    and the Framer reduce-branch renders chips statically.
 *  - Intercepts in-page anchor clicks (href^="#") and routes them through
 *    Lenis.scrollTo with an 88px offset for the fixed nav.
 *  - Gentle, damped config (cubic ease-out, no overshoot) to match the
 *    pneumatic feel.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const staticMode = new URLSearchParams(window.location.search).get("motion") === "0";
    if (reduced || staticMode) {
      document.documentElement.dataset.motion = "off";
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      // cubic-bezier(0.16, 1, 0.3, 1) approximated as an ease-out cubic.
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    // Expose the instance so the GSAP hero (HeroScroll) can sync ScrollTrigger to
    // Lenis (lenis.on('scroll', ScrollTrigger.update)) for a frame-perfect scrub.
    // Only set when Lenis is actually running (motion on). Cleared on teardown.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -88 });
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

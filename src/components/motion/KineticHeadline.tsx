"use client";

import { useEffect, useRef } from "react";

/**
 * KineticHeadline — one oversized headline that reveals per-word on entry
 * (GSAP SplitText) and skews subtly with SCROLL VELOCITY, clamped to ~6deg so it
 * never looks broken (set-piece C, research/motion-awwwards-2026.md).
 *
 * --- First paint (load-bearing) ---
 * Renders the plain headline text immediately as an <h1>. GSAP + SplitText are
 * dynamic-imported AFTER mount; the split + reveal only happen once they load, so
 * the text is the LCP-safe content and is never blank or motion-only.
 *
 * --- Reduced motion / ?motion=0 (load-bearing) ---
 * If the ?motion=0 flag or prefers-reduced-motion is set, GSAP is never imported:
 * the headline stays a plain static <h1>, fully readable, no split, no skew.
 *
 * Skew is transform-only (S-tier), clamped, and eased back to 0 when scrolling
 * stops. Applied to the headline element ONLY, never body or nav.
 */

type KineticHeadlineProps = {
  text: string;
  className?: string;
};

export function KineticHeadline({ text, className }: KineticHeadlineProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const flagOff =
      new URLSearchParams(window.location.search).get("motion") === "0" ||
      document.documentElement.dataset.motion === "off";
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (flagOff || reduced) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText } = await import("gsap/SplitText");
      if (cancelled || !ref.current) return;

      const gsap = gsapMod.gsap ?? gsapMod.default;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const split = new SplitText(el, { type: "words", wordsClass: "kh-word" });

      // Per-word reveal on entry (pneumatic, fast-in gentle-out feel via power3).
      gsap.set(split.words, { yPercent: 110, opacity: 0 });
      gsap.to(split.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.06,
        delay: 0.05,
      });

      // Scroll-velocity skew, clamped to 6deg, eased back to 0 on settle.
      const setSkew = gsap.quickTo(el, "skewX", {
        duration: 0.4,
        ease: "power3.out",
      });
      const MAX = 6;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          // Normalise: velocity is px/s; scale down and clamp.
          const skew = Math.max(-MAX, Math.min(MAX, -v / 320));
          setSkew(skew);
        },
      });
      // Reset to 0 when scrolling stops (velocity tends to 0; nudge explicitly).
      let raf = 0;
      const idle = () => {
        setSkew(0);
      };
      const onScrollEnd = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() =>
          setTimeout(idle, 120) as unknown as void,
        );
      };
      window.addEventListener("scroll", onScrollEnd, { passive: true });

      cleanup = () => {
        window.removeEventListener("scroll", onScrollEnd);
        cancelAnimationFrame(raf);
        st.kill();
        split.revert();
        gsap.set(el, { clearProps: "skewX" });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [text]);

  return (
    <h1
      ref={ref}
      data-component="KineticHeadline"
      data-source="src/components/motion/KineticHeadline.tsx"
      data-tokens="ink,display"
      className={className}
      style={{ willChange: "transform" }}
    >
      {text}
    </h1>
  );
}

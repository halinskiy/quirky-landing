"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CaptureHUD — the Capture OS through-line (CORRECTIONS.md "CAPTURE OS
 * DIRECTION"). The whole site behaves like Quirky's capture overlay: the cursor
 * is the tool.
 *
 * Always on (cheap static chrome, even under motion-off):
 *   - four corner crop-marks framing the viewport,
 *   - a small mono status readout ("QUIRKY / CAPTURE").
 *
 * Desktop + pointer:fine + motion-ON only (progressive enhancement):
 *   - a thin red crosshair (full-width + full-height 1px lines) tracking the
 *     cursor on the compositor (transform only, rAF-throttled),
 *   - a live coordinate readout chip following the cursor,
 *   - a selection bracket whose corner ticks SNAP around any element marked
 *     [data-capture] (CTAs, the hero target) as you hover it.
 *
 * Under ?motion=0 / prefers-reduced-motion / touch / mobile it never attaches a
 * single listener: only the static crop-marks + status text render. The whole
 * overlay is pointer-events-none, so it never blocks interaction, and it is
 * aria-hidden (pure decoration). CLS 0 (fixed layer, no layout flow).
 */
export function CaptureHUD() {
  const [live, setLive] = useState(false);

  const hRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const brkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const flagOff =
      new URLSearchParams(window.location.search).get("motion") === "0" ||
      document.documentElement.dataset.motion === "off";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const desktop = window.matchMedia("(min-width: 769px)").matches;
    if (flagOff || reduce || !fine || !desktop) return; // static chrome only

    setLive(true);

    let raf = 0;
    let mx = 0;
    let my = 0;
    let pending = false;
    let lastCheck = 0;

    const apply = () => {
      pending = false;
      const h = hRef.current;
      const v = vRef.current;
      const dot = dotRef.current;
      const co = coordRef.current;
      if (h) h.style.transform = `translate3d(0, ${my}px, 0)`;
      if (v) v.style.transform = `translate3d(${mx}px, 0, 0)`;
      if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (co) {
        co.style.transform = `translate3d(${mx + 16}px, ${my + 18}px, 0)`;
        co.textContent = `X ${mx} · Y ${my}`;
      }

      // Snap bracket — throttled to ~every 60ms so elementFromPoint is cheap.
      const now = performance.now();
      if (now - lastCheck > 60) {
        lastCheck = now;
        const brk = brkRef.current;
        if (brk) {
          const el = document.elementFromPoint(mx, my) as HTMLElement | null;
          const tgt = el?.closest("[data-capture]") as HTMLElement | null;
          if (tgt) {
            const r = tgt.getBoundingClientRect();
            brk.style.opacity = "1";
            brk.style.transform = `translate3d(${r.left - 6}px, ${r.top - 6}px, 0)`;
            brk.style.width = `${r.width + 12}px`;
            brk.style.height = `${r.height + 12}px`;
          } else {
            brk.style.opacity = "0";
          }
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = Math.round(e.clientX);
      my = Math.round(e.clientY);
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(apply);
      }
    };
    const onLeave = () => {
      const brk = brkRef.current;
      if (brk) brk.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="capture-hud pointer-events-none fixed inset-0 z-[60]">
      {/* corner crop-marks (always on) */}
      <span className="cm cm-tl" />
      <span className="cm cm-tr" />
      <span className="cm cm-bl" />
      <span className="cm cm-br" />

      {/* status readout (always on) */}
      <div className="hud-status">QUIRKY / CAPTURE</div>

      {live && (
        <>
          <div ref={brkRef} className="hud-bracket" style={{ opacity: 0 }}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div ref={hRef} className="hud-line-h" />
          <div ref={vRef} className="hud-line-v" />
          <div ref={dotRef} className="hud-dot" />
          <div ref={coordRef} className="hud-coord">
            X 0 &middot; Y 0
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useMotionOff } from "@/components/motion/useMotionOff";
import { HexTool, OcrTool, SpxTool, DomTool, SvgTool } from "@/components/playground/tools";

/**
 * Playground — the whole site (CORRECTIONS.md "PLAYGROUND DIRECTION" 2nd pass).
 * A full-screen, desktop-only stage with a dock of the five modes. Each mode is
 * a REAL working tool (see tools.tsx): you actually do on the page what Quirky
 * does on the Mac. Minimal chrome: a wordmark, one tagline, the dock.
 */

const MODES = [
  { id: "hex", label: "HEX", tag: "Color", Tool: HexTool },
  { id: "ocr", label: "OCR", tag: "Text", Tool: OcrTool },
  { id: "dom", label: "DOM", tag: "Selector", Tool: DomTool },
  { id: "svg", label: "SVG", tag: "Source", Tool: SvgTool },
  { id: "spx", label: "SPX", tag: "Pixels", Tool: SpxTool },
] as const;

export function Playground() {
  const reduce = useReducedMotion();
  const motionOff = useMotionOff();
  const staticMode = Boolean(reduce) || motionOff;

  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: React.KeyboardEvent, i: number) {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % MODES.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + MODES.length) % MODES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = MODES.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  }

  const mode = MODES[active];
  const Tool = mode.Tool;

  return (
    <section
      id="top"
      data-component="Playground"
      data-source="src/components/playground/Playground.tsx"
      data-tokens="paper,ink,accent,gray-200,captured-blue,mono"
      className="capture-grid relative flex min-h-screen flex-col"
    >
      <header className="flex items-center justify-between px-8 pt-7">
        <span className="text-[1.25rem] font-extrabold tracking-tight text-ink">Quirky</span>
        <span className="font-mono text-[1rem] text-gray-400">macOS 13+ &middot; free core</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-5xl">
          <p className="mb-4 text-center font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-gray-400">
            try every mode &middot; it really works
          </p>

          <div className="overflow-hidden rounded-window border border-gray-300 bg-paper shadow-[0_40px_100px_-50px_rgba(26,22,20,0.5)]">
            {/* title bar */}
            <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-3 w-3 rounded-full border border-gray-300" />
                <span className="h-3 w-3 rounded-full border border-gray-300" />
                <span className="h-3 w-3 rounded-full border border-gray-300" />
              </span>
              <span className="mx-auto font-mono text-[1rem] text-gray-500">quirky / {mode.id}</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-pressed">
                <span className="h-2 w-2 rounded-full bg-accent" />
                live
              </span>
            </div>

            {/* the active tool */}
            <div id="pg-stage" role="tabpanel" aria-labelledby={`pg-tab-${mode.id}`}>
              <Tool key={mode.id} />
            </div>
          </div>

          {/* the dock */}
          <div className="mt-7 flex justify-center">
            <div
              role="tablist"
              aria-label="Capture modes"
              className="relative flex gap-1 rounded-pill border border-gray-200 bg-paper p-1.5 shadow-[0_12px_30px_-18px_rgba(26,22,20,0.5)]"
            >
              {MODES.map((m, i) => {
                const on = i === active;
                return (
                  <button
                    key={m.id}
                    ref={(el) => { tabsRef.current[i] = el; }}
                    role="tab"
                    id={`pg-tab-${m.id}`}
                    aria-selected={on}
                    aria-controls="pg-stage"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className="relative rounded-pill px-6 py-3 font-mono text-[1.0625rem] font-bold outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    {on && (
                      staticMode ? (
                        <span aria-hidden="true" className="absolute inset-0 rounded-pill bg-accent" />
                      ) : (
                        <motion.span
                          layoutId="dock-pill"
                          aria-hidden="true"
                          className="absolute inset-0 rounded-pill bg-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )
                    )}
                    <span className={`relative ${on ? "text-paper" : "text-gray-500"}`}>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

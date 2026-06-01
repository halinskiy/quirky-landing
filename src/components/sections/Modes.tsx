"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/section/Section";
import { useMotionOff } from "@/components/motion/useMotionOff";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * Modes (Section 2) — CAPTURE OS centerpiece. A light, macOS-style capture
 * WINDOW that demonstrates each of the five modes with its own distinct
 * animated micro-demo running over a sample scene (CORRECTIONS.md "CAPTURE OS
 * DIRECTION"): OCR scan-line, HEX loupe, DOM bracket + selector type, SVG lift +
 * code, SPX edge brackets counting. The window auto-cycles; clicking a mode tab
 * takes control. Result bar shows the extracted value + "copied".
 *
 * Static safety: under ?motion=0 / reduced-motion the autocycle never starts,
 * every demo renders its RESOLVED end-state (text sharp, colour locked, selector
 * full, icon lifted, measurement complete), the tabs still switch the visible
 * mode (so it is fully usable), and nothing is motion-only. CLS 0 (the stage is
 * a fixed-aspect box; demos animate transform/opacity inside it).
 */

const MODE_META = [
  { id: "ocr", label: "OCR", tag: "Text" },
  { id: "hex", label: "HEX", tag: "Color" },
  { id: "dom", label: "DOM", tag: "Selector" },
  { id: "svg", label: "SVG", tag: "Icon source" },
  { id: "spx", label: "SPX", tag: "Pixel size" },
];

const CYCLE_MS = 3800;

export function Modes() {
  const c = copy.modes;
  const reduce = useReducedMotion();
  const motionOff = useMotionOff();
  const staticMode = Boolean(reduce) || motionOff;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Autocycle through the modes (motion-on only, not while the user is hovering
  // or after they take manual control).
  useEffect(() => {
    if (staticMode || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % MODE_META.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [staticMode, paused]);

  function select(i: number) {
    setActive(i);
    setPaused(true); // taking control stops the autocycle
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % MODE_META.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + MODE_META.length) % MODE_META.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = MODE_META.length - 1;
    else return;
    e.preventDefault();
    select(next);
    tabsRef.current[next]?.focus();
  }

  const meta = MODE_META[active];

  return (
    <Section
      id="modes"
      component="Modes"
      source="src/components/sections/Modes.tsx"
      tokens="paper,ink,accent,gray-200,captured-blue,mono"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="capture-grid pointer-events-none absolute inset-0 opacity-60"
      />

      <div className="relative">
        {/* header */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-accent-pressed">
            {String(MODE_META.length).padStart(2, "0")} / {c.eyebrow}
          </span>
          <h2 className="max-w-3xl text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.04] tracking-tight text-ink">
            {c.headline}
          </h2>
        </div>

        {/* the capture window */}
        <div
          className="mt-10 overflow-hidden rounded-window border border-gray-300 bg-paper shadow-[0_30px_80px_-40px_rgba(26,22,20,0.4)]"
          onMouseEnter={() => setPaused(true)}
        >
          {/* title bar */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-3 w-3 rounded-full border border-gray-300" />
              <span className="h-3 w-3 rounded-full border border-gray-300" />
              <span className="h-3 w-3 rounded-full border border-gray-300" />
            </span>
            <span className="mx-auto font-mono text-[1rem] text-gray-500">
              quirky / capture region
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-pressed">
              <span className="h-2 w-2 rounded-full bg-accent" />
              live
            </span>
          </div>

          {/* mode tabs (segmented control) */}
          <div
            role="tablist"
            aria-label="Capture modes"
            className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50/60 p-2"
          >
            {MODE_META.map((m, i) => {
              const on = i === active;
              return (
                <button
                  key={m.id}
                  ref={(el) => { tabsRef.current[i] = el; }}
                  role="tab"
                  id={`mode-tab-${m.id}`}
                  aria-selected={on}
                  aria-controls="mode-stage"
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={[
                    "rounded-button px-3.5 py-2 font-mono text-[1rem] font-semibold transition-colors duration-150",
                    on
                      ? "bg-accent text-paper"
                      : "text-gray-500 hover:bg-accent-subtle hover:text-accent-pressed",
                  ].join(" ")}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* stage */}
          <div
            id="mode-stage"
            role="tabpanel"
            aria-labelledby={`mode-tab-${meta.id}`}
            className="grid gap-0 md:grid-cols-[1.4fr_1fr]"
          >
            {/* scene */}
            <div className="relative min-h-[300px] border-b border-gray-200 bg-gray-50/40 p-6 md:min-h-[360px] md:border-b-0 md:border-r md:p-8">
              <Demo key={staticMode ? "static" : active} mode={meta.id} staticMode={staticMode} />
            </div>

            {/* result */}
            <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  output / {meta.tag}
                </span>
                <ResultValue mode={meta.id} />
              </div>
              <div className="flex items-center gap-2 font-mono text-[1rem] text-gray-500">
                <Cursor /> copied to clipboard
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 font-mono text-[1rem] text-gray-500">
          Press{" "}
          <kbd className="rounded-[6px] border border-gray-300 bg-gray-50 px-2 py-0.5 text-ink">
            {c.hotkey}
          </kbd>{" "}
          and drag. Tab to the mode you need.
        </p>
      </div>
    </Section>
  );
}

/* ===== result value chip per mode ===== */
function ResultValue({ mode }: { mode: string }) {
  if (mode === "hex") {
    return (
      <span className="inline-flex w-fit items-center gap-3 rounded-card border border-gray-200 bg-paper px-4 py-3">
        <span className="h-8 w-8 rounded-md border border-gray-300" style={{ background: "var(--color-captured-blue)" }} />
        <code className="font-mono text-[1.5rem] font-bold text-ink">#3D9DF2</code>
      </span>
    );
  }
  if (mode === "svg") {
    return (
      <span className="inline-flex w-fit items-center gap-3 rounded-card border border-gray-200 bg-paper px-4 py-3">
        <Star size={26} />
        <code className="font-mono text-[1.5rem] font-bold text-ink">icon.svg</code>
      </span>
    );
  }
  const value = mode === "ocr" ? "Get started" : mode === "dom" ? "button.cta" : "184 x 48";
  return (
    <span className="inline-flex w-fit items-center rounded-card border border-gray-200 bg-paper px-4 py-3">
      <code className="font-mono text-[1.5rem] font-bold text-ink">{value}</code>
    </span>
  );
}

/* ===== the animated demos ===== */
function Demo({ mode, staticMode }: { mode: string; staticMode: boolean }) {
  if (mode === "ocr") return <OcrDemo staticMode={staticMode} />;
  if (mode === "hex") return <HexDemo staticMode={staticMode} />;
  if (mode === "dom") return <DomDemo staticMode={staticMode} />;
  if (mode === "svg") return <SvgDemo staticMode={staticMode} />;
  return <SpxDemo staticMode={staticMode} />;
}

/* OCR: a scan-line sweeps a paragraph; the target line resolves from blur. */
function OcrDemo({ staticMode }: { staticMode: boolean }) {
  return (
    <div className="relative h-full">
      <div className="rounded-card border border-gray-200 bg-paper p-6">
        <div className="mb-4 h-2.5 w-2/3 rounded bg-gray-200" />
        <motion.p
          className="text-[1.75rem] font-bold text-ink"
          initial={staticMode ? false : { filter: "blur(7px)", opacity: 0.4 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE_OUT }}
        >
          Get started
        </motion.p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="h-2.5 w-full rounded bg-gray-200" />
          <div className="h-2.5 w-4/5 rounded bg-gray-200" />
        </div>
      </div>
      {!staticMode && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 h-[3px] bg-accent shadow-[0_0_18px_rgba(230,62,46,0.6)]"
          initial={{ top: "6%", opacity: 0 }}
          animate={{ top: ["6%", "92%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.4, ease: "linear" }}
        />
      )}
    </div>
  );
}

/* HEX: a colour field with a loupe that locks #3D9DF2. */
function HexDemo({ staticMode }: { staticMode: boolean }) {
  return (
    <div className="relative h-full">
      <div
        className="h-full min-h-[210px] w-full rounded-card border border-gray-200"
        style={{
          background:
            "linear-gradient(135deg, #f5d76e 0%, #2ec5a8 38%, #3d9df2 64%, #b06cf0 100%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-paper shadow-[0_8px_24px_-6px_rgba(26,22,20,0.5)]"
        style={{ background: "var(--color-captured-blue)" }}
        initial={staticMode ? false : { x: -90, y: -50, scale: 0.8, opacity: 0 }}
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
      >
        <span className="font-mono text-[0.8125rem] font-bold text-paper">#3D9DF2</span>
      </motion.div>
    </div>
  );
}

/* DOM: a mock page; a bracket snaps to a button; the selector types out. */
function DomDemo({ staticMode }: { staticMode: boolean }) {
  const selector = "button.cta";
  return (
    <div className="relative h-full">
      <div className="rounded-card border border-gray-200 bg-paper p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <span className="h-2.5 w-24 rounded bg-gray-200" />
        </div>
        <div className="mb-2 h-2.5 w-full rounded bg-gray-100" />
        <div className="mb-5 h-2.5 w-3/4 rounded bg-gray-100" />
        <div className="relative inline-block">
          <span className="inline-flex rounded-button bg-accent px-5 py-2.5 text-[1rem] font-semibold text-paper">
            Get started
          </span>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-[10px] border-2 border-accent"
            initial={staticMode ? false : { opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE_OUT }}
          />
        </div>
      </div>
      <div className="mt-4 rounded-button border border-gray-200 bg-gray-50 px-4 py-3">
        {staticMode ? (
          <code className="font-mono text-[1.0625rem] font-semibold text-ink">{selector}</code>
        ) : (
          <Typed text={selector} delay={0.7} />
        )}
      </div>
    </div>
  );
}

/* SVG: an icon lifts off the page; its source types out. */
function SvgDemo({ staticMode }: { staticMode: boolean }) {
  return (
    <div className="relative h-full">
      <div className="rounded-card border border-gray-200 bg-paper p-6">
        <div className="flex items-center justify-center py-4">
          <motion.div
            initial={staticMode ? false : { y: 0, scale: 1 }}
            animate={{ y: -10, scale: 1.12 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
            style={{ filter: "drop-shadow(0 12px 16px rgba(26,22,20,0.25))" }}
          >
            <Star size={64} />
          </motion.div>
        </div>
      </div>
      <div className="mt-4 rounded-button border border-gray-200 bg-gray-50 px-4 py-3">
        {staticMode ? (
          <code className="font-mono text-[1rem] font-semibold text-ink">{"<svg viewBox=\"0 0 24 24\">"}</code>
        ) : (
          <Typed text={'<svg viewBox="0 0 24 24">'} delay={0.7} />
        )}
      </div>
    </div>
  );
}

/* SPX: measurement brackets extend; the number counts up to 184 x 48. */
function SpxDemo({ staticMode }: { staticMode: boolean }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 py-4">
      <div className="relative">
        <div className="h-28 w-52 rounded-card border-2 border-gray-300 bg-paper" />
        {/* width bracket */}
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-7 left-0 flex h-3 items-center"
          initial={staticMode ? false : { width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
        >
          <span className="h-3 w-[2px] bg-accent" />
          <span className="h-[2px] flex-1 bg-accent" />
          <span className="h-3 w-[2px] bg-accent" />
        </motion.div>
      </div>
      <code className="font-mono text-[1.75rem] font-bold text-ink">
        {staticMode ? "184 x 48" : <CountMeasure />}
      </code>
    </div>
  );
}

/* ===== small helpers ===== */

function Typed({ text, delay = 0 }: { text: string; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const t = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) clearInterval(t);
      }, 45);
      return () => clearInterval(t);
    }, delay * 1000);
    return () => clearTimeout(start);
  }, [text, delay]);
  return (
    <code className="font-mono text-[1.0625rem] font-semibold text-ink">
      {text.slice(0, n)}
      <span className="ml-px inline-block h-[1.1em] w-[2px] -translate-y-[1px] animate-pulse bg-accent align-middle" />
    </code>
  );
}

function CountMeasure() {
  const [w, setW] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setW(Math.round(eased * 184));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <>{w} x 48</>;
}

function Star({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5l2.6 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16.9 6.5 19l1.4-6.1L3.2 8.8l6.2-.6L12 2.5z"
        fill="var(--color-accent)"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cursor() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M2 2 L2 14 L5.2 10.8 L7.6 16 L9.8 15 L7.4 9.9 L12 9.9 Z"
        fill="var(--color-accent)"
        stroke="var(--color-paper)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

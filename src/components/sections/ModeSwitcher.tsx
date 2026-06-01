"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useMotionOff } from "@/components/motion/useMotionOff";
import { EASE_OUT } from "@/lib/motion";

/**
 * ModeSwitcher — the LIVING hero demo. ONE realistic capture scene with a dashed
 * capture rectangle over a region, plus a row of real <button> tabs
 * (OCR / HEX / DOM / SVG / SPX). The output panel updates live to show that
 * mode's real result from the SAME capture.
 *
 * SOUL PASS (CORRECTIONS "GIVE IT SOUL" #2): the demo no longer sits dead waiting
 * for a click.
 *  - AUTOPLAY: on mount a friendly cursor glides in, the dashed capture rect
 *    draws itself, and the data result appears. The tabs then AUTO-CYCLE
 *    OCR -> HEX -> DOM -> SVG -> SPX on a ~2.6s pneumatic timer.
 *  - GRAB CONTROL: clicking a tab or keyboard-navigating PAUSES autoplay and
 *    shows the visitor's choice. After ~7s of no interaction autoplay resumes.
 *  - Each cycle/grab fires onGrab(index) so the parent (Hero) can make the
 *    Quirky character react with delight and aim its eyes at the demo.
 *
 * Accessibility (load-bearing, unchanged):
 *  - Real WAI-ARIA tablist: role="tablist", role="tab", aria-selected, roving
 *    tabindex, ArrowLeft/Right/Up/Down/Home/End keyboard nav.
 *  - Output panel role="tabpanel" labelled by the active tab.
 *  - Default state resolves the FIRST tab (OCR) so the panel is NEVER blank.
 *
 * Motion-off / reduced-motion (load-bearing): NO autoplay, NO cursor animation,
 * NO cross-fade. Static resolved OCR state, fully clickable. Never blank.
 */

export type SwitcherTab = {
  id: string;
  label: string;
  kind: "text" | "color" | "dom" | "svg" | "measure";
  value: string;
  selector?: string;
  caption: string;
};

type ModeSwitcherProps = {
  tabs: SwitcherTab[];
  sceneAlt: string;
  copiedLabel: string;
  className?: string;
  dataSource?: string;
  /** Fired whenever the active mode changes (autoplay tick OR a visitor grab). */
  onGrab?: (index: number, viaInteraction: boolean) => void;
  /** Fired with the active index on every change, for parents that only track it. */
  onActiveChange?: (index: number) => void;
};

const CYCLE_MS = 2600;
const RESUME_AFTER_MS = 7000;

export function ModeSwitcher({
  tabs,
  sceneAlt,
  copiedLabel,
  className,
  dataSource = "src/components/sections/ModeSwitcher.tsx",
  onGrab,
  onActiveChange,
}: ModeSwitcherProps) {
  const reduce = useReducedMotion();
  const motionOff = useMotionOff();
  const staticMode = reduce || motionOff;

  // Initialise to the FIRST tab so the panel is never blank (load-bearing rule).
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // The capture rect "draws" once on first reveal, then stays drawn.
  const [drawn, setDrawn] = useState(false);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tab = tabs[active];

  const goTo = useCallback(
    (next: number, viaInteraction: boolean) => {
      const i = (next + tabs.length) % tabs.length;
      setActive(i);
      onActiveChange?.(i);
      onGrab?.(i, viaInteraction);
    },
    [tabs.length, onActiveChange, onGrab],
  );

  // Visitor took control: pause, then schedule a resume after inactivity.
  const takeControl = useCallback(() => {
    if (staticMode) return;
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }, [staticMode]);

  // First-reveal: draw the capture rect (and fire the first grab) shortly after
  // mount so the cursor + rect animation reads as "Quirky is capturing".
  useEffect(() => {
    if (staticMode) {
      setDrawn(true);
      return;
    }
    const t = setTimeout(() => {
      setDrawn(true);
      onGrab?.(0, false);
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticMode]);

  // Autoplay cycle. Runs only when not static and not paused and after the rect
  // has drawn. Advances through the tabs on a comfortable pneumatic timer.
  useEffect(() => {
    if (staticMode || paused || !drawn) return;
    const t = setTimeout(() => {
      goTo(active + 1, false);
    }, CYCLE_MS);
    return () => clearTimeout(t);
  }, [staticMode, paused, drawn, active, goTo]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  function selectTab(i: number) {
    takeControl();
    goTo(i, true);
  }

  function focusTab(i: number) {
    const next = (i + tabs.length) % tabs.length;
    takeControl();
    goTo(next, true);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        focusTab(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        focusTab(active - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  }

  return (
    <div
      data-component="ModeSwitcher"
      data-source={dataSource}
      data-tokens="ink-surface,ink-raised,on-dark,accent,captured-blue,radius-card"
      className={className}
    >
      <div
        className="dark-scope dot-grid-dark overflow-hidden rounded-window border border-white/10 p-5 sm:p-7"
        style={{ background: "var(--color-ink-surface)" }}
      >
        {/* Capture scene: a stylized browser window with a dashed capture rect
            that draws itself, plus an animated cursor on first reveal. */}
        <CaptureScene alt={sceneAlt} drawn={drawn} staticMode={staticMode} />

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Choose an extraction mode"
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="mt-5 flex flex-wrap gap-2"
        >
          {tabs.map((t, i) => {
            const selected = i === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(i)}
                onFocus={() => takeControl()}
                onMouseEnter={() => takeControl()}
                className={[
                  "relative rounded-full border px-4 py-2 text-[1rem] font-semibold leading-none transition-colors duration-150 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#160c0a]",
                  selected
                    ? "border-accent bg-accent text-paper"
                    : "border-white/15 bg-white/5 text-on-dark/70 hover:border-white/30 hover:text-on-dark",
                ].join(" ")}
              >
                {t.label}
                {/* Autoplay progress ring under the active tab: a thin underline
                    that wipes left-to-right over the cycle so the visitor SEES
                    the demo is alive and moving on its own. */}
                {selected && !staticMode && !paused && drawn && (
                  <motion.span
                    key={`prog-${active}`}
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-1 h-[2px] origin-left rounded-full bg-paper/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* A tiny live hint: autoplaying vs paused. Body-size, friendly. */}
        <p className="mt-3 text-[1rem] text-on-dark/50" aria-live="polite">
          {staticMode
            ? "Tap a mode to see its data."
            : paused
              ? "You are driving. It picks back up in a moment."
              : "Watch it cycle, or grab a mode yourself."}
        </p>

        {/* Output panel. role=tabpanel, labelled by the active tab. Default = OCR
            resolved so it is never blank. */}
        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          className="mt-3 min-h-[148px] rounded-card border border-white/10 bg-white/[0.03] p-5"
        >
          {staticMode ? (
            <OutputBody tab={tab} copiedLabel={copiedLabel} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                <OutputBody tab={tab} copiedLabel={copiedLabel} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * The capture scene: a small browser surface with a dashed capture rectangle
 * over the "Get started" button region. The rect draws itself on first reveal
 * (strokeDashoffset wipe) and a friendly cursor glides to the corner.
 * ------------------------------------------------------------------------- */
function CaptureScene({
  alt,
  drawn,
  staticMode,
}: {
  alt: string;
  drawn: boolean;
  staticMode: boolean;
}) {
  // Rect perimeter for the draw-on animation (approx 204+68 *2 sides + arcs).
  const PERIM = 540;
  return (
    <svg viewBox="0 0 520 260" role="img" aria-label={alt} className="h-auto w-full">
      {/* browser window */}
      <rect x="16" y="16" width="488" height="228" rx="16" fill="var(--color-ink-raised)" stroke="rgba(253,252,250,0.12)" strokeWidth="1.5" />
      {/* title bar */}
      <line x1="16" y1="52" x2="504" y2="52" stroke="rgba(253,252,250,0.12)" strokeWidth="1.5" />
      <circle cx="40" cy="34" r="5" fill="none" stroke="rgba(253,252,250,0.3)" strokeWidth="1.5" />
      <circle cx="58" cy="34" r="5" fill="none" stroke="rgba(253,252,250,0.3)" strokeWidth="1.5" />
      <circle cx="76" cy="34" r="5" fill="none" stroke="rgba(253,252,250,0.3)" strokeWidth="1.5" />
      <rect x="150" y="26" width="220" height="16" rx="8" fill="rgba(253,252,250,0.06)" />

      {/* page content: heading + paragraph lines + the CTA button */}
      <rect x="48" y="80" width="200" height="14" rx="7" fill="rgba(253,252,250,0.16)" />
      <rect x="48" y="106" width="320" height="9" rx="4.5" fill="rgba(253,252,250,0.09)" />
      <rect x="48" y="124" width="280" height="9" rx="4.5" fill="rgba(253,252,250,0.09)" />

      {/* the CTA button being captured */}
      <rect x="48" y="156" width="184" height="48" rx="12" fill="var(--color-captured-blue)" />
      <text x="140" y="186" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="16" fontWeight="700" fill="#0b1f33">
        Get started
      </text>

      {/* dashed capture rectangle over the button region. Draws itself once. */}
      <rect
        x="38"
        y="146"
        width="204"
        height="68"
        rx="14"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeDasharray={staticMode ? "8 6" : `${PERIM}`}
        strokeDashoffset={staticMode || drawn ? 0 : PERIM}
        strokeLinecap="round"
        style={{
          transition: staticMode ? undefined : "stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {/* When fully drawn, swap to the friendly dashed look via a second overlay
          rect so the marching-dash style reads (the draw-on used a solid line). */}
      {(staticMode || drawn) && (
        <rect
          x="38"
          y="146"
          width="204"
          height="68"
          rx="14"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeDasharray="8 6"
          strokeLinecap="round"
          opacity={staticMode ? 1 : 0.0001}
        >
          {!staticMode && (
            <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.65s" fill="freeze" />
          )}
        </rect>
      )}
      {/* corner handles */}
      <g fill="var(--color-accent)" opacity={staticMode || drawn ? 1 : 0} style={{ transition: staticMode ? undefined : "opacity 300ms ease" }}>
        <circle cx="38" cy="146" r="3.5" />
        <circle cx="242" cy="146" r="3.5" />
        <circle cx="38" cy="214" r="3.5" />
        <circle cx="242" cy="214" r="3.5" />
      </g>

      {/* Friendly cursor that glides to the bottom-right handle on first reveal. */}
      {!staticMode && (
        <motion.g
          initial={{ x: 120, y: -40, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1], ease: EASE_OUT }}
          style={{ originX: "242px", originY: "214px" }}
        >
          <g transform="translate(242 214)">
            <path
              d="M0 0 L0 18 L4.5 13.5 L8 21 L11 19.5 L7.5 12 L13 12 Z"
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>
        </motion.g>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * Output body — renders the right shape per mode. Each is a real example value.
 * ------------------------------------------------------------------------- */
function OutputBody({ tab, copiedLabel }: { tab: SwitcherTab; copiedLabel: string }) {
  return (
    <div className="flex h-full flex-col gap-3">
      {tab.kind === "text" && (
        <div className="flex flex-col gap-2">
          <code className="font-mono text-[1.25rem] font-medium text-on-dark">{tab.value}</code>
          <CopiedRow label={copiedLabel} />
        </div>
      )}

      {tab.kind === "color" && (
        <div className="flex items-center gap-4">
          <span
            className="h-14 w-14 shrink-0 rounded-card border border-white/20"
            style={{ background: "var(--color-captured-blue)" }}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <code className="font-mono text-[1.5rem] font-semibold text-on-dark">{tab.value}</code>
            <CopiedRow label={copiedLabel} />
          </div>
        </div>
      )}

      {tab.kind === "dom" && (
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center rounded-button border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[1.0625rem] text-on-dark">
            {tab.selector}
          </span>
          <p className="text-[1rem] text-on-dark/70">
            Inner text: <code className="font-mono text-on-dark">{tab.value}</code>
          </p>
        </div>
      )}

      {tab.kind === "svg" && (
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-card border border-white/15 bg-white/5" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5l2.6 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16.9 6.5 19l1.4-6.1L3.2 8.8l6.2-.6L12 2.5z"
                fill="var(--color-accent)"
                stroke="var(--color-on-dark)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="flex flex-col gap-1">
            <code className="font-mono text-[1.25rem] font-medium text-on-dark">{tab.value}</code>
            <span className="text-[1rem] text-on-dark/70">Vector source extracted</span>
          </div>
        </div>
      )}

      {tab.kind === "measure" && (
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-20 shrink-0 place-items-center rounded-card border border-white/15 bg-white/5" aria-hidden="true">
            <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
              <line x1="6" y1="14" x2="50" y2="14" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="7" x2="6" y2="21" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
              <line x1="50" y1="7" x2="50" y2="21" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <code className="font-mono text-[1.75rem] font-semibold text-on-dark">{tab.value}</code>
        </div>
      )}

      <p className="mt-auto text-[1rem] text-on-dark/60">{tab.caption}</p>
    </div>
  );
}

function CopiedRow({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 text-[1rem] text-on-dark/70">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="text-accent">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="5,8.4 7.2,10.6 11,5.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}

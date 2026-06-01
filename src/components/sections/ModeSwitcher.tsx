"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useMotionOff } from "@/components/motion/useMotionOff";
import { EASE_OUT } from "@/lib/motion";

/**
 * ModeSwitcher — the interactive centerpiece. ONE realistic capture scene with a
 * dashed capture rectangle over a region, plus a row of real <button> tabs
 * (OCR / HEX / DOM / SVG / SPX). Clicking a tab updates the OUTPUT PANEL live to
 * show that mode's real result from the SAME capture. The visitor DRIVES it, so
 * they immediately understand: one capture, five kinds of data.
 *
 * Accessibility (load-bearing):
 *  - Tabs are a real WAI-ARIA tablist: role="tablist", each tab role="tab",
 *    aria-selected, roving tabindex, ArrowLeft/Right/Home/End keyboard nav.
 *  - The output panel is role="tabpanel" labelled by the active tab.
 *  - Default state resolves the FIRST tab (OCR) so the panel is NEVER blank with
 *    ?motion=0 / reduced-motion / no-JS-yet. The state is initialised to the
 *    first tab, not null, so the very first render shows a real output.
 *  - Switching works by click even with motion off (just without the cross-fade).
 *
 * Motion: output transitions are opacity/y cross-fades on the pneumatic ease
 * (no bounce). With reduced-motion / motion=0 the panel swaps instantly.
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
};

export function ModeSwitcher({
  tabs,
  sceneAlt,
  copiedLabel,
  className,
  dataSource = "src/components/sections/ModeSwitcher.tsx",
}: ModeSwitcherProps) {
  const reduce = useReducedMotion();
  const motionOff = useMotionOff();
  const staticMode = reduce || motionOff;

  // Initialise to the FIRST tab so the panel is never blank (load-bearing rule).
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tab = tabs[active];

  function focusTab(i: number) {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
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
        {/* Capture scene: a stylized browser window with a dashed capture rect */}
        <CaptureScene alt={sceneAlt} />

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
                onClick={() => setActive(i)}
                className={[
                  "rounded-full border px-4 py-2 text-[1rem] font-semibold leading-none transition-colors duration-150 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#160c0a]",
                  selected
                    ? "border-accent bg-accent text-paper"
                    : "border-white/15 bg-white/5 text-on-dark/70 hover:border-white/30 hover:text-on-dark",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Output panel. role=tabpanel, labelled by the active tab. Default = OCR
            resolved so it is never blank. */}
        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          className="mt-4 min-h-[148px] rounded-card border border-white/10 bg-white/[0.03] p-5"
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
 * over the "Get started" button region. Static, inline SVG, no photo.
 * ------------------------------------------------------------------------- */
function CaptureScene({ alt }: { alt: string }) {
  return (
    <svg
      viewBox="0 0 520 260"
      role="img"
      aria-label={alt}
      className="h-auto w-full"
    >
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

      {/* dashed capture rectangle over the button region */}
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
      />
      {/* corner handles */}
      <g fill="var(--color-accent)">
        <circle cx="38" cy="146" r="3.5" />
        <circle cx="242" cy="146" r="3.5" />
        <circle cx="38" cy="214" r="3.5" />
        <circle cx="242" cy="214" r="3.5" />
      </g>
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
          <code className="font-mono text-[1.25rem] font-medium text-on-dark">
            {tab.value}
          </code>
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
            <code className="font-mono text-[1.5rem] font-semibold text-on-dark">
              {tab.value}
            </code>
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
            Inner text:{" "}
            <code className="font-mono text-on-dark">{tab.value}</code>
          </p>
        </div>
      )}

      {tab.kind === "svg" && (
        <div className="flex items-center gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-card border border-white/15 bg-white/5"
            aria-hidden="true"
          >
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
            <code className="font-mono text-[1.25rem] font-medium text-on-dark">
              {tab.value}
            </code>
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
          <code className="font-mono text-[1.75rem] font-semibold text-on-dark">
            {tab.value}
          </code>
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
        <polyline
          points="5,8.4 7.2,10.6 11,5.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

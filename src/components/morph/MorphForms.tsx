"use client";

/**
 * MorphForms — the five shapes the single flying block takes as it travels the
 * v0.4 page. Each form is a self-contained, fixed-size render of that section's
 * signature UI, drawn in the SAME blob/chip/accent vocabulary as the hero Capture
 * Fan so the block reads as one object changing shape, not five unrelated
 * graphics.
 *
 * These are PURELY decorative (aria-hidden): the real, readable copy lives in
 * the static sections underneath. The forms reuse copy.json fragments (mode
 * labels, the Pro price, the hex value) so they never invent text, but they are
 * not the accessible source of that text.
 *
 * Chrome is the single coral accent; captured data values stay neutral (the HEX
 * swatch is the grabbed blue #3D9DF2, never coral). ONE easing, no bounce.
 *
 * Stage forms share a 440 x 360 box (DEVICE_W x DEVICE_H). The controller
 * positions and cross-fades them; the forms themselves do not animate position.
 */

import { motion } from "framer-motion";

import { BlobObject, type BlobMode } from "@/components/blobs/BlobObject";
import { Keycap } from "@/components/ui/Keycap";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

export const DEVICE_W = 440;
export const DEVICE_H = 360;

export type MorphStage =
  | "hero"
  | "modes"
  | "how"
  | "pricing"
  | "final";

/**
 * Stage order re-timed for the v0.4 six-section page (Hero, ModesShowcase,
 * HowItWorks, TrustStrip, Pricing, FAQ, FinalCta). The flying block visits the
 * sections that have a genuine right-lane device slot or a payoff to morph into:
 * hero device -> a cycling mode chip over the dark Modes break -> the steps
 * window -> the Pro pricing card + CTA -> the final download form. The thin
 * TrustStrip and the FAQ have no device slot, so the block simply travels past
 * them between the How and Pricing anchors.
 */
export const STAGE_ORDER: MorphStage[] = [
  "hero",
  "modes",
  "how",
  "pricing",
  "final",
];

/** Shared device shell so every form sits in the same physical footprint. */
function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width: DEVICE_W,
        height: DEVICE_H,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

const cardBase =
  "rounded-card border border-gray-200 bg-paper shadow-[0_18px_48px_-24px_rgba(26,22,20,0.28)]";

/* --------------------------------------------------------------------------
 * 1. HERO — the Capture Fan. The block's first form: a capture rectangle with
 * five data-chips fanned around it. Mirrors CaptureFan.tsx in miniature so the
 * overlay reads as a continuation of the hero device.
 * ------------------------------------------------------------------------ */
const FAN_CHIPS = copy.modeRail.modes.map((m, i) => ({
  id: m.id,
  label:
    m.id === "ocr"
      ? "Get started"
      : m.id === "hex"
        ? "#3D9DF2"
        : m.id === "dom"
          ? "button.cta"
          : m.id === "svg"
            ? "icon.svg"
            : "184 x 48",
  // positions around the central capture rect, in the 440x360 box
  pos: [
    { x: 8, y: 18 },
    { x: 268, y: 8 },
    { x: 300, y: 150 },
    { x: 268, y: 286 },
    { x: 6, y: 268 },
  ][i],
}));

export function HeroForm() {
  return (
    <Frame>
      {/* central capture rect */}
      <div
        className="absolute rounded-card"
        style={{
          left: 134,
          top: 120,
          width: 172,
          height: 120,
          background: "var(--color-accent-subtle)",
          border: "2.5px dashed var(--color-accent)",
        }}
      >
        <div className="flex h-full flex-col justify-center gap-2 px-4">
          <span className="h-[3px] w-[70%] rounded-full bg-accent/35" />
          <span className="h-[3px] w-[90%] rounded-full bg-accent/35" />
          <span className="h-[3px] w-[55%] rounded-full bg-accent/35" />
        </div>
      </div>

      {FAN_CHIPS.map((chip, i) => (
        <motion.div
          key={chip.id}
          className={`absolute flex items-center gap-2 px-3 ${cardBase}`}
          style={{ left: chip.pos.x, top: chip.pos.y, width: 150, height: 52 }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 * i, ease: EASE_OUT }}
        >
          {chip.id === "hex" ? (
            <span
              className="h-7 w-7 shrink-0 rounded-[6px] border border-ink/70"
              style={{ background: "var(--color-captured-blue)" }}
            />
          ) : (
            <BlobObject mode={chip.id as BlobMode} size={30} decorative />
          )}
          <span className="truncate text-[1rem] font-bold text-ink">
            {chip.label}
          </span>
        </motion.div>
      ))}
    </Frame>
  );
}

/* --------------------------------------------------------------------------
 * 2. MODES — the fan collapses to ONE highlighted mode chip that cycles
 * OCR -> HEX -> DOM -> SVG -> SPX as the inner progress advances.
 * `cycle` is 0..1 within the stage; we pick the active mode from it.
 * ------------------------------------------------------------------------ */
const MODE_IDS = copy.modeRail.modes.map((m) => m.id);
const MODE_VALUE: Record<string, React.ReactNode> = {
  ocr: <span className="text-[1.5rem] font-extrabold text-ink">Get started</span>,
  hex: (
    <span className="flex items-center gap-3">
      <span
        className="h-9 w-9 rounded-[8px] border border-ink/70"
        style={{ background: "var(--color-captured-blue)" }}
      />
      <span className="text-[1.5rem] font-extrabold text-ink">#3D9DF2</span>
    </span>
  ),
  dom: (
    <span className="rounded-button border border-gray-300 bg-gray-100 px-3 py-1.5 font-mono text-[1.25rem] font-semibold text-ink">
      button.cta
    </span>
  ),
  svg: <BlobObject mode="svg" size={64} decorative />,
  spx: <span className="font-mono text-[1.75rem] font-extrabold text-ink">184 x 48</span>,
};

export function ModesForm({ cycle }: { cycle: number }) {
  const idx = Math.min(
    MODE_IDS.length - 1,
    Math.floor(cycle * MODE_IDS.length),
  );
  const active = MODE_IDS[idx];

  return (
    <Frame>
      <div
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-4 px-7 py-6 ${cardBase}`}
        style={{ width: 320, minHeight: 200 }}
      >
        {/* mode tabs row, active one coral */}
        <div className="flex items-center gap-1.5">
          {MODE_IDS.map((id) => (
            <span
              key={id}
              className={
                id === active
                  ? "rounded-full bg-accent px-2.5 py-1 text-[0.75rem] font-bold uppercase tracking-[0.062em] text-paper"
                  : "rounded-full px-2.5 py-1 text-[0.75rem] font-bold uppercase tracking-[0.062em] text-gray-400"
              }
            >
              {id}
            </span>
          ))}
        </div>
        {/* the morphing value for the active mode */}
        <motion.div
          key={active}
          className="flex min-h-[72px] items-center"
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          {MODE_VALUE[active]}
        </motion.div>
        {/* Tab-to-switch hint */}
        <div className="flex items-center gap-2 text-[1rem] font-semibold text-gray-500">
          <Keycap>Tab</Keycap>
          <span>to switch</span>
        </div>
      </div>
    </Frame>
  );
}

/* --------------------------------------------------------------------------
 * 3. HOW IT WORKS — the chip grows into a small window with three steps and the
 * literal keycaps cmd+shift+1 / Tab. `assemble` 0..1 drives the keys pressing in.
 * ------------------------------------------------------------------------ */
export function HowForm({ assemble }: { assemble: number }) {
  const steps = copy.howItWorks.steps;
  return (
    <Frame>
      <div
        className={`absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-3 p-6 ${cardBase}`}
        style={{ width: 360 }}
      >
        <div className="flex items-center gap-2">
          <Keycap>cmd+shift+1</Keycap>
          <span className="text-[1rem] font-semibold text-gray-500">then</span>
          <Keycap>Tab</Keycap>
        </div>
        <ol className="flex flex-col gap-2.5">
          {steps.map((s, i) => {
            const on = assemble >= (i + 0.5) / steps.length;
            return (
              <li key={s.number} className="flex items-center gap-3">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[1rem] font-bold transition-colors duration-150"
                  style={{
                    background: on
                      ? "var(--color-accent)"
                      : "var(--color-accent-soft)",
                    color: on ? "var(--color-paper)" : "var(--color-accent-pressed)",
                  }}
                >
                  {s.number}
                </span>
                <span className="text-[1.0625rem] font-bold text-ink">
                  {plainStepTitle(s.title)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Frame>
  );
}

function plainStepTitle(title: string) {
  // Keep keystrokes inline but as plain text inside the decorative form.
  return title;
}

/* --------------------------------------------------------------------------
 * 4. PRICING — the block converges into the Pro pricing card with its accent CTA
 * button (the "turns into buttons" payoff). `press` 0..1 nudges the button.
 * ------------------------------------------------------------------------ */
export function PricingForm({ press }: { press: number }) {
  const pro = copy.pricing.tiers.find((t) => t.highlight) ?? copy.pricing.tiers[1];
  return (
    <Frame>
      <div
        className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-4 p-6"
        style={{
          width: 320,
          borderRadius: "var(--radius-window)",
          border: "1px solid var(--color-accent)",
          background: "var(--color-accent-soft)",
          boxShadow: "0 18px 48px -24px rgba(26,22,20,0.28)",
        }}
      >
        <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-[0.75rem] font-bold uppercase tracking-[0.062em] text-paper">
          All five modes
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[1.25rem] font-extrabold text-ink">
            {pro.name}
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-[2.5rem] font-extrabold leading-none text-ink">
              {pro.price}
            </span>
            <span className="text-[1rem] text-gray-500">{pro.priceSub}</span>
          </span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {pro.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2 text-[1rem] text-ink/80">
              <CheckDot />
              <span className="truncate">{f}</span>
            </li>
          ))}
        </ul>
        {/* the accent CTA button, the payoff */}
        <span
          className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-[1rem] font-semibold text-paper"
          style={{
            transform: `scale(${1 - press * 0.04})`,
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {pro.cta.label}
        </span>
      </div>
    </Frame>
  );
}

function CheckDot() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <circle cx="10" cy="10" r="9" fill="var(--color-accent)" />
      <polyline
        points="6,10.5 9,13.5 14,7"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------------------------------
 * 5. FINAL — a last compact form: the capture mark beside dual download buttons.
 * ------------------------------------------------------------------------ */
export function FinalForm() {
  return (
    <Frame>
      <div
        className={`absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 p-7 ${cardBase}`}
        style={{ width: 320 }}
      >
        <div className="flex items-center gap-2">
          <Keycap>cmd+shift+1</Keycap>
        </div>
        <BlobObject mode="capture" size={72} decorative />
        <span className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-[1rem] font-semibold text-paper">
          {copy.finalCta.primaryCta.label}
        </span>
        <span className="inline-flex w-full items-center justify-center rounded-full border border-gray-200 bg-paper px-6 py-3 text-[1rem] font-semibold text-ink">
          {copy.finalCta.secondaryCta.label}
        </span>
      </div>
    </Frame>
  );
}

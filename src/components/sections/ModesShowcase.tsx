"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Keycap } from "@/components/ui/Keycap";
import { DarkSection } from "@/components/section/DarkSection";
import { copy } from "@/content/copy";
import { EASE_OUT } from "@/lib/motion";

/**
 * ModesShowcase — the dark, oversize centerpiece. Merges the old ModeRail +
 * Features into ONE big animated section. Each of the five modes is an oversize
 * panel headed by its verb phrase (copy.json.modeRail.modes[*].description) and a
 * demo that ANIMATES what the mode actually does. No chips. No caption text under
 * chips. The five panels alternate the demo left/right of the heading.
 *
 * Every animation shows something TRUE about the product:
 *   OCR  reads blurred screen text into a clean copied string.
 *   HEX  lands on a pixel and locks in the grabbed value #3D9DF2.
 *   DOM  pulls the live selector button.cta out of a highlighted element.
 *   SVG  lifts the real SVG star off the page surface.
 *   SPX  extends calipers and resolves the 184 x 48 measurement.
 *
 * The giant "5" is the scale moment that opens the section; modes.proofLine
 * closes it as one body-scale proof statement (no chip, no card).
 *
 * MOTION OFF / REDUCED: every demo renders its FINAL, resolved frame (clean
 * text, locked hex, full selector, lifted icon, complete measurement) so the
 * dark section is fully readable static. Loops only run when in view + motion on.
 */

const MODES = copy.modeRail.modes; // ocr / hex / dom / svg / spx with verb-phrase descriptions

export function ModesShowcase() {
  const c = copy.modeRail;
  const proof = copy.modes.proofLine;

  return (
    <DarkSection
      id="modes"
      component="ModesShowcase"
      source="src/components/sections/ModesShowcase.tsx"
      tokens="ink-surface,on-dark,accent,accent-soft,captured-blue,gray"
    >
      {/* Header: giant 5 + eyebrow + tight intro */}
      <div className="flex flex-col gap-6">
        <Reveal>
          <EyebrowLabel className="bg-accent text-paper">{c.eyebrow}</EyebrowLabel>
        </Reveal>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-8">
          <Reveal>
            <span
              aria-hidden="true"
              className="block font-extrabold leading-[0.8] tracking-[-0.04em] text-accent"
              style={{ fontSize: "var(--text-display-2xl)" }}
            >
              5
            </span>
          </Reveal>
          <Reveal className="pb-2 sm:pb-4">
            <h2 className="max-w-2xl text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[1.04] tracking-tight text-on-dark">
              extraction modes,
              <br className="hidden sm:block" /> one capture.
            </h2>
            <p className="mt-3 max-w-md text-[1.125rem] leading-relaxed text-on-dark/70">
              {c.intro}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Five oversize mode panels */}
      <div className="mt-20 flex flex-col gap-20 md:gap-28">
        {MODES.map((mode, i) => (
          <ModePanel
            key={mode.id}
            id={mode.id}
            index={i}
            heading={mode.description}
          />
        ))}
      </div>

      {/* Proof line — one body-scale statement, no card, generous air above */}
      <Reveal className="mt-24">
        <p className="max-w-2xl text-[1.25rem] leading-relaxed text-on-dark/80">
          {proof}
        </p>
      </Reveal>
    </DarkSection>
  );
}

/* ------------------------------------------------------------------------- *
 * One oversize mode panel: number + verb-phrase heading on one side, the live
 * demo on the other. Alternates sides by index.
 * ------------------------------------------------------------------------- */
function ModePanel({
  id,
  index,
  heading,
}: {
  id: string;
  index: number;
  heading: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-20%" });
  const reduce = useReducedMotion();
  const [motionOff, setMotionOff] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setMotionOff(document.documentElement.dataset.motion === "off");
    }
  }, []);

  // active = the demo plays its loop; when motion is off we force the resolved
  // final frame so the section is readable static.
  const still = reduce || motionOff;
  const active = still ? true : inView;
  const flip = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={[
        "grid items-center gap-8 md:grid-cols-2 md:gap-16",
        flip ? "md:[&>*:first-child]:order-2" : "",
      ].join(" ")}
    >
      {/* Heading block */}
      <Reveal>
        <div className="flex flex-col gap-4">
          <span
            aria-hidden="true"
            className="text-[1rem] font-bold uppercase tracking-[0.18em] text-accent"
          >
            {String(index + 1).padStart(2, "0")} / {id}
          </span>
          <h3 className="max-w-md text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.08] tracking-tight text-on-dark">
            {heading}.
          </h3>
        </div>
      </Reveal>

      {/* Demo block */}
      <div className="min-h-[180px]">
        <ModeDemo id={id} active={active} still={still} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * The demos. Each picks its render by mode id. `active` drives the loop; `still`
 * forces the resolved frame (motion off / reduced).
 * ------------------------------------------------------------------------- */
function ModeDemo({
  id,
  active,
  still,
}: {
  id: string;
  active: boolean;
  still: boolean;
}) {
  switch (id) {
    case "ocr":
      return <OcrDemo active={active} still={still} />;
    case "hex":
      return <HexDemo active={active} still={still} />;
    case "dom":
      return <DomDemo active={active} still={still} />;
    case "svg":
      return <SvgDemo active={active} still={still} />;
    case "spx":
      return <SpxDemo active={active} still={still} />;
    default:
      return null;
  }
}

/** A shared dark demo card. Raised warm surface, white hairline, rounded. */
function DemoCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded-window border border-white/10 p-8"
      style={{ background: "var(--color-ink-raised)" }}
    >
      {children}
    </div>
  );
}

/* OCR — blurred screen lines resolve into a clean copied string. */
function OcrDemo({ active, still }: { active: boolean; still: boolean }) {
  // resolved = the text is read; loop toggles blurred -> resolved.
  const resolved = still ? true : active;
  return (
    <DemoCard>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          {[0.7, 0.92, 0.55].map((w, i) => (
            <motion.div
              key={i}
              className="h-3 rounded-full bg-on-dark/80"
              style={{ width: `${w * 100}%` }}
              animate={
                still
                  ? { filter: "blur(0px)", opacity: 1 }
                  : resolved
                    ? { filter: "blur(0px)", opacity: 1 }
                    : { filter: "blur(5px)", opacity: 0.4 }
              }
              transition={{ duration: 0.5, delay: i * 0.12, ease: EASE_OUT }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 self-start rounded-button border border-accent/40 bg-accent/15 px-3 py-2">
          <CopiedTick />
          <span className="font-mono text-[1rem] font-semibold text-on-dark">
            Copied to clipboard
          </span>
        </div>
      </div>
      {/* scan line */}
      {!still && (
        <motion.span
          className="pointer-events-none absolute inset-x-8 h-[2px] bg-accent"
          initial={{ top: "18%", opacity: 0 }}
          animate={
            active
              ? { top: ["18%", "72%", "18%"], opacity: [0, 1, 0] }
              : { top: "18%", opacity: 0 }
          }
          transition={{ duration: 2.4, ease: EASE_OUT, repeat: Infinity }}
        />
      )}
    </DemoCard>
  );
}

/* HEX — a cursor lands on a pixel; the grabbed value locks in (#3D9DF2). */
function HexDemo({ active, still }: { active: boolean; still: boolean }) {
  return (
    <DemoCard>
      <div className="flex flex-col items-center gap-5">
        <motion.span
          className="h-20 w-20 rounded-[16px] border-2 border-on-dark/30"
          style={{ background: "var(--color-captured-blue)" }}
          animate={
            still ? { scale: 1 } : active ? { scale: [1, 1.06, 1] } : { scale: 1 }
          }
          transition={{ duration: 1.8, ease: EASE_OUT, repeat: still ? 0 : Infinity }}
        />
        <span
          className="font-mono font-extrabold leading-none text-on-dark"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          #3D9DF2
        </span>
      </div>
    </DemoCard>
  );
}

/* DOM — a highlighted browser element; the live selector pulls out of it. */
function DomDemo({ active, still }: { active: boolean; still: boolean }) {
  const out = still ? true : active;
  return (
    <DemoCard>
      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        {/* the highlighted element */}
        <span className="inline-flex items-center rounded-button bg-accent px-6 py-3 text-[1.125rem] font-bold text-paper ring-2 ring-on-dark/40 ring-offset-2 ring-offset-[#221513]">
          Get started
        </span>
        {/* the selector that pulls out */}
        <motion.span
          className="rounded-button border border-white/15 bg-ink-surface px-4 py-2.5 font-mono text-[1.25rem] font-semibold text-on-dark"
          style={{ background: "var(--color-ink-surface)" }}
          animate={
            out
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: -14, filter: "blur(6px)" }
          }
          transition={{ duration: 0.6, ease: EASE_OUT, repeat: 0 }}
        >
          button.cta
        </motion.span>
      </div>
    </DemoCard>
  );
}

/* SVG — the real SVG star lifts off the page surface. */
function SvgDemo({ active, still }: { active: boolean; still: boolean }) {
  const lifted = still ? true : active;
  return (
    <DemoCard>
      <div className="relative flex items-center justify-center">
        {/* the flat page surface ghost */}
        <span className="absolute h-24 w-24 rounded-[20px] border border-white/10 bg-white/5" />
        {/* the lifted SVG */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          animate={
            lifted
              ? { y: -10, scale: 1.08, opacity: 1 }
              : { y: 0, scale: 1, opacity: 0.5 }
          }
          transition={{ duration: 0.7, ease: EASE_OUT, repeat: 0 }}
          className="relative"
        >
          <path
            d="M50 14 L61 40 L90 42 L67 60 L75 88 L50 72 L25 88 L33 60 L10 42 L39 40 Z"
            fill="var(--color-accent)"
            stroke="var(--color-on-dark)"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        </motion.svg>
        <span className="absolute -bottom-9 font-mono text-[1rem] font-semibold text-on-dark/70">
          icon.svg
        </span>
      </div>
    </DemoCard>
  );
}

/* SPX — calipers extend; the 184 x 48 readout resolves. */
function SpxDemo({ active, still }: { active: boolean; still: boolean }) {
  const measured = still ? true : active;
  return (
    <DemoCard>
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        {/* the measured span with caliper ends */}
        <div className="flex w-full items-center gap-2">
          <span className="h-6 w-[2px] bg-accent" />
          <motion.span
            className="h-[2px] flex-1 origin-left bg-accent"
            animate={measured ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, repeat: 0 }}
          />
          <span className="h-6 w-[2px] bg-accent" />
        </div>
        <motion.span
          className="font-mono font-extrabold leading-none text-on-dark"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          animate={
            measured
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0.3, filter: "blur(6px)" }
          }
          transition={{ duration: 0.5, ease: EASE_OUT, repeat: 0 }}
        >
          184 x 48
        </motion.span>
      </div>
    </DemoCard>
  );
}

function CopiedTick() {
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

/* ------------------------------------------------------------------------- *
 * Local Reveal that knows the dark scope is fine (uses the same motion-off /
 * reduced contract as the shared Reveal). Kept inline so the dark section never
 * imports a light-only wrapper assumption; behaviour is identical.
 * ------------------------------------------------------------------------- */
function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [motionOff, setMotionOff] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined") {
      setMotionOff(document.documentElement.dataset.motion === "off");
    }
  }, []);

  if (reduce || motionOff) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

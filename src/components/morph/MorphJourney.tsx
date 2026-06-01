"use client";

/**
 * MorphJourney — the signature interactive piece. ONE Quirky block that flies
 * across the WHOLE page (scroll-linked) and morphs into the UI relevant to each
 * section: Capture Fan -> mode chip -> how-it-works window -> features grid ->
 * workflow deck -> Pro pricing card with its coral CTA -> final download form.
 *
 * HOW IT READS AS ONE BLOCK
 * The block is a single position: fixed element. Its x / y / scale interpolate
 * continuously from stage anchor to stage anchor via global scroll progress, so
 * the SAME object visibly travels (hero right -> modes left -> centre -> ...).
 * A true single-element DOM morph across 7 distinct UIs is too costly, so at
 * each stage boundary the consecutive forms CROSS-FADE while position keeps
 * interpolating; because position is shared it still reads as one block changing
 * shape, not seven separate reveals.
 *
 * MOTION-OFF / REDUCED / MOBILE
 * This component is only mounted when useMorphEnabled() is true (desktop, motion
 * on, no reduced-motion). When disabled it renders NOTHING and the static
 * sections are the whole experience. The controller never gates content: the
 * forms here are decorative (aria-hidden) duplicates layered on top.
 *
 * EASING: one curve everywhere (EASE_OUT). No spring, no bounce, no overshoot.
 * GPU: only transform + opacity animate. CLS: the overlay is fixed and reserves
 * no layout space, so it cannot shift the document.
 */

import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";

import {
  DEVICE_W,
  DEVICE_H,
  HeroForm,
  ModesForm,
  HowForm,
  FeaturesForm,
  WorkflowsForm,
  PricingForm,
  FinalForm,
  STAGE_ORDER,
} from "@/components/morph/MorphForms";

/**
 * Per-stage viewport anchor for the flying block. x is a fraction of half the
 * viewport width from centre (-1 = left edge area, +1 = right edge area); y is a
 * fraction of half the viewport height from centre. scale sizes the device.
 * These are tuned so the block sits roughly where each section's own visual
 * weight is, and visibly travels between them.
 */
type Anchor = { x: number; y: number; scale: number };

/**
 * Anchors keep the flying block in the RIGHT-SIDE lane for the full-width
 * content sections (modes/how/features/workflows/pricing) so it never lands on
 * top of the left-aligned headlines and body copy. It is most prominent at the
 * hero and final CTA, which both have a genuine right-column device slot. The
 * block visibly travels (right -> further right -> back) and changes scale; the
 * "fly to one side" beat is the swing between hero (0.5) and modes (0.78) and
 * the return at pricing, not a centre-screen overlap.
 */
const ANCHORS: Record<(typeof STAGE_ORDER)[number], Anchor> = {
  hero: { x: 0.5, y: 0.0, scale: 1.0 }, // right column, beside the headline
  modes: { x: 0.78, y: 0.0, scale: 0.58 }, // collapses + flies to the far right
  how: { x: 0.66, y: 0.0, scale: 0.62 }, // grows into the steps window, right lane
  features: { x: 0.66, y: 0.0, scale: 0.6 }, // unfolds into the grid, right lane
  workflows: { x: 0.72, y: 0.0, scale: 0.56 }, // deck fans, right lane
  pricing: { x: 0.72, y: 0.0, scale: 0.6 }, // Pro card + coral CTA, right lane
  final: { x: 0.5, y: 0.0, scale: 1.0 }, // compact form, right column of the closer
};

const STAGES = STAGE_ORDER;
const N = STAGES.length;

/** Linear interpolation helper. */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Smooth (pneumatic) ease for the inter-stage travel, matching EASE_OUT feel. */
function easeOut(t: number) {
  // Mirrors cubic-bezier(0.16,1,0.3,1) closely enough for position interpolation.
  return 1 - Math.pow(1 - t, 3);
}

export function MorphJourney() {
  // Whole-page scroll progress (0 at top, 1 at the bottom of the document). This
  // is robust: it needs no ref into page.tsx's <main> and no DOM measurement on
  // mount, so it can never read a stale/empty target. The lead-in / lead-out
  // band below trims the hero settle and the footer tail out of the journey.
  const { scrollYProgress } = useScroll();
  return <MorphLayer progress={scrollYProgress} />;
}

function MorphLayer({ progress }: { progress: MotionValue<number> }) {
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const measure = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // The journey runs across the middle band of the scroll so the block has room
  // to settle in the hero before it starts flying and to rest at the final CTA.
  // Map raw scroll 0..1 -> journey 0..1 with a small lead-in / lead-out.
  const journey = useTransform(progress, [0.04, 0.92], [0, 1], {
    clamp: true,
  });

  // Continuous x / y / scale in pixels, interpolated between stage anchors.
  const x = useTransform(journey, (j) => {
    const { a, b, t } = segment(j);
    const e = easeOut(t);
    const ax = ANCHORS[STAGES[a]].x;
    const bx = ANCHORS[STAGES[b]].x;
    return lerp(ax, bx, e) * (vw / 2) - DEVICE_W / 2;
  });

  const y = useTransform(journey, (j) => {
    const { a, b, t } = segment(j);
    const e = easeOut(t);
    const ay = ANCHORS[STAGES[a]].y;
    const by = ANCHORS[STAGES[b]].y;
    // small vertical drift so the travel arcs rather than slides flat
    const arc = Math.sin(t * Math.PI) * 0.06;
    return (lerp(ay, by, e) - arc) * (vh / 2) - DEVICE_H / 2;
  });

  const scale = useTransform(journey, (j) => {
    const { a, b, t } = segment(j);
    const e = easeOut(t);
    return lerp(ANCHORS[STAGES[a]].scale, ANCHORS[STAGES[b]].scale, e);
  });

  if (vw === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      data-component="MorphJourney"
      data-source="src/components/morph/MorphJourney.tsx"
      data-tokens="accent,accent-soft,accent-subtle,ink,gray-200,captured-blue,ease-out"
    >
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          x,
          y,
          scale,
          width: DEVICE_W,
          height: DEVICE_H,
          willChange: "transform",
        }}
      >
        {STAGES.map((stage, i) => (
          <StageForm key={stage} stage={stage} index={i} journey={journey} />
        ))}
      </motion.div>
    </div>
  );
}

/**
 * One form, cross-faded in around its own slot in the journey. Each stage owns a
 * 1/N band; the form is opaque at the band centre and fades across the boundary
 * to the next form, so only ~one form is visible at a time but transitions are
 * continuous.
 */
function StageForm({
  stage,
  index,
  journey,
}: {
  stage: (typeof STAGES)[number];
  index: number;
  journey: MotionValue<number>;
}) {
  const band = 1 / N;
  const centre = (index + 0.5) * band;
  const half = band * 0.62; // overlap so cross-fades meet
  const isFirst = index === 0;
  const isLast = index === N - 1;

  // Opacity ramp: fade in before centre, hold, fade out after. The bookend
  // stages (hero, final CTA) are the highest-conversion frames and the static
  // device behind them is fully suppressed under data-morph=on, so they MUST
  // sit at full opacity at the journey extremes (j=0 and j=1) rather than on
  // the rising/falling edge of their own ramp. So the first stage holds 1 from
  // the start, and the last stage holds 1 to the end.
  const inStops = [
    centre - half,
    centre - half * 0.4,
    centre + half * 0.4,
    centre + half,
  ];
  const outVals = [0, 1, 1, 0];
  if (isFirst) {
    // hold 1 from journey 0 (and before) through this stage's plateau
    inStops[0] = -2;
    inStops[1] = -1;
    outVals[0] = 1;
    outVals[1] = 1;
  }
  if (isLast) {
    // hold 1 through journey 1 (and beyond)
    inStops[2] = 2;
    inStops[3] = 3;
    outVals[2] = 1;
    outVals[3] = 1;
  }

  const opacity = useTransform(journey, inStops, outVals, { clamp: true });

  // Inner 0..1 progress within this stage's band, for per-form sub-animation.
  const inner = useTransform(journey, [index * band, (index + 1) * band], [0, 1], {
    clamp: true,
  });

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity }}
    >
      <FormFor stage={stage} inner={inner} />
    </motion.div>
  );
}

/** Renders the right form, subscribing to its inner progress where needed. */
function FormFor({
  stage,
  inner,
}: {
  stage: (typeof STAGES)[number];
  inner: MotionValue<number>;
}) {
  const v = useMotionValueState(inner);
  switch (stage) {
    case "hero":
      return <HeroForm />;
    case "modes":
      return <ModesForm cycle={v} />;
    case "how":
      return <HowForm assemble={v} />;
    case "features":
      return <FeaturesForm settle={v} />;
    case "workflows":
      return <WorkflowsForm fan={v} />;
    case "pricing":
      return <PricingForm press={v} />;
    case "final":
      return <FinalForm />;
  }
}

/** Subscribe to a MotionValue as React state (forms need a plain number). */
function useMotionValueState(mv: MotionValue<number>): number {
  const [v, setV] = useState(() => mv.get());
  useEffect(() => {
    setV(mv.get());
    const unsub = mv.on("change", setV);
    return unsub;
  }, [mv]);
  return v;
}

/** Which two stages we are between, and the 0..1 blend between them. */
function segment(j: number): { a: number; b: number; t: number } {
  const clamped = Math.max(0, Math.min(1, j));
  const scaled = clamped * (N - 1);
  const a = Math.min(N - 2, Math.floor(scaled));
  const b = a + 1;
  const t = scaled - a;
  return { a, b, t };
}

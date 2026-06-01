"use client";

/**
 * MorphMount — the gate + code-split boundary for the flying morph overlay.
 *
 * - Gates on useMorphEnabled(): renders nothing on motion-off, reduced-motion,
 *   mobile, or SSR. The static sections stand alone in every one of those cases.
 * - Lazy-loads MorphJourney with next/dynamic (ssr: false) so the heavy
 *   scroll-controller is code-split out of the initial bundle and never runs on
 *   the server, keeping first paint fast and the motion-off path zero-cost.
 */

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { useMorphEnabled } from "@/components/morph/useMorphEnabled";

const MorphJourney = dynamic(
  () => import("@/components/morph/MorphJourney").then((m) => m.MorphJourney),
  { ssr: false, loading: () => null },
);

export function MorphMount() {
  const enabled = useMorphEnabled();

  // Reflect the active state on <html> so CSS can hide the static section
  // devices the flying block "takes over" (the hero + final Capture Fan), but
  // ONLY while the morph is live. When disabled the attribute is removed and the
  // static devices render normally (the motion-off / mobile fallback is intact).
  useEffect(() => {
    const el = document.documentElement;
    if (enabled) el.dataset.morph = "on";
    else delete el.dataset.morph;
    return () => {
      delete el.dataset.morph;
    };
  }, [enabled]);

  if (!enabled) return null;
  return <MorphJourney />;
}

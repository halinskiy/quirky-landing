import { Playground } from "@/components/playground/Playground";
import { MobileGate } from "@/components/mobile/MobileGate";

/**
 * Home — the PLAYGROUND DIRECTION, second pass (CORRECTIONS.md, 2026-06-01).
 * The site is ONLY the hero: a full-screen desktop playground where each of the
 * five modes is a REAL working tool you can use right on the page (live colour
 * eyedropper, OCR on a dropped image, drag-to-measure, click-to-selector,
 * SVG source lift). No pricing, no footer, no scripted demos.
 *
 * Mobile: hidden; a single MobileGate banner is shown (Mac desktop only).
 */
export default function Home() {
  return (
    <>
      <div className="hidden md:block">
        <Playground />
      </div>
      <MobileGate />
    </>
  );
}

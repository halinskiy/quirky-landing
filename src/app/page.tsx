import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/sections/Hero";
import { Modes } from "@/components/sections/Modes";
import { Pricing } from "@/components/sections/Pricing";
import { Footer } from "@/components/sections/Footer";

/**
 * Home composition — the CAPITAL REBUILD (CORRECTIONS.md, 2026-06-01, third
 * round). The morph journey and the six-section rhythm are gone. The page is
 * exactly: HEADER + three sections + FOOTER.
 *
 *   Nav      sticky header: logo + Modes / Pricing / FAQ anchors + Download pill
 *   Hero     Section 1: headline + dual download CTA + the interactive
 *            ModeSwitcher (one capture, five kinds of data, visitor-driven)
 *   Modes    Section 2: the five modes, informative, real example outputs
 *   Pricing  Section 3: pricing + download band + compact FAQ
 *   Footer   condensed closing block
 *
 * No flying block, no data-morph anywhere. Every string comes from
 * content/copy.json. The ModeSwitcher resolves the OCR tab by default so the
 * hero demo is never blank under ?motion=0 / reduced-motion.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Modes />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

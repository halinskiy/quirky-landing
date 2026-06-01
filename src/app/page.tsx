import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/sections/Hero";
import { ModesShowcase } from "@/components/sections/ModesShowcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { MorphMount } from "@/components/morph/MorphMount";

/**
 * Home composition — the v0.4 redesign (CORRECTIONS.md "REDESIGN REFINEMENT").
 *
 * Six content sections, light -> dark -> light rhythm:
 *   Hero            (light, dot-grid)
 *   ModesShowcase   (DARK break, oversize, the 5 modes shown by animation)
 *   HowItWorks      (light, 3 animated steps + keycaps)
 *   TrustStrip      (light, thin one-line trust band, App Store honesty)
 *   Pricing         (light, 2 tiers, $16.99 one time)
 *   Faq             (light, holds all detail)
 *   FinalCta        (DARK break, loud, dual download)
 *
 * Dropped vs v0.3: Workflows (proof line salvaged into ModesShowcase), the Fits
 * 6-card grid (demoted to TrustStrip), the ModeRail chips + Features grid (merged
 * into ModesShowcase). Every string still comes from content/copy.json.
 *
 * MorphMount layers the signature scroll-pinned morphing block ON TOP of the
 * static sections, re-timed over the new six-section rhythm. It is an enhancement
 * only: it renders nothing on motion-off / reduced-motion / mobile, where the
 * static sections below are the whole page.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <ModesShowcase />
        <HowItWorks />
        <TrustStrip />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MorphMount />
    </>
  );
}

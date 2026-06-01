import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/sections/Hero";
import { ModeRail } from "@/components/sections/ModeRail";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Workflows } from "@/components/sections/Workflows";
import { Fits } from "@/components/sections/Fits";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { MorphMount } from "@/components/morph/MorphMount";

/**
 * Home composition. Section order per research/quirky-direction.md §3:
 * modes-first, workflows-as-trust, dual download loud at the end. Every string
 * comes from content/copy.json via each section. Anchors: #how-it-works /
 * #features / #pricing / #faq / #download (match copy.json.nav hrefs).
 *
 * MorphMount layers the signature scroll-pinned morphing block ON TOP of the
 * static sections (one Quirky block that flies the page and changes shape per
 * section). It is an enhancement only: it renders nothing on motion-off /
 * reduced-motion / mobile, where the static sections below are the whole page.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <ModeRail />
        <HowItWorks />
        <Features />
        <Workflows />
        <Fits />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MorphMount />
    </>
  );
}

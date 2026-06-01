"use client";

import { useEffect, useRef, useState } from "react";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { KineticHeadline } from "@/components/motion/KineticHeadline";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ModeSwitcher, type SwitcherTab } from "@/components/sections/ModeSwitcher";
import { copy } from "@/content/copy";

/**
 * HeroScroll — THE centerpiece (set-piece A, research/motion-awwwards-2026.md).
 *
 * A scroll-scrubbed "one capture, five modes" pinned film. On desktop with motion
 * ENABLED, the stage PINS to the viewport (GSAP ScrollTrigger pin + scrub, synced
 * to Lenis via gsap.ticker) and scrubbing advances a timeline:
 *
 *   phase 0  cursor glides in, the dashed capture marquee DRAWS itself (DrawSVG)
 *   phase 1  the four corner handles snap on (SPX-style lock)
 *   phase 2..6  each mode resolves: OCR text, HEX swatch #3D9DF2, DOM selector,
 *               SVG glyph, SPX 184 x 48 each flies into a blob-chip
 *   phase 7  all five chips fan out deck-of-cards style and settle
 *
 * Scrolling does not move the page, it advances time inside the scene.
 *
 * --- First paint / LCP (load-bearing) ---
 * The component renders a STATIC poster immediately: the capture scene already
 * drawn + all five chips visible in their fanned end positions, fully labelled.
 * That is the LCP frame. GSAP + ScrollTrigger + DrawSVG are dynamic-imported only
 * AFTER mount (useEffect), so heavy motion never blocks first paint. Until GSAP
 * inits and the matchMedia desktop+motion branch fires, the poster simply IS the
 * content (every output visible, nothing motion-only).
 *
 * --- Reduced motion / ?motion=0 (load-bearing) ---
 * gsap.matchMedia() registers the pinned timeline ONLY under
 * "(min-width:769px) and (prefers-reduced-motion:no-preference)" AND only when
 * the ?motion=0 flag is absent. In reduce / motion-off:
 *   - NO ScrollTrigger is created at all (no pin, no scrub, no scroll-trap),
 *   - the stage renders in normal document flow (not sticky, no tall spacer),
 *   - the static labelled poster is the whole hero. Every output is readable.
 *
 * --- Mobile (<=768) ---
 * No pin, no scrub. The tall spacer collapses and the interactive ModeSwitcher
 * (tap-through tablist, already accessible + autoplaying) is shown instead. Set
 * via gsap.matchMedia "(max-width:768px)" + a state flag so React swaps the DOM.
 */

export function HeroScroll() {
  const c = copy.hero;
  const s = copy.switcher;

  // Refs into the pinned stage for GSAP to drive. All animation targets carry a
  // data-anim hook so the GSAP module can query them without prop drilling.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);

  // isMobile is resolved on the client. SSR + first paint render the desktop
  // poster (safe: it is the full static end-state either way).
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const spacer = spacerRef.current;
    if (!root || !stage || !spacer) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    // Dynamic import AFTER first paint. Never blocks LCP.
    (async () => {
      const flagOff =
        new URLSearchParams(window.location.search).get("motion") === "0" ||
        document.documentElement.dataset.motion === "off";

      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { DrawSVGPlugin } = await import("gsap/DrawSVGPlugin");
      if (cancelled) return;

      const gsap = gsapMod.gsap ?? gsapMod.default;
      gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

      // Sync ScrollTrigger to Lenis if Lenis is present (LenisProvider exposes
      // window.__lenis only when smooth scroll is actually running, i.e. motion
      // on). lenis.on('scroll', ScrollTrigger.update) makes the scrub frame-
      // perfect; lagSmoothing(0) keeps the timeline glued to the scrollbar.
      gsap.ticker.lagSmoothing(0);
      const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).__lenis;
      const onLenisScroll = () => ScrollTrigger.update();
      if (lenis) lenis.on("scroll", onLenisScroll);

      const mm = gsap.matchMedia();

      // ---- MOBILE: no pin, swap to the interactive switcher ----
      mm.add("(max-width: 768px)", () => {
        setIsMobile(true);
        return () => setIsMobile(false);
      });

      // ---- DESKTOP + MOTION ON: the pinned scrubbed film ----
      // Gated on no-preference AND the ?motion=0 flag being absent.
      if (!flagOff) {
        mm.add(
          {
            isDesktop: "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
          },
          (context) => {
            const conditions = context.conditions as { isDesktop: boolean };
            if (!conditions.isDesktop) return;

            const q = gsap.utils.selector(stage);
            const marquee = q("[data-anim='marquee']")[0] as unknown as SVGPathElement;
            const handles = q("[data-anim='handle']");
            const cursor = q("[data-anim='cursor']")[0] as unknown as SVGGElement;
            const chips = q("[data-anim='chip']") as unknown as HTMLElement[];
            const poster = q("[data-anim='poster-hint']")[0] as unknown as HTMLElement;

            // Set the scrub start state. Chips begin hidden + stacked centre; the
            // poster fan positions (data-fan-*) are the END state. We move from a
            // centred stack to the fan as the timeline plays.
            gsap.set(poster, { autoAlpha: 0 });
            gsap.set(marquee, { drawSVG: "0%" });
            gsap.set(handles, { scale: 0, transformOrigin: "50% 50%" });
            gsap.set(cursor, { autoAlpha: 0, x: 90, y: -60 });
            chips.forEach((chip) => {
              gsap.set(chip, {
                autoAlpha: 0,
                xPercent: -50,
                yPercent: -50,
                left: "50%",
                top: "50%",
                x: 0,
                y: 24,
                rotate: 0,
                scale: 0.92,
                filter: "blur(8px)",
              });
            });

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: spacer,
                start: "top top",
                end: "bottom bottom",
                pin: stage,
                pinSpacing: false, // spacer reserves the scroll height itself
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            // phase 0: cursor in, marquee draws
            tl.to(cursor, { autoAlpha: 1, x: 0, y: 0, duration: 1 }, 0)
              .to(marquee, { drawSVG: "100%", duration: 2 }, 0.3)
              // phase 1: handles snap on, cursor out
              .to(handles, { scale: 1, stagger: 0.15, duration: 0.8 }, 2)
              .to(cursor, { autoAlpha: 0, duration: 0.6 }, 2.4);

            // phases 2..6: each chip resolves (fly into place at its fan slot),
            // staggered along the scrub. We animate to the data-fan transform.
            chips.forEach((chip, i) => {
              const fx = parseFloat(chip.dataset.fanX || "0");
              const fy = parseFloat(chip.dataset.fanY || "0");
              const fr = parseFloat(chip.dataset.fanR || "0");
              const at = 3 + i * 1.1;
              tl.to(
                chip,
                {
                  autoAlpha: 1,
                  x: fx,
                  y: fy,
                  rotate: fr,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 1.2,
                },
                at,
              );
            });

            // phase 7: a final settle nudge (the deck breathes into place). Pure
            // transform, no layout. Already at fan positions; this adds a touch
            // of lift so the end reads as "dealt".
            tl.to(chips, { y: "-=6", duration: 0.6, stagger: 0.04 }, 9.2);

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
              // restore poster + chips to static end-state for the non-pinned DOM
              gsap.set(poster, { clearProps: "all" });
              gsap.set(chips, { clearProps: "all" });
              gsap.set([marquee, ...handles, cursor], { clearProps: "all" });
            };
          },
        );
      }

      cleanup = () => {
        if (lenis) lenis.off("scroll", onLenisScroll);
        mm.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      data-component="HeroScroll"
      data-source="src/components/sections/HeroScroll.tsx"
      data-tokens="paper,ink,accent,captured-blue,gray-200,display"
      className="relative border-b border-gray-200"
    >
      {/* On mobile we drop the pin entirely and render the interactive switcher.
          The tall spacer + sticky stage only exist on >=769px. */}
      {isMobile ? (
        <HeroMobile />
      ) : (
        <>
          {/* Tall spacer reserves the scroll length for the pin. The tall height
              is set by CSS (.hero-spacer) gated on a DESKTOP media query AND
              prefers-reduced-motion:no-preference AND html:not([data-motion=off]),
              so the scroll room is reserved from the FIRST PAINT (no JS height
              toggle => CLS 0). Under reduced / motion=0 / mobile / no-support the
              spacer collapses to auto and the stage flows as a normal static hero.
              The .hero-stage CSS makes the stage h-screen only in that same case. */}
          <div ref={spacerRef} data-anim="spacer" className="hero-spacer relative">
            <div
              ref={stageRef}
              className="hero-stage capture-grid relative w-full overflow-hidden"
            >
              <HeroBlobs />

              <div className="relative mx-auto grid h-full max-w-6xl items-center gap-10 px-5 pb-16 pt-28 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:pb-20 lg:pt-32">
                {/* LEFT: copy */}
                <div className="flex flex-col items-start">
                  <span className="inline-flex items-center gap-2 font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-accent-pressed">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {c.eyebrow}
                  </span>

                  <KineticHeadline
                    text={c.headline}
                    className="mt-6 max-w-2xl text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink"
                  />

                  <p className="mt-5 max-w-xl text-[1.25rem] leading-relaxed text-ink/70">
                    {c.subhead}
                  </p>

                  <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <MagneticButton href="#download" data-capture>
                      {c.primaryCta.label}
                    </MagneticButton>
                    <MagneticButton href="#download" variant="secondary" data-capture>
                      {c.secondaryCta.label}
                    </MagneticButton>
                  </div>

                  <p className="mt-5 font-mono text-[1rem] text-gray-500">
                    macOS 13+ &middot; Apple Silicon and Intel &middot; offline
                  </p>
                </div>

                {/* RIGHT: the capture stage. */}
                <div className="relative w-full">
                  <CaptureStage tabs={s.tabs as SwitcherTab[]} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * CaptureStage — the scrubbed scene. Renders the capture browser SVG (with a
 * data-anim marquee path GSAP draws on) and the five resolved output chips.
 *
 * Without GSAP (first paint, motion off, reduced) every chip is visible in its
 * fan position via the data-fan-* values mirrored into an inline transform, so
 * the poster IS the informative end-state. GSAP overrides these transforms when
 * the desktop+motion timeline runs, animating from a centred stack to the fan.
 * ------------------------------------------------------------------------- */
function CaptureStage({ tabs }: { tabs: SwitcherTab[] }) {
  // Fan layout: 5 chips arranged in a shallow arc (deck dealt). x/y in px,
  // rotation in deg. Centre chip upright; outer chips fanned + offset.
  const FAN = [
    { x: -150, y: 6, r: -10 },
    { x: -78, y: -34, r: -5 },
    { x: 0, y: -52, r: 0 },
    { x: 78, y: -34, r: 5 },
    { x: 150, y: 6, r: 10 },
  ];

  const PERIM = 540;

  return (
    <div className="relative">
      {/* The capture browser scene (light Capture OS) */}
      <div className="overflow-hidden rounded-window border border-gray-300 bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(26,22,20,0.4)] sm:p-6">
        <svg
          viewBox="0 0 520 260"
          role="img"
          aria-label="A browser window with a dashed capture rectangle drawn over a button labelled Get started"
          className="h-auto w-full"
        >
          <rect x="16" y="16" width="488" height="228" rx="16" fill="var(--color-gray-50)" stroke="var(--color-gray-200)" strokeWidth="1.5" />
          <line x1="16" y1="52" x2="504" y2="52" stroke="var(--color-gray-200)" strokeWidth="1.5" />
          <circle cx="40" cy="34" r="5" fill="none" stroke="var(--color-gray-300)" strokeWidth="1.5" />
          <circle cx="58" cy="34" r="5" fill="none" stroke="var(--color-gray-300)" strokeWidth="1.5" />
          <circle cx="76" cy="34" r="5" fill="none" stroke="var(--color-gray-300)" strokeWidth="1.5" />
          <rect x="150" y="26" width="220" height="16" rx="8" fill="var(--color-gray-100)" />

          <rect x="48" y="80" width="200" height="14" rx="7" fill="var(--color-gray-300)" />
          <rect x="48" y="106" width="320" height="9" rx="4.5" fill="var(--color-gray-200)" />
          <rect x="48" y="124" width="280" height="9" rx="4.5" fill="var(--color-gray-200)" />

          <rect x="48" y="156" width="184" height="48" rx="12" fill="var(--color-captured-blue)" />
          <text x="140" y="186" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="16" fontWeight="700" fill="#0b1f33">
            Get started
          </text>

          {/* dashed capture marquee. GSAP DrawSVG draws this on. In the poster
              (no GSAP) it is fully drawn (dasharray dashed look). */}
          <rect
            data-anim="marquee"
            x="38"
            y="146"
            width="204"
            height="68"
            rx="14"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{ ["--perim" as string]: String(PERIM) }}
          />
          <g data-anim="handles" fill="var(--color-accent)">
            <circle data-anim="handle" cx="38" cy="146" r="3.5" />
            <circle data-anim="handle" cx="242" cy="146" r="3.5" />
            <circle data-anim="handle" cx="38" cy="214" r="3.5" />
            <circle data-anim="handle" cx="242" cy="214" r="3.5" />
          </g>

          {/* cursor (hidden in poster) */}
          <g data-anim="cursor" style={{ opacity: 0 }}>
            <g transform="translate(242 214)">
              <path
                d="M0 0 L0 18 L4.5 13.5 L8 21 L11 19.5 L7.5 12 L13 12 Z"
                fill="var(--color-accent)"
                stroke="var(--color-paper)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>

        {/* a small hint that GSAP hides during scrub (poster only) */}
        <p
          data-anim="poster-hint"
          className="mt-3 text-center font-mono text-[1rem] text-gray-500"
        >
          one capture, five kinds of data
        </p>
      </div>

      {/* The five chips. Positioned absolutely over a reserved area below the
          scene so the fan never shifts surrounding layout (CLS 0). */}
      <div className="relative mt-6 h-[150px]">
        {tabs.map((tab, i) => {
          const fan = FAN[i];
          return (
            <div
              key={tab.id}
              data-anim="chip"
              data-fan-x={fan.x}
              data-fan-y={fan.y}
              data-fan-r={fan.r}
              className="absolute left-1/2 top-1/2 w-[176px] -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translate(-50%,-50%) translate(${fan.x}px, ${fan.y}px) rotate(${fan.r}deg)`,
              }}
            >
              <Chip tab={tab} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* A single resolved-output chip (one of the five modes). */
function Chip({ tab }: { tab: SwitcherTab }) {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-gray-200 bg-paper p-3.5 shadow-sm">
      <span className="font-mono text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-pressed">
        {tab.label}
      </span>
      <ChipValue tab={tab} />
    </div>
  );
}

function ChipValue({ tab }: { tab: SwitcherTab }) {
  if (tab.kind === "color") {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className="h-7 w-7 shrink-0 rounded-md border border-gray-300"
          style={{ background: "var(--color-captured-blue)" }}
          aria-hidden="true"
        />
        <code className="font-mono text-[1.0625rem] font-semibold text-ink">{tab.value}</code>
      </span>
    );
  }
  if (tab.kind === "dom") {
    return (
      <code className="font-mono text-[1.0625rem] font-semibold text-ink">{tab.selector}</code>
    );
  }
  if (tab.kind === "svg") {
    return (
      <span className="inline-flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.6 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16.9 6.5 19l1.4-6.1L3.2 8.8l6.2-.6L12 2.5z"
            fill="var(--color-accent)"
            stroke="var(--color-ink)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
        <code className="font-mono text-[1.0625rem] font-semibold text-ink">{tab.value}</code>
      </span>
    );
  }
  if (tab.kind === "measure") {
    return (
      <code className="font-mono text-[1.0625rem] font-semibold text-ink">{tab.value}</code>
    );
  }
  // text
  return (
    <code className="font-mono text-[1.0625rem] font-semibold text-ink">{tab.value}</code>
  );
}

/* Mobile fallback: the existing interactive ModeSwitcher (tap-through, autoplay,
 * accessible). No pin, no scrub, no scroll-trap on touch. */
function HeroMobile() {
  const c = copy.hero;
  const s = copy.switcher;
  return (
    <div className="capture-grid relative overflow-hidden">
      <HeroBlobs />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-16 pt-28">
        <div className="flex flex-col items-start">
          <EyebrowLabel>{c.eyebrow}</EyebrowLabel>
          <h1 className="mt-6 text-[clamp(2.5rem,9vw,3.25rem)] font-extrabold leading-[1.0] tracking-[-0.02em] text-ink">
            {c.headline}
          </h1>
          <p className="mt-5 text-[1.125rem] leading-relaxed text-ink/70">
            {c.subhead}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <MagneticButton href="#download" className="w-full">
              {c.primaryCta.label}
            </MagneticButton>
            <MagneticButton href="#download" variant="secondary" className="w-full">
              {c.secondaryCta.label}
            </MagneticButton>
          </div>
          <p className="mt-5 text-[1rem] text-gray-500">
            macOS 13+, Apple Silicon and Intel. Works offline.
          </p>
        </div>
        <div className="relative w-full">
          <ModeSwitcher
            tabs={s.tabs as SwitcherTab[]}
            sceneAlt={s.sceneAlt}
            copiedLabel={s.copiedLabel}
          />
        </div>
      </div>
    </div>
  );
}

/* Soft drifting blobs behind the hero. Decorative, motion-off safe (CSS does not
 * animate them; only the GSAP/Framer layers move). */
function HeroBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-24 top-10 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--color-accent-soft)" }}
      />
      <div
        className="absolute right-[-6rem] top-1/3 h-96 w-96 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--color-accent-subtle)" }}
      />
    </div>
  );
}

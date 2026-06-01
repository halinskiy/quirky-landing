"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { BlobObject } from "@/components/blobs/BlobObject";
import { copy } from "@/content/copy";
import { cn } from "@/lib/cn";

/**
 * Sticky nav. Transparent at the top, warm-paper backdrop-blur once scrolled.
 * Blob capture-mark + Quirky wordmark on the left, flat link row in the middle,
 * coral pill CTA on the right. Strings + hrefs from copy.json.nav (the source
 * of truth for anchors: #how-it-works, #features, #pricing, #faq). The bordered
 * bottom edge is the primary separator (doctrine A5).
 *
 * Mobile: links collapse into a disclosure panel under the bar (no fixed
 * overlay), so nothing overflows at 390px.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const c = copy.nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-component="Nav"
      data-source="src/components/nav/Nav.tsx"
      data-tokens="paper,ink,gray-200,accent"
      data-scrolled={scrolled}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-150",
        "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        scrolled || menuOpen
          ? "border-b border-gray-200 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a
          href="#top"
          className="flex items-center gap-2 text-ink"
          aria-label={`${c.logoAlt} home`}
        >
          <BlobObject mode="capture" size={32} decorative />
          <span className="text-[1.25rem] font-extrabold tracking-tight">
            {c.logoAlt}
          </span>
        </a>

        <ul className="hidden items-center gap-7 text-[1rem] text-ink/70 md:flex">
          {c.links.map((link) => (
            <li key={link.href}>
              <a
                className="transition-colors duration-150 hover:text-ink"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button href="#download" className="hidden px-5 py-2 sm:inline-flex">
            {c.ctaPill}
          </Button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-ink transition-colors duration-150 hover:border-ink/30 md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {menuOpen ? (
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </g>
              ) : (
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </g>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile disclosure panel */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-paper px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-1 text-[1.0625rem] text-ink">
            {c.links.map((link) => (
              <li key={link.href}>
                <a
                  className="block rounded-button px-2 py-2.5 transition-colors duration-150 hover:bg-accent-subtle"
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            href="#download"
            className="mt-3 w-full"
            onClick={() => setMenuOpen(false)}
          >
            {c.ctaPill}
          </Button>
        </div>
      )}
    </header>
  );
}

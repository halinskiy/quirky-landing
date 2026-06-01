import Link from "next/link";
import type { ReactNode } from "react";

import { BlobObject } from "@/components/blobs/BlobObject";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";

/**
 * PageShell — the single shell family for every standalone page (privacy,
 * terms, refunds, thanks, install, 404). Warm-paper, left-aligned, a quiet
 * Quirky mark that links home (the friendly "back" affordance), an eyebrow +
 * title, optional intro, and the body. Deliberately NOT a copy of Corder's
 * legal-page class names: this is its own soft, on-brand shell.
 *
 * `tone="prose"` renders a comfortable max-width reading column for legal text;
 * `tone="centered"` is for the short confirmation pages (thanks / 404 / install
 * hub) where a centred, generous layout reads friendlier.
 */
type PageShellProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  tone?: "prose" | "centered";
  /** optional bottom CTA, e.g. "Back to Quirky" */
  cta?: { label: string; href: string };
};

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
  tone = "prose",
  cta,
}: PageShellProps) {
  const centered = tone === "centered";

  return (
    <div
      data-component="PageShell"
      data-source="src/components/standalone/PageShell.tsx"
      data-tokens="paper,ink,accent,gray-200,gray-500"
      className="min-h-screen bg-paper"
    >
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-ink"
            aria-label="Back to Quirky home"
          >
            <BlobObject mode="capture" size={30} decorative />
            <span className="text-[1.125rem] font-extrabold tracking-tight">
              Quirky
            </span>
          </Link>
        </div>
      </header>

      <main
        className={[
          "mx-auto max-w-3xl px-5 py-16 md:py-24",
          centered ? "flex min-h-[60vh] flex-col items-start justify-center" : "",
        ].join(" ")}
      >
        <div className="flex flex-col gap-4">
          {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-ink">
            {title}
          </h1>
          {intro && (
            <p className="max-w-2xl text-[1.1875rem] leading-relaxed text-gray-500">
              {intro}
            </p>
          )}
        </div>

        {children && <div className="mt-10">{children}</div>}

        {cta && (
          <div className="mt-10">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[1rem] font-semibold text-paper transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed"
            >
              {cta.label}
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 8h9M8 4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * LegalSections — renders {heading, body}[] as a readable column of sections,
 * each with a hairline rule, plus a footer line for "last updated" + contact.
 */
export function LegalSections({
  sections,
  lastUpdated,
  contactLine,
}: {
  sections: { heading: string; body: string }[];
  lastUpdated?: string;
  contactLine?: string;
}) {
  return (
    <div className="flex flex-col">
      {sections.map((s) => (
        <section
          key={s.heading}
          className="border-t border-gray-200 py-7 first:border-t-0 first:pt-0"
        >
          <h2 className="mb-2 text-[1.25rem] font-bold tracking-tight text-ink">
            {s.heading}
          </h2>
          <p className="max-w-2xl text-[1.0625rem] leading-relaxed text-gray-500">
            {s.body}
          </p>
        </section>
      ))}
      {(lastUpdated || contactLine) && (
        <div className="mt-4 flex flex-col gap-1 border-t border-gray-200 pt-6">
          {lastUpdated && (
            <p className="text-[1rem] text-gray-500">
              Last updated: {lastUpdated}
            </p>
          )}
          {contactLine && (
            <p className="text-[1rem] text-gray-500">{contactLine}</p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";

import { BlobObject } from "@/components/blobs/BlobObject";
import { useConsent } from "@/components/consent/ConsentProvider";
import { copy } from "@/content/copy";

/**
 * Footer — 4-column closing block. Squircle Quirky mark + slogan + social on the
 * left; Product / Download / Legal link columns; inline newsletter (placeholder
 * + pill button, no floating nag card); a persistent "Cookie preferences"
 * button that re-opens the consent card from any page (useConsent().reopen);
 * the first-person author line; copyright. Strings from copy.json.footer.
 *
 * Internal routes use next/link so static export resolves the trailing-slash
 * paths. The newsletter is a non-wired placeholder form for the Webflow dev to
 * connect (HANDOFF flags it as native form / integration TODO).
 */
export function Footer() {
  const c = copy.footer;
  const { reopen } = useConsent();

  function isInternal(href: string) {
    return href.startsWith("/");
  }

  return (
    <footer
      data-component="Footer"
      data-source="src/components/sections/Footer.tsx"
      data-tokens="paper,ink,accent,gray-200,gray-500"
      className="border-t border-gray-200 bg-gray-50"
    >
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + slogan + social */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-ink" aria-label={`${c.logoAlt} home`}>
              <BlobObject mode="capture" size={36} decorative />
              <span className="text-[1.375rem] font-extrabold tracking-tight">
                {c.logoAlt}
              </span>
            </Link>
            <p className="max-w-xs text-[1rem] leading-relaxed text-gray-500">
              {c.slogan}
            </p>
            <ul className="flex flex-wrap gap-3">
              {c.social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-gray-200 bg-paper px-3 py-1.5 text-[1rem] text-ink transition-colors duration-150 hover:border-ink/30"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {c.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="flex flex-col gap-3">
              <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.062em] text-gray-500">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {isInternal(link.href) ? (
                      <Link
                        href={link.href}
                        className="text-[1rem] text-ink/80 transition-colors duration-150 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-[1rem] text-ink/80 transition-colors duration-150 hover:text-ink"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Inline newsletter */}
        <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <label htmlFor="footer-newsletter" className="text-[1rem] font-semibold text-ink">
              {c.newsletter.label}
            </label>
            <p className="text-[1rem] text-gray-500">{c.newsletter.note}</p>
          </div>
          <form
            className="flex w-full max-w-md items-center gap-2"
            action="#"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              id="footer-newsletter"
              type="email"
              required
              placeholder={c.newsletter.placeholder}
              className="h-11 min-w-0 flex-1 rounded-full border border-gray-200 bg-paper px-4 text-[1rem] text-ink outline-none transition-colors duration-150 placeholder:text-gray-400 focus-visible:border-accent"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center rounded-full bg-accent px-5 text-[1rem] font-semibold text-paper transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed"
            >
              {c.newsletter.buttonLabel}
            </button>
          </form>
        </div>

        {/* Author line + cookie preferences + copyright */}
        <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[1rem] text-gray-500">{c.authorLine}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={reopen}
              className="text-[1rem] text-ink/80 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              {c.cookiePreferences}
            </button>
            <p className="text-[1rem] text-gray-500">{c.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

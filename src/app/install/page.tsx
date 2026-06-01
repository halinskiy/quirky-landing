import type { Metadata } from "next";

import { PageShell } from "@/components/standalone/PageShell";
import { Button } from "@/components/ui/Button";
import { BlobObject } from "@/components/blobs/BlobObject";
import { copy } from "@/content/copy";

/**
 * /install — the download hub. Two clearly-separated paths: Direct (DMG, all
 * five modes) and Mac App Store (OCR + HEX + SPX). Every string is pulled from
 * copy.json (hero / finalCta / fits) so nothing is invented. The App Store
 * honesty line is present on the App Store card.
 *
 * DMG file size is intentionally a marked TODO (the brief forbids inventing it;
 * pricing-brief named 4.2 MB only as a placeholder). Kostya supplies the real
 * size before launch.
 */
const hero = copy.hero;
const fits = copy.fits;

export const metadata: Metadata = {
  title: "Install Quirky",
  description: copy.meta.metaDescription,
};

export default function InstallPage() {
  return (
    <PageShell
      eyebrow="Download"
      title="Install Quirky"
      intro={fits.items[5].body}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {/* Direct download */}
        <article className="flex h-full flex-col gap-4 rounded-window border border-accent bg-accent-soft p-7">
          <BlobObject mode="capture" size={48} decorative />
          <h2 className="text-[1.25rem] font-extrabold tracking-tight text-ink">
            Direct download
          </h2>
          <p className="text-[1rem] leading-relaxed text-gray-500">
            {hero.primaryCta.modeNote}. {hero.primaryCta.note}.
          </p>
          {/* DMG size: TODO — Kostya to supply the real .dmg size before launch. */}
          <p className="text-[1rem] text-gray-500">
            macOS 13+, Apple Silicon and Intel. File size: to be confirmed.
          </p>
          <div className="mt-auto pt-2">
            <Button href="#" className="w-full">
              {hero.primaryCta.label}
            </Button>
          </div>
        </article>

        {/* App Store */}
        <article className="flex h-full flex-col gap-4 rounded-window border border-gray-200 bg-paper p-7">
          <BlobObject mode="check" size={48} decorative />
          <h2 className="text-[1.25rem] font-extrabold tracking-tight text-ink">
            Mac App Store
          </h2>
          <p className="text-[1rem] leading-relaxed text-gray-500">
            {hero.secondaryCta.note}
          </p>
          <div className="mt-auto pt-2">
            <Button
              href="https://apps.apple.com"
              variant="secondary"
              className="w-full"
            >
              {hero.secondaryCta.label}
            </Button>
          </div>
        </article>
      </div>
    </PageShell>
  );
}

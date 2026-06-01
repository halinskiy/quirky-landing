import type { Metadata } from "next";

import { PageShell } from "@/components/standalone/PageShell";
import { copy } from "@/content/copy";

const c = copy.standalone.thanks;

export const metadata: Metadata = {
  title: c.pageTitle,
  description: c.body,
};

export default function ThanksPage() {
  return (
    <PageShell
      eyebrow={c.pageTitle}
      title={c.headline}
      intro={c.body}
      tone="centered"
      cta={{ label: c.ctaLabel, href: c.ctaHref }}
    />
  );
}

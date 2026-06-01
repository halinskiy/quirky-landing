import type { Metadata } from "next";

import { PageShell, LegalSections } from "@/components/standalone/PageShell";
import { copy } from "@/content/copy";

const c = copy.standalone.privacyPolicy;

export const metadata: Metadata = {
  title: c.pageTitle,
  description: c.intro,
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell eyebrow="Legal" title={c.pageTitle} intro={c.intro}>
      <LegalSections
        sections={c.sections}
        lastUpdated={c.lastUpdated}
        contactLine={c.contactLine}
      />
    </PageShell>
  );
}

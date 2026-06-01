import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { copy } from "@/content/copy";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { Inspector } from "@/components/devtools/Inspector";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const SITE_URL = "https://quirky.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: copy.meta.titleTag,
    template: "%s | Quirky",
  },
  description: copy.meta.metaDescription,
  applicationName: "Quirky",
  category: "productivity",
  keywords: [
    "macOS",
    "screen capture",
    "OCR",
    "color picker",
    "hex picker",
    "DOM selector",
    "SVG extractor",
    "pixel measurement",
    "menu bar app",
  ],
  alternates: { canonical: copy.meta.canonicalPath },
  openGraph: {
    title: copy.meta.ogTitle,
    description: copy.meta.ogDescription,
    type: "website",
    locale: "en_US",
    siteName: "Quirky",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: copy.meta.ogTitle,
    description: copy.meta.ogDescription,
  },
  icons: {
    // basePath-prefixed: metadata icon URLs are NOT auto-rewritten by Next's
    // basePath, so on GitHub Pages project-pages (served from /quirky-landing/)
    // a bare "/icon.svg" 404s. Keep this in sync with next.config.ts basePath.
    icon: [{ url: "/quirky-landing/icon.svg", type: "image/svg+xml" }],
  },
};

// JSON-LD: SoftwareApplication + Organization. Price from product-truth:
// free core + Pro one-time $16.99. Version 1.0, macOS 13+.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Quirky",
      url: SITE_URL,
      operatingSystem: "macOS 13.0",
      applicationCategory: "UtilitiesApplication",
      softwareVersion: "1.0",
      description: copy.meta.metaDescription,
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        {
          "@type": "Offer",
          name: "Quirky Pro",
          price: "16.99",
          priceCurrency: "USD",
          description: "One-time purchase. All five modes. No subscription.",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Quirky",
      url: SITE_URL,
      sameAs: ["https://github.com/halinskiy"],
    },
  ],
};

// Pre-hydration: read ?motion=0 / prefers-reduced-motion before first paint and
// set <html data-motion="off"> so Reveal + the ModeSwitcher short-circuit to
// their final / resolved state. Runs before React so nothing flashes an initial
// animation frame.
const MOTION_BOOTSTRAP = `(function(){try{var s=new URLSearchParams(location.search).get('motion')==='0';var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(s||r){document.documentElement.dataset.motion='off';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
      </head>
      <body>
        <ConsentProvider>
          <LenisProvider>{children}</LenisProvider>
        </ConsentProvider>
        {/* Dev-only Cmd+click inspector for Webflow handoff (doctrine §6). */}
        {process.env.NODE_ENV === "development" && <Inspector />}
      </body>
    </html>
  );
}

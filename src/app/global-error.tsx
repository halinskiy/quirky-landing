"use client";

/**
 * Global error boundary (app router).
 *
 * Why this file exists: with `output: "export"`, `next build` intermittently
 * failed (~1 in 3-4 clean builds) while prerendering `/404` with
 *   "Error occurred prerendering page /404 ... <Html> should not be imported
 *    outside of pages/_document"
 * That message comes from Next's internal PAGES-router `/_error` fallback (which
 * imports <Html>) being raced into the `/404` slot during the parallel export
 * worker phase, instead of the app-router `not-found.tsx`. Providing an
 * app-router `global-error` boundary stops Next falling back to the pages
 * `/_error` component, which removes the race for this project.
 *
 * It is only ever rendered as a last-resort boundary (it replaces the root
 * layout, so it must ship its own <html>/<body>). On a healthy static site it
 * never shows; it carries no styling weight on the happy path.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          background: "#FDFCFA",
          color: "#1A1614",
          fontFamily:
            "var(--font-sans), -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
          Something broke on this page.
        </h1>
        <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, margin: 0, maxWidth: "34rem" }}>
          That is on me, not you. Try again, and if it keeps happening email me at
          hegona3@gmail.com and I will look into it.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            border: "none",
            borderRadius: "9999px",
            background: "#FF7059",
            color: "#FDFCFA",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Inspector — dev-only Cmd+click overlay for Webflow handoff (doctrine §6).
 *
 * Mounted in the root layout behind a NODE_ENV === "development" check. On
 * Cmd+click (or Ctrl+click) it reads the nearest element carrying
 * data-component / data-source / data-tokens and shows a floating panel with
 * the component name, source file, and tokens. Zero cost in production.
 */
type Hit = {
  component: string;
  source: string;
  tokens: string;
  rect: { top: number; left: number; width: number; height: number };
};

export function Inspector() {
  const [hit, setHit] = useState<Hit | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!(e.metaKey || e.ctrlKey)) return;
      const el = (e.target as HTMLElement)?.closest("[data-component]");
      if (!el) {
        setHit(null);
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const r = el.getBoundingClientRect();
      setHit({
        component: el.getAttribute("data-component") ?? "",
        source: el.getAttribute("data-source") ?? "",
        tokens: el.getAttribute("data-tokens") ?? "",
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
      });
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setHit(null);
    }
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!hit) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: hit.rect.top,
          left: hit.rect.left,
          width: hit.rect.width,
          height: hit.rect.height,
          border: "2px solid #e63e2e",
          borderRadius: 6,
          pointerEvents: "none",
          zIndex: 99998,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          maxWidth: 340,
          padding: "14px 16px",
          background: "#1a1614",
          color: "#fdfcfa",
          borderRadius: 12,
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 12,
          lineHeight: 1.5,
          zIndex: 99999,
          boxShadow: "0 16px 48px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ color: "#e63e2e", fontWeight: 700, marginBottom: 6 }}>
          {hit.component}
        </div>
        <div style={{ opacity: 0.8, wordBreak: "break-all" }}>{hit.source}</div>
        {hit.tokens && (
          <div style={{ opacity: 0.6, marginTop: 6, wordBreak: "break-all" }}>
            tokens: {hit.tokens}
          </div>
        )}
        <div style={{ opacity: 0.4, marginTop: 8 }}>Esc to close</div>
      </div>
    </>
  );
}

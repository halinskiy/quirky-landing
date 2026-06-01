"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * CookieConsent — GDPR strict opt-in consent card (presentational only).
 *
 * Project-local adaptation of ui-kit/components/consent/CookieConsent.tsx for
 * the standalone Quirky repo, restyled with Quirky tokens (warm paper, rounded
 * window radius) while keeping the kit contract: host owns storage + analytics,
 * this component is pure UI. Body-portaled so it escapes ancestor overflow /
 * transform. role=dialog aria-modal=false (a persistent corner card, not a
 * blocking modal). Esc is a NO-OP so dismissing is never implied consent.
 *
 * Friendly placement per the brief: a soft card in the bottom-left, not a
 * heavy banner. The persistent re-open trigger lives in the footer.
 */
type CookieConsentProps = {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  title?: string;
  children?: React.ReactNode;
  acceptLabel?: string;
  declineLabel?: string;
};

export function CookieConsent({
  open,
  onAccept,
  onDecline,
  title = "Cookies",
  children,
  acceptLabel = "Accept",
  declineLabel = "Decline",
}: CookieConsentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);

  if (!mounted || !open) return null;

  const node = (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-label={title}
      tabIndex={-1}
      data-component="CookieConsent"
      data-source="src/components/consent/CookieConsent.tsx"
      data-tokens="paper,ink,gray-200,gray-500,accent,radius-window"
      className="fixed bottom-5 left-5 z-[9000] w-[calc(100vw-2.5rem)] max-w-[360px] outline-none"
    >
      <div className="rounded-window border border-gray-200 bg-paper p-5 shadow-[0_16px_40px_-12px_rgba(26,22,20,0.18)]">
        <div className="mb-2 text-[1rem] font-bold tracking-tight text-ink">
          {title}
        </div>
        <div className="mb-4 text-[1rem] leading-relaxed text-gray-500">
          {children}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 rounded-full bg-accent px-4 py-2.5 text-[1rem] font-semibold text-paper transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed"
          >
            {acceptLabel}
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="flex-1 rounded-full border border-gray-200 bg-paper px-4 py-2.5 text-[1rem] font-semibold text-ink transition-colors duration-150 hover:border-ink/30"
          >
            {declineLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

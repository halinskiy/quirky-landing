"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { CookieConsent } from "@/components/consent/CookieConsent";

/**
 * ConsentProvider — owns GDPR strict opt-in consent state + storage.
 *
 * Strict opt-in: nothing non-essential runs until the user accepts. The choice
 * is stored in localStorage ("quirky-consent" = "granted" | "denied"). On first
 * visit (no stored value) the consent card shows. A persistent
 * "Cookie preferences" trigger (exposed via useConsent().reopen) can re-open the
 * card from anywhere on any page (the footer wires it; standalone pages get the
 * provider too).
 *
 * The CookieConsent card itself is presentational; this provider is the only
 * place that touches storage. Quirky ships no analytics today, so "granted" is
 * a forward-looking flag (the honest privacy page says so).
 */
type ConsentValue = "granted" | "denied" | null;

type ConsentContextShape = {
  consent: ConsentValue;
  reopen: () => void;
};

const ConsentContext = createContext<ConsentContextShape>({
  consent: null,
  reopen: () => {},
});

const STORAGE_KEY = "quirky-consent";

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [open, setOpen] = useState(false);

  // Read stored choice after mount (avoids hydration mismatch). Show the card
  // only when there is no stored choice yet.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let stored: ConsentValue = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "granted" || raw === "denied") stored = raw;
    } catch {
      /* localStorage blocked: treat as first visit */
    }
    setConsent(stored);
    if (stored === null) setOpen(true);
  }, []);

  const persist = useCallback((value: Exclude<ConsentValue, null>) => {
    setConsent(value);
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage blocked: choice holds for the session only */
    }
  }, []);

  const reopen = useCallback(() => setOpen(true), []);

  return (
    <ConsentContext.Provider value={{ consent, reopen }}>
      {children}
      <CookieConsent
        open={open}
        onAccept={() => persist("granted")}
        onDecline={() => persist("denied")}
        title="A quick note on cookies"
        acceptLabel="Accept"
        declineLabel="Decline"
      >
        Quirky&apos;s site uses one local preference cookie to remember this
        choice. There is no tracking and no analytics today. If that ever
        changes, only essential storage runs until you accept.
      </CookieConsent>
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}

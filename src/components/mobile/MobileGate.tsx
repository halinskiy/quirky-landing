/**
 * MobileGate — Quirky is a macOS desktop tool and the site is a desktop
 * playground, so on phones / small screens we do not render the site at all
 * (CORRECTIONS.md "PLAYGROUND DIRECTION"). A single full-screen banner asks the
 * visitor to open it on their Mac. Shown only below md; the desktop site is
 * hidden below md (see page.tsx). Fixed + high z so it covers the consent card.
 */
export function MobileGate() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-paper px-8 text-center md:hidden">
      <span className="text-[1.5rem] font-extrabold tracking-tight text-ink">
        Quirky
      </span>
      <p className="max-w-xs text-[1.125rem] leading-relaxed text-ink">
        Quirky is a Mac desktop tool, and this is a desktop playground.
      </p>
      <p className="font-mono text-[1rem] text-gray-500">
        Open it on your Mac to try it.
      </p>
    </div>
  );
}

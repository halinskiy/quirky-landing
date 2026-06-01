/**
 * CaptureHUD — quiet Capture OS frame chrome. Four corner crop-marks + a small
 * mono status readout that frame the page like a capture overlay.
 *
 * The cursor-tracking effect (crosshair lines, live coordinate readout, snapping
 * selection bracket) was REMOVED at the user's request (2026-06-01: "не делай
 * курсор с этим эффектом"). No pointer listeners, no per-frame work; this is
 * static decoration only. aria-hidden, pointer-events-none, hidden on touch.
 */
export function CaptureHUD() {
  return (
    <div aria-hidden="true" className="capture-hud pointer-events-none fixed inset-0 z-[60]">
      <span className="cm cm-tl" />
      <span className="cm cm-tr" />
      <span className="cm cm-bl" />
      <span className="cm cm-br" />
      <div className="hud-status">QUIRKY / CAPTURE</div>
    </div>
  );
}

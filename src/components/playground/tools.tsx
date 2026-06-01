"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The five Quirky modes as REAL, working browser tools (CORRECTIONS.md
 * "PLAYGROUND DIRECTION" 2nd pass, 2026-06-01: the user must actually do on the
 * site what the app does on the Mac):
 *
 *   HEX  native EyeDropper API — pick any pixel on screen, get the hex
 *   OCR  Tesseract.js (lazy) — drop/paste a screenshot, get the text
 *   SPX  drag on the canvas — get the pixel width x height
 *   DOM  click an element in the sample page — get its CSS selector
 *   SVG  drop / paste an SVG — get its source
 *
 * Every result copies to the clipboard. Desktop only (page gates mobile).
 */

/* ---- shared helpers ---- */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function useCopied() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function flash() {
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { copied, flash };
}

function CopyLine({ copied, hint }: { copied: boolean; hint: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[1rem] text-gray-500">
      <span className={`h-2 w-2 rounded-full ${copied ? "bg-accent" : "bg-gray-300"}`} />
      {copied ? "copied to clipboard" : hint}
    </div>
  );
}

const PANEL = "flex flex-col justify-between gap-6 p-8";
const LABEL = "font-mono text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-gray-400";
const STAGE = "grid min-h-[400px] md:grid-cols-[1.5fr_1fr]";
const SCENE = "relative flex flex-col border-b border-gray-200 bg-gray-50/40 p-8 md:border-b-0 md:border-r";

/* ====================================================================== */
/* HEX — native EyeDropper                                                 */
/* ====================================================================== */
type EyeDropperResult = { sRGBHex: string };
type EyeDropperCtor = new () => { open: () => Promise<EyeDropperResult> };

export function HexTool() {
  const { copied, flash } = useCopied();
  const [hex, setHex] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "EyeDropper" in window);
  }, []);

  async function pick() {
    const Ctor = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper;
    if (!Ctor) return;
    try {
      const res = await new Ctor().open();
      const value = res.sRGBHex.toUpperCase();
      setHex(value);
      if (await copyText(value)) flash();
    } catch {
      /* user cancelled the picker — ignore */
    }
  }

  return (
    <div className={STAGE}>
      <div className={SCENE + " items-center justify-center gap-5"}>
        <button
          type="button"
          onClick={pick}
          disabled={!supported}
          className="rounded-full bg-accent px-7 py-3.5 text-[1.0625rem] font-semibold text-paper transition-colors duration-150 hover:bg-accent-hover active:bg-accent-pressed disabled:opacity-40"
        >
          Pick a colour
        </button>
        <p className="max-w-xs text-center text-[1rem] leading-relaxed text-gray-500">
          {supported
            ? "Click, then point at any pixel anywhere on your screen."
            : "The live picker needs Chrome, Arc, or Edge. Safari does not support it yet."}
        </p>
      </div>
      <div className={PANEL}>
        <div className="flex flex-col gap-3">
          <span className={LABEL}>output / color</span>
          <span className="inline-flex w-fit items-center gap-3 rounded-card border border-gray-200 bg-paper px-4 py-3">
            <span
              className="h-9 w-9 rounded-md border border-gray-300"
              style={{ background: hex ?? "var(--color-gray-100)" }}
            />
            <code className="font-mono text-[1.5rem] font-bold text-ink">
              {hex ?? "#------"}
            </code>
          </span>
        </div>
        <CopyLine copied={copied} hint="pick to copy the hex" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* OCR — Tesseract.js (lazy)                                               */
/* ====================================================================== */
export function OcrTool() {
  const { copied, flash } = useCopied();
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setStatus("working");
    setProgress(0);
    setText("");
    try {
      const T = (await import("tesseract.js")) as unknown as {
        recognize: (
          img: File,
          lang: string,
          opts: { logger: (m: { status: string; progress: number }) => void },
        ) => Promise<{ data: { text: string } }>;
      };
      const { data } = await T.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const out = data.text.trim();
      setText(out);
      setStatus("done");
      if (out && (await copyText(out))) flash();
    } catch {
      setStatus("error");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }
  function onPaste(e: React.ClipboardEvent) {
    const item = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"));
    const f = item?.getAsFile();
    if (f) handleFile(f);
  }

  return (
    <div className={STAGE}>
      <div
        className={SCENE + " cursor-pointer items-center justify-center gap-4"}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={onPaste}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Dropped screenshot" className="max-h-44 rounded-card border border-gray-200" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-card border-2 border-dashed border-gray-300 px-8 py-7">
              <span className="font-mono text-[1rem] text-gray-500">drop or paste a screenshot</span>
            </div>
            <span className="text-[1rem] text-gray-400">or click to choose an image</span>
          </div>
        )}
        {status === "working" && (
          <span className="font-mono text-[1rem] text-accent-pressed">reading text… {progress}%</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
      <div className={PANEL}>
        <div className="flex min-h-0 flex-col gap-3">
          <span className={LABEL}>output / text</span>
          <div className="max-h-44 overflow-auto rounded-card border border-gray-200 bg-paper px-4 py-3">
            <code className="whitespace-pre-wrap break-words font-mono text-[1rem] text-ink">
              {status === "error" ? "Could not read that image. Try a clearer screenshot." : text || "…"}
            </code>
          </div>
        </div>
        <CopyLine copied={copied} hint="drop an image to copy its text" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* SPX — drag to measure                                                  */
/* ====================================================================== */
export function SpxTool() {
  const { copied, flash } = useCopied();
  const areaRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  function rel(e: React.PointerEvent) {
    const r = areaRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(r.width, e.clientX - r.left)),
      y: Math.max(0, Math.min(r.height, e.clientY - r.top)),
    };
  }
  function onDown(e: React.PointerEvent) {
    areaRef.current?.setPointerCapture(e.pointerId);
    const p = rel(e);
    start.current = p;
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
  }
  function onMove(e: React.PointerEvent) {
    if (!start.current) return;
    const p = rel(e);
    const s = start.current;
    setRect({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) });
  }
  async function onUp() {
    if (!start.current) return;
    start.current = null;
    if (rect && rect.w > 2 && rect.h > 2) {
      if (await copyText(`${Math.round(rect.w)} x ${Math.round(rect.h)}`)) flash();
    }
  }

  return (
    <div className={STAGE}>
      <div className="relative flex flex-col border-b border-gray-200 bg-gray-50/40 md:border-b-0 md:border-r">
        <div
          ref={areaRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="capture-grid-fine relative h-full min-h-[360px] w-full cursor-crosshair touch-none select-none"
        >
          {rect && (
            <div
              className="absolute border-2 border-accent bg-accent/10"
              style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
            >
              <span className="absolute -top-7 left-0 whitespace-nowrap rounded bg-accent px-2 py-0.5 font-mono text-[0.8125rem] font-semibold text-paper">
                {Math.round(rect.w)} x {Math.round(rect.h)}
              </span>
            </div>
          )}
          {!rect && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[1rem] text-gray-400">
              drag to measure
            </span>
          )}
        </div>
      </div>
      <div className={PANEL}>
        <div className="flex flex-col gap-3">
          <span className={LABEL}>output / pixels</span>
          <span className="inline-flex w-fit items-center rounded-card border border-gray-200 bg-paper px-4 py-3">
            <code className="font-mono text-[1.5rem] font-bold text-ink">
              {rect ? `${Math.round(rect.w)} x ${Math.round(rect.h)}` : "0 x 0"}
            </code>
          </span>
        </div>
        <CopyLine copied={copied} hint="release to copy the size" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* DOM — click an element, get its selector                               */
/* ====================================================================== */
function selectorFor(el: Element, root: Element): string {
  const seg = (n: Element): string => {
    if (n.id) return `#${n.id}`;
    let s = n.tagName.toLowerCase();
    const cls = (n.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
    if (cls.length) s += "." + cls.join(".");
    const parent = n.parentElement;
    if (parent && parent !== root.parentElement) {
      const same = [...parent.children].filter((c) => c.tagName === n.tagName);
      if (same.length > 1) s += `:nth-of-type(${same.indexOf(n) + 1})`;
    }
    return s;
  };
  const path: string[] = [];
  let n: Element | null = el;
  while (n && n !== root && n.nodeType === 1) {
    path.unshift(seg(n));
    if (n.id) break;
    n = n.parentElement;
  }
  return path.join(" > ");
}

export function DomTool() {
  const { copied, flash } = useCopied();
  const rootRef = useRef<HTMLDivElement>(null);
  const [selector, setSelector] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [hoverSel, setHoverSel] = useState<string | null>(null);

  function target(e: React.MouseEvent): Element | null {
    const root = rootRef.current;
    if (!root) return null;
    const el = e.target as Element | null;
    if (el === root) return null;
    return el;
  }
  async function onClick(e: React.MouseEvent) {
    const el = target(e);
    if (!el || !rootRef.current) return;
    const sel = selectorFor(el, rootRef.current);
    setSelector(sel);
    setText((el.textContent || "").trim().slice(0, 60));
    if (await copyText(sel)) flash();
  }
  function onOver(e: React.MouseEvent) {
    const el = target(e);
    if (el && rootRef.current) setHoverSel(selectorFor(el, rootRef.current));
  }

  return (
    <div className={STAGE}>
      <div className={SCENE}>
        {/* sample page — clean semantic classes, inline-styled so the classes
            stay meaningful for selector generation (not Tailwind soup). */}
        <div
          ref={rootRef}
          onClick={onClick}
          onMouseOver={onOver}
          onMouseLeave={() => setHoverSel(null)}
          className="[&_*:hover]:outline [&_*:hover]:outline-2 [&_*:hover]:outline-accent [&_*:hover]:outline-offset-2"
          style={{ cursor: "pointer" }}
        >
          <nav className="nav" style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
            <span className="logo" style={{ fontWeight: 800, color: "var(--color-ink)" }}>Acme</span>
            <a className="link" style={{ color: "var(--color-gray-500)" }}>Pricing</a>
          </nav>
          <h1 className="title" style={{ fontSize: 26, fontWeight: 800, color: "var(--color-ink)", marginBottom: 8 }}>
            Build faster.
          </h1>
          <p className="lede" style={{ color: "var(--color-gray-500)", marginBottom: 16 }}>
            One tool for the whole team.
          </p>
          <button className="cta" style={{ background: "var(--color-accent)", color: "var(--color-paper)", border: 0, borderRadius: 10, padding: "10px 18px", fontWeight: 600 }}>
            Get started
          </button>
          <div className="card" style={{ marginTop: 18, border: "1px solid var(--color-gray-200)", borderRadius: 12, padding: 14 }}>
            <span className="price" style={{ fontWeight: 800, color: "var(--color-ink)" }}>$16.99</span>
          </div>
        </div>
        <p className="mt-auto pt-4 font-mono text-[1rem] text-gray-400">
          {hoverSel ? hoverSel : "hover, then click any element"}
        </p>
      </div>
      <div className={PANEL}>
        <div className="flex flex-col gap-3">
          <span className={LABEL}>output / selector</span>
          <span className="inline-flex w-fit max-w-full items-center rounded-card border border-gray-200 bg-paper px-4 py-3">
            <code className="break-all font-mono text-[1.25rem] font-bold text-ink">
              {selector ?? "—"}
            </code>
          </span>
          {text && <p className="text-[1rem] text-gray-500">text: “{text}”</p>}
        </div>
        <CopyLine copied={copied} hint="click an element to copy its selector" />
      </div>
    </div>
  );
}

/* ====================================================================== */
/* SVG — drop / paste / pick, lift the source                             */
/* ====================================================================== */
const SAMPLE_SVGS: Record<string, string> = {
  star: '<svg viewBox="0 0 24 24" fill="#E63E2E"><path d="M12 2l3 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17l-6.3 3.6 1.6-6.7L2 8.9l6.9-.6z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="#E63E2E"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="#E63E2E"><path d="M12 21S4 13.6 4 8.8A4.2 4.2 0 0 1 12 6a4.2 4.2 0 0 1 8 2.8C20 13.6 12 21 12 21z"/></svg>',
};

export function SvgTool() {
  const { copied, flash } = useCopied();
  const [src, setSrc] = useState<string>(SAMPLE_SVGS.star);
  const inputRef = useRef<HTMLInputElement>(null);

  async function set(source: string) {
    const clean = source.trim();
    setSrc(clean);
    if (await copyText(clean)) flash();
  }
  function onFile(file: File) {
    if (!/svg/.test(file.type) && !file.name.endsWith(".svg")) return;
    file.text().then(set);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
    else { const t = e.dataTransfer.getData("text"); if (t.includes("<svg")) set(t); }
  }
  function onPaste(e: React.ClipboardEvent) {
    const t = e.clipboardData.getData("text");
    if (t.includes("<svg")) { e.preventDefault(); set(t); }
  }

  return (
    <div className={STAGE}>
      <div
        className={SCENE + " items-center justify-center gap-5"}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={onPaste}
      >
        <div
          className="grid h-28 w-28 place-items-center rounded-card border border-gray-200 bg-paper [&_svg]:h-16 [&_svg]:w-16"
          dangerouslySetInnerHTML={{ __html: src }}
        />
        <div className="flex items-center gap-2">
          {Object.entries(SAMPLE_SVGS).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => set(v)}
              className="grid h-10 w-10 place-items-center rounded-button border border-gray-200 bg-paper transition-colors duration-150 hover:border-ink/30 [&_svg]:h-5 [&_svg]:w-5"
              dangerouslySetInnerHTML={{ __html: v }}
              aria-label={`Sample ${k} icon`}
            />
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-button border border-gray-200 bg-paper px-4 py-2.5 font-mono text-[1rem] text-gray-500 transition-colors duration-150 hover:border-ink/30"
          >
            drop .svg
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".svg,image/svg+xml"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        />
      </div>
      <div className={PANEL}>
        <div className="flex flex-col gap-3">
          <span className={LABEL}>output / source</span>
          <div className="max-h-44 overflow-auto rounded-card border border-gray-200 bg-paper px-4 py-3">
            <code className="whitespace-pre-wrap break-all font-mono text-[1rem] text-ink">
              {src}
            </code>
          </div>
        </div>
        <CopyLine copied={copied} hint="pick or drop an SVG to copy its source" />
      </div>
    </div>
  );
}

import { CheckIcon, CloudIcon, GlobeIcon } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import {
  normalizeAddress,
  setAddress,
  usePyoAddress,
} from "~/lib/pyo-address";
import { site } from "~/config/site";

/**
 * The placeholders the docs and the API spec use for the reader's Pyo, in
 * code: `https://your-pyo` in URLs like https://your-pyo/api/v1, and the spec's
 * `your-pyo.example.com`. A placeholder URL becomes the saved origin, scheme
 * and all; a bare placeholder becomes its host. Not `<your-pyo>`, which stands
 * for something to type.
 */
const PLACEHOLDER_URL = /https?:\/\/your-pyo(\.example\.com)?(?![\w-])/g;
const PLACEHOLDER_HOST = /(?<![<\w/-])your-pyo(\.example\.com)?(?![\w-])/g;

/** `text` with the saved origin in place of the placeholders. */
export const withAddress = (text: string, origin: string | null) =>
  origin
    ? text
        .replace(PLACEHOLDER_URL, origin)
        .replace(PLACEHOLDER_HOST, origin.replace(/^https?:\/\//, ""))
    : text;

const hasPlaceholder = (text: string) => text.includes("your-pyo");

/** Text nodes as the page rendered them, so the address can change again. */
const originals = new WeakMap<Text, string>();

function substitute(root: Element, host: string | null) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node as Text;
    if (!text.parentElement?.closest("pre, code")) continue;
    const original = originals.get(text) ?? text.data;
    if (!hasPlaceholder(original)) continue;
    originals.set(text, original);
    const next = withAddress(original, host);
    if (text.data !== next) text.data = next;
  }
}

/**
 * Puts the saved address into the docs' code: code blocks, inline code and the
 * API reference's samples. It runs after the page has rendered, so the server's
 * HTML and the first render stay the same, and copy buttons, which copy what's
 * on the page, copy the address too.
 */
export function AddressInCode() {
  const host = usePyoAddress();
  useEffect(() => {
    const root = document.getElementById("nd-docs-layout");
    if (!root) return;
    substitute(root, host);
    if (!host) return;
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        substitute(root, host);
      });
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [host]);
  return null;
}

/** pyo.mycompa…com:8000: both ends of a long address. */
function truncateMiddle(text: string, max: number) {
  if (text.length <= max) return text;
  const tail = Math.floor((max - 1) / 2);
  return `${text.slice(0, max - 1 - tail)}…${text.slice(-tail)}`;
}

/** The button in the docs' corner, and its popover to set the address. */
export function PyoAddressMenu({
  className = "",
  max = 24,
}: {
  className?: string;
  /** Characters of the address the button shows. */
  max?: number;
}) {
  const host = usePyoAddress();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const cloud = host === site.cloudUrl;

  useEffect(() => {
    if (!open) return;
    setDraft(host ?? "https://");
    setError(false);
    requestAnimationFrame(() => input.current?.focus());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, host]);

  const save = () => {
    const next = normalizeAddress(draft);
    if (!next) return setError(true);
    setAddress(next);
    setOpen(false);
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={id}
        title={host ? `Your Pyo address: ${host}` : "Your Pyo address"}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {cloud ? (
          <>
            <CloudIcon size={14} className="shrink-0" />
            <span className="whitespace-nowrap">Pyo Cloud</span>
          </>
        ) : (
          <>
            <GlobeIcon size={14} className="shrink-0" />
            <span className="whitespace-nowrap font-mono">
              {host ? truncateMiddle(host, max) : "your-pyo"}
            </span>
          </>
        )}
      </button>
      {open ? (
        <div
          id={id}
          role="dialog"
          aria-label="Your Pyo address"
          className="fixed inset-x-3 top-14 z-50 mt-1.5 md:absolute md:inset-x-auto md:right-0 md:top-full md:w-80 animate-dropdown-in rounded-xl border border-border bg-popover p-3 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.45)]"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <label
              htmlFor={`${id}-input`}
              className="text-[13px] font-medium text-foreground"
            >
              Your Pyo address
            </label>
            <input
              ref={input}
              id={`${id}-input`}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(false);
              }}
              placeholder="https://pyo.example.com"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-invalid={error}
              aria-describedby={`${id}-hint`}
              className="field mt-2 h-9 w-full px-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground"
            />
            <p
              id={`${id}-hint`}
              className={`mt-2 text-[12px] leading-snug ${error ? "text-destructive" : "text-muted-foreground"}`}
            >
              {error
                ? "Use an http or https address, like https://pyo.example.com."
                : "Examples in the docs use it. It's only stored in this browser."}
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAddress(null);
                  setOpen(false);
                }}
                className="inline-flex h-8 items-center rounded-full border border-border-strong bg-card px-3.5 text-[12px] font-medium text-foreground hover:bg-accent"
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn-emerge inline-flex h-8 items-center rounded-full px-3.5 text-[12px] font-medium text-primary-foreground"
              >
                Save
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-divider pt-3 text-[12px] text-muted-foreground">
              <span>Using Pyo Cloud?</span>
              <button
                type="button"
                disabled={cloud}
                onClick={() => {
                  setAddress(site.cloudUrl);
                  setOpen(false);
                }}
                className="inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-default disabled:text-success disabled:hover:bg-transparent"
              >
                {cloud ? (
                  <>
                    Using Pyo Cloud
                    <CheckIcon size={12} weight="bold" />
                  </>
                ) : (
                  <>
                    <CloudIcon size={13} />
                    I'm using Pyo Cloud
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

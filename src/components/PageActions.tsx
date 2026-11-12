import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  CheckIcon,
  CopyIcon,
  CursorIcon,
  GithubLogoIcon,
  MarkdownLogoIcon,
  OpenAiLogoIcon,
  SparkleIcon,
  type Icon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { site } from "~/config/site";

const BUTTON =
  "inline-flex h-8 items-center gap-2 rounded-lg border border-[hsl(var(--docs-control-border))] bg-card px-3 text-[13px] font-medium text-foreground/90 transition-colors hover:bg-[hsl(var(--docs-card-hover))] hover:text-foreground disabled:opacity-60";

/** The page as Markdown, on the clipboard. */
function CopyMarkdown({ markdownUrl }: { markdownUrl: string }) {
  const [state, setState] = useState<"idle" | "copying" | "copied" | "failed">(
    "idle",
  );
  const copy = async () => {
    setState("copying");
    try {
      const res = await fetch(markdownUrl);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      disabled={state === "copying"}
      className={BUTTON}
    >
      {state === "copied" ? (
        <CheckIcon size={14} />
      ) : (
        <CopyIcon size={14} className="text-muted-foreground" />
      )}
      {state === "copied"
        ? "Copied Markdown"
        : state === "failed"
          ? "Couldn't copy"
          : "Copy Markdown"}
    </button>
  );
}

/** Links to read the page elsewhere: as Markdown, or with an AI assistant. */
function OpenMenu({
  markdownUrl,
  sourceUrl,
}: {
  markdownUrl: string;
  sourceUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const prompt = encodeURIComponent(
    `Read ${site.url}${markdownUrl}, I want to ask questions about it.`,
  );
  const items: [string, string, Icon][] = [
    ["View as Markdown", markdownUrl, MarkdownLogoIcon],
    ["Open in ChatGPT", `https://chatgpt.com/?hints=search&q=${prompt}`, OpenAiLogoIcon],
    ["Open in Claude", `https://claude.ai/new?q=${prompt}`, SparkleIcon],
    ["Open in Cursor", `https://cursor.com/link/prompt?text=${prompt}`, CursorIcon],
    ["View source on GitHub", sourceUrl, GithubLogoIcon],
  ];

  return (
    <div ref={root} className="sm:relative">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className={BUTTON}
      >
        Open
        <CaretDownIcon
          size={12}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div
          role="menu"
          // On phones it hangs from the whole row, so it stays on the screen.
          className="absolute left-0 top-[calc(100%-1.25rem)] z-30 mt-1.5 w-60 animate-dropdown-in sm:top-full rounded-xl border border-border bg-popover p-1 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.45)]"
        >
          {items.map(([label, href, ItemIcon]) => (
            <a
              key={label}
              role="menuitem"
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-foreground/90 no-underline transition-colors hover:bg-accent hover:text-foreground"
            >
              <ItemIcon size={15} className="shrink-0 text-muted-foreground" />
              <span className="flex-1">{label}</span>
              <ArrowSquareOutIcon
                size={12}
                className="shrink-0 text-muted-foreground/70"
              />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PageActions(props: {
  markdownUrl: string;
  sourceUrl: string;
}) {
  return (
    <div className="relative mb-2 flex flex-wrap items-center gap-2 border-b border-border pb-6">
      <CopyMarkdown markdownUrl={props.markdownUrl} />
      <OpenMenu {...props} />
    </div>
  );
}

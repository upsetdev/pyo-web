import { HouseIcon, ListIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

/** The way out of the docs, beside the logo. */
export function DocsMenu() {
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

  return (
    <div ref={root} className="relative ms-auto w-fit">
      <button
        ref={trigger}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ListIcon size={18} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 w-44 animate-dropdown-in rounded-xl border border-border bg-popover p-1 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.45)]"
        >
          <a
            href="/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
          >
            <HouseIcon size={15} className="shrink-0 text-muted-foreground" />
            Homepage
          </a>
        </div>
      ) : null}
    </div>
  );
}

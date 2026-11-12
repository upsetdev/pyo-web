import { Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CaretDownIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { site } from "~/config/site";
import { RouteButton } from "./Button";
import { GROUPS, iconColor } from "./Features";
import { GithubIcon } from "./GithubIcon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const LINK =
  "text-[13px] text-muted-foreground transition-colors hover:text-foreground";

const CLOSE_DELAY = 140;

export function Header() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closing = useRef<ReturnType<typeof setTimeout>>(undefined);
  /** A mouse opens the menu by hovering, so its click shouldn't close it again. */
  const mouse = useRef(false);

  const show = () => {
    clearTimeout(closing.current);
    setOpen(true);
  };
  const hide = () => {
    closing.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

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
    <header
      ref={root}
      className="sticky top-0 z-40 border-b border-shell-border bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="Pyo home">
            <Logo />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            <Link to="/" hash="screenshots" className={LINK}>
              Screenshots
            </Link>
            <button
              ref={trigger}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onPointerEnter={(e) => e.pointerType === "mouse" && show()}
              onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
              onPointerDown={(e) => {
                mouse.current = e.pointerType === "mouse";
              }}
              onClick={() => {
                if (mouse.current) show();
                else setOpen((o) => !o);
                mouse.current = false;
              }}
              className={`inline-flex items-center gap-1 ${LINK} ${open ? "text-foreground" : ""}`}
            >
              Features
              <CaretDownIcon
                size={11}
                className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>
            <Link to="/templates" className={LINK}>
              Templates
            </Link>
            <Link to="/docs/$" params={{ _splat: "" }} className={LINK}>
              Docs
            </Link>
            <Link to="/pricing" className={LINK}>
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={site.github}
            aria-label="Pyo on GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <GithubIcon size={15} />
          </a>
          <ThemeToggle />
          <RouteButton to="/pricing" size="sm" className="ml-1.5">
            Pyo Cloud
          </RouteButton>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground md:hidden"
          >
            {open ? <XIcon size={16} /> : <ListIcon size={16} />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="site-menu"
          onPointerEnter={(e) => e.pointerType === "mouse" && show()}
          onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] animate-dropdown-in overflow-y-auto border-b border-border bg-background shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)]"
        >
          <nav
            aria-label="Features"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
            className="mx-auto max-w-6xl px-5 py-6"
          >
            <ul className="mb-4 flex flex-col gap-3 border-b border-border pb-4 md:hidden">
              <li>
                <Link
                  to="/"
                  hash="screenshots"
                  className="text-[14px] font-medium"
                >
                  Screenshots
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-[14px] font-medium">
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/docs/$"
                  params={{ _splat: "" }}
                  className="text-[14px] font-medium"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[14px] font-medium">
                  Pricing
                </Link>
              </li>
            </ul>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4 md:gap-y-7">
              {GROUPS.map((group, groupIndex) => (
                <div key={group.id}>
                  <Link
                    to="/"
                    hash={group.id}
                    className="group/title inline-flex items-center gap-1 text-[14px] font-semibold"
                  >
                    {group.title}
                    <ArrowRightIcon
                      size={12}
                      className="hidden text-muted-foreground transition-transform group-hover/title:translate-x-0.5 md:block"
                    />
                  </Link>
                  <ul className="mt-1.5 hidden md:block">
                    {group.items.slice(0, 4).map(([ItemIcon, title], i) => (
                      <li key={title}>
                        <Link
                          to="/"
                          hash={group.id}
                          className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          <ItemIcon
                            size={15}
                            className={`shrink-0 ${iconColor(i + groupIndex)}`}
                          />
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Link
              to="/" hash="features"
              className="group/all mt-5 flex w-full items-center gap-1 border-t border-border pt-4 text-[13px] font-medium text-foreground/85 hover:text-foreground md:mt-6"
            >
              See all features
              <ArrowRightIcon
                size={12}
                className="transition-transform group-hover/all:translate-x-0.5"
              />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

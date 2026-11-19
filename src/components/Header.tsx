import { Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CaretDownIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { site } from "~/config/site";
import { COMPETITORS } from "~/data/versus";
import { RouteButton } from "./Button";
import { GROUPS, iconColor } from "./Features";
import { GithubIcon } from "./GithubIcon";
import { XLogoIcon } from "./XLogoIcon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const LINK =
  "text-[13px] text-muted-foreground transition-colors hover:text-foreground";

const CLOSE_DELAY = 140;

const COMPARE_GROUPS = [
  { title: "Self-hosted", kind: "self-hosted" },
  { title: "Cloud", kind: "cloud" },
].map((g) => ({
  ...g,
  items: COMPETITORS.filter((c) => c.kind === g.kind),
}));

/** The Features menu doubles as the mobile menu. */
type Menu = "features" | "compare";

const MENU_ID: Record<Menu, string> = {
  features: "site-menu",
  compare: "compare-menu",
};

const ITEM =
  "-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export function Header() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const root = useRef<HTMLElement>(null);
  const triggers = {
    features: useRef<HTMLButtonElement>(null),
    compare: useRef<HTMLButtonElement>(null),
  };
  const closing = useRef<ReturnType<typeof setTimeout>>(undefined);
  /** A mouse opens a menu by hovering, so its click shouldn't close it again. */
  const mouse = useRef(false);
  const open = menu !== null;

  const show = (which: Menu) => {
    clearTimeout(closing.current);
    setMenu(which);
  };
  const hide = () => {
    closing.current = setTimeout(() => setMenu(null), CLOSE_DELAY);
  };
  const toggle = (which: Menu) => {
    clearTimeout(closing.current);
    setMenu((m) => (m === which ? null : which));
  };

  /** The props that make a navbar button open its menu. */
  const triggerProps = (which: Menu) => ({
    ref: triggers[which],
    type: "button" as const,
    "aria-expanded": menu === which,
    "aria-controls": MENU_ID[which],
    onPointerEnter: (e: ReactPointerEvent) =>
      e.pointerType === "mouse" && show(which),
    onPointerLeave: (e: ReactPointerEvent) =>
      e.pointerType === "mouse" && hide(),
    onPointerDown: (e: ReactPointerEvent) => {
      mouse.current = e.pointerType === "mouse";
    },
    onClick: () => {
      if (mouse.current) show(which);
      else toggle(which);
      mouse.current = false;
    },
    className: `inline-flex items-center gap-1 ${LINK} ${menu === which ? "text-foreground" : ""}`,
  });

  const caret = (which: Menu) => (
    <CaretDownIcon
      size={11}
      className={`transition-transform duration-200 ${menu === which ? "rotate-180" : ""}`}
    />
  );

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      triggers[menu].current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);

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
          <nav
            aria-label="Main"
            className="hidden items-center gap-5 md:flex lg:gap-6"
          >
            <button {...triggerProps("features")}>
              Features
              {caret("features")}
            </button>
            <button {...triggerProps("compare")}>
              Compare
              {caret("compare")}
            </button>
            <Link to="/templates" className={LINK}>
              Templates
            </Link>
            <a href="/docs" className={LINK}>
              Docs
            </a>
            <Link to="/pricing" className={LINK}>
              Pricing
            </Link>
            <Link to="/sponsors" className={LINK}>
              Sponsors
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
          <a
            href={site.x}
            aria-label="Pyo on X"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <XLogoIcon size={14} />
          </a>
          <ThemeToggle />
          <RouteButton to="/pricing" size="sm" className="ml-1.5">
            Pyo Cloud
          </RouteButton>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menu ? MENU_ID[menu] : MENU_ID.features}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => (open ? setMenu(null) : toggle("features"))}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground md:hidden"
          >
            {open ? <XIcon size={16} /> : <ListIcon size={16} />}
          </button>
        </div>
      </div>

      {menu ? (
        <div
          id={MENU_ID[menu]}
          onPointerEnter={(e) => e.pointerType === "mouse" && show(menu)}
          onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setMenu(null);
          }}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] animate-dropdown-in overflow-y-auto border-b border-border bg-background shadow-[0_24px_60px_-24px_rgb(0_0_0/0.45)]"
        >
          {menu === "compare" ? (
            <nav aria-label="Compare" className="mx-auto max-w-6xl px-5 py-6">
              <CompareGroups />
            </nav>
          ) : (
            <nav aria-label="Features" className="mx-auto max-w-6xl px-5 py-6">
              <ul className="mb-4 flex flex-col gap-3 border-b border-border pb-4 md:hidden">
                <li>
                  <Link to="/templates" className="text-[14px] font-medium">
                    Templates
                  </Link>
                </li>
                <li>
                  <a href="/docs" className="text-[14px] font-medium">
                    Docs
                  </a>
                </li>
                <li>
                  <Link to="/pricing" className="text-[14px] font-medium">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/sponsors" className="text-[14px] font-medium">
                    Sponsors
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
                          <Link to="/" hash={group.id} className={ITEM}>
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

              <div className="mt-5 border-t border-border pt-4 md:hidden">
                <p className="mb-3 text-[14px] font-semibold">Compare</p>
                <CompareGroups />
              </div>
            </nav>
          )}
        </div>
      ) : null}
    </header>
  );
}

function CompareGroups() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:gap-y-7">
      {COMPARE_GROUPS.map((group) => (
        <div key={group.kind}>
          <p className="text-[13px] font-medium text-muted-foreground/70 md:text-[14px] md:font-semibold md:text-foreground">
            {group.title}
          </p>
          <ul className="mt-1.5 grid md:grid-cols-2 md:gap-x-6">
            {group.items.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/vs/$competitor"
                  params={{ competitor: c.slug }}
                  className={ITEM}
                >
                  Pyo vs {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

import {
  BroadcastIcon,
  BrowserIcon,
  ChartLineUpIcon,
  DatabaseIcon,
  DotsThreeCircleIcon,
  GlobeSimpleIcon,
  HardDrivesIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  SquaresFourIcon,
  WrenchIcon,
  type Icon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import data from "~/data/templates.json";
import { isOfficial, OfficialMark, TemplateAuthor } from "./TemplateAuthor";
import { TemplateLogo } from "./TemplateLogo";

// The dashboard's Templates page, for browsing: its categories, search and
// cards, each linking to the template's own page.

const CATEGORY_ICON: Record<string, Icon> = {
  databases: DatabaseIcon,
  caches: LightningIcon,
  storage: HardDrivesIcon,
  networking: GlobeSimpleIcon,
  monitoring: ChartLineUpIcon,
  messaging: BroadcastIcon,
  "developer-tools": WrenchIcon,
  web: BrowserIcon,
  ai: SparkleIcon,
  other: DotsThreeCircleIcon,
};

const categoryLabel = (id: string) =>
  data.categories.find((c) => c.id === id)?.label ?? id;

export function TemplateGallery() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  // The search alone, so each category can say how many it holds.
  const matching = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return data.templates.filter(
      (t) =>
        !ql ||
        t.name.toLowerCase().includes(ql) ||
        t.description.toLowerCase().includes(ql) ||
        t.id.includes(ql) ||
        categoryLabel(t.category).toLowerCase().includes(ql),
    );
  }, [q]);
  // In the catalog's order; browsing everything, the featured ones first.
  const shown =
    cat !== "all"
      ? matching.filter((t) => t.category === cat)
      : q.trim()
        ? matching
        : [...matching.filter((t) => t.featured), ...matching.filter((t) => !t.featured)];

  const categories = [
    { id: "all", label: "All templates", Ico: SquaresFourIcon, n: matching.length },
    ...data.categories.map((c) => ({
      id: c.id,
      label: c.label,
      Ico: CATEGORY_ICON[c.id] ?? DotsThreeCircleIcon,
      n: matching.filter((t) => t.category === c.id).length,
    })),
  ];

  return (
    <div className="grid items-start gap-6 md:grid-cols-[188px_minmax(0,1fr)]">
      <nav aria-label="Template categories" className="hidden md:block">
        <p className="mb-2 px-2.5 text-[12px] font-medium text-muted-foreground/70">
          Categories
        </p>
        <ul className="space-y-0.5">
          {categories.map(({ id, label, Ico, n }) => {
            const on = cat === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCat(id)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] transition-colors ${
                    on
                      ? "bg-accent text-foreground dark:bg-white/[0.06]"
                      : `text-muted-foreground hover:bg-accent/50 hover:text-foreground dark:hover:bg-white/[0.03] ${n ? "" : "opacity-45"}`
                  }`}
                >
                  <Ico
                    size={15}
                    className={`shrink-0 ${on ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"}`}
                  />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  <span className="text-[12px] tabular-nums text-muted-foreground/70">
                    {n}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0 rounded-[20px] frame-edge bg-muted p-1.5">
        <div className="mb-1.5 flex gap-1.5">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search templates</span>
            <MagnifyingGlassIcon
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates"
              className="field h-10 w-full pl-9 pr-3 text-[13.5px] text-foreground placeholder:text-muted-foreground"
            />
          </label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="Category"
            className="field h-10 w-36 px-2.5 text-[13px] md:hidden"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {shown.length ? (
          <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((t) => (
              <li key={t.id}>
                <Link
                  to="/templates/$id"
                  params={{ id: t.id }}
                  className="flex h-full w-full flex-col rounded-[14px] card-edge card-edge-hover bg-card p-4 text-left transition-colors hover:bg-card/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="flex items-center gap-3">
                    <TemplateLogo template={t} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-[14px] font-semibold">
                        <span className="truncate">{t.name}</span>
                        {isOfficial(t) ? <OfficialMark /> : null}
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <span className="truncate">
                          {categoryLabel(t.category)} ·{" "}
                          <TemplateAuthor template={t} />
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 line-clamp-2 text-[12.5px] leading-[1.15rem] text-muted-foreground">
                    {t.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-[14px] card-edge bg-card px-6 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground">
              <MagnifyingGlassIcon size={16} />
            </span>
            <p className="mt-4 text-[14px] font-medium">
              {q ? <>No templates match “{q.trim()}”</> : "No templates here"}
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Try another search, or deploy any container image.
            </p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCat("all");
              }}
              className="mt-4 h-8 rounded-full border border-border bg-card px-3.5 text-[12px] font-medium hover:bg-accent"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

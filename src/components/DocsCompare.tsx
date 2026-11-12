import type { Row } from "~/data/versus";
import { BRAND_PATHS } from "~/lib/brand-paths";
import { CompareTable, Initial } from "./Versus";

/** A brand logo in a small tile, else the name's initial. */
function Mark({ name, logo }: { name: string; logo?: string }) {
  const path = logo ? BRAND_PATHS[logo] : undefined;
  if (!path) return <Initial name={name} />;
  return (
    <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-foreground/[0.08] text-foreground">
      <svg viewBox="0 0 24 24" width={13} height={13} fill="currentColor">
        <path d={path} />
      </svg>
    </span>
  );
}

/**
 * The site's comparison table (checks, notes, a highlighted column) for docs
 * pages, with props MDX can write inline. `rows` cells are
 * [status, note]: "yes" ✓, "partly" –, "no" ✗.
 */
export function DocsCompare({
  caption,
  first,
  second,
  highlight = "second",
  groups,
}: {
  caption: string;
  first: { name: string; tagline?: string; logo?: string };
  second: { name: string; tagline?: string; logo?: string };
  highlight?: "first" | "second";
  groups: { group: string; rows: Row[] }[];
}) {
  return (
    <div className="not-prose my-6">
      <CompareTable
        caption={caption}
        first={{ ...first, mark: <Mark name={first.name} logo={first.logo} /> }}
        second={{ ...second, mark: <Mark name={second.name} logo={second.logo} /> }}
        highlight={highlight}
        groups={groups}
      />
    </div>
  );
}

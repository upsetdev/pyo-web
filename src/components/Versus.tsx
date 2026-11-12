import { CheckIcon, MinusIcon, XIcon } from "@phosphor-icons/react";
import { Fragment, type ReactNode } from "react";
import { COMPETITOR_MARKS } from "~/assets/logos/competitors";
import type { Cell, Competitor, Row } from "~/data/versus";
import { Logo } from "./Logo";

const STATUS = {
  yes: { Icon: CheckIcon, label: "Yes", className: "text-primary" },
  partly: { Icon: MinusIcon, label: "Partly", className: "text-warning" },
  no: { Icon: XIcon, label: "No", className: "text-muted-foreground/60" },
} as const;

/** Pyo's column, tinted like a selected tile in the dashboard. */
const PYO = "bg-primary/[0.05]";
/** Phones scroll the table sideways; the feature names stay pinned. */
const PINNED = "sticky left-0 z-10 bg-card sm:static";

function Status({ cell, strong }: { cell: Cell; strong?: boolean }) {
  const [status, note] = cell;
  const s = STATUS[status];
  return (
    <span className="flex items-start gap-2">
      <s.Icon
        size={14}
        weight="bold"
        aria-hidden
        className={`mt-[3px] shrink-0 ${s.className}`}
      />
      <span className="sr-only">{s.label}: </span>
      <span
        className={`text-[13px] leading-5 ${strong ? "text-foreground" : "text-muted-foreground"}`}
      >
        {note}
      </span>
    </span>
  );
}

type Head = { mark: ReactNode; name: string; tagline?: string };

/** Pyo next to a competitor, grouped by what matters. */
export function VersusTable({ c }: { c: Competitor }) {
  return (
    <CompareTable
      caption={`How Pyo compares with ${c.name}`}
      first={{ mark: <Logo showName={false} />, name: "Pyo" }}
      second={{ mark: <CompetitorMark c={c} />, name: c.name }}
      groups={c.groups}
    />
  );
}

/**
 * A competitor's own logo, sized to sit beside its name. Brands without one
 * we can use get a letter tile, unless `fallback` is off.
 */
export function CompetitorMark({
  c,
  className = "h-5 w-auto max-w-7",
  fallback = true,
}: {
  c: Competitor;
  className?: string;
  fallback?: boolean;
}) {
  const Mark = COMPETITOR_MARKS[c.slug];
  if (Mark) return <Mark className={`shrink-0 ${className}`} />;
  return fallback ? <Initial name={c.name} /> : null;
}

/** A letter tile standing in for a logo. */
export function Initial({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-foreground/[0.08] text-[11px] font-semibold text-muted-foreground"
    >
      {name[0]}
    </span>
  );
}

/**
 * Two columns compared row by row, grouped. The first column is the
 * highlighted one (`row.pyo`), the second is `row.them`.
 */
export function CompareTable({
  caption,
  first,
  second,
  groups,
  highlight = "first",
}: {
  caption: string;
  first: Head;
  second: Head;
  groups: { group: string; rows: Row[] }[];
  /** Which column gets the tint, the top bar and the stronger text. */
  highlight?: "first" | "second";
}) {
  const hi = (col: "first" | "second") => (highlight === col ? PYO : "");
  const bar = (col: "first" | "second") =>
    highlight === col ? (
      <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
    ) : null;
  return (
    <div className="rounded-[20px] frame-edge bg-muted p-1.5">
      <div className="relative overflow-x-auto rounded-[14px] card-edge bg-card">
        <table className="w-full min-w-[640px] table-fixed text-[14px]">
          <caption className="sr-only">
            {caption}
          </caption>
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[34%]" />
            <col className="w-[34%]" />
          </colgroup>
          <thead>
            <tr className="text-left">
              <th scope="col" className={`${PINNED} px-5 py-4`}>
                <span className="sr-only">Feature</span>
              </th>
              <th
                scope="col"
                className={`relative ${hi("first")} px-4 py-4 text-[13px] font-semibold text-foreground`}
              >
                {bar("first")}
                <span className="flex items-center gap-2.5">
                  {first.mark}
                  <span>
                    {first.name}
                    {first.tagline ? (
                      <span className="block text-[11px] font-normal text-muted-foreground">
                        {first.tagline}
                      </span>
                    ) : null}
                  </span>
                </span>
              </th>
              <th
                scope="col"
                className={`relative ${hi("second")} px-4 py-4 text-[13px] font-semibold text-foreground`}
              >
                {bar("second")}
                <span className="flex items-center gap-2.5">
                  {second.mark}
                  <span>
                    {second.name}
                    {second.tagline ? (
                      <span className="block text-[11px] font-normal text-muted-foreground">
                        {second.tagline}
                      </span>
                    ) : null}
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ group, rows }, i) => (
              <Fragment key={group}>
                {/* The first line closes the header: it takes the card's edge. */}
                <tr
                  className={`border-t ${i === 0 ? "border-card-border" : "border-divider"}`}
                >
                  <th
                    scope="rowgroup"
                    className={`${PINNED} px-5 pb-1.5 pt-5 text-left text-[12px] font-medium text-muted-foreground`}
                  >
                    {group}
                  </th>
                  <td className={hi("first")} />
                  <td className={hi("second")} />
                </tr>
                {rows.map((row) => (
                  <tr key={row.topic} className="align-top">
                    <th
                      scope="row"
                      className={`${PINNED} px-5 py-2.5 text-left text-[13.5px] font-medium text-foreground`}
                    >
                      {row.topic}
                    </th>
                    <td className={`${hi("first")} px-4 py-2.5`}>
                      <Status cell={row.pyo} strong={highlight === "first"} />
                    </td>
                    <td className={`${hi("second")} px-4 py-2.5`}>
                      <Status cell={row.them} strong={highlight === "second"} />
                    </td>
                  </tr>
                ))}
                <tr aria-hidden>
                  <td className={`${PINNED} h-3`} />
                  <td className={hi("first")} />
                  <td className={hi("second")} />
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

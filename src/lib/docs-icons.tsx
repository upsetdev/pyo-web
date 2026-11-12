import {
  BookOpenTextIcon,
  CodeIcon,
  CubeIcon,
  DownloadSimpleIcon,
  HardDrivesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparkleIcon,
  SquaresFourIcon,
  TerminalWindowIcon,
  type Icon,
} from "@phosphor-icons/react";

// What pyo-docs can ask for by name, so its pages don't depend on this code.
export const DOCS_ICONS: Record<string, Icon> = {
  book: BookOpenTextIcon,
  code: CodeIcon,
  cube: CubeIcon,
  download: DownloadSimpleIcon,
  rocket: RocketLaunchIcon,
  servers: HardDrivesIcon,
  shield: ShieldCheckIcon,
  sparkle: SparkleIcon,
  templates: SquaresFourIcon,
  terminal: TerminalWindowIcon,
};

/** Card icons, in Pyo's own colours, so each theme gets its readable version. */
const CARD_COLORS: Record<string, string> = {
  book: "text-[var(--series-2)]",
  code: "text-[var(--icon-yellow)]",
  download: "text-[var(--docs-accent)]",
  rocket: "text-[var(--series-3)]",
  cube: "text-[var(--series-2)]",
  terminal: "text-muted-foreground",
  sparkle: "text-warning",
  templates: "text-success",
  servers: "text-[var(--series-2)]",
  shield: "text-success",
};

export const cardColor = (name: string | undefined) =>
  (name && CARD_COLORS[name]) ?? "text-muted-foreground";

/** The segments, each with its own colour wherever it shows. */
const SEGMENTS: Record<string, [Icon, string]> = {
  "segment-core": [CubeIcon, "text-[var(--segment-core)]"],
  "segment-cli": [TerminalWindowIcon, "text-[var(--segment-cli)]"],
  "segment-api": [CodeIcon, "text-[var(--segment-api)]"],
  "segment-mcp": [SparkleIcon, "text-[var(--segment-mcp)]"],
};

export function docsIcon(name: string | undefined, size = 16) {
  if (!name) return undefined;
  const segment = SEGMENTS[name];
  if (segment) {
    const [SegmentIcon, color] = segment;
    return <SegmentIcon size={size} className={color} />;
  }
  const DocsIcon = DOCS_ICONS[name];
  // A typo in pyo-docs should fail the build, not lose an icon quietly.
  if (!DocsIcon) throw new Error(`Unknown docs icon: ${name}`);
  return <DocsIcon size={size} />;
}

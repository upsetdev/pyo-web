import {
  BroadcastIcon,
  BrowserIcon,
  ChartLineUpIcon,
  DatabaseIcon,
  DotsThreeCircleIcon,
  GlobeSimpleIcon,
  HardDrivesIcon,
  LightningIcon,
  SparkleIcon,
  WrenchIcon,
  type Icon,
} from "@phosphor-icons/react";

/** Templates without a logo, by their category. */
const FALLBACK: Record<string, Icon> = {
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

/**
 * A brand logo in its own color, or the text color when that's too dark to
 * read. Dark blues like PostgreSQL's are brightened on the dark theme.
 */
function BrandMark({
  logo,
  size,
}: {
  logo: { hex: string; path: string };
  size: number;
}) {
  const [r, g, b] = [0, 2, 4].map(
    (i) => parseInt(logo.hex.slice(i, i + 2), 16) / 255,
  );
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      fill={luminance < 0.35 ? "currentColor" : `#${logo.hex}`}
      className={`shrink-0 ${luminance < 0.5 ? "dark:brightness-[1.7]" : ""}`}
    >
      <path d={logo.path} />
    </svg>
  );
}

export function TemplateLogo({
  template,
  size = "lg",
}: {
  template: { category: string; logo: { hex: string; path: string } | null };
  size?: "sm" | "lg";
}) {
  const FallbackIcon = FALLBACK[template.category] ?? BrowserIcon;
  const px = size === "sm" ? 13 : 20;
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-foreground/85 ${size === "sm" ? "h-6 w-6" : "h-10 w-10"}`}
    >
      {template.logo ? (
        <BrandMark logo={template.logo} size={px} />
      ) : (
        <FallbackIcon size={px} />
      )}
    </span>
  );
}

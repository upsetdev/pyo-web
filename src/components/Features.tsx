import { Link } from "@tanstack/react-router";
import {
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
  ArrowSquareInIcon,
  ArrowsClockwiseIcon,
  ArrowsOutIcon,
  BellIcon,
  BrainIcon,
  ChartBarIcon,
  ChartLineUpIcon,
  CertificateIcon,
  ClockCounterClockwiseIcon,
  CloudArrowUpIcon,
  CodeIcon,
  CpuIcon,
  CubeIcon,
  DatabaseIcon,
  DownloadSimpleIcon,
  FileTextIcon,
  FingerprintIcon,
  GaugeIcon,
  GearSixIcon,
  GitBranchIcon,
  GlobeSimpleIcon,
  HammerIcon,
  HardDrivesIcon,
  HeartbeatIcon,
  HouseLineIcon,
  KeyIcon,
  LightningIcon,
  ListMagnifyingGlassIcon,
  LockKeyIcon,
  MapPinIcon,
  MagicWandIcon,
  NetworkIcon,
  PackageIcon,
  PlugsConnectedIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ShieldWarningIcon,
  SlidersHorizontalIcon,
  StackIcon,
  TerminalIcon,
  TerminalWindowIcon,
  TimerIcon,
  UsersThreeIcon,
  WebhooksLogoIcon,
  WrenchIcon,
  type Icon,
} from "@phosphor-icons/react";
import data from "~/data/templates.json";
import { RouteButton } from "./Button";
import { TemplateLogo } from "./TemplateLogo";

const { templates } = data;

/** Cycled through the feature icons, each readable in both themes. */
const ICON_COLORS = [
  "text-primary",
  "text-[var(--docs-accent)]",
  "text-[var(--series-3)]",
  "text-[var(--icon-yellow)]",
  "text-success",
];

export const iconColor = (index: number) =>
  ICON_COLORS[index % ICON_COLORS.length];

type Feature = [Icon, string, string];
export type Group = {
  /** Its anchor on the page. */
  id: string;
  title: string;
  body: string;
  /** The first four also show in the header's menu. */
  items: Feature[];
};

// Everything here is checked against the code in the pyo repo. Keep it that
// way: leave out features until they're built.
export const GROUPS: Group[] = [
  {
    id: "deploy",
    title: "Deploy",
    body: "From your code to a running service, however you like to work.",
    items: [
      [RocketLaunchIcon, "Deploy anything", "From Git, a container image, a template or a Docker Compose file."],
      [MagicWandIcon, "Zero-config builds", "Pyo detects your framework and builds it, or uses your Dockerfile or Containerfile."],
      [GitBranchIcon, "Deploy on every push", "Connect GitHub, private repositories included."],
      [ArrowCounterClockwiseIcon, "One-click rollback", "Go back to any earlier version. A failed deploy rolls back on its own."],
      [LightningIcon, "Zero-downtime deploys", "Set 2 replicas to avoid downtime during deploys."],
      [ArrowSquareInIcon, "Import from Coolify or Dokploy", "Bring over projects, services and databases, with their variables and domains."],
      [WebhooksLogoIcon, "Deploy hooks", "Trigger a deploy from CI, a CMS or a cron job with a secret URL."],
      [TimerIcon, "Cron jobs", "Run tasks on a schedule, with run history and alerts when one fails."],
      [HammerIcon, "Build machines", "Build on your own servers or on a dedicated build server."],
    ],
  },
  {
    id: "databases",
    title: "Databases",
    body: "Postgres, MySQL and KV, run for you on your own servers.",
    items: [
      [DatabaseIcon, "Postgres", "Postgres 16 to 18, with a connection pooler built in."],
      [DatabaseIcon, "MySQL", "MySQL 8.4, starting at 1 GiB of memory."],
      [LightningIcon, "Redis-compatible KV", "Valkey, with a REST API for serverless and edge code."],
      [StackIcon, "Automatic failover", "A replica on another server takes over if the primary's server goes down."],
      [ClockCounterClockwiseIcon, "Point-in-time recovery", "Restore Postgres to any moment and MySQL to its latest backup, as a new database."],
      [ArrowsOutIcon, "Read replicas", "Extra copies of Postgres and KV that serve reads."],
      [PlugsConnectedIcon, "Connect in one click", "A service gets its connection variables as secrets."],
      [DownloadSimpleIcon, "Import your data", "Postgres and MySQL from a connection URL or a dump file."],
      [LockKeyIcon, "Deletion protection", "On for every new database, until an admin turns it off."],
    ],
  },
  {
    id: "scale",
    title: "Scale",
    body: "Start with one machine and grow into a cluster.",
    items: [
      [ArrowsOutIcon, "Autoscaling", "Set a min and max, and Pyo scales replicas with CPU and memory use."],
      [HardDrivesIcon, "Multi-server clusters", "Add servers over Tailscale from anywhere, in any data center."],
      [StackIcon, "Multiple clusters", "Keep production and staging apart, all from one dashboard."],
      [MapPinIcon, "Service placement", "Choose where a service runs by location, by tag or by server."],
      [CpuIcon, "Resource limits", "Give every service its own CPU and memory requests and limits."],
      [HeartbeatIcon, "Self-healing", "Crashed containers restart, and stateless services move to a healthy server."],
      [DatabaseIcon, "Persistent volumes", "Attach storage to the services that need to keep data."],
      [WrenchIcon, "Server maintenance", "Cordon or drain a server before you remove it."],
      [GearSixIcon, "Background workers", "Run workers and other services that don't need a public port."],
    ],
  },
  {
    id: "networking",
    title: "Networking",
    body: "Domains, certificates and private traffic, handled for you.",
    items: [
      [GlobeSimpleIcon, "Custom domains", "Point a domain at Pyo and it goes live in seconds, with no redeploy."],
      [CertificateIcon, "Automatic HTTPS", "Let's Encrypt certificates, issued and renewed automatically."],
      [LightningIcon, "Free domains", "Start with a free domain that needs no DNS setup."],
      [KeyIcon, "Your own certificates", "Upload certificates for your domains, wildcards included."],
      [HouseLineIcon, "Private network HTTPS", "Tailnet and LAN domains get a self-signed certificate."],
      [PlugsConnectedIcon, "TCP and UDP ports", "Game servers, DNS and more, through Pyo Gateway or straight from your servers."],
      [NetworkIcon, "Isolated project networks", "Projects can't reach each other's services."],
      [LockKeyIcon, "Private services", "Keep databases and APIs internal, reachable only inside the cluster."],
      [ArrowsClockwiseIcon, "PROXY protocol", "Send or accept it per port, so services see visitors' addresses."],
    ],
  },
  {
    id: "observability",
    title: "Observability",
    body: "See what's happening, without adding another tool.",
    items: [
      [ChartBarIcon, "Analytics", "Visitors, pages, referrers, countries and devices, with no script to add."],
      [FingerprintIcon, "Privacy by default", "Visitors are hashed, and client IPs aren't kept unless you turn it on."],
      [ListMagnifyingGlassIcon, "Logs", "Request logs for your websites, ready to search and filter."],
      [FileTextIcon, "Live logs", "Follow any service's output from the dashboard or with pyo logs."],
      [ChartLineUpIcon, "Server monitoring", "CPU, memory, disk and network, with no Prometheus to run."],
      [TerminalWindowIcon, "Web terminal", "Open a shell in any running service from the dashboard."],
      [ClockCounterClockwiseIcon, "Activity log", "A record of who deployed and changed what, and when."],
      [BellIcon, "Notifications", "Alerts for failed deploys and server health. Mute any topic you like."],
      [PlugsConnectedIcon, "Connection analytics", "See who connects to your TCP and UDP ports, and for how long."],
    ],
  },
  {
    id: "firewall",
    title: "Firewall",
    body: "Decide who reaches your services.",
    items: [
      [ShieldCheckIcon, "Access rules", "Allow or block by IP, range or country, per service."],
      [GlobeSimpleIcon, "Public traffic switch", "Close a whole cluster to the internet with one setting."],
      [GaugeIcon, "Rate limits", "Cap how many requests one visitor can send to a website."],
      [ShieldWarningIcon, "Web application firewall", "The OWASP Core Rule Set and your own rules, per service. Off by default."],
      [SlidersHorizontalIcon, "Log only or block", "Pick Standard to Strictest, add exceptions and see findings in Analytics."],
      [KeyIcon, "A proxy without keys", "Pyo Gateway routes your traffic and never sees your projects' Secrets."],
    ],
  },
  {
    id: "security",
    title: "Security and backups",
    body: "Your data stays on your servers, protected.",
    items: [
      [LockKeyIcon, "Encrypted secrets", "Every team's values are sealed with its own key."],
      [KeyIcon, "OpenBao and Vault", "Keep the master key in OpenBao or Vault, and rotate it any time."],
      [ShieldCheckIcon, "Least-privilege agent", "Turn off terminals or force removal, or make the agent read-only."],
      [CloudArrowUpIcon, "Volume backups", "Scheduled or on demand, to the built-in store or S3. Restore in one click."],
      [DatabaseIcon, "Database backups", "PostgreSQL, MySQL, MariaDB, MongoDB and Valkey dumps."],
      [ClockCounterClockwiseIcon, "Restore without Pyo", "Backups use restic, so they're yours even if Pyo is gone."],
      [UsersThreeIcon, "Teams and roles", "Invite your team as owners, admins, developers or viewers."],
      [PackageIcon, "Private registries", "Pull images from private registries with saved logins."],
      [HardDrivesIcon, "Backups of Pyo itself", "Save Pyo's own data on a schedule, locally or to a bucket."],
    ],
  },
  {
    id: "automate",
    title: "Automate",
    body: "Work from the dashboard, your terminal, your code or your AI assistant.",
    items: [
      [TerminalIcon, "The pyo CLI", "Deploy, follow logs, set variables, roll back and open a shell."],
      [GearSixIcon, "Config in your repo", "Keep a service's build and deploy settings in pyo.toml."],
      [CodeIcon, "API and scoped keys", "A documented API, with keys that can read, deploy or do everything."],
      [BrainIcon, "MCP for AI assistants", "131 tools that cover everything the API can do."],
      [HeartbeatIcon, "Keeps running without Pyo", "Your services stay up even if Pyo itself is down."],
      [CubeIcon, "No lock-in", "Open source under Apache 2.0, built on standard tools."],
    ],
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-14">
      <div className="mx-auto max-w-6xl px-5 pt-24 sm:pt-32">
        <h2 className="max-w-2xl text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
          A modern cloud platform, on hardware you own or rent
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
          Everything you'd expect from a hosted platform, with your servers and
          your data.
        </p>

        <div className="mt-12 space-y-12 lg:space-y-16">
          {GROUPS.map((group, groupIndex) => (
            <div
              key={group.id}
              id={group.id}
              className="grid scroll-mt-20 gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
            >
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h3 className="text-[20px] font-semibold tracking-tight">
                  {group.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                  {group.body}
                </p>
              </div>
              <div className="rounded-[20px] frame-edge bg-muted p-1.5">
                <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map(([ItemIcon, title, body], i) => (
                    <li
                      key={title}
                      className="rounded-[14px] card-edge bg-card p-4"
                    >
                      <ItemIcon
                        size={18}
                        className={iconColor(i + groupIndex)}
                      />
                      <h4 className="mt-3 text-[14px] font-semibold">
                        {title}
                      </h4>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <TemplatesShowcase />
      </div>
    </section>
  );
}

/** Popular templates by their logos, featured first; the rest are a click away. */
const SHOWN = [...templates.filter((t) => t.featured), ...templates.filter((t) => !t.featured)]
  .filter((t) => t.logo)
  .slice(0, 11);

function TemplatesShowcase() {
  const more = templates.length - SHOWN.length;
  return (
    <div
      id="templates"
      className="mt-16 scroll-mt-20 rounded-[24px] frame-edge bg-muted p-1.5 lg:mt-24"
    >
      <div className="grid gap-1.5 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
        <div className="flex flex-col rounded-[18px] card-edge bg-card p-7 sm:p-9">
          <h3 className="text-balance text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
            One-click templates
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {templates.length} databases, tools and apps, ready to run on
            your servers. Pick one and Pyo handles the rest: storage, health
            checks and generated passwords.
          </p>
          <div className="mt-7 lg:mt-auto lg:pt-8">
            <RouteButton to="/templates">
              Browse all templates
              <ArrowRightIcon size={14} />
            </RouteButton>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
          {SHOWN.map((t) => (
            <li key={t.id}>
              <Link
                to="/templates/$id"
                params={{ id: t.id }}
                className="group/tile flex h-full flex-col gap-3 rounded-[14px] card-edge card-edge-hover bg-card p-4 transition-colors hover:bg-accent/40"
              >
                <TemplateLogo template={t} />
                <span className="truncate text-[13.5px] font-medium">
                  {t.name}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/templates"
              className="group/more flex h-full flex-col justify-between gap-3 rounded-[14px] border border-dashed border-foreground/15 p-4 transition-colors hover:border-foreground/25 hover:bg-card"
            >
              <span className="text-[22px] font-semibold leading-10 tracking-tight">
                +{more}
              </span>
              <span className="inline-flex items-center gap-1 text-[13.5px] font-medium text-foreground/85">
                more
                <ArrowRightIcon
                  size={12}
                  className="transition-transform group-hover/more:translate-x-0.5"
                />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

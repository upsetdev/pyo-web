import {
  BellIcon,
  CheckIcon,
  CubeTransparentIcon,
  DatabaseIcon,
  GitPullRequestIcon,
  HardDrivesIcon,
  ShieldCheckIcon,
  RobotIcon,
  RocketLaunchIcon,
  type Icon,
} from "@phosphor-icons/react";
import { FeatureCard, FeatureGrid, iconColor } from "~/components/Features";
import { CompareTable } from "~/components/Versus";
import { Logo } from "~/components/Logo";
import type { Row } from "~/data/versus";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ButtonLink } from "~/components/Button";
import { CloudButton } from "~/components/CloudButton";
import { CopyCommand } from "~/components/CopyCommand";
import { site } from "~/config/site";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    seo({
      path: "/pricing",
      title: "Pricing: free self-hosted, or Pyo Cloud at $5 per server | Pyo",
      description:
        "Self-host Pyo for free, or let us run Pyo for $5 per server per month. Your services and data stay on your servers.",
      card: {
        badge: "Pricing",
        title: "Free to self-host, or Pyo Cloud at $5 per server",
        description: "Every feature on both plans. Your services and data stay on your servers.",
      },
    }),
  component: PricingPage,
});

const SELF_HOSTED = [
  "Every feature",
  "Open source, Apache 2.0",
  "Unlimited teams, members, projects and services",
];

const CLOUD = [
  "Every feature",
  "We update and back up Pyo",
  "Support from the Pyo team",
  "Unlimited teams, members, projects and services",
];

/** Headline features, shown below the plans. `soon` marks what isn't shipped yet. */
const INCLUDED: {
  icon: Icon;
  title: string;
  body: string;
  page?: "/sandbox";
  soon?: boolean;
}[] = [
  { icon: HardDrivesIcon, title: "Multi-server clusters", body: "Connect servers over your Tailscale tailnet. Pick where each service runs." },
  { icon: DatabaseIcon, title: "Built-in databases", body: "Postgres, MySQL and KV with replicas, point-in-time restore and backups." },
  { icon: ShieldCheckIcon, title: "WAF, firewall and analytics", body: "Raw requests stay on your servers. Pyo keeps only the totals." },
  { icon: CubeTransparentIcon, title: "Sandboxes", body: "Isolated machines for code and agents, with a full desktop in the browser.", page: "/sandbox" },
  { icon: BellIcon, title: "Alerts", body: "In Telegram, Discord, Slack or any webhook." },
  { icon: RocketLaunchIcon, title: "Push to deploy", body: "Deploy from GitHub, GitLab or any image. Roll back in one click." },
  { icon: RobotIcon, title: "MCP, API and CLI", body: "Let AI agents and scripts run Pyo through its MCP server, API or CLI." },
  { icon: GitPullRequestIcon, title: "Preview environments", body: "A live preview of every pull request." },
];

/** Pyo Cloud (highlighted) next to self-hosted Pyo, grouped. */
const COMPARE: { group: string; rows: Row[] }[] = [
  {
    group: "Your services",
    rows: [
      { topic: "Where your services run", pyo: ["yes", "Your servers"], them: ["yes", "Your servers"] },
    ],
  },
  {
    group: "Running Pyo",
    rows: [
      {
        topic: "Dashboard, API and database",
        pyo: ["partly", "You run them on your server"],
        them: ["yes", "Run by us at cloud.pyo.dev"],
      },
      {
        topic: "Updates",
        pyo: ["partly", "You install each release"],
        them: ["yes", "By us, while your services keep running"],
      },
      {
        topic: "Agent updates",
        pyo: ["yes", "With each Pyo update"],
        them: ["yes", "Automatic, or when you choose"],
      },
      {
        topic: "Pyo's own backups",
        pyo: ["partly", "You set them up, on your server or in S3"],
        them: ["yes", "By us"],
      },
    ],
  },
  {
    group: "Network and support",
    rows: [
      {
        topic: "Inbound ports",
        pyo: ["partly", "Your team needs to reach your dashboard"],
        them: ["yes", "None for Pyo, as your servers only connect out"],
      },
      {
        topic: "Support",
        pyo: ["partly", "Community on GitHub"],
        them: ["yes", "From the Pyo team"],
      },
    ],
  },
  {
    group: "Price",
    rows: [
      {
        topic: "Cost",
        pyo: ["yes", "Free"],
        them: ["yes", "$5 per server per month, 20% off yearly"],
      },
    ],
  },
];

const FAQ: [string, ReactNode][] = [
  [
    "What counts as a server?",
    "Each machine you connect counts once, whatever it runs. Everything else is free and unlimited.",
  ],
  [
    "When am I charged?",
    "When you connect your first server, then every month or year.",
  ],
  [
    "How can I pay?",
    "By card. In Indonesia you can also pay with QRIS, bank transfer or e-wallets.",
  ],
  [
    "What happens when I add or remove a server?",
    "A server added mid-month is charged for the rest of the month. A removed one is credited on your next invoice.",
  ],
  [
    "What if a payment fails?",
    "Your services keep running. After 7 days, deploys pause until you pay.",
  ],
  [
    "Can I cancel or leave?",
    "Yes, anytime. Remove your servers and billing stops, but your services keep running.",
  ],
  [
    "Where does my data live?",
    <>
      Services, databases, images, backups and raw request logs stay on your
      servers. Pyo Cloud keeps settings, encrypted environment variables, build
      logs and analytics totals. See{" "}
      <a href="/docs/cloud/security" className="font-medium text-foreground underline underline-offset-4">
        Security on Pyo Cloud
      </a>
      .
    </>,
  ],
  [
    "Is there a free trial?",
    "No. Self-hosted Pyo is free and has every feature.",
  ],
  ...(site.cloudLive
    ? []
    : ([["When does Pyo Cloud open?", "Soon. Until then, self-host Pyo for free."]] as [string, ReactNode][])),
];

function Soon() {
  return (
    <span className="inline-flex h-5 items-center rounded-full border border-border px-2 align-middle text-[11px] font-medium text-muted-foreground">
      Coming soon
    </span>
  );
}

function Feature({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] leading-6">
      <CheckIcon
        size={14}
        weight="bold"
        aria-hidden
        className="mt-[5px] shrink-0 text-primary"
      />
      <span>{children}</span>
    </li>
  );
}

function Plan({
  name,
  price,
  unit,
  note,
  summary,
  action,
  features,
  footer,
}: {
  name: string;
  price: string;
  unit?: string;
  note?: string;
  summary: string;
  action: ReactNode;
  features: ReactNode[];
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-[14px] card-edge bg-card p-6 sm:p-8">
      <h2 className="text-[15px] font-semibold">{name}</h2>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[40px] font-semibold leading-none tracking-[-0.02em]">
          {price}
        </span>
        {unit ? (
          <span className="text-[14px] text-muted-foreground">{unit}</span>
        ) : null}
      </p>
      {/* The note and summary keep the same height on both cards, so the
          buttons line up side by side. */}
      <p
        aria-hidden={note ? undefined : true}
        className="mt-2 hidden min-h-5 text-[13px] leading-5 text-muted-foreground md:block"
      >
        {note}
      </p>
      {note ? (
        <p className="mt-2 text-[13px] leading-5 text-muted-foreground md:hidden">
          {note}
        </p>
      ) : null}
      <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground md:min-h-[2lh]">
        {summary}
      </p>
      <div className="mt-6">{action}</div>
      <ul className="mt-8 space-y-2.5">
        {features.map((f, i) => (
          <Feature key={i}>{f}</Feature>
        ))}
      </ul>
      {footer ? <div className="mt-auto pt-8">{footer}</div> : null}
    </div>
  );
}

function PricingPage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl animate-fade-up px-5 pb-10 pt-16 sm:pt-24">
        <h1 className="text-balance text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
          Pricing
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
          Run Pyo yourself for free, or let us run it with Pyo Cloud. Your
          services run on your servers either way.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <div className="grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 md:grid-cols-2">
          <Plan
            name="Self-hosted"
            price="Free"
            summary="You run and update Pyo on your own server."
            action={
              <ButtonLink
                href="/docs/install"
                variant="secondary"
                className="w-full"
              >
                Install
              </ButtonLink>
            }
            features={SELF_HOSTED}
            footer={<CopyCommand command={site.setupCommand} />}
          />
          <Plan
            name="Pyo Cloud"
            price="$5"
            unit="/ server / month"
            note="Or $48 per server per year, 20% off."
            summary="We run Pyo for you. Your services run on your servers."
            action={
              <CloudButton href={`${site.cloudUrl}/signup`}>Get started</CloudButton>
            }
            features={CLOUD}
          />
        </div>
        <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
          Servers need Linux on x86-64 with at least 2 CPU cores, 2 GB of
          memory (4 GB recommended) and 40 GB of disk.{" "}
          <a href="/docs/cloud/server-requirements" className="underline underline-offset-4 hover:text-foreground">
            Server requirements
          </a>
        </p>
        <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
          Your providers bill servers, bandwidth and S3 storage directly.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
          Everything included
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Both plans have every feature, including these.{" "}
          <a href="/#features" className="font-medium text-foreground underline underline-offset-4">
            See all features
          </a>
        </p>
        <div className="mt-8">
          <FeatureGrid className="sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                color={iconColor(i)}
                title={f.title}
                body={f.body}
                page={f.page}
                tag={f.soon ? <Soon /> : undefined}
              />
            ))}
          </FeatureGrid>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
          Self-hosted or Pyo Cloud
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The only difference is who runs Pyo itself.
        </p>
        <div className="mt-8">
          <CompareTable
            caption="How self-hosted Pyo compares with Pyo Cloud"
            first={{ mark: <Logo showName={false} />, name: "Self-hosted", tagline: "You run Pyo" }}
            second={{ mark: <Logo showName={false} />, name: "Pyo Cloud", tagline: "We run Pyo" }}
            groups={COMPARE}
            highlight="second"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
          Questions about Pyo Cloud
        </h2>
        <dl className="mt-8 list-rows overflow-hidden rounded-[14px] card-edge bg-card [--row-inset:1.5rem]">
          {FAQ.map(([q, a]) => (
            <div key={q} className="px-6 py-5">
              <dt className="text-[15px] font-semibold">{q}</dt>
              <dd className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}

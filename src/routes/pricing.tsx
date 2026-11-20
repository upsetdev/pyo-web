import { CheckIcon } from "@phosphor-icons/react";
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
        "Self-host Pyo for free with every feature, or let us run it with Pyo Cloud for $5 per server per month. Either way, your services and data stay on your servers.",
      card: {
        badge: "Pricing",
        title: "Free to self-host, or Pyo Cloud at $5 per server",
        description: "Every feature on every install. Your services and data stay on your servers.",
      },
    }),
  component: PricingPage,
});

const SELF_HOSTED = [
  "Every feature, on every install",
  "Open source, Apache 2.0",
  "Runs entirely on your servers",
  "Unlimited teams, members, projects, services and clusters",
];

/** What Pyo Cloud includes, headline level. `soon` marks what isn't shipped yet. */
const CLOUD: { text: string; soon?: boolean }[] = [
  { text: "Multi-server clusters over your own Tailscale tailnet. Choose where each service runs." },
  { text: "Built-in Postgres, MySQL and KV, with replicas, point-in-time restore and scheduled backups" },
  { text: "Built-in WAF, firewall and analytics. Totals on Pyo, raw requests on your servers." },
  { text: "Sandboxes, including a full desktop in the browser" },
  { text: "Alerts to Telegram, Discord, Slack and webhooks" },
  { text: "Every command to your servers signed with keys kept in AWS KMS, a hardware security module" },
  { text: "Each team's data kept apart in the database" },
  { text: "Preview environments for pull requests", soon: true },
  { text: "Unlimited users, projects and services" },
  { text: "Updates handled by us" },
];

/** Pyo Cloud (highlighted) next to self-hosted Pyo, grouped. */
const COMPARE: { group: string; rows: Row[] }[] = [
  {
    group: "Your services",
    rows: [
      { topic: "Where your services run", pyo: ["yes", "Your servers"], them: ["yes", "Your servers"] },
      { topic: "Features", pyo: ["yes", "Every feature"], them: ["yes", "Every feature"] },
    ],
  },
  {
    group: "Running Pyo",
    rows: [
      {
        topic: "Dashboard, API and database",
        pyo: ["partly", "You run them on one of your servers"],
        them: ["yes", "Run by us at cloud.pyo.dev"],
      },
      {
        topic: "Updates",
        pyo: ["partly", "You update Pyo when a release comes out"],
        them: ["yes", "Handled by us, and your services keep running"],
      },
      {
        topic: "Agent updates",
        pyo: ["yes", "With each Pyo update"],
        them: ["yes", "Automatic, or when your team chooses"],
      },
      {
        topic: "Pyo's own backups",
        pyo: ["partly", "You set them up, on your server or in your own S3 bucket"],
        them: ["yes", "Handled by us"],
      },
    ],
  },
  {
    group: "Network and support",
    rows: [
      {
        topic: "Inbound ports",
        pyo: ["partly", "Your team must be able to reach your dashboard"],
        them: ["yes", "None for Pyo: your servers only connect out"],
      },
      {
        topic: "Support",
        pyo: ["partly", "Community, on GitHub"],
        them: ["yes", "From the Pyo team"],
      },
    ],
  },
  {
    group: "Price",
    rows: [
      {
        topic: "Cost",
        pyo: ["yes", "Free and open source"],
        them: ["yes", "$5 per server per month, 20% off yearly"],
      },
    ],
  },
];

const FAQ: [string, ReactNode][] = [
  [
    "What counts as a server?",
    "Each machine you connect counts once, whatever it does. One server that runs your services, databases and builds is $5 a month. Clusters, teams, members, projects and services are free and unlimited.",
  ],
  [
    "When am I charged?",
    "You pay when you connect your first server. After that, you pay $5 per server each month, or $48 per server each year.",
  ],
  [
    "What happens when I add or remove a server?",
    "Adding a server mid-month charges it for the rest of that month. Removing one credits your next invoice.",
  ],
  [
    "What if a payment fails?",
    "Your services keep running. After 7 days, deploys pause until the payment goes through.",
  ],
  [
    "Can I cancel or leave?",
    "Cancel anytime. Remove your servers and the charges stop. Your services keep running on your servers.",
  ],
  [
    "Where does my data live?",
    <>
      Your services, databases, images, backups and raw request logs stay on
      your servers. Pyo Cloud keeps your settings, encrypted environment
      variables, build logs and analytics totals. Your servers only connect
      out, so Pyo needs no inbound ports. See{" "}
      <a href="/docs/cloud/security" className="font-medium text-foreground underline underline-offset-4">
        Security on Pyo Cloud
      </a>
      .
    </>,
  ],
  [
    "What server do I need?",
    <>
      Linux on x86-64 with at least 2 CPU cores, 2 GB of memory and 40 GB of
      disk. 4 GB of memory is recommended. Pyo uses about 1 GB of it. See{" "}
      <a href="/docs/cloud/server-requirements" className="font-medium text-foreground underline underline-offset-4">
        Server requirements
      </a>
      .
    </>,
  ],
  [
    "What else do I pay for?",
    "Your servers, bandwidth and S3 storage, billed directly by your providers. The $5 covers what Pyo runs for you.",
  ],
  [
    "Is there a free trial?",
    "No. Self-hosted Pyo is the free option. It's open source and has every feature.",
  ],
  ...(site.cloudLive
    ? []
    : ([["When does Pyo Cloud open?", "Soon. Until then, self-host Pyo for free."]] as [string, ReactNode][])),
];

function Soon() {
  return (
    <span className="ml-1.5 inline-flex h-5 items-center rounded-full border border-border px-2 align-middle text-[11px] font-medium text-muted-foreground">
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
  label,
  features,
  footer,
}: {
  name: string;
  price: string;
  unit?: string;
  note?: string;
  summary: string;
  action: ReactNode;
  label?: string;
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
      {note ? (
        <p className="mt-2 text-[13px] text-muted-foreground">{note}</p>
      ) : null}
      <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
        {summary}
      </p>
      <div className="mt-6">{action}</div>
      {label ? (
        <h3 className="mt-8 text-[13px] font-semibold">{label}</h3>
      ) : null}
      <ul className={`${label ? "mt-3" : "mt-8"} space-y-2.5`}>
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
          Self-host Pyo for free, or let us run it for you with Pyo Cloud.
          Either way, your services run on your own infrastructure.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <div className="grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 md:grid-cols-2">
          <Plan
            name="Self-hosted"
            price="Free"
            summary="Open source, with every feature. You run and update Pyo yourself."
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
            summary="Pyo, run by us. Connect your servers and deploy to them, with nothing to run or update."
            action={
              <CloudButton href={`${site.cloudUrl}/signup`}>Get started</CloudButton>
            }
            label="Everything included"
            features={CLOUD.map((f) => (
              <>
                {f.text}
                {f.soon ? <Soon /> : null}
              </>
            ))}
          />
        </div>
        <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
          Each server needs Linux on x86-64 with at least 2 CPU cores, 2 GB of
          memory and 40 GB of disk. 4 GB is recommended.{" "}
          <a href="/docs/cloud/server-requirements" className="underline underline-offset-4 hover:text-foreground">
            Server requirements
          </a>
        </p>
        <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
          Your servers, bandwidth and S3 storage are billed by your own
          providers, on either plan.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
          Self-hosted or Pyo Cloud
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Same Pyo, same features, and your services run on your servers
          either way. The difference is who runs and looks after Pyo itself.
        </p>
        <div className="mt-8">
          <CompareTable
            caption="How self-hosted Pyo compares with Pyo Cloud"
            first={{ mark: <Logo showName={false} />, name: "Self-hosted", tagline: "Open source, run by you" }}
            second={{ mark: <Logo showName={false} />, name: "Pyo Cloud", tagline: "Run by us" }}
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

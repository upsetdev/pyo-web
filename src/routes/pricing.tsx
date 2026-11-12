import { CheckIcon } from "@phosphor-icons/react";
import { CompareTable } from "~/components/Versus";
import { Logo } from "~/components/Logo";
import type { Row } from "~/data/versus";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { RouteButton } from "~/components/Button";
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
    }),
  component: PricingPage,
});

const SELF_HOSTED = [
  "Every feature, on every install",
  "Open source, Apache 2.0",
  "Runs entirely on your servers",
  "Unlimited teams, members, projects, services and clusters",
];

const CLOUD = [
  "Fully managed by the Pyo team",
  "Deploy to your own servers",
  "Login and MFA",
  "The GitHub App",
  "Managed updates",
  "Uptime alerts",
  "Support",
  "Unlimited teams, members, projects, services and clusters",
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
        topic: "Uptime",
        pyo: ["partly", "Keeping Pyo up is on you"],
        them: ["yes", "Monitored by us, with uptime alerts"],
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
        them: ["yes", "None: your servers only connect out"],
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
        them: ["yes", "$5 per server per month"],
      },
    ],
  },
];

const FAQ: [string, ReactNode][] = [
  [
    "What counts as a server?",
    "Each machine you connect counts once, whatever it does. One server that runs your services, the control plane and your builds is $5 a month. Clusters, teams, members, projects and services are free and unlimited.",
  ],
  [
    "When am I charged?",
    "You add a card when you connect your first server, and it's charged right away. After that, you pay $5 per server each month.",
  ],
  [
    "What happens when I add or remove a server?",
    "Adding a server mid-month charges it for the rest of that month. Removing one credits your next invoice.",
  ],
  [
    "What if a payment fails?",
    "Your services keep running. After a 7-day grace period, the dashboard and deploys pause until the payment goes through.",
  ],
  [
    "Can I cancel or leave?",
    "Cancel anytime: remove your servers and the charges stop. To leave, export your team and import it into self-hosted Pyo.",
  ],
  [
    "Where does my data live?",
    "Your services, images, logs, backups and analytics stay on your servers. Pyo Cloud keeps only the metadata the dashboard needs. Your servers only connect out, so you need no inbound ports. The one firewall rule you need allows outbound traffic to agent.pyo.dev on port 443.",
  ],
  [
    "What else do I pay for?",
    "Your servers, bandwidth and S3 storage, billed directly by your providers. The $5 covers what Pyo runs for you.",
  ],
  [
    "Is there a free trial?",
    "No. Self-hosted Pyo is the free option: it's open source and has every feature.",
  ],
];

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
  summary,
  action,
  features,
  footer,
}: {
  name: string;
  price: string;
  unit?: string;
  summary: string;
  action: ReactNode;
  features: string[];
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
      <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
        {summary}
      </p>
      <div className="mt-6">{action}</div>
      <ul className="mt-8 space-y-2.5">
        {features.map((f) => (
          <Feature key={f}>{f}</Feature>
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
          Either way, your services run on your own servers.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <div className="grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 md:grid-cols-2">
          <Plan
            name="Self-hosted"
            price="Free"
            summary="Open source, with every feature. You run and update Pyo yourself."
            action={
              <RouteButton
                to="/docs/$"
                params={{ _splat: "install" }}
                variant="secondary"
                className="w-full"
              >
                Install
              </RouteButton>
            }
            features={SELF_HOSTED}
            footer={<CopyCommand command={site.setupCommand} />}
          />
          <Plan
            name="Pyo Cloud"
            price="$5"
            unit="/ server / month"
            summary="Pyo, fully managed by us. Connect your servers and deploy to them, with nothing to run or update."
            action={
              <span
                aria-disabled="true"
                className="inline-flex h-11 w-full cursor-default items-center justify-center rounded-full border border-border bg-secondary text-[14px] font-medium text-muted-foreground"
              >
                Coming soon
              </span>
            }
            features={CLOUD}
          />
        </div>
        <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
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
            second={{ mark: <Logo showName={false} />, name: "Pyo Cloud", tagline: "Managed by us" }}
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

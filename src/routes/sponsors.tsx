import { ArrowUpRightIcon, CheckIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ButtonLink } from "~/components/Button";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/sponsors")({
  head: () =>
    seo({
      path: "/sponsors",
      title: "Sponsors: support Pyo on GitHub Sponsors | Pyo",
      description:
        "Pyo is free and open source, made by upset.dev. Sponsor us on GitHub to fund maintenance, docs and the servers behind our free services.",
      card: {
        badge: "Sponsors",
        title: "Sponsor Pyo",
        description: "Pyo is free and open source. Sponsoring on GitHub helps keep it that way.",
      },
    }),
  component: SponsorsPage,
});

const SPONSOR_URL = "https://github.com/sponsors/upsetdev";

const PROJECTS = [
  {
    name: "Pyo",
    about: "The open-source PaaS for your own servers.",
    href: "https://pyo.dev",
  },
  {
    name: "Favicone",
    about: "An API to get the favicon of any website.",
    href: "https://favicone.com",
  },
  {
    name: "DNS Profile Generator",
    about: "DNS profiles for Apple devices.",
    href: "https://upset.dev/dns-profile-generator",
  },
  {
    name: "Stak",
    about: "Maps Kubernetes manifests and Docker Compose files.",
    href: "https://stak.upset.dev",
  },
  {
    name: "fonts.upset.dev",
    about: "A privacy-preserving proxy for Google Fonts.",
    href: "https://fonts.upset.dev",
  },
];

const REASONS = [
  "Keeps Pyo free to self-host, with every feature",
  "Pays for maintenance and docs",
  "Covers the servers behind our free services",
  "Means faster fixes",
];

const SUPPORTERS = [
  {
    price: "$1",
    about: "Every contribution counts. Thank you for supporting open source.",
  },
  {
    price: "$5",
    about: "Helps keep our open-source projects alive and open to everyone.",
  },
  {
    price: "$15",
    about: "Supports development, infrastructure and maintenance across our projects.",
  },
  {
    price: "Custom",
    about: "Any amount you choose, with the same rewards as the $15 tier.",
  },
];

const COMPANIES = [
  {
    name: "Bronze",
    price: "$30",
    perks: ["Small logo with a link in the Pyo README on GitHub"],
  },
  {
    name: "Silver",
    price: "$75",
    perks: ["Everything in Bronze", "Small logo with a link on the Pyo homepage"],
  },
  {
    name: "Gold",
    price: "$150",
    perks: ["Everything in Silver", "Small logo with a link in the Pyo docs"],
  },
  {
    name: "Platinum",
    price: "$300",
    perks: [
      "Everything in Gold",
      "Medium logo across Pyo's sites",
      "Featured spot in sponsor sections",
    ],
  },
  {
    name: "Strategic",
    price: "$500",
    perks: [
      "Everything in Platinum",
      "Large logo across Pyo's sites",
      "Top spot in sponsor sections",
      "Dedicated recognition on upset.dev",
    ],
  },
];

function SponsorButton({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <ButtonLink href={SPONSOR_URL} size={size}>
      <GithubLogoIcon size={size === "lg" ? 17 : 14} weight="fill" aria-hidden />
      Sponsor on GitHub
    </ButtonLink>
  );
}

function ChooseLink({ label }: { label: string }) {
  return (
    <ButtonLink
      href={SPONSOR_URL}
      variant="secondary"
      size="sm"
      aria-label={`Choose the ${label} tier on GitHub Sponsors`}
    >
      Choose
    </ButtonLink>
  );
}

function Perk({ children }: { children: ReactNode }) {
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

function SectionHeading({ children, intro }: { children: ReactNode; intro?: ReactNode }) {
  return (
    <>
      <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
        {children}
      </h2>
      {intro ? (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {intro}
        </p>
      ) : null}
    </>
  );
}

function SponsorsPage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl animate-fade-up px-5 pb-10 pt-16 sm:pt-24">
        <h1 className="text-balance text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
          Sponsor Pyo
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
          Pyo is free and open source. Sponsoring us on GitHub helps keep it
          that way.
        </p>
        <div className="mt-8">
          <SponsorButton />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-14">
        <div className="grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 md:grid-cols-2">
          <div className="min-w-0 rounded-[14px] card-edge bg-card p-6 sm:p-8">
            <h2 className="text-[15px] font-semibold">About upset.dev</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              upset.dev builds and maintains open-source tools for developers.
              Pyo is one of them.
            </p>
            <ul className="mt-6 list-rows overflow-hidden rounded-[12px] border border-border/60">
              {PROJECTS.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.href}
                    className="group flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-accent"
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium">{p.name}</span>
                      <span className="block text-[13px] leading-5 text-muted-foreground">
                        {p.about}
                      </span>
                    </span>
                    <ArrowUpRightIcon
                      size={14}
                      aria-hidden
                      className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                    />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="https://github.com/upsetdev"
              className="mt-4 inline-flex items-center gap-1 text-[13px] text-foreground/80 transition-colors hover:text-foreground"
            >
              And more on GitHub
              <ArrowUpRightIcon size={12} aria-hidden />
            </a>
          </div>
          <div className="flex min-w-0 flex-col rounded-[14px] card-edge bg-card p-6 sm:p-8">
            <h2 className="text-[15px] font-semibold">We love open source</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              We build in the open, and what we make is free to use. Sponsors
              pay for the work that keeps it going.
            </p>
            <ul className="mt-6 space-y-2.5">
              {REASONS.map((r) => (
                <Perk key={r}>{r}</Perk>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-[14px] leading-relaxed text-muted-foreground">
              Everything stays free whether you sponsor or not. If Pyo saves
              you time or money, sponsoring is a way to give some back.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <SectionHeading intro="Monthly tiers on GitHub Sponsors. Pick one that suits you.">
          Supporters
        </SectionHeading>
        <div className="mt-8 grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORTERS.map((t) => (
            <div
              key={t.price}
              className="flex min-w-0 flex-col rounded-[14px] card-edge bg-card p-6"
            >
              <p className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-semibold leading-none tracking-[-0.02em]">
                  {t.price}
                </span>
                {t.price === "Custom" ? null : (
                  <span className="text-[13px] text-muted-foreground">/ month</span>
                )}
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                {t.about}
              </p>
              <div className="mt-auto pt-6">
                <ChooseLink label={t.price === "Custom" ? "custom amount" : `${t.price} a month`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <SectionHeading intro="For companies that use Pyo. Each tier puts your logo, with a link, in more places.">
          Company sponsors
        </SectionHeading>
        <ul className="mt-8 list-rows overflow-hidden rounded-[14px] card-edge bg-card">
          {COMPANIES.map((t) => (
            <li
              key={t.name}
              className="grid gap-4 px-6 py-6 sm:grid-cols-[180px_1fr_auto] sm:items-start sm:gap-8"
            >
              <div>
                <h3 className="text-[15px] font-semibold">{t.name} Sponsor</h3>
                <p className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-[24px] font-semibold leading-none tracking-[-0.02em]">
                    {t.price}
                  </span>
                  <span className="text-[13px] text-muted-foreground">/ month</span>
                </p>
              </div>
              <ul className="space-y-1.5">
                {t.perks.map((p) => (
                  <Perk key={p}>{p}</Perk>
                ))}
              </ul>
              <div>
                <ChooseLink label={t.name} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
          Our goal on GitHub Sponsors is $1,000 a month.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <SectionHeading>Sponsors</SectionHeading>
        <div className="mt-8 flex flex-col items-center rounded-[14px] border border-dashed border-border-strong px-6 py-14 text-center">
          <p className="text-[18px] font-semibold">Be the first to sponsor Pyo.</p>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            There are no sponsors yet. Sponsoring on GitHub takes a minute.
          </p>
          <div className="mt-6">
            <SponsorButton />
          </div>
        </div>
      </section>
    </main>
  );
}

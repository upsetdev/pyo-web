import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowsClockwiseIcon,
  HeartbeatIcon,
  ShieldCheckIcon,
  StackIcon,
  type Icon,
} from "@phosphor-icons/react";
import { site } from "~/config/site";
import { COMPETITORS } from "~/data/versus";
import { iconColor } from "./Features";
import { ButtonLink } from "./Button";
import { CopyCommand } from "./CopyCommand";
import { GithubIcon } from "./GithubIcon";
import { Logo } from "./Logo";

const PRODUCTION: [Icon, string, string][] = [
  [
    ArrowsClockwiseIcon,
    "Deploys without downtime",
    "Set 2 replicas to avoid downtime during deploys.",
  ],
  [
    HeartbeatIcon,
    "Self-healing",
    "Crashed containers restart on their own, and stateless services move to a healthy server if one goes down.",
  ],
  [
    StackIcon,
    "Room to scale",
    "Run as many replicas as your servers fit, or let Pyo add and remove them as CPU and memory use change.",
  ],
  [
    ShieldCheckIcon,
    "Isolation by default",
    "Projects are kept apart, secrets are encrypted, and a firewall decides who gets in.",
  ],
];

export function Production() {
  return (
    <section id="production" className="scroll-mt-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-24 sm:pt-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <h2 className="text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
            Built for production
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            The safeguards production needs, on servers you own.
          </p>
        </div>
        <ul className="list-rows overflow-hidden rounded-2xl card-edge bg-card">
          {PRODUCTION.map(([ItemIcon, title, body], i) => (
            <li key={title} className="flex gap-4 p-5 transition-colors hover:bg-accent/40">
              <ItemIcon
                size={20}
                className={`mt-0.5 shrink-0 ${iconColor(i)}`}
              />
              <div>
                <h3 className="text-[15px] font-semibold">{title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Install() {
  return (
    <section id="install" className="scroll-mt-14 px-5 pt-24 sm:pt-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[24px] card-edge bg-card px-6 py-16 text-center sm:py-20">
        <div aria-hidden className="dash-pattern absolute inset-0" />
        <div
          aria-hidden
          className="absolute left-1/2 top-[-220px] h-[460px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent)]"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="max-w-md text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
            Get Pyo running on your server
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Run Pyo on any machine, from your laptop or VPS to a dedicated
            server or homelab.
          </p>
          <div className="mt-8 w-full max-w-md">
            <CopyCommand command={site.setupCommand} />
          </div>
          <ButtonLink
            href={site.github}
            variant="secondary"
            className="mt-8"
          >
            <GithubIcon size={15} /> View on GitHub
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINK =
  "text-[13px] text-foreground/80 transition-colors hover:text-foreground";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[13px] font-medium text-muted-foreground/70">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 text-muted-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-12 px-5 py-16 sm:grid-cols-3 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link to="/" aria-label={`${site.name} home`} className="inline-flex">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed">
            The open-source PaaS for your own servers. Deploy your apps easily, from one machine to a whole cluster.
          </p>
          <a
            href={site.github}
            aria-label="Pyo on GitHub"
            className="mt-5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon size={15} />
          </a>
        </div>
        <FooterColumn title="Product">
          <li>
            <Link to="/" hash="features" className={FOOTER_LINK}>
              Features
            </Link>
          </li>
          <li>
            <Link to="/templates" className={FOOTER_LINK}>
              Templates
            </Link>
          </li>
          <li>
            <Link to="/architecture" className={FOOTER_LINK}>
              Architecture
            </Link>
          </li>
          <li>
            <Link to="/" hash="install" className={FOOTER_LINK}>
              Install
            </Link>
          </li>
          <li>
            <Link to="/pricing" className={FOOTER_LINK}>
              Pricing
            </Link>
          </li>
        </FooterColumn>
        <FooterColumn title="Resources">
          <li>
            <a href="/docs" className={FOOTER_LINK}>
              Docs
            </a>
          </li>
          <li>
            <a href={site.github} className={FOOTER_LINK}>
              GitHub
            </a>
          </li>
          <li>
            <Link to="/sponsors" className={FOOTER_LINK}>
              Sponsors
            </Link>
          </li>
        </FooterColumn>
        <FooterColumn title="Compare">
          {COMPETITORS.map((c) => (
            <li key={c.slug}>
              <Link
                to="/vs/$competitor"
                params={{ competitor: c.slug }}
                className={FOOTER_LINK}
              >
                Pyo vs {c.name}
              </Link>
            </li>
          ))}
        </FooterColumn>
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-5 py-6 text-[12px]">
          © {new Date().getFullYear()} {site.name}.
        </p>
      </div>
    </footer>
  );
}

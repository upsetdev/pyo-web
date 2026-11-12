import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { site } from "~/config/site";
import { ButtonLink, RouteButton } from "./Button";
import { CopyCommand } from "./CopyCommand";
import { GithubIcon } from "./GithubIcon";
import { RotatingWord } from "./RotatingWord";
import { ScreenFrame, ScreenImage } from "./Screen";

const WORDS = ["apps", "websites", "APIs", "databases", "workers", "AI models"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="dash-pattern absolute inset-0" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[-260px] h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.22),transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-20 sm:pt-28">
        <div className="mx-auto flex max-w-4xl animate-fade-up flex-col items-center text-center">
          <Link
            to="/architecture"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            See how Pyo works
            <ArrowRightIcon size={11} aria-hidden />
          </Link>
          <h1
            aria-label="Deploy your apps easily on your own servers"
            className="mt-6 text-[36px] font-semibold max-[370px]:text-[31px] leading-[1.22] tracking-[-0.03em] sm:text-[60px]"
          >
            <span aria-hidden="true">
              Deploy your <br className="sm:hidden" />
              <RotatingWord words={WORDS} /> easily
              <br />
              on your own servers
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
            The open-source PaaS alternative to Vercel, Netlify, Railway,
            Render and Fly.io, from one machine to a whole cluster.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <RouteButton to="/" hash="install">Get started</RouteButton>
            <ButtonLink href={site.github} variant="secondary">
              <GithubIcon size={15} /> View on GitHub
            </ButtonLink>
          </div>
          <div className="mt-6 w-full max-w-md">
            <CopyCommand command={site.setupCommand} />
          </div>
        </div>

        <ScreenFrame className="relative mt-16 animate-fade-up [animation-delay:120ms]">
          <ScreenImage
            name="overview"
            alt="The Pyo dashboard overview, with projects, recent deployments and domains"
          />
        </ScreenFrame>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { ScreenFrame, ScreenImage } from "./Screen";

const STEPS: {
  name: string;
  label: string;
  title: string;
  body: string;
  link?: { href: "/templates"; label: string };
}[] = [
  {
    name: "deployments",
    label: "Deployments",
    title: "Every deploy, in one place",
    body: "Build from Git, with or without a Dockerfile, or run any container image. Connect GitHub to deploy on every push and roll back in one click. If a deploy fails, Pyo puts the previous version back on its own. Coming from Coolify or Dokploy? Import your services and databases in one go.",
  },
  {
    name: "analytics",
    label: "Observability",
    title: "See what's happening",
    body: "Visitors, requests and errors for your sites, with live logs and CPU and memory charts for everything you run.",
  },
  {
    name: "clusters",
    label: "Clusters",
    title: "Start with one server, add more as you grow",
    body: "Connect a VPS, a dedicated server or the machine under your desk. Add servers over Tailscale and choose where each service runs.",
  },
  {
    name: "database",
    label: "Databases",
    title: "Postgres, MySQL and KV, built in",
    body: "Standby replicas take over if the primary fails, read replicas handle reads, and backups run on a schedule. Restore Postgres to any moment, turn on extensions like pgvector, and watch throughput, connections and cache hits. KV speaks the Redis protocol and a REST API.",
  },
  {
    name: "templates",
    label: "Templates",
    title: "Apps in one click",
    body: "WordPress, Ghost, n8n, Ollama and more, ready to run next to your code.",
    link: { href: "/templates", label: "See all templates" },
  },
];

/**
 * A walk through the dashboard: the text scrolls while the screenshot stays
 * put and changes with it. On small screens each step has its own image.
 */
export function Tour() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting)
            setActive(refs.current.indexOf(e.target as HTMLDivElement));
      },
      // The step crossing the middle of the viewport.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const el of refs.current) if (el) seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <section id="screenshots" className="scroll-mt-14">
      <div className="mx-auto max-w-6xl px-5 pt-24 sm:pt-32">
        <h2 className="max-w-2xl text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
          Everything you run, in one dashboard
        </h2>
        <div className="mt-8 grid gap-10 lg:mt-0 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          <div>
            {STEPS.map((step, i) => (
              <div
                key={step.name}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex flex-col justify-center py-8 lg:min-h-[78vh] lg:py-0"
              >
                <div
                  className={`transition-opacity duration-300 ${active === i ? "" : "lg:opacity-35"}`}
                >
                  <p className="text-[13px] font-medium text-primary">
                    {step.label}
                  </p>
                  <h3 className="mt-2 text-balance text-[22px] font-semibold leading-snug tracking-tight sm:text-[26px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                  {step.link ? (
                    <Link
                      to={step.link.href}
                      className="group/link mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-foreground/85 hover:text-foreground"
                    >
                      {step.link.label}
                      <ArrowRightIcon
                        size={12}
                        className="transition-transform group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  ) : null}
                </div>
                <ScreenFrame className="mt-6 lg:hidden">
                  <ScreenImage name={step.name} alt={`The ${step.label} page`} />
                </ScreenFrame>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-240px)]">
              <ScreenFrame className="relative aspect-[1430/900]">
                {STEPS.map((step, i) => (
                  <div
                    key={step.name}
                    aria-hidden={active !== i}
                    className={`absolute inset-0 transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}
                  >
                    <ScreenImage
                      name={step.name}
                      alt={`The ${step.label} page`}
                    />
                  </div>
                ))}
              </ScreenFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

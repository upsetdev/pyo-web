import {
  ArrowRightIcon,
  ArrowSquareOutIcon,
  GlobeIcon,
  LockSimpleIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ButtonLink, RouteButton } from "~/components/Button";
import { GithubIcon } from "~/components/GithubIcon";
import { Install } from "~/components/Sections";
import {
  isOfficial,
  OfficialMark,
  TemplateAuthor,
} from "~/components/TemplateAuthor";
import { TemplateLogo } from "~/components/TemplateLogo";
import { site } from "~/config/site";
import data from "~/data/templates.json";
import { seo } from "~/lib/seo";

type Template = (typeof data.templates)[number];

const EXPOSURE: Record<string, string> = {
  internal: "Private",
  http: "Internal until you add a domain",
  nodeport: "Port on every server",
  loadbalancer: "Public IP",
};

const cpu = (millis: number) => `${+(millis / 1000).toFixed(2)} vCPU`;
const mem = (mi: number) =>
  mi >= 1024 ? `${+(mi / 1024).toFixed(1)} GiB` : `${Math.round(mi)} MiB`;
const categoryLabel = (id: string) =>
  data.categories.find((c) => c.id === id)?.label ?? id;

/** How people reach it: a web app gets a domain, the rest stay private. */
const REACHED: Record<string, string> = {
  web: "Web app, on a domain you add",
  public: "A public TCP or UDP port",
  internal: "Inside the cluster only",
};

const pageTitle = (t: Template) => `Self-host ${t.name} with one click | Pyo`;

function pageDescription(t: Template) {
  const pitch = `${t.description} Run it on your own servers with Pyo.`;
  return pitch.length <= 160 ? pitch : t.description;
}

function breadcrumbs(t: Template) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Pyo", item: `${site.url}/` },
      { name: "Templates", item: `${site.url}/templates` },
      { name: t.name, item: `${site.url}/templates/${t.id}` },
    ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb })),
  };
}

export const Route = createFileRoute("/templates_/$id")({
  loader: ({ params }) => {
    const template = data.templates.find((t) => t.id === params.id);
    if (!template) throw notFound();
    return template;
  },
  head: ({ loaderData: t }) =>
    t
      ? {
          ...seo({
            path: `/templates/${t.id}`,
            title: pageTitle(t),
            description: pageDescription(t),
            card: { badge: "Template", description: t.description },
          }),
          scripts: [
            {
              type: "application/ld+json",
              children: JSON.stringify(breadcrumbs(t)),
            },
          ],
        }
      : {},
  component: TemplatePage,
});

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border px-4 py-2.5 last:border-b-0">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-right">{value}</dd>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[20px] font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 rounded-[20px] frame-edge bg-muted p-1.5">
        <div className="rounded-[14px] card-edge bg-card text-[13.5px]">
          {children}
        </div>
      </div>
    </section>
  );
}

function TemplatePage() {
  const t = Route.useLoaderData();
  const steps = [
    ["Install Pyo", "Run the setup command on your server."],
    [
      `Choose ${t.name}`,
      "Open Templates in the dashboard and pick it. Pyo fills in sensible defaults.",
    ],
    ["Deploy", "Pick a server and deploy. Pyo runs it and follows the rollout."],
  ];
  const related = [
    ...data.templates.filter(
      (o) => o.category === t.category && o.id !== t.id,
    ),
    ...data.templates.filter((o) => o.category !== t.category),
  ].slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="dash-pattern absolute inset-0" />
        <div
          aria-hidden
          className="absolute left-1/2 top-[-300px] h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.2),transparent)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />
        <div className="relative mx-auto max-w-6xl animate-fade-up px-5 pb-12 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="text-[13px]">
            <ol className="flex items-center gap-1.5 text-muted-foreground">
              <li>
                <Link to="/templates" className="hover:text-foreground">
                  Templates
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{t.name}</li>
            </ol>
          </nav>
          <div className="mt-8 flex items-center gap-3">
            <TemplateLogo template={t} />
            <span className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] text-muted-foreground">
              {categoryLabel(t.category)}
              <span aria-hidden>·</span>
              <TemplateAuthor template={t} link />
              {isOfficial(t) ? <OfficialMark /> : null}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[48px]">
            Deploy {t.name} on your own servers
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
            {t.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <RouteButton to="/" hash="install">
              Get started
            </RouteButton>
            {t.homepage ? (
              <ButtonLink href={t.homepage} variant="secondary">
                <ArrowSquareOutIcon size={15} /> {t.name} website
              </ButtonLink>
            ) : (
              <ButtonLink href={site.github} variant="secondary">
                <GithubIcon size={15} /> View Pyo on GitHub
              </ButtonLink>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <div className="min-w-0 space-y-12">
          <Panel title="What Pyo sets up">
            <dl>
              <Row
                label="Image"
                value={
                  <span className="font-mono text-[12.5px]">
                    {t.image}:{t.version}
                  </span>
                }
              />
              {t.versions.length > 1 ? (
                <Row label="Versions" value={t.versions.join(", ")} />
              ) : null}
              <Row label="Reached" value={REACHED[t.exposure]} />
              {t.databases.length ? (
                <Row
                  label="Database"
                  value={`Uses ${
                    t.databases.some((d) => d.extensions.length)
                      ? t.databases
                          .map((d) => `a ${d.engine} database${d.extensions.length ? ` with ${d.extensions.join(", ")}` : ""}`)
                          .join(" and ")
                      : `${t.databases.map((d) => `a ${d.engine}`).join(" and ")} database`
                  }, connected when you deploy`}
                />
              ) : null}
              {t.companions.length ? (
                <Row
                  label="Also runs"
                  value={
                    <span className="font-mono text-[12.5px]">
                      {t.companions.map((c) => c.image).join(", ")}
                    </span>
                  }
                />
              ) : null}
              <Row
                label="Runs as"
                value={t.stateful ? "One replica with its own data" : "Stateless service"}
              />
              <Row label="Replicas" value={t.replicas} />
              <Row
                label="Requests"
                value={`${cpu(t.resources.cpuRequest)} · ${mem(t.resources.memoryRequest)}`}
              />
              <Row
                label="Limits"
                value={`${cpu(t.resources.cpuLimit)} · ${mem(t.resources.memoryLimit)}`}
              />
              <Row
                label={t.volumes.length > 1 ? "Volumes" : "Storage"}
                value={
                  t.volumes.length
                    ? t.volumes
                        .map(
                          (v) =>
                            `${v.sizeGi} GiB at ${v.mountPath}${t.volumes.length > 1 ? ` (${v.service})` : ""}${v.required ? "" : " (optional)"}`,
                        )
                        .join(", ")
                    : "None"
                }
              />
              {t.gpu ? (
                <Row
                  label="GPU"
                  value={`${t.gpu.count} NVIDIA GPU, ${t.gpu.use === "required" ? "required" : "used when the cluster has one"}`}
                />
              ) : null}
              <Row label="Health check" value={t.healthCheck} />
            </dl>
          </Panel>

          {t.fields.length ? (
            <Panel title="What you can configure">
              <ul>
                {t.fields.map((f) => (
                  <li
                    key={f.label}
                    className="border-b border-border px-4 py-2.5 last:border-b-0"
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <span>{f.label}</span>
                      {f.value ? (
                        <span className="min-w-0 truncate font-mono text-[12px] text-muted-foreground">
                          {f.value}
                        </span>
                      ) : null}
                    </div>
                    {f.help ? (
                      <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                        {f.help}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>

        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="text-[20px] font-semibold tracking-tight">
              How to deploy it
            </h2>
            <ol className="mt-4 space-y-4">
              {steps.map(([title, body], i) => (
                <li key={title} className="flex gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11.5px] font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold">{title}</h3>
                    <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {t.ports.length ? (
            <section>
              <h2 className="text-[20px] font-semibold tracking-tight">
                Ports
              </h2>
              <ul className="mt-4 space-y-1.5 text-[13.5px]">
                {t.ports.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="font-mono text-[12.5px]">
                      {p.name} {p.port}/{p.protocol}
                    </span>
                    <span className="inline-flex items-center gap-1 text-right text-muted-foreground">
                      {p.exposure === "internal" ? (
                        <LockSimpleIcon size={12} />
                      ) : (
                        <GlobeIcon size={12} />
                      )}
                      {EXPOSURE[p.exposure]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {t.hints.length ? (
            <section>
              <h2 className="text-[20px] font-semibold tracking-tight">
                Good to know
              </h2>
              <ul className="mt-4 list-disc space-y-1.5 pl-4 text-[13.5px] leading-relaxed text-muted-foreground">
                {t.hints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[20px] font-semibold tracking-tight">
            Related templates
          </h2>
          <Link
            to="/templates"
            className="group/all inline-flex items-center gap-1 text-[13px] font-medium text-foreground/85 hover:text-foreground"
          >
            All templates
            <ArrowRightIcon
              size={12}
              className="transition-transform group-hover/all:translate-x-0.5"
            />
          </Link>
        </div>
        <ul className="mt-4 grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 sm:grid-cols-3">
          {related.map((o) => (
            <li key={o.id}>
              <Link
                to="/templates/$id"
                params={{ id: o.id }}
                className="flex h-full items-center gap-3 rounded-[14px] card-edge card-edge-hover bg-card p-4 transition-colors hover:bg-card/80"
              >
                <TemplateLogo template={o} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-[14px] font-semibold">
                    <span className="truncate">{o.name}</span>
                    {isOfficial(o) ? <OfficialMark /> : null}
                  </span>
                  <span className="block truncate text-[12px] text-muted-foreground">
                    {categoryLabel(o.category)} ·{" "}
                    <TemplateAuthor template={o} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Install />
    </main>
  );
}

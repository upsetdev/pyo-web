import { createFileRoute, notFound } from "@tanstack/react-router";
import { Logo } from "~/components/Logo";
import { Install } from "~/components/Sections";
import { CompetitorMark, VersusTable } from "~/components/Versus";
import { CHECKED, type Competitor, competitorBySlug } from "~/data/versus";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/vs/$competitor")({
  loader: ({ params }) => {
    if (!competitorBySlug(params.competitor)) throw notFound();
    return params.competitor;
  },
  head: ({ params }) => {
    const c = competitorBySlug(params.competitor);
    return c
      ? seo({
          path: `/vs/${c.slug}`,
          title: `${c.name} alternative, Pyo is an open source and self-hosted PaaS`,
          description: c.seoDescription,
          card: { badge: "Comparison", title: `Pyo vs ${c.name}` },
        })
      : {};
  },
  component: VersusPage,
});

function VersusPage() {
  const c = competitorBySlug(Route.useLoaderData()) as Competitor;
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="dash-pattern absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />
        <div className="relative mx-auto max-w-5xl animate-fade-up px-5 pb-10 pt-16 sm:pt-24">
          <h1 className="flex flex-wrap items-center gap-x-[0.3em] gap-y-1 text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
            <span className="inline-flex items-center gap-[0.25em]">
              <Logo showName={false} markClassName="h-[0.85em] w-[0.85em]" />
              Pyo
            </span>{" "}
            <span className="text-muted-foreground">vs</span>{" "}
            <span className="inline-flex items-center gap-[0.25em]">
              <CompetitorMark
                c={c}
                className="h-[0.85em] w-auto max-w-[1.2em]"
                fallback={false}
              />
              {c.name}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            {c.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <VersusTable c={c} />
        <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
          Based on {c.name}'s public docs, checked {CHECKED}. Features and plans
          change, so check their site for the latest. {c.name} is a trademark of
          its owner. Pyo isn't affiliated with or endorsed by {c.name}.
          {c.trademark ? ` ${c.trademark}` : null}
        </p>
      </section>

      <Install />
    </main>
  );
}

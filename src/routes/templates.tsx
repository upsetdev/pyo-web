import { createFileRoute } from "@tanstack/react-router";
import { Install } from "~/components/Sections";
import { TemplateGallery } from "~/components/TemplateGallery";
import data from "~/data/templates.json";
import { seo } from "~/lib/seo";

const COUNT = data.templates.length;

export const Route = createFileRoute("/templates")({
  head: () =>
    seo({
      path: "/templates",
      title: "One-click templates for your own servers | Pyo",
      description: `${COUNT} ready-to-run templates for Pyo: WordPress, Ghost, MySQL, MongoDB, Grafana, n8n, Ollama and more, on your own servers.`,
    }),
  component: TemplatesPage,
});

function TemplatesPage() {
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
          <div className="relative mx-auto max-w-6xl animate-fade-up px-5 pb-12 pt-16 sm:pt-24">
            <h1 className="max-w-2xl text-balance text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[52px]">
              One-click templates
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
              {COUNT} ready-to-run databases, tools and apps. Pick one in
              the dashboard, and Pyo runs it on your own servers.
            </p>
          </div>
        </section>
        <section
          aria-label="Templates"
          className="mx-auto max-w-6xl px-5 pt-4"
        >
          <TemplateGallery />
        </section>
        <Install />
    </main>
  );
}

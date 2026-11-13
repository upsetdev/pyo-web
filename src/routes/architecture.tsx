import { createFileRoute } from "@tanstack/react-router";
import { ArchitectureDiagram } from "~/components/ArchitectureDiagram";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/architecture")({
  head: () =>
    seo({
      path: "/architecture",
      title: "How Pyo works: your services, on your own servers | Pyo",
      description:
        "How Pyo fits together: visitors, Pyo Gateway, your servers, Pyo and you, and what each part does.",
      card: {
        title: "How Pyo works",
        description: "Pyo runs your services on servers you own, and handles the rest.",
      },
    }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <main className="pb-24 sm:pb-32">
      <section className="mx-auto max-w-[820px] animate-fade-up px-5 pb-12 pt-16 text-center sm:pb-14 sm:pt-24 lg:pb-16">
        <h1 className="text-balance text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[44px] lg:text-[52px]">
          How Pyo works
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed lg:text-[18px] text-muted-foreground">
          Pyo runs your services on servers you own, and handles the rest.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <ArchitectureDiagram />
      </section>
    </main>
  );
}

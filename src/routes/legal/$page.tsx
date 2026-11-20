import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { seo } from "~/lib/seo";

// Pyo Cloud's legal pages, written in content/legal. They are drafts until a
// lawyer has reviewed them: nothing links here, the sitemap leaves them out
// and search engines are told not to index them.

type LegalPage = {
  default: ComponentType;
  frontmatter: { title: string; description: string; updated: string };
};

const files = import.meta.glob<LegalPage>("../../../content/legal/*.md", {
  eager: true,
});

const pages: Record<string, LegalPage> = Object.fromEntries(
  Object.entries(files).map(([file, page]) => [
    file.replace(/^.*\/([^/]+)\.md$/, "$1"),
    page,
  ]),
);

/** The date line under the title. The date is set on publishing, so an
 * empty or "{{EFFECTIVE_DATE}}" value shows that the page is a draft. */
function effective(updated: string | undefined) {
  if (!updated || updated.includes("{{")) return "Draft, not yet in effect";
  return `Last updated ${updated}`;
}

/** In the order they are listed at the foot of each page. */
const ORDER = ["terms", "privacy", "dpa"];

export const Route = createFileRoute("/legal/$page")({
  loader: ({ params }) => {
    if (!pages[params.page]) throw notFound();
  },
  head: ({ params }) => {
    const page = pages[params.page];
    if (!page) return {};
    const { title, description } = page.frontmatter;
    const { meta, links } = seo({
      path: `/legal/${params.page}`,
      title: `${title} | Pyo`,
      description,
      card: { badge: "Legal", title },
    });
    // Not for search engines until these are published.
    return { meta: [...meta, { name: "robots", content: "noindex, nofollow" }], links };
  },
  component: LegalRoute,
});

function LegalRoute() {
  const { page: slug } = Route.useParams();
  const page = pages[slug];
  const Body = page.default;
  return (
    <main className="mx-auto max-w-3xl animate-fade-up px-5 pb-24 pt-16 sm:pt-24">
      <h1 className="text-balance text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
        {page.frontmatter.title}
      </h1>
      <p className="mt-4 text-[14px] text-muted-foreground">
        {effective(page.frontmatter.updated)}
      </p>
      <article className="legal-page prose mt-10 max-w-none">
        <Body />
      </article>
      <nav aria-label="Legal" className="mt-16 border-t border-border/60 pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          {ORDER.filter((s) => pages[s]).map((s) => (
            <li key={s}>
              <a
                href={`/legal/${s}`}
                aria-current={s === slug ? "page" : undefined}
                className="text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
              >
                {pages[s].frontmatter.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

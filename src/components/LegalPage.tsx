import type { ComponentType } from "react";
import { seo } from "~/lib/seo";

// Pyo Cloud's legal pages, written in content/legal and served at /terms,
// /privacy and /dpa. They are drafts until a lawyer has reviewed them: the
// sitemap leaves them out and search engines are told not to index them.

type LegalFile = {
  default: ComponentType;
  frontmatter: { title: string; description: string; updated: string };
};

const files = import.meta.glob<LegalFile>("../../content/legal/*.md", {
  eager: true,
});

const pages: Record<string, LegalFile> = Object.fromEntries(
  Object.entries(files).map(([file, page]) => [
    file.replace(/^.*\/([^/]+)\.md$/, "$1"),
    page,
  ]),
);

export type LegalSlug = "terms" | "privacy" | "dpa";

/** The side menu, in this order. */
const LINKS: { slug: LegalSlug; label: string }[] = [
  { slug: "terms", label: "Terms of Service" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "dpa", label: "DPA" },
];

/** The date line under the title. The date is set on publishing, so an
 * empty or "{{EFFECTIVE_DATE}}" value shows that the page is a draft. */
function effective(updated: string | undefined) {
  if (!updated || updated.includes("{{")) return "Draft, not yet in effect";
  return `Last updated ${updated}`;
}

export function legalHead(slug: LegalSlug) {
  const { title, description } = pages[slug].frontmatter;
  const { meta, links } = seo({
    path: `/${slug}`,
    title: `${title} | Pyo`,
    description,
    card: { badge: "Legal", title },
  });
  // Not for search engines until these are published.
  return { meta: [...meta, { name: "robots", content: "noindex, nofollow" }], links };
}

const LINK =
  "rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground";

function LegalLinks({ slug, className }: { slug: LegalSlug; className: string }) {
  return (
    <ul className={className}>
      {LINKS.map((l) => (
        <li key={l.slug} className="shrink-0">
          <a
            href={`/${l.slug}`}
            aria-current={l.slug === slug ? "page" : undefined}
            className={`block ${LINK}`}
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const page = pages[slug];
  const Body = page.default;
  return (
    <main className="mx-auto grid max-w-6xl animate-fade-up gap-16 px-5 pb-24 pt-10 sm:pt-16 lg:grid-cols-[200px_minmax(0,1fr)] lg:pt-24">
      <aside className="hidden lg:block">
        <nav aria-label="Legal" className="sticky top-24">
          <p className="px-2.5 pb-2 text-[12px] font-medium text-muted-foreground">
            Legal
          </p>
          <LegalLinks slug={slug} className="flex flex-col gap-0.5" />
        </nav>
      </aside>
      <div className="min-w-0 max-w-3xl">
        <nav aria-label="Legal" className="-mx-2.5 mb-8 overflow-x-auto lg:hidden">
          <LegalLinks slug={slug} className="flex gap-1" />
        </nav>
        <h1 className="text-balance text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
          {page.frontmatter.title}
        </h1>
        <p className="mt-4 text-[14px] text-muted-foreground">
          {effective(page.frontmatter.updated)}
        </p>
        <article className="legal-page prose mt-10 max-w-none">
          <Body />
        </article>
      </div>
    </main>
  );
}

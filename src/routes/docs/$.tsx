import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Card } from "fumadocs-ui/components/card";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { type ComponentProps, type HTMLAttributes, Suspense, use } from "react";
import { DocsBreadcrumb } from "~/components/DocsBreadcrumb";
import { DocsMenu } from "~/components/DocsMenu";
import { ApiPage } from "~/components/ApiPage";
import { Strong, Term } from "~/components/DocsInline";
import { GithubIcon } from "~/components/GithubIcon";
import { Logo } from "~/components/Logo";
import { PageActions } from "~/components/PageActions";
import { ProxyDiagram } from "~/components/ProxyDiagram";
import { DocsCompare } from "~/components/DocsCompare";
import { AddressInCode, PyoAddressMenu } from "~/components/PyoAddress";
import { ThemeToggle } from "~/components/ThemeToggle";
import { site } from "~/config/site";
import { cardColor, docsIcon } from "~/lib/docs-icons";
import { seo } from "~/lib/seo";
import { docs, source } from "~/lib/source";

// Saved as files when the site is built, so moving between docs pages needs no
// server.
const loadPage = createServerFn({ method: "GET" })
  .validator((slugs: string[]) => slugs)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();
    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? "",
      file: page.path,
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
  });

export const Route = createFileRoute("/docs/$")({
  loader: async ({ params }) => {
    const data = await loadPage({
      data: params._splat ? params._splat.split("/") : [],
    });
    await docs.getPage(data.path)?.preload();
    return data;
  },
  head: ({ loaderData: d }) => {
    if (!d) return {};
    const { meta, links } = seo({
      path: d.url,
      title: `${d.title} | Pyo Docs`,
      description: d.description,
    });
    return {
      meta: [...meta, { property: "og:site_name", content: "Pyo Docs" }],
      links,
    };
  },
  component: Page,
});

/** Cards take an icon by name, and each icon has its own colour. */
function DocsCard({
  icon,
  ...props
}: Omit<ComponentProps<typeof Card>, "icon"> & { icon?: string }) {
  return (
    <Card
      icon={<span className={cardColor(icon)}>{docsIcon(icon, 15)}</span>}
      {...props}
    />
  );
}

/** The file `bun run build` writes for a page: /docs/cli/ci is /md/cli/ci.md. */
const markdownUrlOf = (url: string) =>
  `/md/${url.replace(/^\/docs\/?/, "") || "index"}.md`;

/** Under the table of contents: the page's source, to suggest a change. */
function EditPage({ href, className }: { href: string; className: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground ${className}`}
    >
      <PencilSimpleIcon size={16} aria-hidden />
      Edit page
    </a>
  );
}

function Content({ path, url }: { path: string; url: string }) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`Unknown page: ${path}`);
  const { toc } = use(page.load());
  const MDX = page.body;
  // API reference pages are generated from the OpenAPI spec, full width.
  const { full, _openapi } = page as { full?: boolean; _openapi?: unknown };
  const sourceUrl = _openapi
    ? `${site.docsRepo}/blob/main/openapi/pyo.json`
    : `${site.docsRepo}/blob/main/content/${path}`;
  return (
    <DocsPage
      toc={toc}
      full={full}
      // Section › sidebar group › page, every part a link.
      slots={{ breadcrumb: DocsBreadcrumb }}
      tableOfContent={{
        footer: <EditPage href={sourceUrl} className="mt-4 self-start" />,
      }}
      tableOfContentPopover={{
        footer: <EditPage href={sourceUrl} className="mb-3 mt-2" />,
      }}
    >
      <DocsTitle className="text-[28px]">{page.title}</DocsTitle>
      <DocsDescription className="mb-2 text-[18px]">
        {page.description}
      </DocsDescription>
      <PageActions
        markdownUrl={markdownUrlOf(url)}
        sourceUrl={sourceUrl}
      />
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Card: DocsCard,
            strong: Strong,
            Term,
            OpenAPIPage: ApiPage,
            ProxyDiagram,
            DocsCompare,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

/** The segment a page is in, from its URL: it sets the docs' accent colour. */
const segmentOf = (url: string) =>
  /^\/docs\/(cli|api|mcp)(\/|$)/.exec(url)?.[1] ?? "core";

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());
  return (
    <DocsLayout
      // This bar only shows on small screens: it opens the sidebar there.
      nav={{
        url: "/docs",
        children: (
          <div className="ms-auto flex items-center gap-1.5">
            <PyoAddressMenu className="md:hidden" max={14} />
            <DocsMenu />
          </div>
        ),
        title: (
          <span className="inline-flex items-center gap-2">
            <Logo />
            <span className="text-[13px] font-normal text-muted-foreground">
              Docs
            </span>
          </span>
        ),
      }}
      // Search goes in the banner, which comes after the segment switcher.
      sidebar={{
        collapsible: false,
        banner: <FullSearchTrigger hideIfDisabled />,
      }}
      slots={{ searchTrigger: { full: () => null, sm: SearchTrigger } }}
      themeSwitch={{ enabled: false }}
      tree={data.pageTree}
      containerProps={
        { "data-segment": segmentOf(data.url) } as HTMLAttributes<HTMLDivElement>
      }
    >
      <Suspense>
        <AddressInCode />
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 md:right-5 md:top-5">
          <PyoAddressMenu className="hidden md:block" />
          <a
            href={site.github}
            aria-label="Pyo on GitHub"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <GithubIcon size={15} />
          </a>
          <ThemeToggle />
        </div>
        <Content path={data.path} url={data.url} />
      </Suspense>
    </DocsLayout>
  );
}

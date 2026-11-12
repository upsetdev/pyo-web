import { useTreePath } from "fumadocs-ui/contexts/tree";
import { Link } from "@tanstack/react-router";
import type * as PageTree from "fumadocs-core/page-tree";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

/** The first page in a folder (its index, else the first page found inside). */
function firstPage(folder: PageTree.Folder): string | undefined {
  if (folder.index) return folder.index.url;
  for (const n of folder.children) {
    if (n.type === "page") return n.url;
    if (n.type === "folder") {
      const u = firstPage(n);
      if (u) return u;
    }
  }
  return undefined;
}

/** The first page after a sidebar group heading (separator). */
function firstAfter(children: PageTree.Node[], from: number): string | undefined {
  for (const n of children.slice(from + 1)) {
    if (n.type === "separator") return undefined;
    if (n.type === "page") return n.url;
    if (n.type === "folder") return firstPage(n);
  }
  return undefined;
}

/** Whether a node is, or holds, the page at this URL. */
function holds(n: PageTree.Node, url: string): boolean {
  if (n.type === "page") return n.url === url;
  if (n.type === "folder")
    return n.index?.url === url || n.children.some((c) => holds(c, url));
  return false;
}

/**
 * Section › group › folder › page, every part a link: a section or folder
 * goes to its first page, a sidebar group heading to the first page under it.
 */
export function DocsBreadcrumb() {
  const path = useTreePath();
  const page = path.findLast((n) => n.type === "page");
  const here = page?.type === "page" ? page.url : "";
  const items: { name: ReactNode; url?: string }[] = [];
  path.forEach((node, i) => {
    if (node.type === "folder") {
      items.push({ name: node.name, url: firstPage(node) });
      // The group heading this folder's next step sits under.
      if (here && i < path.length - 1) {
        const at = node.children.findIndex((c) => holds(c, here));
        for (let j = at - 1; j >= 0; j--) {
          const c = node.children[j];
          if (c.type === "separator") {
            if (c.name) items.push({ name: c.name, url: firstAfter(node.children, j) });
            break;
          }
        }
      }
    } else if (node.type === "page") {
      items.push({ name: node.name, url: node.url });
    }
  });
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-fd-muted-foreground">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const cls = `truncate ${last ? "font-medium text-fd-primary" : "transition-colors hover:text-fd-foreground"}`;
          return (
            <li key={i} className="flex min-w-0 items-center gap-1.5">
              {i > 0 ? (
                <ChevronRight aria-hidden className="size-3.5 shrink-0" />
              ) : null}
                {it.url ? (
                  <Link
                    to={it.url}
                    activeOptions={{ exact: true }}
                    className={cls}
                  >
                    {it.name}
                  </Link>
                ) : (
                  <span className={cls}>{it.name}</span>
                )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

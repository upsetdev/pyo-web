import { Link, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";

/** A path inside the docs: anchors and relative links stay in the docs too. */
const inDocs = (href: string) =>
  !href.startsWith("/") || href === "/docs" || /^\/docs[/?#]/.test(href);

/**
 * The link Fumadocs renders in the docs: in the sidebar, cards and pages.
 * Within the docs it moves without a page load, as Fumadocs' own does; a link
 * to the main site is a plain anchor, which loads the page in full.
 */
export function DocsLink({
  href = "",
  prefetch = true,
  ...props
}: ComponentProps<"a"> & { prefetch?: boolean }) {
  const router = useRouter();
  if (href.startsWith("#") || !inDocs(href)) return <a href={href} {...props} />;
  const hashIdx = href.indexOf("#");
  const path = hashIdx === -1 ? href : href.slice(0, hashIdx);
  const searchIdx = path.indexOf("?");
  return (
    <Link
      to={searchIdx === -1 ? path : path.slice(0, searchIdx)}
      search={
        searchIdx === -1
          ? undefined
          : router.options.parseSearch(path.slice(searchIdx))
      }
      hash={hashIdx === -1 ? undefined : href.slice(hashIdx + 1)}
      preload={prefetch ? "intent" : false}
      {...(props as object)}
    />
  );
}

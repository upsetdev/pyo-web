import { site } from "~/config/site";

/** What a page's social card shows. Defaults to the page's own title and description. */
export type Card = {
  /** Small pill in the card's corner, like "Docs". */
  badge?: string;
  title?: string;
  description?: string;
};

/** The page title minus the " | Pyo" suffix that search results need but a card doesn't. */
const cardTitle = (title: string) => title.replace(/\s*\|\s*Pyo( Docs)?$/, "");

/** A 1200×630 social card for the page, rendered by og.upset.dev's pyo template. */
function cardImage(path: string, card: Card) {
  const params = new URLSearchParams({ template: "pyo" });
  for (const key of ["badge", "title", "description"] as const) {
    if (card[key]) params.set(key, card[key]);
  }
  const page = path.replace(/^\/+|\/+$/g, "");
  if (page) params.set("page", page);
  return `${site.ogImageUrl}?${params}`;
}

/** A page's title, description, social tags and canonical URL. */
export function seo({
  path,
  title,
  description,
  card = {},
}: {
  path: string;
  title: string;
  description: string;
  card?: Card;
}) {
  const url = `${site.url}${path}`;
  const shown = {
    badge: card.badge,
    title: card.title ?? cardTitle(title),
    description: card.description ?? description,
  };
  const image = cardImage(path, shown);
  const alt = /\bPyo\b/.test(shown.title)
    ? shown.title
    : `${shown.badge ? `Pyo ${shown.badge}` : "Pyo"}: ${shown.title}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: alt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: alt },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

import { SealCheckIcon } from "@phosphor-icons/react";
import { site } from "~/config/site";

type Author = { tier: string; author: string };

export const isOfficial = (t: Author) => t.tier === "official";

/** Blue check beside the name of a template the Pyo team maintains. */
export function OfficialMark({ size = 14 }: { size?: number }) {
  return (
    <SealCheckIcon
      size={size}
      weight="fill"
      role="img"
      aria-label="Official template"
      className="shrink-0 text-primary"
    >
      <title>Official template</title>
    </SealCheckIcon>
  );
}

/** Who wrote a template. On cards it's text: the whole card is already a link. */
export function TemplateAuthor({
  template: t,
  link = false,
}: {
  template: Author;
  link?: boolean;
}) {
  const label = isOfficial(t) ? "Pyo" : `@${t.author}`;
  return (
    <span>
      by{" "}
      {link ? (
        <a
          href={isOfficial(t) ? site.github : `https://github.com/${t.author}`}
          // Community links aren't endorsed, so they pass on no ranking.
          rel={isOfficial(t) ? undefined : "ugc nofollow noopener"}
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          {label}
        </a>
      ) : (
        label
      )}
    </span>
  );
}

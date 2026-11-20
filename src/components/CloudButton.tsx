import type { ReactNode } from "react";
import { site } from "~/config/site";
import { ButtonLink } from "./Button";

/** Pyo Cloud's call to action: a link once Cloud is live, "Coming soon" until then. */
export function CloudButton({ href, children }: { href: string; children: ReactNode }) {
  if (site.cloudLive) {
    return (
      <ButtonLink href={href} className="w-full">
        {children}
      </ButtonLink>
    );
  }
  return (
    <span
      aria-disabled="true"
      className="inline-flex h-11 w-full cursor-default items-center justify-center rounded-full border border-border bg-secondary text-[14px] font-medium text-muted-foreground"
    >
      Coming soon
    </span>
  );
}

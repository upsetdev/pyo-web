import { useEffect, useState } from "react";
import { site } from "~/config/site";
import { GithubIcon } from "./GithubIcon";

// The repo's star count, fetched in the browser once the page is up and kept
// in localStorage for an hour. If GitHub can't be reached, only the icon shows.

const KEY = "pyo:gh-stars";
const MAX_AGE = 60 * 60 * 1000;
const API = `https://api.github.com/repos/${new URL(site.github).pathname.slice(1)}`;

type Saved = { stars: number; at: number };

function readSaved(): Saved | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (typeof saved?.stars === "number" && typeof saved?.at === "number")
      return saved;
  } catch {}
  return null;
}

/** One request per page load, shared by every link on the page. */
let request: Promise<number | null> | undefined;

function fetchStars() {
  request ??= fetch(API)
    .then((res) => (res.ok ? res.json() : null))
    .then((repo) => {
      const stars = repo?.stargazers_count;
      if (typeof stars !== "number") return null;
      try {
        localStorage.setItem(KEY, JSON.stringify({ stars, at: Date.now() }));
      } catch {}
      return stars;
    })
    .catch(() => null);
  return request;
}

/** Runs `fn` once the browser is idle, or soon after where it can't tell. */
function whenIdle(fn: () => void) {
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(fn, { timeout: 3000 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}

function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    const saved = readSaved();
    if (saved) setStars(saved.stars);
    if (saved && Date.now() - saved.at < MAX_AGE) return;
    const cancel = whenIdle(() =>
      fetchStars().then((n) => live && n !== null && setStars(n)),
    );
    return () => {
      live = false;
      cancel();
    };
  }, []);
  return stars;
}

/** 1,234 below ten thousand, then 12.3k. */
export function formatStars(n: number) {
  if (n < 10_000) return n.toLocaleString("en-US");
  const k = n < 100_000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") : Math.round(n / 1000);
  return `${k}k`;
}

/**
 * The GitHub icon button. The count slides out of it once known, so the
 * button grows in place and nothing else on the bar moves.
 */
export function GithubLink({ cramped = false }: {
  /** On a bar that, below 375px wide, has room for three digits only. */
  cramped?: boolean;
}) {
  const stars = useGithubStars();
  const shown = stars !== null;
  const label = shown ? formatStars(stars) : "";
  return (
    <a
      href={site.github}
      aria-label={
        shown
          ? `Pyo on GitHub, ${stars.toLocaleString("en-US")} stars`
          : "Pyo on GitHub"
      }
      className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full px-[8.5px] text-muted-foreground transition hover:bg-accent hover:text-foreground"
    >
      <GithubIcon size={15} />
      <span
        aria-hidden="true"
        className={`grid transition-[grid-template-columns] duration-300 ease-out ${cramped && label.length > 3 ? "max-[374px]:hidden" : ""}`}
        style={{ gridTemplateColumns: shown ? "1fr" : "0fr" }}
      >
        <span className="min-w-0 overflow-hidden">
          <span
            className={`block whitespace-nowrap pl-1.5 text-[12px] font-medium tabular-nums transition duration-300 ease-out ${shown ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
          >
            {label}
          </span>
        </span>
      </span>
    </a>
  );
}

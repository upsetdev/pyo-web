// "Deploy with Pyo" links: pyo.dev/deploy?repo=<https Git URL> or
// ?image=<image reference>. They come from anyone's README, so each value is
// checked before it goes into a link. The dashboard checks them again
// (dash/src/lib/pyo/deploy-link.ts in the pyo repo).
//
// A repository is on github.com or gitlab.com. A tree link picks a branch
// and a folder: GitHub .../tree/<branch>/<folder>, GitLab
// .../-/tree/<branch>/<folder>. The first part after tree is the branch, so
// a branch with a slash in its name can't be picked this way.

export type Provider = "github" | "gitlab";

export type Source =
  | {
      kind: "repo";
      provider: Provider;
      /** The URL as links carry it: no .git, no trailing slash. */
      value: string;
      /** owner/repo, or group/subgroup/project. */
      label: string;
      href: string;
      branch: string;
      path: string;
    }
  | {
      kind: "image";
      /** On Docker Hub, rather than another registry. */
      hub: boolean;
      value: string;
      label: string;
      /** Docker Hub's page, "" for other registries. */
      href: string;
    };

export type Problem = { error: string; title?: string };
export type Parsed = { source: Source } | Problem | null;

export const KINDS = ["repo", "image"] as const;
export type Kind = (typeof KINDS)[number];

export const MESSAGES: Record<Kind, string> = {
  repo: "The repository should look like https://github.com/owner/repo.",
  image: "The image should look like nginx:1.27.",
};
export const UNSUPPORTED = "This Git host isn't supported yet";
const UNSUPPORTED_HINT = "Pyo deploys from GitHub and GitLab.";

/** GitHub: a user or organization, then a repository. */
const GITHUB_OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const GITHUB_REPO = /^[A-Za-z0-9._-]{1,100}$/;
/** GitLab: groups and subgroups, then a project. */
const GITLAB_PART = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,254}$/;
/** A branch name without slashes, by Git's rules. */
const BRANCH =
  /^(?!-)(?!.*\.\.)(?!.*@\{)(?!.*\.lock$)(?!.*\.$)[^\s~^:?*[\\\u0000-\u001f\u007f]{1,255}$/;
/** One folder name in a repository. */
const FOLDER = /^[^/\\\u0000-\u001f\u007f]{1,255}$/;

const HOSTS: Record<string, Provider> = {
  "github.com": "github",
  "gitlab.com": "gitlab",
};

// The image reference grammar Docker and registries use: an optional
// registry host, lowercase path components, then a tag and/or a digest.
const DOMAIN_PART = "(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])";
const DOMAIN = `(?:${DOMAIN_PART}(?:\\.${DOMAIN_PART})*|\\[[0-9a-fA-F:]+\\])(?::[0-9]{1,5})?`;
const PATH_PART = "[a-z0-9]+(?:(?:[._]|__|-+)[a-z0-9]+)*";
const TAG = "[\\w][\\w.-]{0,127}";
const DIGEST = "[A-Za-z][A-Za-z0-9]*(?:[-_+.][A-Za-z][A-Za-z0-9]*)*:[0-9a-fA-F]{32,}";
const IMAGE = new RegExp(
  `^(?:${DOMAIN}/)?${PATH_PART}(?:/${PATH_PART})*(?::${TAG})?(?:@${DIGEST})?$`,
);

const dots = (s: string) => s === "." || s === "..";

/** A URL path's parts, decoded. `null` when one can't be used. */
function pathParts(pathname: string): string[] | null {
  const parts: string[] = [];
  for (const p of pathname.replace(/\/+$/, "").split("/").slice(1)) {
    let part: string;
    try {
      part = decodeURIComponent(p);
    } catch {
      return null;
    }
    if (!FOLDER.test(part) || dots(part)) return null;
    parts.push(part);
  }
  return parts;
}

/** The repository's own parts, then the branch and folder after tree. */
function split(provider: Provider, parts: string[]) {
  // GitHub: owner/repo/tree/<branch>/<folder>.
  // GitLab: group/…/project/-/tree/<branch>/<folder>.
  const at = provider === "github" ? 2 : parts.indexOf("-");
  const repo = at < 0 ? parts : parts.slice(0, at);
  const rest = at < 0 ? [] : parts.slice(provider === "github" ? at : at + 1);
  if (rest.length && (rest[0] !== "tree" || rest.length < 2)) return null;
  const [, branch = "", ...path] = rest;
  if (branch && !BRANCH.test(branch)) return null;
  if (repo.length) repo[repo.length - 1] = repo[repo.length - 1].replace(/\.git$/i, "");
  return { repo, branch, path };
}

function repoOk(provider: Provider, repo: string[]) {
  if (provider === "github")
    return (
      repo.length === 2 &&
      GITHUB_OWNER.test(repo[0]) &&
      GITHUB_REPO.test(repo[1]) &&
      !dots(repo[1])
    );
  return (
    repo.length >= 2 &&
    repo.length <= 20 &&
    repo.every((p) => GITLAB_PART.test(p) && !dots(p)) &&
    !repo[repo.length - 1].toLowerCase().endsWith(".atom")
  );
}

const joined = (parts: string[]) => parts.map(encodeURIComponent).join("/");

/** A repository's https:// URL, checked. */
export function checkRepo(raw: string): { source: Source } | Problem {
  const value = raw.trim();
  const bad = { error: MESSAGES.repo };
  if (value.length > 2048 || !/^https:\/\//i.test(value)) return bad;
  // URL would resolve . and .. away: a link has no reason to hold them.
  if (/\/(?:\.|%2e){1,2}(?:[/?#]|$)/i.test(value)) return bad;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return bad;
  }
  if (url.protocol !== "https:" || url.username || url.password) return bad;
  const provider = HOSTS[url.host];
  if (!provider) return { title: UNSUPPORTED, error: UNSUPPORTED_HINT };
  const parts = pathParts(url.pathname);
  const found = parts && split(provider, parts);
  if (!found || !repoOk(provider, found.repo)) return bad;
  const { repo, branch, path } = found;
  const base = `https://${url.host}/${joined(repo)}`;
  const tree = provider === "github" ? "/tree/" : "/-/tree/";
  const canonical = branch ? `${base}${tree}${joined([branch, ...path])}` : base;
  return {
    source: {
      kind: "repo",
      provider,
      value: canonical,
      label: repo.join("/"),
      href: canonical,
      branch,
      path: path.join("/"),
    },
  };
}

export function imageReference(raw: string): string | null {
  if (raw.length > 512) return null;
  return IMAGE.test(raw) ? raw : null;
}

/** Docker Hub's page for an official or user image, `null` for other registries. */
function hubPage(image: string) {
  const name = image
    .split("@")[0]
    .replace(/:[\w][\w.-]*$/, "")
    .replace(/^(?:docker\.io|index\.docker\.io)\//, "")
    .replace(/^library\/(?=[^/]+$)/, "");
  const first = name.split("/")[0];
  if (name.includes("/") && (first.includes(".") || first.includes(":") || first === "localhost"))
    return null;
  return name.includes("/")
    ? `https://hub.docker.com/r/${name}`
    : `https://hub.docker.com/_/${name}`;
}

/** An image reference, checked. */
export function checkImage(raw: string): { source: Source } | Problem {
  const image = imageReference(raw.trim());
  if (!image) return { error: MESSAGES.image };
  const page = hubPage(image);
  return {
    source: { kind: "image", hub: !!page, value: image, label: image, href: page ?? "" },
  };
}

export const checkSource = (kind: Kind, raw: string) =>
  kind === "repo" ? checkRepo(raw) : checkImage(raw);

/** What a page's query asks to deploy, `null` when it asks for nothing. */
export function parseSearch(search: string): Parsed {
  const q = new URLSearchParams(search);
  const repos = q.getAll("repo");
  const images = q.getAll("image");
  if (repos.length + images.length > 1)
    return { error: "Use one repo or one image." };
  if (repos.length) return checkRepo(repos[0]);
  if (images.length) return checkImage(images[0]);
  // Anything else, tracking aside, is a link gone wrong.
  const other = [...q.keys()].some((k) => !k.startsWith("utm_"));
  return other ? { error: "The link should have a repo or an image." } : null;
}

/** Keeps / : @ readable: checked values hold nothing else that needs escaping. */
const encode = (v: string) =>
  encodeURIComponent(v).replace(/%2F/gi, "/").replace(/%3A/gi, ":").replace(/%40/gi, "@");

/** pyo.dev's page for a source, as in a README. */
export const deployPageUrl = (base: string, s: { kind: Kind; value: string }) =>
  `${base}/deploy?${s.kind}=${encode(s.value)}`;

/** A Pyo's own deploy page for it, from that Pyo's checked origin. */
export const dashboardUrl = (origin: string, s: Source) =>
  `${origin}/new?${s.kind}=${encode(s.value)}`;

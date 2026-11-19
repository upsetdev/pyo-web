// Puts Pyo's install scripts into the built site (dist/client), from its
// signed GitHub releases. The last step of `bun run build`:
//
//   pyo.dev/<script>              the latest release's, revalidated on every fetch
//   pyo.dev/v/<version>/<script>  each release's, cached for good
//
// <script> is install.sh, cli.sh, connect.sh, join.sh or sandbox.sh, byte
// for byte as the release published it. Every release from 0.4.0 on is
// served (its tag on upsetdev/pyo, from `git ls-remote`), once it's
// published and verify.ts has checked it. The latest is the highest
// version checked. A tag with no published release yet is skipped. Any
// other problem fails the build, and pyo.dev keeps what it serves.
//
// Scripts never come from this repository: a public/<script>, public/v/,
// public/_headers or public/_redirects fails the build too.
//
// bun run scripts/release-scripts/publish.ts [--out dist/client]

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { TrustedRoot } from "@sigstore/protobuf-specs";
import { getTrustedRoot } from "@sigstore/tuf";
import { type Checked, checkRelease, compareVersions, type Fetch, type Legacy, REPO, sha256 } from "./verify";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "../..");

/** Workers static assets take at most this many rules in _headers. */
const MAX_RULES = 100;

/**
 * How the site serves the scripts (Workers static assets' _headers). Every
 * response is nosniff. Every script, the latest and each release's, is
 * text/plain, so a browser shows it instead of downloading it. That one
 * rule replaces the type Workers guess from the extension (application/x-sh):
 * no other rule may set Content-Type, or the values would be joined. "/*.sh"
 * is a single splat, which matches any path ending in .sh, and only scripts
 * end in .sh (verify.ts takes no other name). The latest are revalidated on
 * every fetch (the default max-age=0, must-revalidate). Each release's under
 * /v/<version>/ never change, so they're cached for good. Only releases
 * served get that: a version pyo.dev doesn't have yet isn't cached as
 * missing. Past the rule limit, the oldest releases are revalidated like the
 * latest.
 */
export function headers(versions: string[]) {
  const newest = [...versions].sort(compareVersions).reverse().slice(0, MAX_RULES - 2);
  return [
    "",
    "# Pyo's install scripts, from its signed releases (scripts/release-scripts).",
    "/*",
    "  X-Content-Type-Options: nosniff",
    "/*.sh",
    "  Content-Type: text/plain; charset=utf-8",
    ...newest.flatMap((v) => [`/v/${v}/*`, "  Cache-Control: public, max-age=31536000, immutable"]),
    "",
  ].join("\n");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** An error with what caused it, all the way down. */
export function explain(e: unknown): string {
  const parts: string[] = [];
  for (let c: unknown = e; c && parts.length < 6; c = (c as { cause?: unknown }).cause) {
    parts.push(c instanceof Error ? `${c.name === "Error" ? "" : `${c.name}: `}${c.message}` : String(c));
  }
  return parts.join("\n  because: ");
}

/** Release versions from 0.4.0 on, by their tags on GitHub. */
async function versions(oldest: string): Promise<string[]> {
  let refs = "";
  for (let attempt = 1; ; attempt++) {
    try {
      refs = execFileSync("git", ["ls-remote", "--tags", "--refs", `https://github.com/${REPO}.git`], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 60_000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
      });
      break;
    } catch (e) {
      const stderr = String((e as { stderr?: unknown }).stderr ?? "").trim();
      if (attempt >= 4) throw new Error(`couldn't list ${REPO}'s tags with git ls-remote: ${stderr || explain(e)}`);
      await sleep(attempt * 2000);
    }
  }
  return refs
    .split("\n")
    .map((l) => l.match(/\trefs\/tags\/v(\d+\.\d+\.\d+)$/)?.[1])
    .filter((v): v is string => !!v && compareVersions(v, oldest) >= 0)
    .sort(compareVersions);
}

/** A release asset from GitHub, null when there's none (404). Retries a few times. */
export const fromGitHub: Fetch = async (version, name) => {
  const url = `https://github.com/${REPO}/releases/download/v${version}/${name}`;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(60_000) });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return new Uint8Array(await res.arrayBuffer());
    } catch (e) {
      if (attempt >= 4) throw new Error(`couldn't download ${url}: ${explain(e)}`);
      await sleep(attempt * 2000);
    }
  }
};

/**
 * The site's own files may not have any script, anything under v/, or the
 * _headers and _redirects that could change how the scripts are served.
 */
export function refuseOwnScripts(out: string) {
  const own = readdirSync(out).filter((f) => f.endsWith(".sh") || ["v", "_headers", "_redirects"].includes(f));
  if (own.length) {
    throw new Error(
      `${own.join(", ")} came from public/. pyo.dev serves Pyo's scripts, and says how, only from its signed releases: remove ${own.map((f) => `public/${f}`).join(", ")}.`,
    );
  }
}

/**
 * Sigstore's keys (Fulcio's certificates, Rekor's and the CT logs' keys),
 * through TUF, Sigstore's own signed and versioned metadata. If TUF can't be
 * reached, the copy in sigstore-trusted-root.json (Sigstore's public
 * trusted_root.json, reviewed with this code). Either way a signature only
 * checks out with Sigstore's real keys: a stale copy can only refuse.
 */
async function sigstoreRoot(): Promise<TrustedRoot> {
  const cachePath = mkdtempSync(join(tmpdir(), "pyo-sigstore-"));
  try {
    const r = await getTrustedRoot({ cachePath, timeout: 30_000, retry: 4 });
    console.log("Pyo's install scripts: Sigstore's keys from TUF");
    return r;
  } catch (e) {
    console.warn(`Pyo's install scripts: Sigstore's TUF repository didn't answer, so the reviewed copy of its keys is used:\n  ${explain(e)}`);
    return TrustedRoot.fromJSON(JSON.parse(readFileSync(join(here, "sigstore-trusted-root.json"), "utf8")));
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const out = argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : join(root, "dist/client");
  if (!existsSync(out)) throw new Error(`${out} doesn't exist: run vite build first`);
  refuseOwnScripts(out);

  const legacy: Legacy = JSON.parse(readFileSync(join(here, "legacy.json"), "utf8")).releases;
  const oldest = Object.keys(legacy).sort(compareVersions)[0];
  console.log(`Pyo's install scripts: Bun ${process.versions.bun ?? "-"}, Node ${process.versions.node}, ${process.platform}-${process.arch}`);
  const tags = await versions(oldest);
  if (!tags.length) throw new Error(`${REPO} has no release tags from v${oldest} on`);
  console.log(`Pyo's install scripts: checking ${tags.length} releases (${tags[0]} to ${tags.at(-1)})`);
  const trusted = await sigstoreRoot();

  const checked: Checked[] = [];
  for (const version of tags) {
    const r = await checkRelease(version, { fetch: fromGitHub, legacy, root: trusted });
    if (!r) {
      console.log(`  v${version}: not published yet, skipped`);
      continue;
    }
    console.log(`  v${version}: signed at ${r.commit.slice(0, 12)}, ${Object.keys(r.scripts).length} scripts match`);
    checked.push(r);
  }
  const latest = checked.at(-1);
  if (!latest) throw new Error("no release's scripts checked out");

  for (const r of checked) {
    const dir = join(out, "v", r.version);
    mkdirSync(dir, { recursive: true });
    for (const [name, data] of Object.entries(r.scripts)) writeFileSync(join(dir, name), data);
  }
  const names = Object.keys(latest.scripts).sort();
  for (const name of names) writeFileSync(join(out, name), latest.scripts[name]);
  writeFileSync(join(out, "_headers"), headers(checked.map((r) => r.version)));

  console.log(`pyo.dev/<script> is v${latest.version}'s:`);
  for (const name of names) console.log(`  ${sha256(latest.scripts[name])}  ${name}`);
}

if (import.meta.main) {
  main().catch((e) => {
    console.error(`\nPyo's install scripts: ${explain(e)}`);
    console.error("Nothing was published. Pyo's scripts come only from its signed releases.");
    process.exit(1);
  });
}

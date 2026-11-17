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
import { getTrustedRoot } from "@sigstore/tuf";
import { type Checked, checkRelease, compareVersions, type Fetch, type Legacy, REPO, sha256 } from "./verify";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "../..");

/** Workers static assets take at most this many rules in _headers. */
const MAX_RULES = 100;

/**
 * How the site serves the scripts (Workers static assets' _headers). Every
 * response is nosniff. The scripts' type is application/x-sh by their
 * extension, and the latest are revalidated on every fetch (the default
 * max-age=0, must-revalidate). Each release's under /v/<version>/ never
 * change, so they're cached for good. Only releases served get that: a
 * version pyo.dev doesn't have yet isn't cached as missing. Past the rule
 * limit, the oldest releases are revalidated like the latest.
 */
export function headers(versions: string[]) {
  const newest = [...versions].sort(compareVersions).reverse().slice(0, MAX_RULES - 1);
  return [
    "",
    "# Pyo's install scripts, from its signed releases (scripts/release-scripts).",
    "/*",
    "  X-Content-Type-Options: nosniff",
    ...newest.flatMap((v) => [`/v/${v}/*`, "  Cache-Control: public, max-age=31536000, immutable"]),
    "",
  ].join("\n");
}

/** Release versions from 0.4.0 on, by their tags on GitHub. */
function versions(oldest: string): string[] {
  const refs = execFileSync("git", ["ls-remote", "--tags", "--refs", `https://github.com/${REPO}.git`], {
    encoding: "utf8",
  });
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
      if (attempt >= 4) throw new Error(`couldn't download ${url}: ${(e as Error).message}`);
      await new Promise((r) => setTimeout(r, attempt * 2000));
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

async function main() {
  const argv = process.argv.slice(2);
  const out = argv.includes("--out") ? argv[argv.indexOf("--out") + 1] : join(root, "dist/client");
  if (!existsSync(out)) throw new Error(`${out} doesn't exist: run vite build first`);
  refuseOwnScripts(out);

  const legacy: Legacy = JSON.parse(readFileSync(join(here, "legacy.json"), "utf8")).releases;
  const oldest = Object.keys(legacy).sort(compareVersions)[0];
  const tags = versions(oldest);
  console.log(`Pyo's install scripts: checking ${tags.length} releases (${tags[0]} to ${tags.at(-1)})`);

  // Sigstore's keys, through TUF (Sigstore's own signed metadata).
  const trusted = await getTrustedRoot({ cachePath: mkdtempSync(join(tmpdir(), "pyo-sigstore-")) });

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
    console.error(`\nPyo's install scripts: ${(e as Error).message}`);
    console.error("Nothing was published. Pyo's scripts come only from its signed releases.");
    process.exit(1);
  });
}

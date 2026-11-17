// Writes legacy.json: the SHA-256 of the install scripts of releases whose
// release.json lists none (0.4.2 and earlier). Run once per such release,
// then review the result and commit it:
//
//   bun run scripts/release-scripts/snapshot.ts 0.4.0 0.4.1 0.4.2
//
// For each release, it checks release.json's signature (as verify.ts does)
// and takes the commit the release workflow signed it at. Each script the
// release published must then be the same file as in upsetdev/pyo at that
// commit (crates/pyo-api/assets/connect.sh and join.sh, deploy/install.sh,
// cli.sh and sandbox.sh), or nothing is written. So each sum is of the
// source the signed release was built from. The build then serves these
// releases' scripts only when they still have these sums, and their signed
// release.json names the same commit.

import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getTrustedRoot } from "@sigstore/tuf";
import { fromGitHub } from "./publish";
import { compareVersions, type Legacy, REPO, SCRIPTS, sha256, verifySignature } from "./verify";

const SOURCES: Record<(typeof SCRIPTS)[number], string> = {
  "install.sh": "deploy/install.sh",
  "cli.sh": "deploy/cli.sh",
  "connect.sh": "crates/pyo-api/assets/connect.sh",
  "join.sh": "crates/pyo-api/assets/join.sh",
  "sandbox.sh": "deploy/sandbox.sh",
};

const file = join(fileURLToPath(new URL(".", import.meta.url)), "legacy.json");

async function source(commit: string, path: string) {
  const url = `https://raw.githubusercontent.com/${REPO}/${commit}/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`couldn't download ${url}: HTTP ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

const want = process.argv.slice(2);
if (!want.length) {
  console.error("usage: snapshot.ts <version>...");
  process.exit(2);
}
const root = await getTrustedRoot({ cachePath: mkdtempSync(join(tmpdir(), "pyo-sigstore-")) });
const doc: { comment: string; releases: Legacy } = JSON.parse(readFileSync(file, "utf8"));

for (const version of want) {
  const releaseJson = await fromGitHub(version, "release.json");
  const bundle = await fromGitHub(version, "release.json.sigstore.json");
  if (!releaseJson || !bundle) throw new Error(`v${version} has no signed release.json`);
  const { commit } = verifySignature(root, JSON.parse(Buffer.from(bundle).toString("utf8")), releaseJson, version);
  if (JSON.parse(Buffer.from(releaseJson).toString("utf8")).scripts) {
    throw new Error(`v${version}'s release.json lists its scripts' sums: it needs no snapshot`);
  }
  const scripts: Record<string, string> = {};
  for (const name of SCRIPTS) {
    const published = await fromGitHub(version, name);
    if (!published) throw new Error(`v${version} has no ${name}`);
    const built = await source(commit, SOURCES[name]);
    if (sha256(published) !== sha256(built)) {
      throw new Error(`v${version}'s ${name} isn't ${SOURCES[name]} at ${commit}`);
    }
    scripts[name] = sha256(published);
  }
  doc.releases[version] = { commit, scripts };
  console.log(`v${version}: signed at ${commit}, each script matches the source there`);
}

doc.releases = Object.fromEntries(Object.entries(doc.releases).sort(([a], [b]) => compareVersions(a, b)));
writeFileSync(file, `${JSON.stringify(doc, null, 2)}\n`);

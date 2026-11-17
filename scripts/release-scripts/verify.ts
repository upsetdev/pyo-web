// Checks Pyo's install scripts before pyo.dev serves them. A release's
// scripts are served only when:
//
// 1. its release.json is signed by Pyo's release workflow: a Sigstore
//    bundle (release.json.sigstore.json) whose certificate is GitHub
//    Actions' identity for .github/workflows/release.yml at that release's
//    tag, in the upsetdev/pyo repository (by name and by GitHub's id for
//    it), and that Sigstore's transparency log (Rekor) recorded;
// 2. that release.json is for that version;
// 3. each script is the SHA-256 release.json lists for it (`scripts`).
//
// Releases up to 0.4.2 have no `scripts` in their release.json. Their sums
// come from legacy.json instead, a reviewed list that snapshot.ts wrote
// once, and only for the commit their signed release.json was built from.
//
// Anything else refuses, and the build fails.

import { createHash } from "node:crypto";
import { bundleFromJSON } from "@sigstore/bundle";
import type { TrustedRoot } from "@sigstore/protobuf-specs";
import { toSignedEntity, toTrustMaterial, Verifier } from "@sigstore/verify";

export const REPO = "upsetdev/pyo";
/** GitHub's id for upsetdev/pyo: a repository made again under that name gets another. */
export const REPO_ID = "1455824863";
export const ISSUER = "https://token.actions.githubusercontent.com";
/** The scripts every release since 0.4.0 publishes, and pyo.dev serves. */
export const SCRIPTS = ["install.sh", "cli.sh", "connect.sh", "join.sh", "sandbox.sh"] as const;

const VERSION = /^\d+\.\d+\.\d+$/;
const SHA256 = /^[0-9a-f]{64}$/;
const COMMIT = /^[0-9a-f]{40}$/;
const SCRIPT_NAME = /^[a-z][a-z0-9-]*\.sh$/;

/** Fulcio's certificate extensions for GitHub Actions (OID 1.3.6.1.4.1.57264.1.*). */
const OID = {
  /** The commit the workflow ran at. */
  commit: [1, 3, 6, 1, 4, 1, 57264, 1, 3],
  repository: [1, 3, 6, 1, 4, 1, 57264, 1, 5],
  ref: [1, 3, 6, 1, 4, 1, 57264, 1, 6],
  repositoryId: [1, 3, 6, 1, 4, 1, 57264, 1, 15],
};

/** The identity that signs release vX.Y.Z's release.json. */
export const signerOf = (version: string) =>
  `https://github.com/${REPO}/.github/workflows/release.yml@refs/tags/v${version}`;

/** A reason not to serve a release's scripts. */
export class Refused extends Error {
  override name = "Refused";
}

export type Sums = Record<string, string>;
export type Legacy = Record<string, { commit: string; scripts: Sums }>;

export const compareVersions = (a: string, b: string) => {
  const [x, y] = [a.split(".").map(Number), b.split(".").map(Number)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

export const sha256 = (data: Uint8Array) => createHash("sha256").update(data).digest("hex");

/** A UTF8String, DER-encoded, as the newer extensions hold their values. */
function utf8String(s: string) {
  const b = Buffer.from(s, "utf8");
  if (b.length > 127) throw new Error("too long for a short DER length");
  return Buffer.concat([Buffer.from([0x0c, b.length]), b]);
}

const sameOid = (a: number[] | undefined, b: number[]) =>
  a?.length === b.length && a.every((n, i) => n === b[i]);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/**
 * Checks release `version`'s release.json (`data`) against its Sigstore
 * bundle, and returns the commit the release workflow signed it at.
 */
export function verifySignature(
  root: TrustedRoot,
  bundle: unknown,
  data: Uint8Array,
  version: string,
): { commit: string } {
  if (!VERSION.test(version)) throw new Refused(`"${version}" isn't a release version`);
  const what = `v${version}'s release.json`;
  let parsed;
  try {
    parsed = bundleFromJSON(bundle);
  } catch (e) {
    throw new Refused(`${what}: release.json.sigstore.json isn't a Sigstore bundle (${(e as Error).message})`);
  }
  const identity = signerOf(version);
  const verifier = new Verifier(toTrustMaterial(root), { tlogThreshold: 1, ctlogThreshold: 1 });
  let signer;
  try {
    signer = verifier.verify(toSignedEntity(parsed, Buffer.from(data)), {
      subjectAlternativeName: `^${escape(identity)}$`,
      extensions: { issuer: ISSUER },
      oids: [
        { oid: { id: OID.repository }, value: Buffer.from(REPO) },
        { oid: { id: OID.ref }, value: Buffer.from(`refs/tags/v${version}`) },
        { oid: { id: OID.repositoryId }, value: utf8String(REPO_ID) },
      ],
    });
  } catch (e) {
    throw new Refused(`${what}: its signature doesn't check out (${(e as Error).message})`);
  }
  // The policy above already holds these. Checked again, exactly.
  if (signer.identity?.subjectAlternativeName !== identity) {
    throw new Refused(`${what} is signed by ${signer.identity?.subjectAlternativeName}, not ${identity}`);
  }
  if (signer.identity?.extensions?.issuer !== ISSUER) {
    throw new Refused(`${what}'s signer comes from ${signer.identity?.extensions?.issuer}, not ${ISSUER}`);
  }
  const commit = signer.identity.oids
    ?.find((o) => sameOid(o.oid?.id, OID.commit))
    ?.value.toString("utf8");
  if (!commit || !COMMIT.test(commit)) throw new Refused(`${what}'s signature names no commit`);
  return { commit };
}

/** Script names to SHA-256, as `what` lists them. */
function sums(list: unknown, what: string): Sums {
  if (!list || typeof list !== "object" || Array.isArray(list)) throw new Refused(`${what}: scripts isn't a list of sums`);
  const out: Sums = {};
  for (const [name, sum] of Object.entries(list)) {
    if (!SCRIPT_NAME.test(name)) throw new Refused(`${what}: "${name}" isn't a script's name`);
    if (typeof sum !== "string" || !SHA256.test(sum)) throw new Refused(`${what}: ${name}'s SHA-256 is malformed`);
    out[name] = sum;
  }
  for (const name of SCRIPTS) if (!out[name]) throw new Refused(`${what} lists no sum for ${name}`);
  return out;
}

/**
 * The sums release `version`'s scripts must have: its release.json's
 * `scripts`, or else legacy.json's, when that has the very commit its
 * signed release.json names.
 */
export function expectedSums(releaseJson: Uint8Array, version: string, commit: string, legacy: Legacy): Sums {
  const what = `v${version}'s release.json`;
  let release: { version?: unknown; scripts?: unknown };
  try {
    release = JSON.parse(Buffer.from(releaseJson).toString("utf8"));
  } catch {
    throw new Refused(`${what} isn't JSON`);
  }
  if (release.version !== version) throw new Refused(`${what} is for version ${String(release.version)}`);
  if (release.scripts !== undefined) return sums(release.scripts, what);
  const old = legacy[version];
  if (!old) throw new Refused(`${what} lists no script sums, and legacy.json doesn't have v${version}`);
  if (old.commit !== commit) {
    throw new Refused(`legacy.json has v${version} at ${old.commit}, but its signed release.json was made at ${commit}`);
  }
  return sums(old.scripts, `legacy.json's v${version}`);
}

/** Each script is there, and is what `expected` says. */
export function checkScripts(expected: Sums, files: Record<string, Uint8Array | null | undefined>, version: string) {
  for (const [name, sum] of Object.entries(expected)) {
    const file = files[name];
    if (!file) throw new Refused(`v${version} has no ${name}`);
    const got = sha256(file);
    if (got !== sum) throw new Refused(`v${version}'s ${name} is ${got}, and its release lists ${sum}`);
  }
}

/** A release asset: its bytes, or null when the release has none of that name. */
export type Fetch = (version: string, name: string) => Promise<Uint8Array | null>;

export type Checked = { version: string; commit: string; scripts: Record<string, Uint8Array> };

/**
 * Release `version`'s scripts, each checked. Null when it has no
 * release.json: not published (yet).
 */
export async function checkRelease(
  version: string,
  opts: {
    fetch: Fetch;
    legacy: Legacy;
    root: TrustedRoot;
    /** Tests only: what checks the signature. */
    verify?: typeof verifySignature;
  },
): Promise<Checked | null> {
  const releaseJson = await opts.fetch(version, "release.json");
  if (!releaseJson) return null;
  const bundle = await opts.fetch(version, "release.json.sigstore.json");
  if (!bundle) throw new Refused(`v${version} has a release.json but no signature for it (release.json.sigstore.json)`);
  let bundleJson: unknown;
  try {
    bundleJson = JSON.parse(Buffer.from(bundle).toString("utf8"));
  } catch {
    throw new Refused(`v${version}'s release.json.sigstore.json isn't JSON`);
  }
  const { commit } = (opts.verify ?? verifySignature)(opts.root, bundleJson, releaseJson, version);
  const expected = expectedSums(releaseJson, version, commit, opts.legacy);
  const scripts: Record<string, Uint8Array> = {};
  await Promise.all(
    Object.keys(expected).map(async (name) => {
      const file = await opts.fetch(version, name);
      if (file) scripts[name] = file;
    }),
  );
  checkScripts(expected, scripts, version);
  return { version, commit, scripts };
}

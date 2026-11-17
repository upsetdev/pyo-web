// bun run sync-docs: see docs-sync.ts.
//
// pyo-docs sits next to this repo when you work on the site. A build in CI
// (Cloudflare's Workers Builds sets WORKERS_CI=1, others set CI) has no
// copy of it, so it takes the public repo's main branch, a shallow clone in
// a temporary folder. PYO_DOCS_CLONE=1 does the same anywhere, and
// PYO_DOCS_REF picks another branch or tag. PYO_DOCS_DIR always wins: then
// nothing is cloned.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PYO_DOCS_GIT = "https://github.com/upsetdev/pyo-docs.git";

const root = fileURLToPath(new URL("..", import.meta.url));
const ci = Boolean(process.env.WORKERS_CI || process.env.CI);
const asked = process.env.PYO_DOCS_CLONE === "1";

if (
  !process.env.PYO_DOCS_DIR &&
  !existsSync(join(root, "../pyo-docs/content")) &&
  (ci || asked)
) {
  const ref = process.env.PYO_DOCS_REF || "main";
  const dir = join(mkdtempSync(join(tmpdir(), "pyo-docs-")), "pyo-docs");
  console.log(`No pyo-docs next to this repo: cloning ${PYO_DOCS_GIT} (${ref})`);
  execFileSync(
    "git",
    ["clone", "--quiet", "--depth", "1", "--branch", ref, PYO_DOCS_GIT, dir],
    { stdio: "inherit" },
  );
  const commit = execFileSync("git", ["-C", dir, "rev-parse", "--short", "HEAD"], {
    encoding: "utf8",
  }).trim();
  console.log(`pyo-docs at ${commit}`);
  process.env.PYO_DOCS_DIR = dir;
}

// After PYO_DOCS_DIR is settled: docs-sync reads it when it loads.
const { docsSource, docsTarget, syncDocs } = await import("./docs-sync");

if (!existsSync(docsSource)) {
  if (existsSync(docsTarget)) {
    console.log(`No ${docsSource}: keeping content/docs as it is`);
    process.exit(0);
  }
  console.error(
    `No docs at ${docsSource}. Clone pyo-docs next to this repo, set PYO_DOCS_DIR, or set PYO_DOCS_CLONE=1 to clone it.`,
  );
  process.exit(1);
}
console.log(`${await syncDocs()} docs files changed`);

// Writes src/data/templates.json, what the site shows of pyo-templates' build
// (the same dist/v1/index.json and logos the Pyo dashboard bundles).
// Passwords and other environment values stay behind. Part of `bun run build`.
//
// pyo-templates sits next to this repo when you work on the site: run
// `bun run build` there first. A build in CI (Cloudflare's Workers Builds sets
// WORKERS_CI=1, others set CI) has no copy of it, so it takes the public
// repo's main branch, a shallow clone in a temporary folder, and builds it.
// PYO_TEMPLATES_CLONE=1 does the same anywhere, and PYO_TEMPLATES_REF picks
// another branch or tag. PYO_TEMPLATES_DIR always wins: then nothing is
// cloned. With no pyo-templates at all, the committed templates.json stays.
//
// bun run sync-templates
// bun run sync-templates --out /tmp/templates.json   (a dry run: written elsewhere)
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PYO_TEMPLATES_GIT = "https://github.com/upsetdev/pyo-templates.git";

const root = fileURLToPath(new URL("..", import.meta.url));
const ci = Boolean(process.env.WORKERS_CI || process.env.CI);
const asked = process.env.PYO_TEMPLATES_CLONE === "1";
const sibling = join(root, "../pyo-templates");

let repo = resolve(process.env.PYO_TEMPLATES_DIR || sibling);
if (!process.env.PYO_TEMPLATES_DIR && !existsSync(sibling) && (ci || asked)) {
  const ref = process.env.PYO_TEMPLATES_REF || "main";
  repo = join(mkdtempSync(join(tmpdir(), "pyo-templates-")), "pyo-templates");
  console.log(`No pyo-templates next to this repo: cloning ${PYO_TEMPLATES_GIT} (${ref})`);
  execFileSync(
    "git",
    ["clone", "--quiet", "--depth", "1", "--branch", ref, PYO_TEMPLATES_GIT, repo],
    { stdio: "inherit" },
  );
  const commit = execFileSync("git", ["-C", repo, "rev-parse", "--short", "HEAD"], {
    encoding: "utf8",
  }).trim();
  console.log(`pyo-templates at ${commit}: building it`);
  // This script runs in Bun, so its own binary installs and builds.
  const bun = process.versions.bun ? process.execPath : "bun";
  execFileSync(bun, ["install", "--frozen-lockfile"], { cwd: repo, stdio: "inherit" });
  execFileSync(bun, ["run", "build"], { cwd: repo, stdio: "inherit" });
}

const DIST = join(repo, "dist/v1");
const indexFile = join(DIST, "index.json");
if (!existsSync(indexFile)) {
  if (!process.env.PYO_TEMPLATES_DIR && !existsSync(sibling)) {
    console.log("No pyo-templates next to this repo: keeping src/data/templates.json as it is");
    process.exit(0);
  }
  console.error(`No ${indexFile}: run \`bun run build\` in ${repo} first.`);
  process.exit(1);
}

const CATEGORIES = [
  ["databases", "Databases"],
  ["caches", "Caches"],
  ["storage", "Storage"],
  ["networking", "Networking"],
  ["monitoring", "Monitoring"],
  ["messaging", "Messaging"],
  ["developer-tools", "Dev tools"],
  ["web", "Web apps"],
  ["ai", "AI"],
  ["other", "Other"],
];

/** The engines' names, as the dashboard shows them. */
const ENGINES: Record<string, string> = { mysql: "MySQL", postgres: "Postgres", kv: "KV" };

type Field = {
  label: string;
  help?: string;
  default?: unknown;
  sensitive?: boolean;
};
type Port = { name: string; port: number; protocol: string; exposure: string };
type Storage = { required: boolean; sizeGi: number; mountPath: string };

const healthCheck = (h: {
  type: string;
  path?: string;
  port?: number;
  command?: string;
}) =>
  h.type === "none"
    ? "None"
    : h.type === "http"
      ? `HTTP ${h.path}`
      : h.type === "tcp"
        ? `TCP :${h.port}`
        : h.command;

/** The one path and colour each logo is, to draw in place. */
function logoOf(path: string | null) {
  if (!path) return null;
  const svg = readFileSync(join(DIST, path), "utf8");
  const hex = /fill="#([0-9A-Fa-f]{6})"/.exec(svg)?.[1];
  const d = /\sd="([^"]+)"/.exec(svg)?.[1];
  if (!hex || !d) throw new Error(`can't read ${path}`);
  return { hex, path: d };
}

const index = JSON.parse(readFileSync(indexFile, "utf8"));
if (index.schema !== 1) throw new Error(`index.json schema ${index.schema}: this script reads 1`);

// The catalog's order; hidden ones aren't shown.
const templates = index.templates
  .filter((t: Record<string, any>) => !t.hidden)
  .map((t: Record<string, any>) => {
    const versions: { tag: string }[] = t.source.versions;
    const companions: Record<string, any>[] = t.companions ?? [];
    const ports: Port[] = t.ports;
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      tier: t.tier,
      author: t.author,
      homepage: t.homepage ?? null,
      featured: !!t.featured,
      logo: logoOf(t.logo),
      image: t.source.image,
      version: versions[0].tag,
      versions: versions.map((v) => v.tag),
      // A web app gets a domain; the rest stay inside the cluster.
      exposure: ports.some((p) => p.exposure === "http")
        ? "web"
        : ports.some((p) => p.exposure !== "internal")
          ? "public"
          : "internal",
      stateful: t.stateful,
      replicas: t.replicas,
      resources: t.resources,
      gpu: t.gpu ?? null,
      // Its own volume, then its companions'.
      volumes: [
        ...(t.storage ? [{ service: t.id, ...(t.storage as Storage) }] : []),
        ...companions
          .filter((c) => c.storage)
          .map((c) => ({ service: c.name as string, ...(c.storage as Storage) })),
      ],
      healthCheck: healthCheck(t.healthCheck),
      ports,
      databases: (t.databases ?? []).map((d: { engine: string; env: Record<string, string>; extensions?: string[] }) => ({
        engine: ENGINES[d.engine] ?? d.engine,
        variables: Object.keys(d.env),
        extensions: d.extensions ?? [],
      })),
      companions: companions.map((c) => ({
        name: c.name as string,
        image: `${c.image}:${c.version.tag}`,
      })),
      hints: t.hints,
      // What you can set when deploying it. A sensitive value is never copied.
      fields: [
        ...(versions.length > 1
          ? [{ label: "Version", help: "", value: versions[0].tag }]
          : []),
        ...t.fields.map((f: Field) => ({
          label: f.label,
          help: f.help ?? "",
          value: f.sensitive ? "Generated, or your own" : String(f.default ?? ""),
        })),
      ],
    };
  });

const categories = CATEGORIES.filter(([id]) =>
  templates.some((t: { category: string }) => t.category === id),
).map(([id, label]) => ({ id, label }));

const out = process.argv.indexOf("--out");
writeFileSync(
  out > 0 ? process.argv[out + 1] : join(root, "src/data/templates.json"),
  `${JSON.stringify({ categories, templates }, null, 2)}\n`,
);

console.log(`${templates.length} templates in ${categories.length} categories`);

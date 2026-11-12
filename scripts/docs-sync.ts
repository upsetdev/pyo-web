// Keeps content/docs and content/openapi (not committed) the same as pyo-docs,
// next to this repo. It only touches what changed, so a running dev server
// never sees the whole tree vanish. Set PYO_DOCS_DIR when pyo-docs is
// somewhere else.
//
// Besides copying, it builds the API reference: one page per operation in
// pyo-docs/openapi/pyo.json, under docs/api/reference, grouped by tag.
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateFilesOnly } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";
import { FALLBACK_TAG, referenceDocuments } from "../src/lib/openapi-ops.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const docsRepo = resolve(
  process.env.PYO_DOCS_DIR ?? join(root, "../pyo-docs"),
);

export const docsSource = join(docsRepo, "content");
export const specSource = join(docsRepo, "openapi/pyo.json");
export const docsTarget = join(root, "content/docs");
/** The spec, for the API pages to load in the browser. */
export const specTarget = join(root, "content/openapi/pyo.json");

/** Where the generated pages go, inside the API section. */
const REFERENCE = "api/reference";

const walk = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
      )
    : [];

/** getState -> get-state, for URLs. */
const kebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

/** The API reference pages, keyed by their path under content/docs. */
async function reference(): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!existsSync(specSource)) return out;
  const spec = JSON.parse(readFileSync(specSource, "utf8"));
  // The plain endpoints, then one document per /ops action (see openapi-ops).
  const documents = referenceDocuments(spec);
  const openapi = createOpenAPI({ input: documents, disableCache: true });
  const files = await generateFilesOnly({
    input: openapi,
    per: "operation",
    groupBy: "tag",
    includeDescription: true,
  });

  // Folder metas: pages in the order they were generated, which follows the
  // spec (its endpoints, then its actions).
  const folders = new Map<string, string[]>();
  for (const f of files) {
    if (!f.path.endsWith(".mdx")) continue;
    const parts = f.path.slice(0, -4).split("/").map(kebab);
    const page = parts.pop() as string;
    const folder = parts.join("/");
    out.set(join(REFERENCE, folder, `${page}.mdx`), f.content);
    folders.set(folder, [...(folders.get(folder) ?? []), page]);
  }
  const tagInfo = new Map<string, { name: string; description?: string; "x-displayName"?: string }>(
    (spec.tags ?? []).map((t: { name: string }) => [kebab(t.name), t]),
  );
  for (const [folder, pages] of folders) {
    if (!folder) continue;
    const tag = tagInfo.get(folder);
    const fallback = kebab(FALLBACK_TAG) === folder ? FALLBACK_TAG : folder;
    const meta = {
      title: tag?.["x-displayName"] ?? tag?.name ?? fallback,
      ...(tag?.description ? { description: tag.description } : {}),
      pages,
    };
    out.set(join(REFERENCE, folder, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
  }
  // The section itself: folders in the spec's tag order, then any others.
  const order = [...tagInfo.keys(), kebab(FALLBACK_TAG)].filter((t) =>
    folders.has(t),
  );
  out.set(
    join(REFERENCE, "meta.json"),
    `${JSON.stringify({ title: "Reference", pages: [...order, "..."] }, null, 2)}\n`,
  );
  return out;
}

/** The API section lists its pages: the reference goes after them. */
function withReference(meta: string): string {
  const data = JSON.parse(meta);
  if (
    !Array.isArray(data.pages) ||
    data.pages.some((p: string) => /(^|\.\.\.)reference$/.test(p))
  )
    return meta;
  data.pages.push("---Reference---", "...reference");
  return `${JSON.stringify(data, null, 2)}\n`;
}

/** Folders left empty by removed pages would show up as empty sidebar groups. */
function removeEmptyDirs(dir: string): boolean {
  if (!existsSync(dir)) return true;
  let empty = true;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && removeEmptyDirs(join(dir, e.name)))
      rmSync(join(dir, e.name), { recursive: true });
    else empty = false;
  }
  return empty;
}

/** Writes `want` into `dir`, removing anything else there. Returns how many files changed. */
function mirror(dir: string, want: Map<string, Buffer>) {
  let changed = 0;
  for (const [file, data] of want) {
    const target = join(dir, file);
    if (existsSync(target) && readFileSync(target).equals(data)) continue;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, data);
    changed++;
  }
  for (const target of walk(dir)) {
    if (want.has(relative(dir, target))) continue;
    rmSync(target);
    changed++;
  }
  removeEmptyDirs(dir);
  return changed;
}

/** Returns how many files changed. */
export async function syncDocs() {
  const want = new Map<string, Buffer>();
  for (const file of walk(docsSource)) {
    const name = relative(docsSource, file);
    let data = readFileSync(file);
    if (name === join("api", "meta.json") && existsSync(specSource))
      data = Buffer.from(withReference(data.toString("utf8")));
    want.set(name, data);
  }
  for (const [name, content] of await reference())
    want.set(name, Buffer.from(content));

  const spec = new Map<string, Buffer>();
  if (existsSync(specSource)) spec.set("pyo.json", readFileSync(specSource));

  return mirror(docsTarget, want) + mirror(dirname(specTarget), spec);
}

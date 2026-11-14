// Writes what search engines and AI assistants read, from the templates and
// the docs: public/sitemap.xml, public/llms.txt, public/llms-full.txt, and each
// docs page as Markdown in public/md. Part of `bun run build`.
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { parse } from "yaml";
import { COMPETITORS } from "../src/data/versus";

const root = new URL("..", import.meta.url).pathname;
const SITE = "https://pyo.dev";
const DOCS = join(root, "content/docs");

const { templates } = JSON.parse(
  readFileSync(join(root, "src/data/templates.json"), "utf8"),
);

const mdx = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? mdx(join(dir, e.name))
      : e.name.endsWith(".mdx")
        ? [join(dir, e.name)]
        : [],
  );

/** Plain Markdown: the MDX components become what they mean. */
const absolute = (href: string) => (href.startsWith("/") ? `${SITE}${href}` : href);
const toMarkdown = (body: string) =>
  body
    .replace(/\{\/\*[\s\S]*?\*\/\}\n*/g, "")
    .replace(/<\/?Cards>\n?/g, "")
    .replace(/^[ \t]*<Card\b([^>]*)\/>$/gm, (_, attrs: string) => {
      const attr = (name: string) => new RegExp(`${name}="([^"]*)"`).exec(attrs)?.[1];
      const about = attr("description");
      return `- [${attr("title")}](${absolute(attr("href") ?? "")})${about ? `: ${about}` : ""}`;
    })
    .replace(/<Term\b[^>]*>([\s\S]*?)<\/Term>/g, "$1")
    .replace(/<Callout[^>]*>\s*([\s\S]*?)\s*<\/Callout>/g, (_, text: string) => `> ${text}`)
    .replace(/\]\(\/(docs|templates)/g, `](${SITE}/$1`)
    .replace(/```(\w+) title="[^"]*"/g, "```$1")
    .trim();

const docs = mdx(DOCS)
  .map((file) => {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(readFileSync(file, "utf8"));
    if (!match) throw new Error(`No frontmatter in ${file}`);
    const { title } = parse(match[1]);
    let { description } = parse(match[1]);
    const slug = relative(DOCS, file)
      .replace(/\.mdx$/, "")
      .replace(/\([^)]+\)\//g, "") // Bracketed folders aren't in URLs.
      .replace(/(^|\/)index$/, "");
    let body = readFileSync(file, "utf8").slice(match[0].length);
    // API reference pages are generated from the OpenAPI spec: their Markdown
    // names the endpoint and points to the spec, which says the rest.
    const front = parse(match[1]);
    if (front._openapi) {
      const ops = /operations=\{(\[.*?\])\}/.exec(body);
      const list: { path: string; method: string }[] = ops ? JSON.parse(ops[1]) : [];
      const about = front._openapi.structuredData?.contents?.[0]?.content;
      description ??= about ?? "";
      body = [
        ...list.map((o) => `\`${o.method.toUpperCase()} /api/v1${o.path}\``),
        `The full request and response schemas are in the OpenAPI spec: ${SITE}/openapi.json`,
      ]
        .filter(Boolean)
        .join("\n\n");
    }
    return {
      title,
      description,
      slug,
      path: slug ? `/docs/${slug}` : "/docs",
      markdown: `# ${title}\n\n${description}\n\n${toMarkdown(body)}\n`,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const paths = [
  "/",
  "/templates",
  "/pricing",
  "/architecture",
  "/sponsors",
  ...templates.map((t: { id: string }) => `/templates/${t.id}`),
  ...COMPETITORS.map((c) => `/vs/${c.slug}`),
  ...docs.map((d) => d.path),
];

writeFileSync(
  join(root, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url>\n    <loc>${SITE}${p}</loc>\n  </url>`).join("\n")}
</urlset>
`,
);

writeFileSync(
  join(root, "public/llms.txt"),
  `# Pyo

> The open-source, self-hosted PaaS alternative to Vercel, Netlify, Railway, Render and Fly.io.

## Docs

${docs.map((d) => `- [${d.title}](${SITE}/md/${d.slug || "index"}.md): ${d.description}`).join("\n")}

## Templates

- [All templates](${SITE}/templates)

## Full text

- [All docs as one file](${SITE}/llms-full.txt)
`,
);

// The OpenAPI spec the API reference is built from, for tools and assistants.
const spec = join(root, "content/openapi/pyo.json");
if (existsSync(spec)) copyFileSync(spec, join(root, "public/openapi.json"));

writeFileSync(
  join(root, "public/llms-full.txt"),
  docs.map((d) => d.markdown).join("\n---\n\n"),
);

const md = join(root, "public/md");
rmSync(md, { recursive: true, force: true });
for (const d of docs) {
  const file = join(md, `${d.slug || "index"}.md`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, d.markdown);
}

console.log(`${paths.length} URLs, ${docs.length} docs pages`);

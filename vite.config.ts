import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { existsSync, watch } from "node:fs";
import { dirname } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { docsSource, docsTarget, specSource, syncDocs } from "./scripts/docs-sync.ts";

/**
 * Dev only. Follows pyo-docs, and answers any docs change with a clean reload:
 * hot updates can't recover from a save that didn't compile, which left a blank
 * page until the server restarted.
 */
function docsDev(): Plugin {
  return {
    name: "pyo-docs-dev",
    apply: "serve",
    configureServer(server) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let syncing: ReturnType<typeof setTimeout> | undefined;
      const reload = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          for (const env of Object.values(server.environments))
            env.moduleGraph.invalidateAll();
          server.ws.send({ type: "full-reload" });
        }, 150);
      };
      // While a page fails on the server, keep trying it, so it comes back on
      // its own when the file is fixed, instead of sitting on a raw error.
      server.middlewares.use((req, res, next) => {
        if (!req.headers.accept?.includes("text/html")) return next();
        const writeHead = res.writeHead.bind(res) as (s: number, h?: object) => void;
        const write = res.write.bind(res) as (...a: unknown[]) => boolean;
        const end = res.end.bind(res) as (...a: unknown[]) => typeof res;
        let failed = false;
        res.writeHead = ((status: number, ...rest: [object?]) => {
          failed = status >= 500;
          if (!failed) writeHead(status, ...rest);
          return res;
        }) as typeof res.writeHead;
        res.write = ((...args: unknown[]) =>
          failed ? true : write(...args)) as typeof res.write;
        res.end = ((...args: unknown[]) => {
          if (!failed) return end(...args);
          writeHead(500, { "content-type": "text/html" });
          return end(
            `<!doctype html><title>Docs error</title><pre style="padding:24px;font:14px monospace">This page failed to build: check the terminal.\nFix the file and it reloads.</pre><script>setTimeout(() => location.reload(), 1500)</script>`,
          );
        }) as typeof res.end;
        next();
      });
      // Outside the project, so Vite's own watcher doesn't see them: the docs,
      // and the OpenAPI spec the API reference is built from.
      for (const dir of [docsSource, dirname(specSource)]) {
        if (!existsSync(dir)) continue;
        const watcher = watch(dir, { recursive: true }, () => {
          clearTimeout(syncing);
          syncing = setTimeout(() => {
            syncDocs().then(
              (changed) => changed && reload(),
              (e) => console.error("[docs] sync failed:", e),
            );
          }, 100);
        });
        server.httpServer?.once("close", () => watcher.close());
      }
      server.watcher.on("all", (_event, file) => {
        if (file.startsWith(docsTarget)) reload();
      });
    },
  };
}

// Every page is prerendered, so the site deploys as static files (dist/client).
export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    docsDev(),
    fumadocsMdx(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true },
      // Nothing links to this one: DocsSearch fetches it.
      pages: [{ path: "/docs-search.json" }],
    }),
    viteReact(),
  ],
});

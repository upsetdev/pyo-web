import { createFileRoute } from "@tanstack/react-router";
import { createFromSource } from "fumadocs-core/search/server";
import { source } from "~/lib/source";

const search = createFromSource(source);

// Prerendered to a file: the index DocsSearch loads in the browser.
export const Route = createFileRoute("/docs-search.json")({
  server: { handlers: { GET: async () => search.staticGET() } },
});

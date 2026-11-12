import { createElement, Fragment } from "react";
import { type LoaderPlugin, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { docsIcon } from "./docs-icons";

// content/docs is copied from pyo-docs by `bun run sync-docs`, which also
// generates the API reference from pyo-docs/openapi/pyo.json.
export const docs = defineDocs({
  dir: "content/docs",
  docs: { async: true },
});

/** API reference pages show their HTTP method beside their name. */
const methodBadges: LoaderPlugin = {
  name: "pyo:method-badges",
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      if (!file || file.format !== "page") return node;
      const method = (file.data as { _openapi?: { method?: string } })._openapi
        ?.method;
      if (!method) return node;
      node.name = createElement(
        Fragment,
        null,
        node.name,
        createElement(
          "span",
          { "data-method": method.toLowerCase(), className: "api-method ms-auto" },
          method,
        ),
      );
      return node;
    },
  },
};

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon: (name) => docsIcon(name),
  plugins: [methodBadges],
});

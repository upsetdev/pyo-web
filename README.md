# pyo-web

The marketing site for [Pyo](https://github.com/upsetdev/pyo), built with
TanStack Start and the dashboard's design tokens.

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # prerendered static site in dist/client
```

## Templates

`src/data/templates.json` comes from
[pyo-templates](https://github.com/upsetdev/pyo-templates), next to this repo.
Run `bun run build` there, then `bun run sync-templates` here. `bun run build`
here writes `public/sitemap.xml` from it and the docs.

## Docs

`/docs` renders [pyo-docs](https://github.com/upsetdev/pyo-docs), next to this
repo, with Fumadocs. `bun run dev` and `bun run build` copy it into
`content/docs`, which isn't committed, and the dev server follows your edits. Set `PYO_DOCS_DIR` if it's elsewhere.
The site is static, so docs pages and the search index are written out at build
time, and search runs in the browser.

## Screenshots

`public/screens` holds the dashboard's main pages in both themes, using the
made-up data in `scripts/screenshots/fixtures.mjs`. To retake them, start the
dashboard from the `pyo` repo, then capture:

```bash
PYO_API_URL=http://127.0.0.1:9 bunx vite dev --port 8090   # in ../pyo/dash
bun run screenshots                                        # here
```

Every API request is answered in the browser, so nothing reaches a real Pyo.
Set `CHROME_PATH` if your Chromium is somewhere else. The script needs Python
with Pillow.

## License

The code and content are under the [Apache License 2.0](./LICENSE).

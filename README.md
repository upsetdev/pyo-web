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
Run `bun run build` there, then `bun run build` or `bun run sync-templates`
here. Set `PYO_TEMPLATES_DIR` if it's elsewhere. Without pyo-templates the
committed `templates.json` stays as it is.
In CI (`CI` or `WORKERS_CI` set), with no pyo-templates next to the repo, the
build clones and builds pyo-templates' `main` instead. `PYO_TEMPLATES_CLONE=1`
does that anywhere, and `PYO_TEMPLATES_REF` picks another branch or tag.
`bun run build` also writes `public/sitemap.xml` from it and the docs.

## Docs

`/docs` renders [pyo-docs](https://github.com/upsetdev/pyo-docs), next to this
repo, with Fumadocs. `bun run dev` and `bun run build` copy it into
`content/docs`, which isn't committed, and the dev server follows your edits. Set `PYO_DOCS_DIR` if it's elsewhere.
In CI (`CI` or `WORKERS_CI` set), with no pyo-docs next to the repo, the build
clones pyo-docs' `main` instead. `PYO_DOCS_CLONE=1` does that anywhere, and
`PYO_DOCS_REF` picks another branch or tag.
The site is static, so docs pages and the search index are written out at build
time, and search runs in the browser.

## Install scripts

pyo.dev serves Pyo's install scripts (`install.sh`, `cli.sh`, `connect.sh`,
`join.sh`, `sandbox.sh`) byte for byte as Pyo's releases publish them:

- `pyo.dev/<script>`: the latest release's, revalidated on every fetch
- `pyo.dev/v/<version>/<script>`: each release's from 0.4.0 on, cached for good

They never come from this repo. The last step of `bun run build`
(`scripts/release-scripts/publish.ts`) downloads each release's
`release.json` and its Sigstore bundle, checks the signature is Pyo's
release workflow at that release's tag in upsetdev/pyo, then checks each
script against the SHA-256 that `release.json` lists, and writes them to
`dist/client` with their `_headers`. Anything that doesn't check out fails
the build, so nothing is deployed. So does a script, `v/`, `_headers` or
`_redirects` in `public/`. The build needs GitHub and Sigstore's TUF
repository to be reachable.

Releases up to 0.4.2 list no sums in their `release.json`. Theirs are in
`scripts/release-scripts/legacy.json`, which `snapshot.ts` there wrote once
after checking each script against the source at the commit the signed
`release.json` names. The build uses those sums only with that same signed
commit.

`bun run test` runs the checks' tests, offline.

## Deploy

Cloudflare's Workers Builds builds and deploys the site on every push to
`main`, with `bun run build` and the assets in `dist/client` (`wrangler.jsonc`).
A push to pyo-docs' `main`, a template change on pyo-templates' `main`, or a
Pyo release starts a build too, through a Workers Builds deploy hook saved in
each of those repos as the secret `PYO_WEB_DEPLOY_HOOK`.

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

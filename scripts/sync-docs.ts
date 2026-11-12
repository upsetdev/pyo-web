// bun run sync-docs: see docs-sync.ts.
import { existsSync } from "node:fs";
import { docsSource, docsTarget, syncDocs } from "./docs-sync";

if (!existsSync(docsSource)) {
  if (existsSync(docsTarget)) {
    console.log(`No ${docsSource}: keeping content/docs as it is`);
    process.exit(0);
  }
  console.error(
    `No docs at ${docsSource}. Clone pyo-docs next to this repo, or set PYO_DOCS_DIR.`,
  );
  process.exit(1);
}
console.log(`${await syncDocs()} docs files changed`);

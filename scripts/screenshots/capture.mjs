// Screenshots the Pyo dashboard with made-up data, in both themes, for the
// site. Every /api request is answered here, in the browser, so nothing reaches
// a real Pyo.
//
// In the pyo repo:   PYO_API_URL=http://127.0.0.1:9 bunx vite dev --port 8090
// Here:              bun run screenshots
import { homedir } from "node:os";
import { chromium } from "playwright-core";
import {
  analytics,
  analyticsFor,
  appLogs,
  databaseAnalytics,
  databaseExtensions,
  databaseLogs,
  meta,
  metrics,
  state,
  traffic,
  user,
} from "./fixtures.mjs";

const BASE = process.env.DASHBOARD_URL ?? "http://localhost:8090";
const CHROME =
  process.env.CHROME_PATH ??
  `${homedir()}/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`;
const OUT = process.env.OUT_DIR
  ? `${process.env.OUT_DIR.replace(/\/$/, "")}/`
  : new URL("../../.screens-raw/", import.meta.url).pathname;

// The page keeps a 10px scrollbar gutter on the right; it's cropped off.
const WIDTH = 1440;
const HEIGHT = Number(process.env.HEIGHT ?? 900);
const CLIP = { x: 0, y: 0, width: WIDTH - 10, height: HEIGHT };

const PAGES = {
  overview: "/acme",
  deployments: "/acme/prj_storefront/deployments",
  analytics: "/acme/observability/analytics",
  clusters: "/acme/clusters",
  templates: "/acme/templates",
  database: "/acme/postgres/db_shop",
};
// Not on the site; captured only when named (`node capture.mjs servers`).
const EXTRA = {
  servers: "/acme/clusters/production/servers",
  service: "/acme/prj_storefront/svc_storefront_web",
};

const only = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const unknown = new Set();

for (const theme of process.env.THEMES ? process.env.THEMES.split(",") : ["dark", "light"]) {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  // Each page starts fresh (no remembered open sidebar groups), in the theme.
  await context.addInitScript((t) => {
    localStorage.clear();
    localStorage.setItem("theme", t);
  }, theme);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));

  await page.route("**/api/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    const json = (body) => route.fulfill({ json: body });
    if (path === "/api/auth/me") return json(user);
    if (path === "/api/v1/state") return json(state);
    if (path === "/api/v1/observability") return json(analyticsFor(new URL(route.request().url()).searchParams));
    if (path === "/api/v1/meta") return json(meta);
    if (path === "/api/v1/metrics") return json(metrics);
    if (path === "/api/v1/database-extensions") return json(databaseExtensions);
    const svcTraffic = path.match(/^\/api\/v1\/services\/([^/]+)\/traffic$/);
    if (svcTraffic) {
      const body = traffic(decodeURIComponent(svcTraffic[1]));
      return body ? json(body) : route.fulfill({ status: 404, json: { error: "not found" } });
    }
    const dbPage = path.match(/^\/api\/v1\/databases\/([^/]+)\/(analytics|logs)$/);
    if (dbPage) {
      const [, id, what] = dbPage;
      const range = new URL(route.request().url()).searchParams.get("range") ?? "24h";
      return json(what === "analytics" ? databaseAnalytics(decodeURIComponent(id), range) : databaseLogs(decodeURIComponent(id)));
    }
    // The fictional sites can't be framed.
    if (/^\/api\/v1\/services\/[^/]+\/preview$/.test(path)) return json({ frameable: false, reason: "unreachable" });
    if (path.endsWith("/logs")) return json(appLogs);
    unknown.add(path);
    return json({});
  });

  for (const [name, path] of Object.entries({ ...PAGES, ...EXTRA })) {
    if (only.length ? !only.includes(name) : !(name in PAGES)) continue;
    errors.length = 0;
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 90_000 });
    await page.locator("#boot").waitFor({ state: "hidden", timeout: 90_000 }).catch(() => {});
    await page.locator("main h1, h1").first().waitFor({ timeout: 90_000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2500);
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${OUT}${process.env.PREFIX ?? ""}${name}-${theme}.png`, clip: CLIP });
    console.log(theme, name, errors.length ? errors : "ok");
  }
  await context.close();
}

console.log("unmocked:", [...unknown]);
await browser.close();

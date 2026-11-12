// Made-up data for the dashboard screenshots: the fictional team "Acme".

const now = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const TEAM = "team_acme";

// Repeatable noise, so a re-run gives the same charts.
let seed = 42;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

export const user = {
  id: "usr_maya",
  name: "Maya Lindqvist",
  email: "maya@acme.example",
  timezone: "UTC",
  isAdmin: true,
};

const team = {
  id: TEAM,
  name: "Acme",
  slug: "acme",
  description: "",
  createdAt: now - 200 * DAY,
  defaultClusterId: "cl_prod",
  preferences: { requireDeployApproval: false, autoDeployOnPush: true, retainDeployments: 20 },
};

const capabilities = {
  ingressController: "envoy",
  loadBalancer: "servicelb",
  loadBalancerIPs: ["203.0.113.10"],
  certManager: true,
  metricsServer: true,
  storageClasses: [
    {
      name: "local-path",
      provisioner: "rancher.io/local-path",
      isDefault: true,
      replicated: false,
      reclaimPolicy: "Delete",
      volumeBindingMode: "WaitForFirstConsumer",
    },
  ],
};

const cluster = (id, name, location, description) => ({
  id,
  teamId: TEAM,
  name,
  description,
  distribution: "k3s",
  version: "v1.36.5+k3s1",
  status: "connected",
  location,
  trafficMode: "region",
  publicTraffic: true,
  connection: { method: "agent", apiEndpoint: "https://10.0.0.1:6443", agentVersion: "1.4.0" },
  capabilities,
  podCidr: "10.42.0.0/16",
  serviceCidr: "10.43.0.0/16",
  createdAt: now - 180 * DAY,
  lastSeenAt: now - 2000,
});

const clusters = [
  cluster("cl_prod", "production", "Frankfurt, DE", "Customer-facing services"),
  cluster("cl_stag", "staging", "Helsinki, FI", "Previews and testing"),
];

const server = (clusterId, name, location, publicIp, cpu, memoryGi, used, control) => ({
  id: `srv_${name}`,
  clusterId,
  name,
  location,
  locationSource: "manual",
  roles: control ? ["control-plane", "worker"] : ["worker"],
  status: "ready",
  schedulable: true,
  maintenance: false,
  kubeletVersion: "v1.36.5+k3s1",
  osImage: "Ubuntu 26.04 LTS",
  arch: "amd64",
  containerRuntime: "containerd://2.3.4",
  internalIP: `10.0.0.${publicIp.split(".").pop()}`,
  publicIp,
  publicIpv4: publicIp,
  capacity: { cpu, memoryGi, pods: 110 },
  usage: { cpu: cpu * used, memoryGi: memoryGi * used },
  podCount: 14,
  conditions: [{ type: "Ready", status: "True", message: "kubelet is ready" }],
  createdAt: now - 170 * DAY,
  tags: [],
});

const servers = [
  server("cl_prod", "fra-1", "Frankfurt, DE", "203.0.113.10", 8, 32, 0.34, true),
  server("cl_prod", "nyc-1", "New York, US", "203.0.113.20", 8, 32, 0.28),
  server("cl_prod", "sgp-1", "Singapore, SG", "203.0.113.30", 4, 16, 0.22),
  server("cl_stag", "hel-1", "Helsinki, FI", "198.51.100.10", 4, 8, 0.31, true),
];

const project = (id, name, ago) => ({
  id,
  teamId: TEAM,
  name,
  namespace: id.replace("prj_", ""),
  description: "",
  networkIsolation: true,
  createdAt: now - 150 * DAY,
  updatedAt: now - ago,
});

const projects = [
  project("prj_storefront", "Storefront", 12 * MIN),
  project("prj_marketing", "Marketing site", 3 * HOUR),
  project("prj_assistant", "AI assistant", 5 * HOUR),
  project("prj_insights", "Insights", DAY),
  project("prj_automation", "Automation", 2 * DAY),
  project("prj_docs", "Docs", 3 * DAY),
  project("prj_monitoring", "Monitoring", 6 * DAY),
];

const git = (repo, language) => ({
  type: "git",
  repoUrl: `https://github.com/acme/${repo}`,
  branch: "main",
  commit: "",
  builder: "railpack",
  buildpackLanguage: language,
  dockerfilePath: "Dockerfile",
  buildContext: ".",
  buildArgs: [],
  private: true,
  webhook: "active",
  autoDeploy: true,
});
const tpl = (templateId, image, reference) => ({ type: "template", templateId, image, reference });

const domain = (hostname) => ({
  id: `dom_${hostname}`,
  hostname,
  portName: "http",
  status: "active",
  tls: "issued",
  tlsMode: "auto",
  redirectHttps: true,
  createdAt: now - 120 * DAY,
});

// [project, name, kind, source, cluster, servers, domains, deployed ago]
const defs = [
  ["prj_storefront", "web", "application", git("storefront", "Next.js"), "cl_prod", ["fra-1", "nyc-1", "sgp-1"], ["shop.acme.example"], 12 * MIN],
  ["prj_storefront", "api", "application", git("storefront-api", "Go"), "cl_prod", ["fra-1", "nyc-1"], [], 47 * MIN],
  ["prj_storefront", "worker", "application", git("storefront-worker", "Go"), "cl_prod", ["fra-1"], [], 47 * MIN],
  ["prj_marketing", "website", "application", git("website", "Astro"), "cl_prod", ["fra-1", "nyc-1"], ["acme.example"], 3 * HOUR],
  ["prj_assistant", "chat", "application", git("assistant", "Python"), "cl_prod", ["nyc-1"], ["chat.acme.example"], 5 * HOUR],
  ["prj_assistant", "ollama", "service", tpl("ollama", "ollama/ollama", "latest"), "cl_prod", ["nyc-1"], [], 20 * DAY],
  ["prj_insights", "dashboard", "application", git("insights", "React"), "cl_prod", ["sgp-1"], ["insights.acme.example"], DAY],
  ["prj_insights", "clickhouse", "service", tpl("clickhouse", "clickhouse/clickhouse-server", "25.8"), "cl_prod", ["sgp-1"], [], 40 * DAY],
  ["prj_insights", "metabase", "service", tpl("metabase", "metabase/metabase", "latest"), "cl_prod", ["sgp-1"], [], 40 * DAY],
  ["prj_automation", "n8n", "service", tpl("n8n", "n8nio/n8n", "latest"), "cl_stag", ["hel-1"], ["flows.acme.example"], 2 * DAY],
  ["prj_docs", "docs", "application", git("docs", "Vite"), "cl_prod", ["fra-1", "sgp-1"], ["docs.acme.example"], 3 * DAY],
  ["prj_monitoring", "grafana", "service", tpl("grafana", "grafana/grafana", "latest"), "cl_stag", ["hel-1"], ["grafana.acme.example"], 6 * DAY],
  ["prj_monitoring", "prometheus", "service", tpl("prometheus", "prom/prometheus", "latest"), "cl_stag", ["hel-1"], [], 6 * DAY],
];

const resources = { cpuRequest: 250, cpuLimit: 1000, memoryRequest: 256, memoryLimit: 1024 };
const stages = ["queued", "building", "pushing", "applying", "scheduling", "pulling", "starting", "waiting_ready"];
const actors = ["Maya Lindqvist", "Tomas Okafor", "Priya Nair"];

const uid = () => `dpl_${Array.from({ length: 10 }, () => "abcdefghijkmnpqrstuvwxyz23456789"[Math.floor(rnd() * 32)]).join("")}`;
const took = () => (46 + Math.floor(rnd() * 150)) * 1000;

const services = [];
const deployments = [];
defs.forEach(([projectId, name, kind, source, clusterId, on, hostnames, ago], i) => {
  const id = `svc_${projectId.slice(4)}_${name}`;
  const depId = uid();
  const createdAt = now - ago;
  const isGit = source.type === "git";
  const sha = Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
  services.push({
    id,
    teamId: TEAM,
    projectId,
    clusterId,
    name,
    description: "",
    kind,
    workloadKind: kind === "service" ? "StatefulSet" : "Deployment",
    source,
    status: "running",
    currentDeploymentId: depId,
    env: [],
    ports: [{ id: `p_${i}`, name: "http", containerPort: 8080, protocol: "HTTP", exposure: hostnames.length ? "http" : "internal" }],
    domains: hostnames.map(domain),
    resources,
    replicas: on.length,
    healthCheck: { type: "http", path: "/healthz", port: 8080, command: "", initialDelaySeconds: 5, periodSeconds: 10 },
    runtime: {
      readyReplicas: on.length,
      cpuMillis: 120,
      memoryMi: 240,
      restarts: 0,
      since: createdAt,
      replicas: on.map((server, r) => ({ name: `${name}-${r}`, server, ready: true, startedAt: createdAt })),
    },
    pendingChanges: false,
    autoRollback: true,
    createdAt: now - 100 * DAY,
    updatedAt: createdAt,
  });
  deployments.push({
    id: depId,
    teamId: TEAM,
    projectId,
    serviceId: id,
    clusterId,
    source,
    revision: isGit ? sha : source.reference,
    revisionLabel: isGit ? sha.slice(0, 7) : source.reference,
    trigger: isGit ? "git_push" : "manual",
    actor: actors[i % actors.length],
    status: "succeeded",
    stages: stages.map((stage) => ({ stage, startedAt: createdAt, finishedAt: createdAt + 60_000 })),
    stageStartedAt: createdAt,
    createdAt,
    finishedAt: createdAt + took(),
    logs: [],
    events: [],
    config: { replicas: on.length, resources, envKeys: [] },
  });
});
// Older deploys of the Git services, one of them failed and rolled back.
for (const current of deployments.filter((d) => d.source.type === "git").slice(0, 6)) {
  for (let n = 1; n <= 3; n++) {
    const createdAt = current.createdAt - n * (0.7 + rnd()) * DAY;
    const sha = Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
    const failed = n === 2 && current.serviceId.endsWith("_api");
    deployments.push({
      ...current,
      id: uid(),
      revision: sha,
      revisionLabel: sha.slice(0, 7),
      actor: actors[Math.floor(rnd() * actors.length)],
      status: failed ? "failed" : "succeeded",
      autoRolledBack: failed || undefined,
      failure: failed
        ? { stage: "waiting_ready", reason: "HealthCheckFailed", message: "/healthz didn't answer within 60s" }
        : undefined,
      createdAt,
      stageStartedAt: createdAt,
      finishedAt: createdAt + took(),
    });
  }
}
deployments.sort((a, b) => b.createdAt - a.createdAt);

export const state = {
  user,
  teams: [team],
  members: [
    { id: "mem_1", teamId: TEAM, name: user.name, email: user.email, role: "owner", status: "active", joinedAt: now - 200 * DAY },
  ],
  projects,
  clusters,
  servers,
  systemWorkloads: [],
  services,
  deployments,
  volumes: [],
  activity: [],
  builders: [],
  integrations: [],
  agentApiUrl: "https://pyo.acme.example",
  email: null,
  github: null,
  githubInstallations: [],
  deployHooks: [],
  apiTokens: [],
  oauthGrants: [],
  encryption: null,
  controlBackup: null,
  teamBackups: [],
  registryLogins: [],
  observabilitySettings: { ipMode: "none" },
  certificates: [],
  registries: [],
  updates: null,
  originPullCertificates: [],
  firewallRules: [],
  wafRules: [],
  databases: [],
  secretStores: [],
};

// A week of traffic, one point an hour: daily rhythm, slowly growing.
export const series = Array.from({ length: 168 }, (_, i) => {
  const at = now - (167 - i) * HOUR;
  const daily = 0.6 + 0.4 * Math.sin((i / 24) * 2 * Math.PI - 1.6);
  const scale = (0.8 + (0.35 * i) / 168) * daily * (0.9 + 0.2 * rnd());
  const requests = Math.round(4300 * scale);
  return {
    at,
    requests,
    visitors: Math.round(190 * scale),
    bandwidthMb: Math.round(requests * 0.04),
    errors: Math.round(requests * 0.002),
    p50: 38,
    p95: 142,
    p99: 310,
  };
});
const totalRequests = series.reduce((a, p) => a + p.requests, 0);
export const analytics = {
  summary: {
    range: "7d",
    requests: totalRequests,
    estimatedVisitors: 18420,
    bandwidthMb: Math.round(totalRequests * 0.04),
    errorRate: 0.002,
    latency: { p50: 38, p95: 142, p99: 310 },
    statusCodes: [],
    topPaths: [],
    referrers: [],
    countries: [],
    cities: [],
    pages: [],
    pageviews: 96400,
    devices: [],
    browsers: [],
    queryParams: [],
    recentRequests: [],
    ingestion: { status: "healthy", lagSeconds: 1, eventsPerSecond: 14, pipeline: [] },
  },
  series,
  previous: { estimatedVisitors: 15860, pageviews: 81200, errorRate: 0.003 },
};

// A day of server load, every 15 minutes.
const times = Array.from({ length: 96 }, (_, i) => now - (95 - i) * 15 * MIN);
export const metrics = {
  range: "24h",
  stepMs: 15 * MIN,
  times,
  servers: servers.map((n) => {
    const cpuCapacity = n.capacity.cpu;
    const memoryCapacityMi = n.capacity.memoryGi * 1024;
    const wave = (i) => 0.75 + 0.35 * Math.sin((i / 96) * 2 * Math.PI - 1.2);
    return {
      id: n.id,
      name: n.name,
      clusterId: n.clusterId,
      cpu: times.map((_, i) => n.usage.cpu * wave(i) * (0.92 + 0.16 * rnd())),
      memoryMi: times.map((_, i) => n.usage.memoryGi * 1024 * (1.1 + 0.05 * Math.sin(i / 14)) * (0.99 + 0.02 * rnd())),
      cpuCapacity,
      memoryCapacityMi,
      pods: n.podCount,
      restarts: 0,
    };
  }),
  services: [],
};


// ── Richer data for the pages past the overview ───────────────────────────

const log = (at, source, message, level = "info") => ({ id: `log_${at}_${message.length}`, at, level, source, message });
const latest = deployments[0];
const t0 = latest.createdAt;
latest.logs = [
  ["build", "Cloning acme/storefront at main"],
  ["build", "Detected Next.js 16 with bun"],
  ["build", "Installing dependencies"],
  ["build", "1,204 packages installed in 8.4s"],
  ["build", "Running next build"],
  ["build", "Compiled successfully in 21.6s"],
  ["build", "Generated 148 static pages"],
  ["build", "Image size 184 MB"],
  ["push", "Pushed image to the registry"],
  ["rollout", "web: 3 replicas of storefront:" + latest.revisionLabel],
  ["rollout", "web-7c9f5d: scheduled on fra-1"],
  ["rollout", "web-7c9f5d: health check passed on /healthz"],
  ["rollout", "web-2a81be: scheduled on nyc-1"],
  ["rollout", "web-2a81be: health check passed on /healthz"],
  ["rollout", "web-e04d17: scheduled on sgp-1"],
  ["rollout", "web-e04d17: health check passed on /healthz"],
  ["rollout", "web is live: 3 ready"],
].map(([source, message], i) => log(t0 + i * 4000, source, message));

state.activity = deployments.slice(0, 8).map((d, i) => ({
  id: `act_${i}`,
  teamId: TEAM,
  type: "deployment.succeeded",
  at: d.createdAt,
  actor: { name: d.actor, kind: "user" },
  status: "success",
  title: `Deployed ${services.find((a) => a.id === d.serviceId).name}`,
  target: { kind: "deployment", id: d.id, label: d.revisionLabel },
  projectId: d.projectId,
  serviceId: d.serviceId,
  clusterId: d.clusterId,
  details: {},
}));

state.members.push(
  { id: "mem_2", teamId: TEAM, name: "Tomas Okafor", email: "tomas@acme.example", role: "admin", status: "active", joinedAt: now - 150 * DAY },
  { id: "mem_3", teamId: TEAM, name: "Priya Nair", email: "priya@acme.example", role: "developer", status: "active", joinedAt: now - 90 * DAY },
);

state.volumes = services
  .filter((a) => a.kind === "service" && a.name !== "n8n")
  .map((a, i) => ({
    id: `vol_${i}`,
    teamId: TEAM,
    clusterId: a.clusterId,
    projectId: a.projectId,
    serviceId: a.id,
    name: `${a.name}-data`,
    storageClass: "local-path",
    sizeGi: 20,
    usedGi: 4 + i,
    mountPath: "/data",
    accessMode: "ReadWriteOnce",
    status: "bound",
    backup: { status: "enabled", lastAt: now - 6 * HOUR, schedule: "daily" },
    server: a.runtime.replicas[0].server,
    createdAt: now - 60 * DAY,
  }));

for (const a of services) a.runtime.cpuMillis = 60 + Math.round(rnd() * 240);
for (const a of services) a.runtime.memoryMi = 120 + Math.round(rnd() * 500);

state.systemWorkloads = services.map((a, i) => ({
  id: `wl_${i}`,
  clusterId: a.clusterId,
  name: a.name,
  namespace: a.projectId.slice(4),
  kind: a.workloadKind,
  status: "healthy",
  replicas: { desired: a.replicas, ready: a.replicas },
  cpuMillis: a.runtime.cpuMillis,
  memoryMi: a.runtime.memoryMi,
  serviceId: a.id,
  projectId: a.projectId,
  servers: a.runtime.replicas.map((r) => r.server),
  createdAt: a.createdAt,
}));

const v = analytics.summary.estimatedVisitors;
Object.assign(analytics.summary, {
  statusCodes: [
    { code: "2xx", count: Math.round(totalRequests * 0.94) },
    { code: "3xx", count: Math.round(totalRequests * 0.04) },
    { code: "4xx", count: Math.round(totalRequests * 0.018) },
    { code: "5xx", count: Math.round(totalRequests * 0.002) },
  ],
  topPaths: [
    ["/", 92400, 96],
    ["/products", 61300, 128],
    ["/checkout", 18700, 214],
    ["/api/cart", 15200, 64],
    ["/blog", 9800, 88],
  ].map(([path, requests, p95]) => ({ path, requests, p95 })),
  referrers: [
    ["Google", 0.46],
    ["Direct", 0.31],
    ["GitHub", 0.09],
    ["Newsletter", 0.08],
    ["Bing", 0.06],
  ].map(([source, s]) => ({ source, visitors: Math.round(v * s) })),
  countries: [
    ["US", "United States", 0.34],
    ["DE", "Germany", 0.19],
    ["SG", "Singapore", 0.12],
    ["GB", "United Kingdom", 0.1],
    ["ID", "Indonesia", 0.08],
    ["FR", "France", 0.06],
  ].map(([code, name, s]) => ({ code, name, visitors: Math.round(v * s) })),
  cities: [
    ["New York", "US", 0.11],
    ["Berlin", "DE", 0.08],
    ["Singapore", "SG", 0.08],
    ["London", "GB", 0.07],
    ["Jakarta", "ID", 0.05],
  ].map(([city, country, s]) => ({ city, country, visitors: Math.round(v * s) })),
  pages: [
    ["/", 34100, 14200, 41],
    ["/products", 22800, 9100, 58],
    ["/products/desk-lamp", 9400, 5200, 63],
    ["/checkout", 6100, 3300, 94],
    ["/blog/shipping-faster", 4200, 3100, 37],
  ].map(([url, views, visitors, avgMs]) => ({ url, path: url, views, visitors, avgMs })),
  devices: [
    ["Desktop", 0.58],
    ["Mobile", 0.37],
    ["Tablet", 0.05],
  ].map(([label, s]) => ({ label, visitors: Math.round(v * s) })),
  browsers: [
    ["Chrome", 0.56],
    ["Safari", 0.24],
    ["Firefox", 0.11],
    ["Edge", 0.09],
  ].map(([label, s]) => ({ label, visitors: Math.round(v * s) })),
});

metrics.services = services.map((a) => ({
  id: a.id,
  name: a.name,
  clusterId: a.clusterId,
  cpu: times.map(() => (a.runtime.cpuMillis / 1000) * (0.7 + 0.6 * rnd())),
  memoryMi: times.map(() => a.runtime.memoryMi * (0.95 + 0.1 * rnd())),
  cpuCapacity: a.replicas,
  memoryCapacityMi: 1024 * a.replicas,
  pods: a.replicas,
  restarts: 0,
}));

export const appLogs = {
  fetchedAt: now,
  logs: Array.from({ length: 40 }, (_, i) => ({
    at: now - (40 - i) * 9000,
    level: "info",
    source: "web-7c9f5d",
    message: ["GET /products 200 42ms", "GET / 200 18ms", "POST /api/cart 201 63ms", "GET /checkout 200 88ms"][i % 4],
  })),
};


// ── Databases (built in: Postgres, MySQL and KV) ──────────────────────────

const M = "••••••••";
const db = (id, name, engine, version, clusterId, servers, connect, extra = {}) => {
  const ns = "pyo-db-acme";
  const host = `${name}.${ns}.svc.cluster.local`;
  const url =
    engine === "postgres" ? { key: "DATABASE_URL", value: `postgres://app:${M}@${host}:5432/app` }
    : engine === "mysql" ? { key: "DATABASE_URL", value: `mysql://app:${M}@${host}:3306/app` }
    : { key: "REDIS_URL", value: `redis://default:${M}@${host}:6379` };
  return {
    id, teamId: TEAM, clusterId, name, engine, version, size: "small", cpu: "500m", memory: "1Gi",
    storageGi: 20, instances: servers.length, pooler: engine === "postgres", rest: false, deletionProtection: true,
    state: "active",
    status: { phase: "Ready", instances: servers.length, readyInstances: servers.length, primary: `${name}-1`, failovers: 0 },
    backup: engine === "valkey" ? null : { enabled: true, retentionDays: 14, hour: 3 },
    readReplicas: null,
    extensions: engine === "postgres" ? [{ name: "pg_stat_statements", enabled: true, state: "enabled", message: "" }] : null,
    setup: null,
    createdAt: now - 90 * DAY,
    members: servers.map((server, i) => ({ name: `${name}-${i + 1}`, role: i ? "replica" : "primary", ready: true, server })),
    connections: connect.map((serviceId) => ({ serviceId: serviceId, variables: [url.key] })),
    username: engine === "valkey" ? "default" : "app",
    database: engine === "valkey" ? null : "app",
    variables: [url],
    ...extra,
  };
};
// shop-db: the busy one the database screenshots show. High availability
// (a primary and two standbys), PgBouncer, a read replica behind its own
// pooler, point-in-time backups and a few extensions.
const pgHost = (svc) => `${svc}.pyo-db-acme.svc.cluster.local`;
const pgUrl = (svc) => `postgres://app:${M}@${pgHost(svc)}:5432/app`;
const iso = (at) => new Date(at).toISOString();
const lastBase = (() => {
  const t = new Date(now);
  t.setUTCHours(3, 4, 12, 0);
  return t.getTime() > now ? t.getTime() - DAY : t.getTime();
})();
const shopDb = db("db_shop", "shop-db", "postgres", "18", "cl_prod", ["fra-1", "nyc-1", "sgp-1"], ["svc_storefront_web", "svc_storefront_api", "svc_storefront_worker"], {
  size: "xlarge",
  cpu: "2",
  memory: "4Gi",
  cpuMillis: 2000,
  memoryMi: 4096,
  storageGi: 50,
  createdAt: now - 160 * DAY,
  readReplicas: {
    instances: 1,
    ready: 1,
    members: [{ name: "shop-db-read-1", ready: true, server: "sgp-1", lagSeconds: 0.4 }],
    reported: true,
  },
  extensions: ["pg_stat_statements", "vector", "pg_cron", "auto_explain"].map((name) => ({ name, enabled: true, state: "enabled", message: "" })),
  variables: [
    { key: "DATABASE_URL", value: pgUrl("shop-db-pooler") },
    { key: "DATABASE_URL_DIRECT", value: pgUrl("shop-db-rw") },
    { key: "DATABASE_URL_READ", value: pgUrl("shop-db-read-pooler") },
  ],
});
shopDb.connections = shopDb.connections.map((c) => ({
  ...c,
  variables: c.serviceId === "svc_storefront_api" ? ["DATABASE_URL", "DATABASE_URL_READ"] : ["DATABASE_URL"],
}));
Object.assign(shopDb.status, {
  endpoints: {
    primary: `${pgHost("shop-db-rw")}:5432`,
    replicas: `${pgHost("shop-db-ro")}:5432`,
    pooler: `${pgHost("shop-db-pooler")}:5432`,
    read: `${pgHost("shop-db-read-pooler")}:5432`,
  },
  backup: {
    firstRecoverabilityPoint: iso(lastBase - 14 * DAY),
    lastSuccessfulBackup: iso(lastBase),
    lastArchivedWal: iso(now - 38_000),
  },
});

state.databases = [
  shopDb,
  db("db_cache", "cache", "valkey", "9", "cl_prod", ["fra-1", "nyc-1", "sgp-1"], ["svc_storefront_web", "svc_storefront_api"]),
  db("db_orders", "orders", "mysql", "8.4", "cl_prod", ["fra-1", "nyc-1"], ["svc_storefront_api"]),
  db("db_chat", "chat-db", "postgres", "18", "cl_prod", ["nyc-1"], ["svc_assistant_chat"]),
  db("db_flows", "flows-db", "postgres", "18", "cl_stag", ["hel-1"], ["svc_automation_n8n"]),
];

// Backups go to the team's bucket.
state.teamBackups = [
  {
    teamId: TEAM,
    databases: [],
    settings: {
      destination: "s3",
      localAvailable: false,
      enabled: true,
      schedule: "daily",
      hour: 2,
      keep: 14,
      endpoint: "https://s3.eu-central-1.example.com",
      region: "eu-central-1",
      bucket: "acme-backups",
      prefix: "pyo",
      accessKey: "AKIAEXAMPLE",
      hasSecret: true,
      repository: "s3:https://s3.eu-central-1.example.com/acme-backups/pyo",
      mode: "all",
      exceptions: [],
    },
    targets: [],
    history: [],
  },
];

// The Postgres extensions Pyo turns on (a part of its catalog).
export const databaseExtensions = {
  extensions: [
    ["auto_explain", "Logs the plan of every query that takes over a second.", true],
    ["pg_cron", "Runs SQL on a schedule, with cron syntax, inside the database.", true],
    ["pg_hint_plan", "Steers the query planner with hints in SQL comments.", true],
    ["pg_stat_statements", "Tracks planning and execution statistics of every query.", true],
    ["pgaudit", "Writes an audit trail of schema and role changes to the logs.", true],
    ["vector", "Vector similarity search: embeddings and nearest neighbours (pgvector).", false],
    ["bloom", "Index type based on Bloom filters, for many columns at once.", false],
    ["dblink", "Runs queries on other Postgres databases from inside this one.", false],
    ["pg_prewarm", "Loads tables into memory, so the first queries after a restart are fast.", false],
    ["postgres_fdw", "Queries tables on other Postgres servers as if they were local.", false],
  ].map(([name, description, restart]) => ({ name, engine: "postgres", section: "managed", description, docs: "", restart })),
};

// shop-db's figures over a range, the way GET /databases/{id}/analytics
// shapes them: a daily rhythm of a shop's traffic, busiest mid-afternoon UTC.
const STEP = { "1h": 30_000, "24h": 5 * MIN, "7d": HOUR, "30d": 4 * HOUR };
export function databaseAnalytics(id, range) {
  if (id !== "db_shop") return { range, stepMs: STEP[range] ?? 5 * MIN, times: [], engine: "postgres", members: [] };
  const step = STEP[range] ?? 5 * MIN;
  const n = Math.round(({ "1h": HOUR, "24h": DAY, "7d": 7 * DAY, "30d": 30 * DAY }[range] ?? DAY) / step);
  let s3 = 7;
  const r = () => ((s3 = (s3 * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const times = Array.from({ length: n }, (_, i) => Math.floor((now - (n - 1 - i) * step) / step) * step);
  // 0..1 load: low at night, peaking around 15:00 UTC, with a little noise.
  const load = times.map((t) => {
    const h = new Date(t).getUTCHours() + new Date(t).getUTCMinutes() / 60;
    const day = 0.5 - 0.5 * Math.cos(((h - 3) / 24) * 2 * Math.PI);
    return Math.min(1, Math.max(0, 0.25 + 0.75 * day ** 1.3 + (r() - 0.5) * 0.08));
  });
  const ser = (f) => load.map((l, i) => Math.round(f(l, i) * 100) / 100);
  const span = times[n - 1] - times[0];
  const grow = (at0, perDay) => times.map((t) => at0 + (perDay * (t - times[0])) / DAY);
  const sizeGi = grow(18.4 - (0.32 * span) / DAY, 0.32);
  const member = (name, component, role, server, f) => ({
    name,
    component,
    role,
    server,
    cpu: ser((l) => f.cpu[0] + f.cpu[1] * l * (0.9 + 0.2 * r())),
    memoryMi: ser((l) => f.mem[0] + f.mem[1] * l * (0.97 + 0.06 * r())),
    diskUsedGi: f.disk ? sizeGi.map((g) => Math.round((g + f.disk) * 100) / 100) : null,
    diskCapacityGi: f.disk ? 50 : null,
    connections: null,
    lagSeconds: f.lag ? load.map((l) => Math.round(f.lag * (0.3 + l) * (0.5 + r()) * 1000) / 1000) : null,
  });
  return {
    range,
    stepMs: step,
    times,
    engine: "postgres",
    members: [
      member("shop-db-1", "instance", "primary", "fra-1", { cpu: [0.18, 0.95], mem: [2600, 520], disk: 2.6 }),
      member("shop-db-2", "instance", "replica", "nyc-1", { cpu: [0.08, 0.16], mem: [2350, 180], disk: 2.4, lag: 0.25 }),
      member("shop-db-3", "instance", "replica", "sgp-1", { cpu: [0.08, 0.17], mem: [2340, 190], disk: 2.4, lag: 0.3 }),
      member("shop-db-read-1", "read", "replica", "sgp-1", { cpu: [0.1, 0.55], mem: [2420, 380], disk: 2.4, lag: 0.45 }),
      member("shop-db-pooler-6d8f7b9c4-2kx9q", "pooler", "", "fra-1", { cpu: [0.01, 0.05], mem: [18, 6] }),
      member("shop-db-pooler-6d8f7b9c4-h7tnz", "pooler", "", "nyc-1", { cpu: [0.01, 0.04], mem: [17, 6] }),
      member("shop-db-pooler-6d8f7b9c4-wq4lm", "pooler", "", "sgp-1", { cpu: [0.01, 0.03], mem: [17, 5] }),
      member("shop-db-read-pooler-5c7d9f8b6-p3rvd", "read-pooler", "", "sgp-1", { cpu: [0.01, 0.03], mem: [16, 5] }),
    ],
    transactions: ser((l) => 140 + 1180 * l * (0.92 + 0.16 * r())),
    queries: null,
    poolerQueries: ser((l) => 520 + 4300 * l * (0.92 + 0.16 * r())),
    commands: null,
    connections: {
      primary: ser((l) => Math.round(24 + 38 * l + 4 * r())),
      replicas: ser((l) => Math.round(8 + 22 * l + 3 * r())),
      limit: 200,
      poolerActive: ser((l) => Math.round(90 + 520 * l * (0.9 + 0.2 * r()))),
      poolerWaiting: ser((l) => (l > 0.85 && r() > 0.6 ? 1 : 0)),
      poolerServersActive: ser((l) => Math.round(14 + 34 * l + 3 * r())),
      poolerServersIdle: ser((l) => Math.round(20 - 10 * l)),
      poolerMaxWaitSeconds: ser((l) => (l > 0.85 ? 0.02 * r() : 0)),
    },
    cacheHitRatio: load.map((l) => Math.round((0.9975 - 0.004 * l - 0.001 * r()) * 10000) / 10000),
    keyHitRatio: null,
    evictions: null,
    routing: { replica: null, primary: null, fallbacks: null },
    storage: { sizeBytes: sizeGi.map((g) => Math.round(g * 1024 ** 3)), memoryUsedBytes: null, maxmemoryBytes: null, keys: null },
  };
}

// shop-db's recent log lines and events.
export function databaseLogs(id) {
  if (id !== "db_shop") return { logs: [], events: [], fetchedAt: now };
  const lines = [
    ["shop-db-1", "primary", "info", "checkpoint starting: time"],
    ["shop-db-1", "primary", "info", "checkpoint complete: wrote 4127 buffers (3.1%); write=269.8 s, sync=0.012 s, total=269.9 s"],
    ["shop-db-pooler-6d8f7b9c4-2kx9q", "pooler", "info", "stats: 1214 xacts/s, 4380 queries/s, 61 client connections"],
    ["shop-db-1", "primary", "info", "archived write-ahead log file \"0000000400000A1C000000B7\""],
    ["shop-db-2", "replica", "info", "restartpoint complete: wrote 3902 buffers (2.9%)"],
    ["shop-db-read-1", "read", "info", "recovery restart point at A1C/B6F2D1E8"],
    ["shop-db-1", "primary", "info", "automatic vacuum of table \"app.public.order_items\": index scans: 1"],
    ["shop-db-1", "primary", "info", "archived write-ahead log file \"0000000400000A1C000000B8\""],
  ];
  return {
    fetchedAt: now,
    logs: Array.from({ length: 32 }, (_, i) => {
      const [source, role, level, message] = lines[i % lines.length];
      return { at: now - (32 - i) * 11_000, level, source, role, message };
    }),
    events: [
      { at: lastBase + 4 * MIN, type: "Normal", reason: "BackupSucceeded", source: "cluster", object: "shop-db", message: "Base backup completed" },
      { at: now - 2 * DAY, type: "Normal", reason: "ExtensionsChanged", source: "team", message: "Maya Lindqvist turned on auto_explain" },
    ],
  };
}

// How requests reach a service, the way GET /services/{id}/traffic shapes it:
// every server of its cluster takes public traffic and sends it to replicas
// in its own region (a region is a server's location here).
export function traffic(serviceId) {
  const svc = services.find((a) => a.id === serviceId);
  if (!svc) return null;
  // Its own noise, so each poll answers the same.
  let s4 = 11;
  const r = () => ((s4 = (s4 * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const cluster = clusters.find((c) => c.id === svc.clusterId);
  const on = servers.filter((n) => n.clusterId === svc.clusterId);
  const replicas = svc.runtime.replicas.map((r) => ({ name: r.name, server: r.server, ready: r.ready }));
  const regionOf = (name) => on.find((n) => n.name === name)?.location ?? "";
  // The domains point at the servers that run a replica.
  const pointed = new Set(replicas.map((r) => r.server));
  const regions = [...new Set(on.map((n) => n.location))].sort().map((name) => {
    const here = replicas.filter((r) => regionOf(r.server) === name);
    const series = Array.from({ length: 24 }, (_, i) => (here.length ? Math.round(900 * here.length * (0.6 + 0.4 * Math.sin((i / 24) * 2 * Math.PI - 1.6)) * (0.9 + 0.2 * r())) : 0));
    const requests = series.reduce((a, b) => a + b, 0);
    return {
      name,
      servers: on
        .filter((n) => n.location === name)
        .map((n) => ({
          name: n.name,
          ips: [n.internalIP, n.publicIp],
          ipv4: n.publicIp,
          ipv6: null,
          ready: true,
          publicTraffic: true,
          pointedBy: pointed.has(n.name) ? svc.domains.map((d) => d.hostname) : [],
          sendsTo: here.length
            ? { how: "region", replicas: here.map((r) => r.name) }
            : { how: "anywhere", replicas: replicas.map((r) => r.name) },
          stats: here.length ? { requests, errors: Math.round(requests * 0.002), p95Ms: 120 + Math.round(r() * 60) } : null,
        })),
      replicas: here,
      stats: here.length ? { requests, errors: Math.round(requests * 0.002), avgMs: 38 + Math.round(r() * 20), p95Ms: 140 + Math.round(r() * 60) } : null,
      series,
    };
  });
  return {
    cluster: cluster.name,
    mode: cluster.trafficMode,
    domains: svc.domains.map((d) => ({
      hostname: d.hostname,
      addresses: on.filter((n) => pointed.has(n.name)).map((n) => n.publicIp),
      error: null,
    })),
    regions,
    warnings: [],
    statsAvailable: true,
    statsHours: 24,
    inRegionRouting: true,
  };
}

export const meta = { version: "1.0.0", features: [], publicUrl: "https://pyo.acme.example" };

// One project's last 24 hours: its own size and its own wobble.
export function analyticsFor(params) {
  if (params.get("project") === "all" || params.get("range") !== "24h") return analytics;
  const key = params.get("project") ?? "";
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  let s2 = h || 1;
  const r = () => ((s2 = (s2 * 1664525 + 1013904223) % 4294967296) / 4294967296);
  // [size, peak hour, second bump, noise]
  const profile = {
    prj_storefront: [1.6, 15, 0.25, 0.25],
    prj_marketing: [1.0, 11, 0.0, 0.5],
    prj_assistant: [0.7, 20, 0.35, 0.35],
    prj_insights: [0.5, 9, 0.5, 0.2],
    prj_automation: [0.35, 3, 0.0, 0.6],
    prj_docs: [0.6, 14, 0.2, 0.45],
    prj_monitoring: [0.3, 18, 0.4, 0.3],
  }[key] ?? [0.5, 12, 0.2, 0.4];
  const [scale, peak, bump, noise] = profile;
  const pts = Array.from({ length: 24 }, (_, i) => {
    const t = ((i - peak) / 24) * 2 * Math.PI;
    const daily = 0.5 + 0.4 * Math.cos(t) + bump * Math.max(0, Math.cos(2 * t + 1));
    const requests = Math.round(4000 * scale * daily * (1 - noise / 2 + noise * r()));
    return { ...series[144 + i], requests, visitors: Math.round(requests / 22) };
  });
  return { ...analytics, series: pts, summary: { ...analytics.summary, requests: pts.reduce((a, p) => a + p.requests, 0) } };
}

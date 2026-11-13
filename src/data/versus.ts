// Comparison pages, one per competitor. Everything about them comes from their
// own docs, checked on the date below, and everything about Pyo from its code.
// A row only says they lack something if their docs bear that out.

export const CHECKED = "November 9, 2026";

export type Status = "yes" | "partly" | "no";
/** A status, and what it means here. */
export type Cell = [Status, string];
export type Row = { topic: string; pyo: Cell; them: Cell };

export type Competitor = {
  slug: string;
  name: string;
  /** A trademark notice the owner asks for wherever its logo appears. */
  trademark?: string;
  seoDescription: string;
  subtitle: string;
  /** Pyo imports projects from this platform (see /docs/import-platforms). */
  imports?: boolean;
  groups: { group: string; rows: Row[] }[];
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "coolify",
    name: "Coolify",
    seoDescription: "Autoscaling, clusters and self-healing on your own servers. Compare Pyo and Coolify, feature by feature.",
    subtitle: "Autoscaling, clusters and self-healing on your own servers, all from one dashboard. Here's how Pyo compares, feature by feature.",
    imports: true,
    groups: [
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Yes"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Docker Compose", pyo: ["yes", "Dashboard, API or pyo deploy -f"], them: ["yes", "Yes"] },
          { topic: "Zero-config builds", pyo: ["yes", "Detects your framework"], them: ["yes", "Yes"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["partly", "Rolling updates, not for Compose"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "To images still on the server"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["yes", "Keeps the running container"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "Yes"] },
          { topic: "Deploy hooks", pyo: ["yes", "A secret URL for CI"], them: ["yes", "Yes"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "Yes"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["no", "No"] },
          { topic: "Replicas across servers", pyo: ["yes", "Up to 50, from the dashboard"], them: ["partly", "Swarm, or your own load balancer"] },
          { topic: "Databases that fail over", pyo: ["yes", "Postgres, MySQL and KV, with replicas on other servers"], them: ["no", "One container each. Replication is up to you"] },
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["partly", "Only with Swarm, which is deprecated"] },
          { topic: "Clusters", pyo: ["yes", "Built in from the start"], them: ["partly", "Swarm, deprecated and due to be removed"] },
          { topic: "Multiple servers", pyo: ["yes", "Joined over Tailscale"], them: ["yes", "Connected over SSH"] },
          { topic: "CPU and memory limits", pyo: ["yes", "For every service"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["no", "Not built in"] },
          { topic: "Firewall by IP, range or country", pyo: ["yes", "Per service"], them: ["partly", "IP allow lists, as Traefik middleware"] },
          { topic: "Rate limits", pyo: ["yes", "Per visitor, for websites"], them: ["partly", "As Traefik middleware"] },
          { topic: "TCP and UDP ports", pyo: ["yes", "Through Pyo Gateway, or from your servers"], them: ["yes", "Published from the server"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "No script to add"], them: ["yes", "Yes"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["yes", "Servers and containers"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Yes"] },
          { topic: "Network isolation", pyo: ["yes", "Between projects"], them: ["partly", "Docker networks"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["partly", "Vault, Infisical and Doppler"] },
          { topic: "Team roles", pyo: ["yes", "Owner, admin, developer and viewer"], them: ["yes", "Owner, admin and member"] },
          { topic: "Scoped API keys", pyo: ["yes", "Read, deploy or full, per team"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Data",
        rows: [
          { topic: "Persistent volumes", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Scheduled backups", pyo: ["yes", "Volumes and databases. Volumes are encrypted and restore in one click"], them: ["yes", "Volumes and databases"] },
          { topic: "Your own S3 bucket", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
        ],
      },
    ],
  },
  {
    slug: "dokploy",
    name: "Dokploy",
    seoDescription: "Autoscaling, self-healing replicas and scheduled backups on your own servers. Compare Pyo and Dokploy, feature by feature.",
    subtitle: "Autoscaling, self-healing replicas and scheduled backups on your own servers, all from one dashboard. Here's how Pyo compares, feature by feature.",
    imports: true,
    groups: [
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Yes"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Docker Compose", pyo: ["yes", "Dashboard, API or pyo deploy -f"], them: ["yes", "Yes"] },
          { topic: "Zero-config builds", pyo: ["yes", "Detects your framework"], them: ["yes", "Nixpacks or buildpacks"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["partly", "Once you add a health check"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "Needs a Docker registry"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["partly", "Set up in Swarm settings"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "In Swarm settings"] },
          { topic: "Deploy hooks", pyo: ["yes", "A secret URL for CI"], them: ["yes", "Yes"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "Yes"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["no", "No"] },
          { topic: "Replicas across servers", pyo: ["yes", "Up to 50, from the dashboard"], them: ["partly", "Swarm replicas, set up by hand"] },
          { topic: "Databases that fail over", pyo: ["yes", "Postgres, MySQL and KV, with replicas on other servers"], them: ["no", "One instance each, with no replication"] },
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["partly", "Through Docker Swarm"] },
          { topic: "Clusters", pyo: ["yes", "Built in from the start"], them: ["yes", "Docker Swarm"] },
          { topic: "Multiple servers", pyo: ["yes", "Joined over Tailscale"], them: ["yes", "Connected over SSH"] },
          { topic: "CPU and memory limits", pyo: ["yes", "For every service"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["no", "Not built in"] },
          { topic: "TCP and UDP ports", pyo: ["yes", "Through Pyo Gateway, or from your servers"], them: ["yes", "Published from the server"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "No script to add"], them: ["no", "Not built in"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["yes", "Servers and containers"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Yes"] },
          { topic: "Network isolation", pyo: ["yes", "Between projects"], them: ["partly", "Isolated deployments, for Compose"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["yes", "Vault, OpenBao, Infisical, AWS, Azure, Doppler and Scaleway"] },
          { topic: "Team roles", pyo: ["yes", "Owner, admin, developer and viewer"], them: ["yes", "Owner, admin and member. Custom roles on Enterprise"] },
          { topic: "Scoped API keys", pyo: ["yes", "Read, deploy or full, per team"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Data",
        rows: [
          { topic: "Persistent volumes", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Scheduled backups", pyo: ["yes", "Volumes and databases. Volumes are encrypted and restore in one click"], them: ["yes", "Volumes and databases"] },
          { topic: "Your own S3 bucket", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
        ],
      },
    ],
  },
  {
    slug: "caprover",
    name: "CapRover",
    seoDescription: "Autoscaling, team roles and scheduled backups on your own servers. Compare Pyo and CapRover, feature by feature.",
    subtitle: "Autoscaling, team roles and scheduled backups on your own servers, all from one dashboard. Here's how Pyo compares, feature by feature.",
    groups: [
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Through a webhook"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Zero-config builds", pyo: ["yes", "Detects your framework"], them: ["partly", "A Dockerfile, or a few language templates"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["partly", "Swarm rolling updates, with a health check"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "To saved image versions"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["partly", "Through Swarm update settings"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["partly", "A health check in your Dockerfile"] },
          { topic: "Deploy hooks", pyo: ["yes", "A secret URL for CI"], them: ["yes", "Webhook URL and app tokens"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["no", "Not built in"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "One-click apps"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["no", "No"] },
          { topic: "Replicas across servers", pyo: ["yes", "Up to 50, from the dashboard"], them: ["yes", "Instance count, across Swarm nodes"] },
          { topic: "Databases that fail over", pyo: ["yes", "Postgres, MySQL and KV, with replicas on other servers"], them: ["no", "One-click apps, pinned to one server"] },
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["partly", "Stateless apps, through Docker Swarm"] },
          { topic: "Clusters", pyo: ["yes", "Built in from the start"], them: ["yes", "Docker Swarm"] },
          { topic: "Multiple servers", pyo: ["yes", "Joined over Tailscale"], them: ["yes", "Joined over SSH"] },
          { topic: "CPU and memory limits", pyo: ["yes", "For every service"], them: ["partly", "Through a service override"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["no", "Not built in"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "No script to add"], them: ["yes", "GoAccess reports from NGINX logs"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["partly", "Servers, through NetData"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["partly", "From the server's shell"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["partly", "Environment variables"] },
          { topic: "Network isolation", pyo: ["yes", "Between projects"], them: ["partly", "Docker networks"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["no", "Not built in"] },
          { topic: "Team roles", pyo: ["yes", "Owner, admin, developer and viewer"], them: ["no", "A single admin login"] },
          { topic: "Scoped API keys", pyo: ["yes", "Read, deploy or full, per team"], them: ["partly", "Deploy tokens, per app"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["partly", "Community servers"] },
        ],
      },
      {
        group: "Data",
        rows: [
          { topic: "Persistent volumes", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Scheduled backups", pyo: ["yes", "Volumes and databases. Volumes are encrypted and restore in one click"], them: ["no", "Settings by hand. App data not included"] },
          { topic: "Your own S3 bucket", pyo: ["yes", "Yes"], them: ["no", "Not built in"] },
        ],
      },
    ],
  },
  {
    slug: "dokku",
    name: "Dokku",
    seoDescription: "Push-to-deploy with a dashboard, autoscaling and team roles, on your own servers. Compare Pyo and Dokku, feature by feature.",
    subtitle: "Push to deploy, with a dashboard, autoscaling, team roles and scheduled backups on your own servers. Here's how Pyo compares, feature by feature.",
    groups: [
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Git push over SSH"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Zero-config builds", pyo: ["yes", "Detects your framework"], them: ["yes", "Buildpacks or Nixpacks"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["yes", "Yes"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["partly", "Redeploy an earlier image by hand"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["yes", "Failed checks keep the old containers"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "HTTP, command or uptime"] },
          { topic: "Deploy hooks", pyo: ["yes", "A secret URL for CI"], them: ["partly", "Push or run the CLI from CI"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "Yes"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["partly", "Database plugins"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["partly", "With the multi-server scheduler"] },
          { topic: "Replicas across servers", pyo: ["yes", "Up to 50, from the dashboard"], them: ["partly", "With the multi-server scheduler"] },
          { topic: "Databases that fail over", pyo: ["yes", "Postgres, MySQL and KV, with replicas on other servers"], them: ["no", "Through plugins, one container each"] },
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["partly", "With the multi-server scheduler"] },
          { topic: "Clusters", pyo: ["yes", "Built in from the start"], them: ["partly", "With the multi-server scheduler"] },
          { topic: "Multiple servers", pyo: ["yes", "Joined over Tailscale"], them: ["partly", "With the multi-server scheduler"] },
          { topic: "CPU and memory limits", pyo: ["yes", "For every service"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["no", "Not built in"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "No script to add"], them: ["no", "Not built in"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["no", "Not built in"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "From the CLI"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "From the CLI"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["partly", "Environment variables"] },
          { topic: "Network isolation", pyo: ["yes", "Between projects"], them: ["partly", "Docker networks"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["no", "Not built in"] },
          { topic: "Team roles", pyo: ["yes", "Owner, admin, developer and viewer"], them: ["partly", "Per-app access, via a plugin"] },
          { topic: "Scoped API keys", pyo: ["yes", "Read, deploy or full, per team"], them: ["partly", "SSH keys"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["partly", "Commands over SSH"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["partly", "Community servers"] },
        ],
      },
      {
        group: "Data",
        rows: [
          { topic: "Persistent volumes", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Scheduled backups", pyo: ["yes", "Volumes and databases. Volumes are encrypted and restore in one click"], them: ["partly", "Databases, through their plugins"] },
          { topic: "Your own S3 bucket", pyo: ["yes", "Yes"], them: ["partly", "For database backups"] },
        ],
      },
    ],
  },
  {
    slug: "portainer",
    name: "Portainer",
    seoDescription: "Git deploys, autoscaling, rollbacks and backups for your services, on your own servers. Compare Pyo and Portainer, feature by feature.",
    subtitle: "Pyo builds, deploys, scales and backs up your services for you, on your own servers and from one dashboard. Here's how it compares, feature by feature.",
    groups: [
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Stacks from a Git repository"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Zero-config builds", pyo: ["yes", "Detects your framework"], them: ["no", "Needs a Dockerfile or an image"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["partly", "Swarm rolling updates"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["partly", "Swarm services, to the previous version"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["partly", "Through Swarm update settings"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "Docker health checks"] },
          { topic: "Deploy hooks", pyo: ["yes", "A secret URL for CI"], them: ["partly", "Services. Stacks on Business Edition"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["partly", "Edge jobs, for Edge environments"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "App and custom templates"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["no", "Not for Docker or Swarm"] },
          { topic: "Replicas across servers", pyo: ["yes", "Up to 50, from the dashboard"], them: ["partly", "With Docker Swarm"] },
          { topic: "Databases that fail over", pyo: ["yes", "Postgres, MySQL and KV, with replicas on other servers"], them: ["no", "Runs your containers. No built-in databases"] },
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["partly", "With Docker Swarm"] },
          { topic: "Clusters", pyo: ["yes", "Built in from the start"], them: ["partly", "Docker Swarm"] },
          { topic: "Multiple servers", pyo: ["yes", "Joined over Tailscale"], them: ["yes", "Through the Portainer agent"] },
          { topic: "CPU and memory limits", pyo: ["yes", "For every service"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["no", "Not built in"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "No script to add"], them: ["no", "Not built in"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["yes", "Container stats"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "Container console"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["partly", "Swarm secrets"] },
          { topic: "Network isolation", pyo: ["yes", "Between projects"], them: ["partly", "Docker networks"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["no", "Not built in"] },
          { topic: "Team roles", pyo: ["yes", "Owner, admin, developer and viewer"], them: ["partly", "Full roles on Business Edition"] },
          { topic: "Scoped API keys", pyo: ["yes", "Read, deploy or full, per team"], them: ["partly", "Per user, with that user's access"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["partly", "Through the API or Terraform"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Data",
        rows: [
          { topic: "Persistent volumes", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Scheduled backups", pyo: ["yes", "Volumes and databases. Volumes are encrypted and restore in one click"], them: ["partly", "Portainer's settings, on Business Edition"] },
          { topic: "Your own S3 bucket", pyo: ["yes", "Yes"], them: ["partly", "Settings backups, on Business Edition"] },
        ],
      },
    ],
  },
  {
    slug: "openship",
    name: "OpenShip",
    seoDescription: "Autoscaling, a web application firewall and databases that fail over, on your own servers. Compare Pyo and OpenShip, feature by feature.",
    subtitle: "Autoscaling, a web application firewall and databases that fail over on your own servers, all from one dashboard. Here's how Pyo compares, feature by feature.",
    groups: [
      {
        group: "Hosting",
        rows: [
          { topic: "Control plane on your laptop", pyo: ["no", "Runs on your servers"], them: ["yes", "The desktop app drives servers over SSH"] },
          { topic: "Desktop app", pyo: ["no", "A web dashboard"], them: ["yes", "macOS, Windows and Linux"] },
          { topic: "Mail server", pyo: ["no", "Not built in"], them: ["yes", "Sends and receives, with webmail"] },
        ],
      },
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "On every push"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Docker Compose", pyo: ["yes", "Dashboard, API or pyo deploy -f"], them: ["yes", "Yes"] },
          { topic: "Zero-config builds", pyo: ["yes", "Detects your framework"], them: ["yes", "Detects your stack"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["partly", "For containers, not host processes"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "To any healthy earlier version"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["yes", "Keeps the running version"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "Compose-style, per service"] },
          { topic: "Deploy hooks", pyo: ["yes", "A secret URL for CI"], them: ["partly", "Run the CLI from CI with a token"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "With run history and notifications"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "Yes"] },
          { topic: "Adopt running containers", pyo: ["no", "Not built in"], them: ["yes", "From Coolify, Dokploy or Dokku servers"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["no", "Not on your own servers"] },
          { topic: "Replicas across servers", pyo: ["yes", "Up to 50, from the dashboard"], them: ["yes", "Up to 100, on a k3s or Swarm cluster"] },
          { topic: "Databases that fail over", pyo: ["yes", "Postgres, MySQL and KV, with replicas on other servers"], them: ["partly", "Postgres and Redis replicas, on a k3s cluster"] },
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["partly", "On a k3s cluster"] },
          { topic: "Clusters", pyo: ["yes", "Built in from the start"], them: ["yes", "k3s, or an existing Docker Swarm"] },
          { topic: "Multiple servers", pyo: ["yes", "Joined over Tailscale"], them: ["yes", "Connected over SSH"] },
          { topic: "CPU and memory limits", pyo: ["yes", "For every service"], them: ["yes", "For container services"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["no", "Not built in"] },
          { topic: "Firewall by IP, range or country", pyo: ["yes", "Per service"], them: ["yes", "Per route"] },
          { topic: "Rate limits", pyo: ["yes", "Per visitor, for websites"], them: ["yes", "Per route"] },
          { topic: "TCP and UDP ports", pyo: ["yes", "Through Pyo Gateway, or from your servers"], them: ["yes", "Published from the server"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "No script to add"], them: ["yes", "From the edge, no script to add"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["yes", "Servers and containers"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "From the dashboard"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Every value, at rest"] },
          { topic: "Network isolation", pyo: ["yes", "Between projects"], them: ["yes", "A Docker network per project"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["no", "Not built in"] },
          { topic: "Team roles", pyo: ["yes", "Owner, admin, developer and viewer"], them: ["yes", "Owner, admin, member and restricted"] },
          { topic: "Scoped API keys", pyo: ["yes", "Read, deploy or full, per team"], them: ["yes", "Read-only, or limited to chosen resources"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "SDK", pyo: ["no", "Use the API"], them: ["yes", "JavaScript and TypeScript"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Data",
        rows: [
          { topic: "One-click databases", pyo: ["yes", "Postgres, MySQL and KV. MongoDB as a template"], them: ["yes", "Postgres, MySQL, MongoDB and Redis"] },
          { topic: "Persistent volumes", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Scheduled backups", pyo: ["yes", "Volumes and databases. Volumes are encrypted and restore in one click"], them: ["yes", "Volumes and databases. Restore in one click"] },
          { topic: "Your own S3 bucket", pyo: ["yes", "Yes"], them: ["yes", "Or SFTP, a server or a local disk"] },
        ],
      },
    ],
  },
  {
    slug: "render",
    name: "Render",
    seoDescription: "Pyo is an open-source alternative to Render that runs on your own servers. Compare features, costs and control, side by side.",
    subtitle: "Everything you like about a modern platform, on servers you own. Pyo is open source, and free to run for as many services as your servers can hold.",
    groups: [
      {
        group: "Hosting",
        rows: [
          { topic: "Runs on your own servers", pyo: ["yes", "A VPS, dedicated server or homelab"], them: ["no", "Render's cloud only"] },
          { topic: "Open source", pyo: ["yes", "Apache 2.0"], them: ["no", "Proprietary"] },
          { topic: "Free to use", pyo: ["yes", "You only pay for your servers"], them: ["partly", "Paid per instance, with some free options"] },
          { topic: "Runs on any provider", pyo: ["yes", "Or several at once"], them: ["no", "Render only"] },
          { topic: "Your data on your hardware", pyo: ["yes", "Yes"], them: ["no", "On Render's infrastructure"] },
          { topic: "No plan limits", pyo: ["yes", "Every feature, on every install"], them: ["no", "Some features need a Pro plan"] },
        ],
      },
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Yes"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["yes", "Yes"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "Yes"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["yes", "Yes"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "Yes"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "Yes"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["yes", "Yes"] },
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["partly", "On Pro plans and higher"] },
          { topic: "Choose where services run", pyo: ["yes", "By location, tag or server"], them: ["partly", "By Render region"] },
          { topic: "Add your own servers", pyo: ["yes", "Over Tailscale, from anywhere"], them: ["no", "Render instances only"] },
        ],
      },
      {
        group: "Networking",
        rows: [
          { topic: "Custom domains and HTTPS", pyo: ["yes", "Automatic certificates"], them: ["yes", "Yes"] },
          { topic: "Private networking", pyo: ["yes", "Between services, and over Tailscale"], them: ["yes", "Between services"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["partly", "Render's own rules, no settings"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "Built in, no script to add"], them: ["no", "Infrastructure metrics only"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["yes", "For services"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Yes"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["partly", "Synced in by Doppler or Infisical"] },
          { topic: "Team roles", pyo: ["yes", "On every install"], them: ["partly", "Depends on your plan"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
    ],
  },
  {
    slug: "railway",
    name: "Railway",
    seoDescription: "Pyo is an open-source alternative to Railway that runs on your own servers. Compare features, costs and control, side by side.",
    subtitle: "Services, databases and cron jobs from one dashboard, on servers you own. Pyo is open source, and free to run for as many services as your servers can hold.",
    groups: [
      {
        group: "Hosting",
        rows: [
          { topic: "Runs on your own servers", pyo: ["yes", "A VPS, dedicated server or homelab"], them: ["no", "Railway's cloud only"] },
          { topic: "Open source", pyo: ["yes", "Apache 2.0"], them: ["no", "Proprietary"] },
          { topic: "Free to use", pyo: ["yes", "You only pay for your servers"], them: ["partly", "Paid by usage, with a small free plan"] },
          { topic: "Runs on any provider", pyo: ["yes", "Or several at once"], them: ["no", "Railway only"] },
          { topic: "Your data on your hardware", pyo: ["yes", "Yes"], them: ["no", "On Railway's infrastructure"] },
          { topic: "No plan limits", pyo: ["yes", "Every feature, on every install"], them: ["no", "Replicas, seats and roles depend on your plan"] },
        ],
      },
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Yes"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["yes", "With a health check"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "Yes"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["yes", "Failed checks keep the old deploy"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "Yes"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "HTTP, while deploying"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["yes", "Yes"] },
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["partly", "Up to your plan's CPU and memory. Replicas set by hand"] },
          { topic: "Choose where services run", pyo: ["yes", "By location, tag or server"], them: ["partly", "By Railway region"] },
          { topic: "Add your own servers", pyo: ["yes", "Over Tailscale, from anywhere"], them: ["no", "Railway's infrastructure only"] },
        ],
      },
      {
        group: "Networking",
        rows: [
          { topic: "Custom domains and HTTPS", pyo: ["yes", "Automatic certificates"], them: ["yes", "Yes"] },
          { topic: "Private networking", pyo: ["yes", "Between services, and over Tailscale"], them: ["yes", "Between services"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["partly", "Under Attack Mode at the edge"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "Built in, no script to add"], them: ["no", "Infrastructure metrics only"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["yes", "For services"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "Over SSH, from the CLI"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Yes"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["partly", "Synced in by Doppler, Infisical or a script"] },
          { topic: "Team roles", pyo: ["yes", "On every install"], them: ["partly", "Depends on your plan"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
    ],
  },
  {
    slug: "vercel",
    name: "Vercel",
    trademark: "Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries.",
    seoDescription: "Pyo is an open-source alternative to Vercel that runs on your own servers. Compare features, costs and control, side by side.",
    subtitle: "Deploy on every push, with rollbacks, domains and analytics, on servers you own. Pyo is open source, and free to run for as many services as your servers can hold.",
    groups: [
      {
        group: "Hosting",
        rows: [
          { topic: "Runs on your own servers", pyo: ["yes", "A VPS, dedicated server or homelab"], them: ["no", "Vercel's cloud, or your AWS account on Enterprise"] },
          { topic: "Open source", pyo: ["yes", "Apache 2.0"], them: ["no", "Proprietary"] },
          { topic: "Free to use", pyo: ["yes", "You only pay for your servers"], them: ["partly", "Free for personal projects. Paid plans for teams"] },
          { topic: "Runs on any provider", pyo: ["yes", "Or several at once"], them: ["no", "Vercel, or AWS on Enterprise"] },
          { topic: "Your data on your hardware", pyo: ["yes", "Yes"], them: ["no", "On Vercel's infrastructure"] },
          { topic: "No plan limits", pyo: ["yes", "Every feature, on every install"], them: ["no", "Some features need Pro or Enterprise"] },
        ],
      },
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Yes"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["partly", "As functions, in beta"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["yes", "Yes"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "Yes"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["yes", "Failed builds never go live"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "Once a day at most on the free plan"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["partly", "Checks before a deploy goes live"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["yes", "Yes"] },
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["yes", "Yes"] },
          { topic: "Choose where services run", pyo: ["yes", "By location, tag or server"], them: ["partly", "By Vercel region"] },
          { topic: "Add your own servers", pyo: ["yes", "Over Tailscale, from anywhere"], them: ["partly", "Your AWS account, on Enterprise"] },
        ],
      },
      {
        group: "Networking",
        rows: [
          { topic: "Custom domains and HTTPS", pyo: ["yes", "Automatic certificates"], them: ["yes", "Yes"] },
          { topic: "Private networking", pyo: ["yes", "Between services, and over Tailscale"], them: ["partly", "Secure Compute, on Enterprise"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["partly", "Custom rules. OWASP rules on Enterprise"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "Built in, no script to add"], them: ["yes", "Add a package to your site"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["partly", "Function metrics. More on paid add-ons"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Kept longer on paid plans"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["no", "Not for deployments"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Yes"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["partly", "Synced in by Doppler or Infisical"] },
          { topic: "Team roles", pyo: ["yes", "On every install"], them: ["partly", "On Pro and Enterprise"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
    ],
  },
  {
    slug: "netlify",
    name: "Netlify",
    seoDescription: "Pyo is an open-source alternative to Netlify that runs on your own servers. Compare features, costs and control, side by side.",
    subtitle: "Sites, APIs, workers and databases from one dashboard, on servers you own. Pyo is open source, and free to run for as many services as your servers can hold.",
    groups: [
      {
        group: "Hosting",
        rows: [
          { topic: "Runs on your own servers", pyo: ["yes", "A VPS, dedicated server or homelab"], them: ["no", "Netlify's cloud only"] },
          { topic: "Open source", pyo: ["yes", "Apache 2.0"], them: ["no", "Proprietary"] },
          { topic: "Free to use", pyo: ["yes", "You only pay for your servers"], them: ["partly", "Free plan with monthly credits. Paid plans for more"] },
          { topic: "Runs on any provider", pyo: ["yes", "Or several at once"], them: ["no", "Netlify only"] },
          { topic: "Your data on your hardware", pyo: ["yes", "Yes"], them: ["no", "On Netlify's infrastructure"] },
          { topic: "No plan limits", pyo: ["yes", "Every feature, on every install"], them: ["no", "Some features need Pro or Enterprise"] },
        ],
      },
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["yes", "Yes"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["no", "Static sites and functions"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["yes", "Yes"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["yes", "Yes"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["yes", "Failed builds never go live"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["yes", "Scheduled functions, up to 30 seconds each"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["partly", "A build must pass before it goes live"] },
          { topic: "One-click templates", pyo: ["yes", "Databases, tools and apps"], them: ["yes", "Yes"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["yes", "Yes"] },
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["yes", "Yes"] },
          { topic: "Choose where services run", pyo: ["yes", "By location, tag or server"], them: ["partly", "Function region, on Pro and Enterprise"] },
          { topic: "Add your own servers", pyo: ["yes", "Over Tailscale, from anywhere"], them: ["no", "Netlify's infrastructure only"] },
        ],
      },
      {
        group: "Networking",
        rows: [
          { topic: "Custom domains and HTTPS", pyo: ["yes", "Automatic certificates"], them: ["yes", "Yes"] },
          { topic: "Private networking", pyo: ["yes", "Between services, and over Tailscale"], them: ["partly", "Private connectivity, on Enterprise"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["partly", "On Enterprise"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "Built in, no script to add"], them: ["yes", "Server-side. History depends on your plan"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["partly", "Request and function metrics"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Kept longer on paid plans"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["no", "Not for deployments"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Yes"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["partly", "Synced in by Doppler or Infisical"] },
          { topic: "Team roles", pyo: ["yes", "On every install"], them: ["partly", "Depends on your plan"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["yes", "Yes"] },
        ],
      },
    ],
  },
  {
    slug: "fly",
    name: "Fly.io",
    seoDescription: "Pyo is an open-source alternative to Fly.io that runs on your own servers. Compare features, costs and control, side by side.",
    subtitle: "Services, databases and cron jobs from one dashboard, on servers you own. Pyo is open source, and free to run for as many services as your servers can hold.",
    groups: [
      {
        group: "Hosting",
        rows: [
          { topic: "Runs on your own servers", pyo: ["yes", "A VPS, dedicated server or homelab"], them: ["no", "Fly.io's cloud only"] },
          { topic: "Open source", pyo: ["yes", "Apache 2.0"], them: ["no", "Proprietary platform, open-source CLI"] },
          { topic: "Free to use", pyo: ["yes", "You only pay for your servers"], them: ["no", "Paid by usage, no free plan"] },
          { topic: "Runs on any provider", pyo: ["yes", "Or several at once"], them: ["no", "Fly.io only"] },
          { topic: "Your data on your hardware", pyo: ["yes", "Yes"], them: ["no", "On Fly.io's infrastructure"] },
        ],
      },
      {
        group: "Deploying",
        rows: [
          { topic: "Deploy from Git", pyo: ["yes", "On every push"], them: ["partly", "Through a GitHub Actions workflow you add"] },
          { topic: "Deploy any container image", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Zero-downtime deploys", pyo: ["yes", "With 2 or more replicas"], them: ["yes", "Rolling, canary or blue-green"] },
          { topic: "One-click rollback", pyo: ["yes", "To any earlier version"], them: ["partly", "Redeploy an earlier image from the CLI"] },
          { topic: "Automatic rollback", pyo: ["yes", "A failed deploy undoes itself"], them: ["partly", "Failed checks stop the deploy"] },
          { topic: "Cron jobs", pyo: ["yes", "With run history and failure alerts"], them: ["partly", "Machines that run hourly, daily, weekly or monthly"] },
          { topic: "Health checks", pyo: ["yes", "HTTP, TCP or command"], them: ["yes", "HTTP or TCP"] },
        ],
      },
      {
        group: "Scaling",
        rows: [
          { topic: "Services move if a server fails", pyo: ["yes", "Stateless services, automatically"], them: ["no", "Run 2 or more Machines, or a standby"] },
          { topic: "Autoscaling", pyo: ["yes", "On CPU and memory, from min to max"], them: ["yes", "Start and stop on requests, or scale by a metric"] },
          { topic: "Choose where services run", pyo: ["yes", "By location, tag or server"], them: ["partly", "By Fly.io region"] },
          { topic: "Add your own servers", pyo: ["yes", "Over Tailscale, from anywhere"], them: ["no", "Fly.io's infrastructure only"] },
        ],
      },
      {
        group: "Networking",
        rows: [
          { topic: "Custom domains and HTTPS", pyo: ["yes", "Automatic certificates"], them: ["yes", "Yes"] },
          { topic: "Private networking", pyo: ["yes", "Between services, and over Tailscale"], them: ["yes", "Between apps, and over WireGuard"] },
        ],
      },
      {
        group: "Traffic",
        rows: [
          { topic: "Web application firewall", pyo: ["yes", "OWASP and custom rules, off by default"], them: ["partly", "Through partner extensions"] },
        ],
      },
      {
        group: "Observability",
        rows: [
          { topic: "Analytics", pyo: ["yes", "Built in, no script to add"], them: ["partly", "Request metrics in managed Grafana"] },
          { topic: "CPU and memory metrics", pyo: ["yes", "Servers and services, no Prometheus"], them: ["yes", "In managed Grafana"] },
          { topic: "Live logs", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "Terminal into a service", pyo: ["yes", "From the dashboard"], them: ["yes", "Over SSH, from the CLI"] },
        ],
      },
      {
        group: "Security",
        rows: [
          { topic: "Encrypted secrets", pyo: ["yes", "A separate key for each team"], them: ["yes", "Yes"] },
          { topic: "External secret stores", pyo: ["yes", "Vault, OpenBao, Infisical, AWS, GCP, Azure and Doppler"], them: ["no", "Set with the CLI or API"] },
          { topic: "Team roles", pyo: ["yes", "On every install"], them: ["partly", "Admin or member"] },
        ],
      },
      {
        group: "Automation",
        rows: [
          { topic: "CLI", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "API", pyo: ["yes", "Yes"], them: ["yes", "Yes"] },
          { topic: "MCP for AI assistants", pyo: ["yes", "129 tools, covering the whole API"], them: ["partly", "Experimental, in the CLI"] },
        ],
      },
    ],
  },
];

export const competitorBySlug = (slug: string) =>
  COMPETITORS.find((c) => c.slug === slug);

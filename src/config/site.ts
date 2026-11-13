// Everything brand-specific lives here; the rest of the site reads from it.

export const site = {
  name: "Pyo",
  /** Under 60 characters, so search results show all of it. */
  title: "Pyo: Open-source, self-hosted PaaS for your own servers",
  /** Under 160 characters, for the same reason. */
  description:
    "Deploy your code, databases and one-click templates on your own servers. The open-source, self-hosted alternative to Vercel, Netlify, Railway, Render and Fly.io.",
  /** Renders each page's social card (see lib/seo.ts). */
  ogImageUrl: "https://og.upset.dev/image",
  url: "https://pyo.dev",
  github: "https://github.com/upsetdev/pyo",
  docsRepo: "https://github.com/upsetdev/pyo-docs",
  license: "https://github.com/upsetdev/pyo/blob/main/LICENSE",
  setupCommand: "curl -fsSL https://pyo.dev/install.sh | bash",
  /** Pyo Cloud's address, for the docs' examples (see PyoAddress). */
  cloudUrl: "https://cloud.pyo.dev",
} as const;

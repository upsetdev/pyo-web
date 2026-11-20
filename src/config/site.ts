// Everything brand-specific lives here; the rest of the site reads from it.

export const site = {
  name: "Pyo",
  /** Under 60 characters, so search results show all of it. */
  title: "Pyo: Open-source, self-hosted PaaS for your own infrastructure",
  /** The positioning line, word for word. At 175 characters, search results may cut its end. */
  description:
    "The open-source PaaS alternative to Vercel, Netlify, Railway, Render and Fly.io. Deploy apps, run services, and create isolated sandboxes, from one machine to a whole cluster.",
  /** Renders each page's social card (see lib/seo.ts). */
  ogImageUrl: "https://og.upset.dev/image",
  url: "https://pyo.dev",
  github: "https://github.com/upsetdev/pyo",
  x: "https://x.com/pyo_dev",
  xHandle: "@pyo_dev",
  docsRepo: "https://github.com/upsetdev/pyo-docs",
  license: "https://github.com/upsetdev/pyo/blob/main/LICENSE",
  setupCommand: "curl -fsSL https://pyo.dev/install.sh | bash",
  /** Pyo Cloud's address, for the docs' examples (see PyoAddress). */
  cloudUrl: "https://cloud.pyo.dev",
  /** Pyo Cloud takes sign-ups. Off: the pricing and deploy pages say "Coming soon". */
  cloudLive: false as boolean,
} as const;

import { createFileRoute } from "@tanstack/react-router";
import { Features } from "~/components/Features";
import { Hero } from "~/components/Hero";
import { Install, Production } from "~/components/Sections";
import { Tour } from "~/components/Tour";
import { site } from "~/config/site";
import { seo } from "~/lib/seo";

/** Tells search engines what Pyo is. Only facts: no ratings or review counts. */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  description: site.description,
  url: `${site.url}/`,
  image: `${site.url}/og.png`,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux",
  license: site.license,
  codeRepository: site.github,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({ path: "/", title: site.title, description: site.description }),
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(STRUCTURED_DATA) },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <Hero />
      <Tour />
      <Features />
      <Production />
      <Install />
    </main>
  );
}

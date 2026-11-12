/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Link,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import type { ReactNode } from "react";
import DocsSearch from "~/components/DocsSearch";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Sections";
import { ThemeProvider, themeScript } from "~/components/ThemeProvider";
import { site } from "~/config/site";
import appCss from "~/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootDocument,
  component: Layout,
  notFoundComponent: NotFound,
});

function Layout() {
  // The docs are their own screen, with their own navigation.
  const inDocs = useLocation({ select: (l) => l.pathname.startsWith("/docs") });
  if (inDocs) return <Outlet />;
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body className="bg-background">
        <ThemeProvider>
          {/* The theme is ours, and search has to work without a server. */}
          <RootProvider
            theme={{ enabled: false }}
            search={{ SearchDialog: DocsSearch }}
          >
            {children}
          </RootProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <Link to="/" className="mt-4 text-[13px] underline underline-offset-4">
        Go to the homepage
      </Link>
    </main>
  );
}

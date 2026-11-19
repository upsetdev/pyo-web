import {
  ArrowSquareOutIcon,
  CheckIcon,
  CloudIcon,
  CopyIcon,
  GitlabLogoIcon,
  GitBranchIcon,
  HardDrivesIcon,
  PackageIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { CopyCommand } from "~/components/CopyCommand";
import { DockerIcon } from "~/components/DockerIcon";
import { GithubIcon } from "~/components/GithubIcon";
import { site } from "~/config/site";
import {
  checkSource,
  dashboardUrl,
  deployPageUrl,
  KINDS,
  parseSearch,
  type Kind,
  type Problem,
  type Source,
} from "~/lib/deploy-link";
import { getAddress, normalizeAddress, setAddress } from "~/lib/pyo-address";
import { seo } from "~/lib/seo";

// pyo.dev/deploy: with no query, the "Deploy with Pyo" button and how to add
// it to a README. With ?repo= or ?image= (where the button leads), what
// will be deployed and where: the visitor's own Pyo opens its deploy page with
// it filled in. The page is prerendered without a query, so the query is read
// once it's in the browser. Until then a script in the head hides the button
// page from a visitor who came with one.

/** Set before first paint when the URL asks for a deploy. */
const LINK_ATTR = "data-deploy-link";
const linkScript = `if(/[?&](?!utm_)[^=&]/.test(location.search))document.documentElement.setAttribute("${LINK_ATTR}","")`;

export const Route = createFileRoute("/deploy")({
  head: () => ({
    ...seo({
      path: "/deploy",
      title: "Deploy with Pyo button for your README | Pyo",
      description:
        "Add a Deploy with Pyo button to your README. Anyone who clicks it can deploy your repository or image to their own Pyo.",
      card: {
        badge: "Deploy button",
        title: "Deploy with Pyo",
        description: "A button for your README that deploys your repository or image to anyone's Pyo.",
      },
    }),
    scripts: [{ children: linkScript }],
  }),
  component: DeployPage,
});

const KIND_LABEL: Record<Kind, string> = {
  repo: "Repository",
  image: "Image",
};

const PLACEHOLDER: Record<Kind, string> = {
  repo: "https://github.com/owner/repo",
  image: "nginx:1.27",
};

const HINT: Record<Kind, string> = {
  repo: "A public repository on GitHub or GitLab. A tree link picks the branch and folder.",
  image: "Any public image, like ghcr.io/owner/app:latest.",
};

function KindIcon({ kind, size = 15 }: { kind: Kind; size?: number }) {
  if (kind === "repo") return <GitBranchIcon size={size} aria-hidden />;
  return <PackageIcon size={size} aria-hidden />;
}

function SourceIcon({ source, size = 15 }: { source: Source; size?: number }) {
  if (source.kind === "repo")
    return source.provider === "github" ? (
      <GithubIcon size={size} />
    ) : (
      <GitlabLogoIcon size={size} aria-hidden />
    );
  return source.hub ? <DockerIcon size={size} /> : <PackageIcon size={size} aria-hidden />;
}

const BADGES = [
  { name: "Dark", file: "deploy-dark.svg", width: 178, height: 40, surface: "light" },
  { name: "Light", file: "deploy-light.svg", width: 178, height: 40, surface: "dark" },
  { name: "Dark, small", file: "deploy-dark-small.svg", width: 138, height: 28, surface: "light" },
  { name: "Light, small", file: "deploy-light-small.svg", width: 138, height: 28, surface: "dark" },
] as const;

const badgeUrl = (file: string) => `${site.url}/badge/${file}`;

function DeployPage() {
  // Follows the router, so a link to /deploy from here updates the page.
  useLocation({ select: (l) => l.href });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.documentElement.removeAttribute(LINK_ATTR);
  }, []);
  const parsed = mounted ? parseSearch(window.location.search) : null;
  if (parsed && "source" in parsed) return <DeploySource source={parsed.source} />;
  if (parsed) return <InvalidLink problem={parsed} />;
  return <ButtonPage />;
}

// ── The button ─────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // No clipboard here: the text stays selectable.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {copied ? <CheckIcon size={15} className="text-success" /> : <CopyIcon size={15} />}
    </button>
  );
}

function Snippet({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-start gap-2 rounded-xl border border-border bg-background py-1.5 pl-3.5 pr-1.5">
        <code className="min-w-0 flex-1 break-all py-1.5 font-mono text-[12px] leading-5 text-foreground/90">
          {code}
        </code>
        <CopyButton text={code} label={`Copy ${label}`} />
      </div>
    </div>
  );
}

function ButtonPage() {
  const [kind, setKind] = useState<Kind>("repo");
  const [value, setValue] = useState("");
  const id = useId();
  const checked = value.trim() ? checkSource(kind, value) : null;
  const source = checked && "source" in checked ? checked.source : null;
  const error = checked && "error" in checked ? (checked.title ? `${checked.title}. ${checked.error}` : checked.error) : "";
  const link = deployPageUrl(site.url, source ?? { kind, value: PLACEHOLDER[kind] });

  return (
    <main className="[html[data-deploy-link]_&]:invisible">
      <section className="mx-auto max-w-5xl animate-fade-up px-5 pb-10 pt-16 sm:pt-24">
        <h1 className="text-balance text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[44px]">
          Deploy with Pyo
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
          Add the button to your README. Anyone who clicks it can deploy your
          repository or image to their own Pyo.
        </p>
        <div className="mt-8">
          <img
            src="/badge/deploy-dark.svg"
            width={178}
            height={40}
            alt="Deploy with Pyo"
            className="dark:hidden"
          />
          <img
            src="/badge/deploy-light.svg"
            width={178}
            height={40}
            alt="Deploy with Pyo"
            className="hidden dark:block"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <div className="rounded-[20px] frame-edge bg-muted p-1.5">
          <div className="rounded-[14px] card-edge bg-card p-6 sm:p-8">
            <h2 className="text-[15px] font-semibold">Your link</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
              Pick what to deploy. The snippets below use it.
            </p>
            <div
              role="radiogroup"
              aria-label="Source"
              className="mt-5 inline-flex rounded-full border border-border bg-background p-0.5"
            >
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={kind === k}
                  onClick={() => {
                    setKind(k);
                    setValue("");
                  }}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-colors ${
                    kind === k
                      ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <KindIcon kind={k} size={14} />
                  {KIND_LABEL[k]}
                </button>
              ))}
            </div>
            <label htmlFor={id} className="sr-only">
              {KIND_LABEL[kind]}
            </label>
            <input
              id={id}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={PLACEHOLDER[kind]}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-invalid={!!error}
              aria-describedby={`${id}-hint`}
              className="field mt-3 h-10 w-full max-w-md px-3.5 font-mono text-[13px] text-foreground placeholder:text-muted-foreground"
            />
            <p
              id={`${id}-hint`}
              className={`mt-2 text-[12.5px] ${error ? "text-destructive" : "text-muted-foreground"}`}
            >
              {error || HINT[kind]}
            </p>
            <div className="mt-5">
              <Snippet label="Link" code={link} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-24">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
          Styles
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Pick the one that suits your README.
        </p>
        <div className="mt-8 grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 md:grid-cols-2">
          {BADGES.map((b) => {
            const src = badgeUrl(b.file);
            return (
              <div key={b.file} className="min-w-0 rounded-[14px] card-edge bg-card p-5 sm:p-6">
                <div
                  className={`flex h-28 items-center justify-center rounded-xl border border-border ${
                    b.surface === "light" ? "bg-white" : "bg-[#0d1117]"
                  }`}
                >
                  <img src={`/badge/${b.file}`} width={b.width} height={b.height} alt="Deploy with Pyo" />
                </div>
                <h3 className="mt-5 text-[14px] font-semibold">{b.name}</h3>
                <div className="mt-3 space-y-3">
                  <Snippet label="Markdown" code={`[![Deploy with Pyo](${src})](${link})`} />
                  <Snippet
                    label="HTML"
                    code={`<a href="${link}"><img src="${src}" alt="Deploy with Pyo" width="${b.width}" height="${b.height}"></a>`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground">
          More in the{" "}
          <a href="/docs/deploy/deploy-button" className="font-medium text-foreground underline underline-offset-4">
            docs
          </a>
          .
        </p>
      </section>
    </main>
  );
}

// ── A link ─────────────────────────────────────────────────────────────────

function InvalidLink({ problem }: { problem: Problem }) {
  return (
    <main>
      <section className="mx-auto max-w-5xl animate-fade-up px-5 pb-10 pt-16 sm:pt-24">
        <h1 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-tight sm:text-[40px]">
          {problem.title ?? "This deploy link isn't valid"}
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">{problem.error}</p>
        <Link
          to="/deploy"
          className="mt-8 inline-flex h-11 items-center rounded-full border border-border-strong bg-card px-6 text-[14px] font-medium text-foreground transition-colors hover:bg-accent"
        >
          About the Deploy with Pyo button
        </Link>
      </section>
    </main>
  );
}

/** A long name that wraps after its slashes rather than mid-word. */
function Breakable({ text }: { text: string }) {
  const parts = text.split("/");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 ? (
            <>
              /<wbr />
            </>
          ) : null}
        </span>
      ))}
    </>
  );
}

function Choice({
  icon,
  title,
  children,
  muted = false,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={`flex min-w-0 flex-col rounded-[14px] card-edge bg-card p-6 sm:p-8 ${muted ? "text-muted-foreground" : ""}`}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground">
          {icon}
        </span>
        <h2 className={`text-[15px] font-semibold ${muted ? "" : "text-foreground"}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function DeploySource({ source }: { source: Source }) {
  const id = useId();
  const [address, setDraft] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    // The address saved here or in the docs, unless it's Pyo Cloud.
    const saved = getAddress();
    if (saved && saved !== site.cloudUrl) setDraft(saved);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const origin = normalizeAddress(address);
    if (!origin) return setError(true);
    try {
      setAddress(origin);
    } catch {
      // Not saved: the deploy still opens.
    }
    window.location.assign(dashboardUrl(origin, source));
  };

  const what =
    source.kind === "image"
      ? "Image"
      : source.provider === "github"
        ? "GitHub repository"
        : "GitLab project";

  return (
    <main>
      <section className="mx-auto max-w-5xl animate-fade-up px-5 pb-10 pt-16 sm:pt-24">
        <p className="text-[13px] font-medium text-muted-foreground">Deploy with Pyo</p>
        <h1 className="mt-3 break-words text-[32px] font-semibold leading-[1.1] tracking-tight sm:text-[44px]">
          Deploy <Breakable text={source.label} />
        </h1>
        <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-3 pr-3.5 text-[13px]">
          <span className="text-foreground">
            <SourceIcon source={source} size={14} />
          </span>
          <span className="whitespace-nowrap text-muted-foreground">{what}</span>
          {source.href ? (
            <a
              href={source.href}
              rel="noopener noreferrer"
              className="inline-flex min-w-0 items-center gap-1 font-mono text-[12.5px] text-foreground hover:underline"
            >
              <span className="truncate">{source.href.replace(/^https:\/\//, "")}</span>
              <ArrowSquareOutIcon size={12} aria-hidden className="shrink-0" />
            </a>
          ) : (
            <span className="min-w-0 truncate font-mono text-[12.5px] text-foreground">{source.label}</span>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <div className="grid gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5 md:grid-cols-2">
          <Choice icon={<HardDrivesIcon size={16} aria-hidden />} title="Your Pyo">
            <form onSubmit={submit} noValidate className="mt-4 flex flex-1 flex-col">
              <label htmlFor={id} className="text-[13px] font-medium text-foreground">
                Pyo address
              </label>
              <input
                id={id}
                value={address}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError(false);
                }}
                placeholder="https://pyo.example.com"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="url"
                inputMode="url"
                aria-invalid={error}
                aria-describedby={`${id}-hint`}
                className="field mt-2 h-10 w-full px-3.5 font-mono text-[13px] text-foreground placeholder:text-muted-foreground"
              />
              <p
                id={`${id}-hint`}
                role={error ? "alert" : undefined}
                className={`mt-2 text-[12.5px] leading-snug ${error ? "text-destructive" : "text-muted-foreground"}`}
              >
                {error
                  ? "Use an http or https address, like https://pyo.example.com."
                  : "Saved in this browser only."}
              </p>
              <div className="mt-auto pt-6">
                <button
                  type="submit"
                  className="btn-emerge inline-flex h-11 w-full items-center justify-center rounded-full text-[14px] font-medium text-primary-foreground"
                >
                  Deploy
                </button>
              </div>
            </form>
          </Choice>
          <Choice icon={<CloudIcon size={16} aria-hidden />} title="Pyo Cloud" muted>
            <p className="mt-4 text-[14px] leading-relaxed">
              Pyo, run by us. Your services run on your own servers.
            </p>
            <div className="mt-auto pt-6">
              <span
                aria-disabled="true"
                className="inline-flex h-11 w-full cursor-default items-center justify-center rounded-full border border-border bg-secondary text-[14px] font-medium text-muted-foreground"
              >
                Coming soon
              </span>
            </div>
          </Choice>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          Your Pyo opens its deploy page with this filled in. Nothing deploys
          until you press Deploy there.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pt-16">
        <h2 className="text-[17px] font-semibold">No Pyo yet?</h2>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Install it on your server, then come back to this page.{" "}
          <a href="/docs/install" className="font-medium text-foreground underline underline-offset-4">
            Install guide
          </a>
        </p>
        <div className="mt-4 max-w-xl">
          <CopyCommand command={site.setupCommand} />
        </div>
      </section>
    </main>
  );
}

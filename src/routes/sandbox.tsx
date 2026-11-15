import {
  BrainIcon,
  BrowserIcon,
  CodeIcon,
  CubeTransparentIcon,
  DatabaseIcon,
  EyeIcon,
  GlobeSimpleIcon,
  HardDrivesIcon,
  LightningIcon,
  PauseIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  TestTubeIcon,
  TreeStructureIcon,
  type Icon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { ButtonLink, RouteButton } from "~/components/Button";
import { CopyCommand } from "~/components/CopyCommand";
import { iconColor } from "~/components/Features";
import { Install } from "~/components/Sections";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/sandbox")({
  head: () =>
    seo({
      path: "/sandbox",
      title: "Pyo Sandbox: isolated sandboxes for AI agents on your own infrastructure | Pyo",
      description:
        "Isolated microVMs for AI agents, code interpreters, previews and CI, made on demand through an API. Open source, on your own infrastructure.",
      card: {
        badge: "Sandbox",
        title: "Isolated sandboxes for AI agents",
        description:
          "For code interpreters, coding agents, previews and CI, on your own infrastructure.",
      },
    }),
  component: SandboxPage,
});

const EXAMPLE = `import { Sandbox } from "@pyodev/sandbox";

const sbx = await Sandbox.create({ template: "node-22", ttl: "1h" });
const out = await sbx.exec("node -v");
await sbx.files.write("/app/index.js", "console.log('hi')");
const url = await sbx.ports.open(3000);`;

const MCP = "claude mcp add --transport http pyo https://your-pyo/api/mcp";

const USES: [Icon, string, string][] = [
  [CodeIcon, "Code interpreter", "Run the code a model writes and send back what it prints."],
  [BrainIcon, "Coding agents", "Give an agent its own machine to clone a repo, install packages and run tests."],
  [EyeIcon, "Live previews", "Open a port and share what an agent builds as a live URL."],
  [BrowserIcon, "Browser and computer use", "Run a browser for an agent to drive, away from your own machines."],
  [TestTubeIcon, "Evals", "Start many sandboxes at once to test agents and models on real tasks."],
  [ShieldCheckIcon, "Untrusted code in CI", "Run pull requests and user code without putting your servers at risk."],
];

const RUNS: [Icon, string, string][] = [
  [
    CubeTransparentIcon,
    "A microVM for each sandbox",
    "Each sandbox is its own Firecracker microVM. Servers without KVM use gVisor. Pyo picks one for you.",
  ],
  [
    HardDrivesIcon,
    "Dedicated sandbox servers",
    "Sandboxes run on their own servers, outside your clusters. Your services never share a machine with them.",
  ],
  [
    LightningIcon,
    "Starts from a template",
    "A sandbox starts from a template in under 50 ms. Its root disk is shared and its memory is copy-on-write.",
  ],
  [
    ShieldCheckIcon,
    "A safe network",
    "Internet is on. Your own network and cloud metadata are always blocked.",
  ],
  [
    GlobeSimpleIcon,
    "Ports become URLs",
    "Open a port and get a live HTTPS URL, public or private.",
  ],
  [
    PauseIcon,
    "Pause and resume",
    "Pause a sandbox to keep its memory and files, and pick up where it left off.",
  ],
];

const STATS: [string, string][] = [
  ["< 50 ms", "to start from a template"],
  ["~7 MB", "of memory per idle sandbox"],
];

const WHY: [Icon, string, string, boolean][] = [
  [
    TreeStructureIcon,
    "On your own infrastructure",
    "Code and data never leave your servers, so sandboxes can work with private data.",
    false,
  ],
  [
    SquaresFourIcon,
    "One bill and one dashboard",
    "Services, databases and sandboxes, all in one place.",
    false,
  ],
  [
    RocketLaunchIcon,
    "Promote to a service",
    "When an agent builds something good, deploy it as a Pyo service with a domain, HTTPS and autoscaling.",
    true,
  ],
  [
    DatabaseIcon,
    "Scoped database access",
    "Let a sandbox read one of your Pyo databases through a read-only connection. Off by default.",
    true,
  ],
];

function SandboxPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div aria-hidden className="dash-pattern absolute inset-0" />
        <div
          aria-hidden
          className="absolute left-1/2 top-[-300px] h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.2),transparent)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />
        <div className="relative mx-auto flex max-w-3xl animate-fade-up flex-col items-center px-5 pb-12 pt-16 text-center sm:pt-24">
          <span className="rounded-full border border-primary/35 bg-primary/[0.08] px-3 py-1 font-mono text-[12px] text-foreground/85">
            Pyo Sandbox
          </span>
          <h1 className="mt-6 text-balance text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[52px]">
            Isolated sandboxes for AI agents
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
            Create a sandbox through an API for code interpreters, coding
            agents, previews and CI. Each one is an isolated machine on your
            own infrastructure.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/docs/sandbox">Read the docs</ButtonLink>
            <RouteButton to="/" hash="install" variant="secondary">
              Get started
            </RouteButton>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
        <div className="min-w-0">
          <h2 className="text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
            A few lines of code
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Create a sandbox, run commands, write files and open a port as a
            URL with the TypeScript SDK.
          </p>
          <div className="mt-6">
            <CopyCommand command="npm install @pyodev/sandbox" />
          </div>
          <p className="mt-8 text-[15px] leading-relaxed text-muted-foreground">
            Or give your AI assistant sandbox tools through Pyo's MCP server.
          </p>
          <div className="mt-4">
            <CopyCommand command={MCP} />
          </div>
        </div>
        <div className="min-w-0 self-start rounded-[20px] frame-edge bg-muted p-1.5">
          <DynamicCodeBlock
            lang="ts"
            code={EXAMPLE}
            codeblock={{ title: "agent.ts", className: "my-0" }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24 sm:pt-32">
        <h2 className="max-w-2xl text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
          What you can run
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
          One sandbox for each session or job. Make as many as you need and
          throw them away when you're done.
        </p>
        <div className="mt-10 rounded-[20px] frame-edge bg-muted p-1.5">
          <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {USES.map(([ItemIcon, title, body], i) => (
              <li key={title} className="rounded-[14px] card-edge bg-card p-5">
                <ItemIcon size={18} className={iconColor(i)} />
                <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-24 sm:pt-32 grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-14">
        <div className="min-w-0">
          <h2 className="text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
            How it runs
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Strong isolation that starts fast, on servers you own.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-1.5 rounded-[20px] frame-edge bg-muted p-1.5">
            {STATS.map(([value, label]) => (
              <div key={label} className="rounded-[14px] card-edge bg-card p-4">
                <dt className="sr-only">{label}</dt>
                <dd className="text-[26px] font-semibold leading-none tracking-[-0.02em]">
                  {value}
                </dd>
                <dd className="mt-2 text-[13px] leading-snug text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className="list-rows overflow-hidden rounded-2xl card-edge bg-card">
          {RUNS.map(([ItemIcon, title, body], i) => (
            <li key={title} className="flex gap-4 p-5 transition-colors hover:bg-accent/40">
              <ItemIcon size={20} className={`mt-0.5 shrink-0 ${iconColor(i)}`} />
              <div>
                <h3 className="text-[15px] font-semibold">{title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24 sm:pt-32">
        <h2 className="max-w-2xl text-balance text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[40px]">
          Why Pyo
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
          Sandboxes that live next to your services and databases.
        </p>
        <div className="mt-10 rounded-[20px] frame-edge bg-muted p-1.5">
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {WHY.map(([ItemIcon, title, body, later], i) => (
              <li key={title} className="rounded-[14px] card-edge bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <ItemIcon size={18} className={iconColor(i + 2)} />
                  {later ? (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-[11.5px] text-muted-foreground">
                      Coming later
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Install />
    </main>
  );
}

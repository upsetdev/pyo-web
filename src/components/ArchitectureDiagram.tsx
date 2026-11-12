import { useEffect, useRef, type CSSProperties } from "react";

// How Pyo fits together, read top to bottom. Visitors come in through Pyo
// Gateway on your servers. Pyo wraps your servers, your backups and its own
// parts, which the agent on each cluster connects out to. You work with Pyo
// from below. Under that, one deploy step by step.
//
// One inline SVG on a fixed grid, so every wire meets the edge it points at
// and the text stays real text. Monospace throughout: JetBrains Mono's glyphs
// are all 0.6em wide, which is what the box widths are worked out from.
// Colours come from the .arch-* rules in styles.css, so it follows the theme.

const W = 1100;
const H = 2050;
const LH = 18; // line height for the muted lines
const R = 10; // corner radius of a box; frames get a little more

type Pt = readonly [number, number];

/** A box's height for a title and `n` muted lines below it. */
const boxH = (n: number) => 38 + LH * n;

/** A box: a bold title and muted lines, centred. */
function Box({
  x,
  y,
  w,
  title,
  lines = [],
  accent,
  tint,
  stack = 0,
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  lines?: readonly string[];
  /** A 2px accent line on top: one of the parts doing the work. */
  accent?: boolean;
  /** Filled: a way in, like visitors and your clients. */
  tint?: boolean;
  /** Copies drawn behind it: there are many of these. */
  stack?: number;
  /** Only there when you turn it on. */
  dashed?: boolean;
}) {
  const h = boxH(lines.length);
  const cx = x + w / 2;
  const cls = `arch-box${tint ? " arch-box-tint" : ""}${dashed ? " arch-box-dashed" : ""}`;
  return (
    <g>
      {[...Array.from({ length: stack }, (_, i) => (stack - i) * 8), 0].map((o) => (
        <g key={o}>
          {/* The tint is see-through: a solid ground keeps what's behind hidden. */}
          {tint && <rect className="arch-ground" x={x - o} y={y - o} width={w} height={h} rx={R} />}
          <rect className={cls} x={x - o} y={y - o} width={w} height={h} rx={R} />
        </g>
      ))}
      {accent && (
        <path
          className="arch-accent"
          d={`M${x},${y + R} A${R},${R} 0 0 1 ${x + R},${y} H${x + w - R} A${R},${R} 0 0 1 ${x + w},${y + R}`}
        />
      )}
      <text className="arch-title" x={cx} y={y + 24}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} className="arch-muted" x={cx} y={y + 24 + LH * (i + 1)}>
          {l}
        </text>
      ))}
    </g>
  );
}

/** A data store: a cylinder with its name inside and what it holds below. */
function Store({
  cx,
  y,
  w,
  title,
  caption,
}: {
  cx: number;
  y: number;
  w: number;
  title: string;
  caption: readonly string[];
}) {
  const h = 60;
  const rx = w / 2;
  const ry = 8;
  const x = cx - rx;
  return (
    <g>
      <path
        className="arch-box"
        d={`M${x},${y + ry} V${y + h - ry} A${rx},${ry} 0 0 0 ${x + w},${y + h - ry} V${y + ry}`}
      />
      <ellipse className="arch-box" cx={cx} cy={y + ry} rx={rx} ry={ry} />
      <text className="arch-title" x={cx} y={y + ry + (h - ry) / 2 + 5}>
        {title}
      </text>
      {caption.map((l, i) => (
        <text key={l} className="arch-muted" x={cx} y={y + h + 24 + LH * i}>
          {l}
        </text>
      ))}
    </g>
  );
}

/** A title sitting in a gap it cuts in a line. */
function Notch({ x, y, title, aside, big }: { x: number; y: number; title: string; aside?: string; big?: boolean }) {
  const size = big ? 16 : 14;
  const text = aside ? `${title}  ${aside}` : title;
  const width = text.length * size * 0.6 + 20;
  return (
    <g>
      <rect className="arch-ground" x={x} y={y - 10} width={width} height={20} />
      <text className="arch-notch" x={x + 10} y={y + size * 0.35} style={{ fontSize: size }}>
        {title}
        {aside && (
          <tspan className="arch-notch-aside" dx={size * 0.6 * 2}>
            {aside}
          </tspan>
        )}
      </text>
    </g>
  );
}

/** A frame around a part of the picture, its title notched into the top edge. */
function Frame({ x, y, w, h, title, big }: { x: number; y: number; w: number; h: number; title: string; big?: boolean }) {
  return (
    <g>
      <rect className="arch-frame" x={x} y={y} width={w} height={h} rx={R + 6} />
      <Notch x={x + 20} y={y} title={title} big={big} />
    </g>
  );
}

/** A label beside a wire. */
type Label = { x: number; y: number; text: string; anchor?: "start" | "middle" | "end" };

/**
 * A connection along right angles, with an arrowhead where it arrives, square
 * dots where it meets others, and a short accent dash that travels along it
 * (it holds still for visitors who prefer reduced motion).
 */
function Wire({
  points,
  label,
  dots = [],
  delay = 0,
  head = true,
}: {
  points: readonly Pt[];
  label?: Label;
  dots?: readonly Pt[];
  delay?: number;
  head?: boolean;
}) {
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join("");
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.abs(points[i][0] - points[i - 1][0]) + Math.abs(points[i][1] - points[i - 1][1]);
  }
  const [ex, ey] = points[points.length - 1];
  const [px, py] = points[points.length - 2];
  const dx = Math.sign(ex - px);
  const dy = Math.sign(ey - py);
  // The chevron: 5px back from the tip, 4px out to each side.
  const bx = ex - dx * 5;
  const by = ey - dy * 5;
  const arrow = `M${bx - dy * 4},${by - dx * 4}L${ex},${ey}L${bx + dy * 4},${by + dx * 4}`;
  const style = {
    "--len": len,
    animationDuration: `${(len / 70 + 2.2).toFixed(2)}s`,
    animationDelay: `${delay}s`,
  } as CSSProperties;
  return (
    <g>
      <path className="arch-wire" d={d} />
      {head && <path className="arch-wire" d={arrow} />}
      {len > 40 && <path className="arch-flow" d={d} style={style} />}
      {dots.map(([x, y]) => (
        <rect key={`${x},${y}`} className="arch-dot" x={x - 2.5} y={y - 2.5} width={5} height={5} />
      ))}
      {label && (
        <text className="arch-label" x={label.x} y={label.y} style={{ textAnchor: label.anchor ?? "start" }}>
          {label.text}
        </text>
      )}
    </g>
  );
}

const C = 570; // the centre column: gateway, services, databases

const CLIENTS = [
  ["dashboard", "in your browser"],
  ["CLI", "in your terminal"],
  ["API", "for your scripts"],
  ["MCP", "for AI assistants"],
] as const;

const STEPS: [string, string[]][] = [
  ["push", ["push to Git", "or choose Deploy"]],
  ["build", ["a builder on", "your server", "makes an image"]],
  ["store", ["the image goes", "to the registry"]],
  ["start", ["one new replica", "starts beside", "the old ones"]],
  ["check", ["its health check", "passes, traffic", "moves to it"]],
  ["live", ["an old replica", "stops, repeated", "until all are new"]],
];

function Diagram() {
  return (
    <>
      {/* Pyo, around your servers, your backups and its own parts. */}
      <Frame x={10} y={140} w={1080} h={1340} title="pyo" big />
      <line className="arch-divider" x1={10} x2={1090} y1={1150} y2={1150} />
      <Frame x={40} y={180} w={1020} h={660} title="your servers" />
      <Frame x={600} y={880} w={270} h={235} title="backups" />
      <Notch x={530} y={1150} title="Pyo itself" aside="on your server or Pyo Cloud" />
      <Frame x={10} y={1720} w={1080} h={310} title="a deploy, step by step" />

      {/* Wires first, so boxes sit on top of their ends. */}
      <Wire points={[[C, 104], [C, 225]]} label={{ x: C + 12, y: 126, text: "HTTPS" }} />
      <Wire points={[[440, 271], [300, 271]]} label={{ x: 370, y: 263, text: "each request", anchor: "middle" }} delay={0.4} />
      <Wire points={[[C, 317], [C, 359]]} label={{ x: C + 12, y: 343, text: "requests" }} delay={0.8} />
      <Wire points={[[420, 421], [270, 421]]} label={{ x: 337, y: 413, text: "reads and writes", anchor: "middle" }} delay={1.2} />
      <Wire points={[[C, 467], [C, 519]]} label={{ x: C + 12, y: 497, text: "queries" }} delay={1.6} />
      <Wire
        points={[[175, 458], [175, 680], [735, 680], [735, 920]]}
        dots={[[C, 680]]}
        label={{ x: 747, y: 764, text: "backups" }}
        delay={2}
      />
      <Wire points={[[C, 645], [C, 680]]} head={false} />
      <Wire points={[[910, 317], [910, 1195]]} label={{ x: 922, y: 1124, text: "image" }} delay={0.6} />
      <Wire points={[[170, 1195], [170, 807]]} label={{ x: 158, y: 1124, text: "commands", anchor: "end" }} delay={1} />
      <Wire points={[[230, 807], [230, 1195]]} label={{ x: 242, y: 1124, text: "status, logs, metrics" }} delay={2.4} />
      <Wire points={[[490, 798], [490, 1195]]} label={{ x: 502, y: 1124, text: "request logs" }} delay={1.8} />
      <Wire points={[[200, 1269], [200, 1320]]} label={{ x: 212, y: 1299, text: "queries" }} delay={0.3} />
      <Wire points={[[285, 1350], [582, 1350]]} label={{ x: 433, y: 1342, text: "jobs", anchor: "middle" }} delay={1.4} />
      <Wire
        points={[[925, 1550], [925, 1520], [35, 1520], [35, 1232], [70, 1232]]}
        dots={[[175, 1520], [425, 1520], [675, 1520]]}
        label={{ x: 105, y: 1512, text: "manage", anchor: "middle" }}
        delay={0.9}
      />
      {[175, 425, 675].map((x) => (
        <Wire key={x} points={[[x, 1550], [x, 1520]]} head={false} />
      ))}
      {STEPS.slice(1).map((_, i) => {
        const x = 40 + i * 176 + 140;
        return <Wire key={x} points={[[x, 1806], [x + 36, 1806]]} />;
      })}
      <Wire points={[[814, 1852], [814, 1900]]} label={{ x: 802, y: 1881, text: "if it fails", anchor: "end" }} delay={1.2} />

      <Box x={450} y={30} w={240} title="visitors" lines={["browsers, apps, API clients", "your domains or free ones"]} tint stack={2} />

      {/* Your servers. */}
      <Box x={80} y={234} w={220} title="web firewall" lines={["when you turn it on", "checks for attacks first"]} dashed />
      <Box
        x={440}
        y={225}
        w={260}
        title="Pyo Gateway"
        lines={["free HTTPS, access rules", "rate limits, TCP and UDP", "domains live in seconds"]}
        accent
      />
      <Box
        x={790}
        y={225}
        w={240}
        title="builds"
        lines={["from Git push or Dockerfile", "or with zero config", "on a server or a build server"]}
      />
      <Box x={80} y={384} w={190} title="files" lines={["volumes that keep data", "when a service restarts"]} />
      <Box
        x={420}
        y={375}
        w={300}
        title="services"
        lines={["sites, APIs, workers, cron jobs", "replicas across your servers", "zero-downtime deploys"]}
        accent
        stack={2}
      />
      <Box
        x={420}
        y={535}
        w={300}
        title="databases"
        lines={["Postgres, MySQL, key-value", "point-in-time recovery", "a replica takes over", "if a server is lost"]}
        accent
        stack={2}
      />
      <Box x={80} y={715} w={240} title="Pyo agent" lines={["one on each cluster", "connects out to Pyo", "nothing connects in"]} accent />
      <Box x={380} y={724} w={220} title="log collector" lines={["on each server", "sends request logs"]} stack={2} />

      {/* Backups. */}
      <Store
        cx={735}
        y={920}
        w={160}
        title="backup store"
        caption={[
          "built-in or your own S3",
          "files, encrypted",
          "Postgres and MySQL,",
          "to a point in time",
          "key-value, encrypted",
          "Pyo itself, encrypted",
        ]}
      />

      {/* Pyo itself. */}
      <Box x={70} y={1195} w={260} title="dashboard and API" lines={["where you, the CLI and", "AI assistants work"]} accent />
      <Store cx={490} y={1195} w={180} title="observability" caption={["ClickHouse", "requests and metrics", "for analytics and logs"]} />
      <Store cx={910} y={1195} w={170} title="registry" caption={["your built images", "servers pull from here"]} />
      <Store
        cx={200}
        y={1320}
        w={170}
        title="Pyo's database"
        caption={["Postgres", "teams, projects, settings", "history, encrypted secrets"]}
      />
      <Box x={590} y={1322} w={230} title="background workers" lines={["deploys, backups, checks"]} accent stack={1} />

      {/* You. */}
      {CLIENTS.map(([title, line], i) => (
        <Box key={title} x={70 + i * 250} y={1550} w={210} title={title} lines={[line]} tint />
      ))}
      <text className="arch-title" x={550} y={1650}>
        you and your team
      </text>
      <text className="arch-muted" x={550} y={1670}>
        owner, admin, developer, viewer
      </text>

      {/* A deploy, step by step. */}
      {STEPS.map(([title, lines], i) => (
        <Box key={title} x={40 + i * 176} y={1760} w={140} title={`${i + 1} ${title}`} lines={lines} accent={i === 5} />
      ))}
      <Box
        x={684}
        y={1900}
        w={260}
        title="roll back"
        lines={["old replicas keep serving", "the previous version returns", "you can turn this off"]}
        dashed
      />
    </>
  );
}

export function ArchitectureDiagram() {
  // On a phone it's wider than the screen: start at its middle, where the
  // way in is, rather than its left edge.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  return (
    <figure className="m-0">
      <p className="arch-hint" aria-hidden>
        Scroll sideways to see it all
      </p>
      <div ref={scroller} className="arch-scroll">
        <svg className="arch-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="arch-summary">
          <Diagram />
        </svg>
      </div>

      <figcaption id="arch-summary" className="sr-only">
        Read from top to bottom. Visitors, in browsers, apps and API clients,
        reach your services over HTTPS, on your own domains or free ones. Pyo
        wraps your servers, your backups and its own parts. On your servers,
        visitors arrive at Pyo Gateway. It gives free HTTPS, puts new domains
        live in seconds, and applies access rules and rate limits, for websites
        and for TCP and UDP ports. When you turn on the web firewall, the
        gateway has it check each request for attacks first. The gateway sends
        requests to your services: sites, APIs, workers and cron jobs, whose
        replicas spread across your servers, with zero-downtime deploys.
        Services read and write files on volumes, which keep their data when a
        service restarts, and send queries to databases: Postgres, MySQL and
        key-value, with point-in-time recovery. With high availability, a
        replica takes over if a server is lost. Builds turn your code into an
        image, from a Git push, a Dockerfile or with zero config, on one of
        your servers or a build server of its own, and send it to Pyo's
        registry. The Pyo agent, one on each cluster, connects out to Pyo, so
        nothing connects in. Pyo sends it commands, and gets back status, logs
        and metrics. A log collector on each server sends request logs to Pyo.
        Files and databases are backed up to the built-in store or your own S3
        bucket: files encrypted, Postgres and MySQL to a point in time,
        key-value as encrypted snapshots, and Pyo itself encrypted. Pyo itself
        runs on your server or on Pyo Cloud. Its dashboard and API are where
        you, the CLI and AI assistants work. It keeps teams, projects,
        settings, history and encrypted secrets in its own Postgres database,
        which also holds the jobs that background workers run: deploys,
        backups and checks. Requests and metrics go to ClickHouse, for
        analytics and logs. The registry holds your built images, and servers
        pull them from there. Below it all is you and your team, as owners,
        admins, developers and viewers, working from the dashboard, the CLI,
        the API or an AI assistant over MCP. Then a deploy, step by step. You
        push to Git or choose Deploy. A builder on your server makes an image.
        The image goes to the registry. One new replica starts beside the old
        ones. When its health check passes, traffic moves to it. An old
        replica stops, and this repeats until all are new. If it fails, the
        old replicas keep serving and the previous version comes back. You can
        turn this off per service.
      </figcaption>
    </figure>
  );
}

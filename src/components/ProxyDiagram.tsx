import { useId } from "react";

// The gateway page's "Traefik vs Envoy" picture, drawn as two small
// flowcharts in the style of a Mermaid graph (boxes, arrows with labels on
// the line, dashed groups). Hand-drawn SVG so it needs no library and
// follows the docs theme.

type Tone = "neutral" | "danger" | "safe";

const NODE: Record<Tone, string> = {
  neutral: "fill-fd-card stroke-fd-border",
  danger: "fill-destructive/10 stroke-destructive",
  safe: "fill-success/10 stroke-success",
};
const EDGE: Record<Tone, string> = {
  neutral: "stroke-fd-muted-foreground",
  danger: "stroke-destructive",
  safe: "stroke-success",
};
const TEXT: Record<Tone, string> = {
  neutral: "fill-fd-muted-foreground",
  danger: "fill-destructive",
  safe: "fill-success",
};

type Node = { x: number; y: number; w: number; h: number; title: string; note?: string; tone?: Tone };
type Edge = { d: string; label?: string; at?: [number, number]; tone?: Tone; arrow?: boolean };
type Group = { x: number; y: number; w: number; h: number; label: string; tone?: Tone };

function Graph({
  title,
  width,
  height,
  nodes,
  edges,
  groups = [],
}: {
  title: string;
  width: number;
  height: number;
  nodes: Node[];
  edges: Edge[];
  groups?: Group[];
}) {
  const id = useId().replace(/:/g, "");
  const tones: Tone[] = ["neutral", "danger", "safe"];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={title}
      className="h-auto w-full font-sans"
    >
      <defs>
        {tones.map((t) => (
          <marker
            key={t}
            id={`${id}-${t}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className={`${EDGE[t].replace("stroke-", "fill-")}`} />
          </marker>
        ))}
      </defs>

      {groups.map((g) => (
        <g key={g.label}>
          <rect
            x={g.x}
            y={g.y}
            width={g.w}
            height={g.h}
            rx={8}
            strokeDasharray="5 4"
            className={`fill-fd-muted/40 ${g.tone ? EDGE[g.tone] : "stroke-fd-border"}`}
          />
          <text x={g.x + 10} y={g.y + 16} className={`text-[10.5px] font-medium ${g.tone ? TEXT[g.tone] : "fill-fd-muted-foreground"}`}>
            {g.label}
          </text>
        </g>
      ))}

      {edges.map((e, i) => (
        <path
          key={i}
          d={e.d}
          fill="none"
          strokeWidth={1.4}
          className={EDGE[e.tone ?? "neutral"]}
          markerEnd={e.arrow === false ? undefined : `url(#${id}-${e.tone ?? "neutral"})`}
        />
      ))}

      {nodes.map((n) => {
        const t = n.tone ?? "neutral";
        return (
          <g key={n.title + n.x}>
            <rect
              x={n.x - n.w / 2}
              y={n.y - n.h / 2}
              width={n.w}
              height={n.h}
              rx={6}
              strokeWidth={1.3}
              className={NODE[t]}
            />
            <text
              x={n.x}
              y={n.note ? n.y - 4 : n.y + 4}
              textAnchor="middle"
              className="fill-fd-foreground text-[12.5px] font-semibold"
            >
              {n.title}
            </text>
            {n.note ? (
              <text x={n.x} y={n.y + 13} textAnchor="middle" className="fill-fd-muted-foreground text-[10.5px]">
                {n.note}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* Edge labels last, on a background so the line passes behind them. */}
      {edges
        .filter((e) => e.label && e.at)
        .map((e, i) => {
          const [x, y] = e.at!;
          const w = e.label!.length * 5.6 + 14;
          return (
            <g key={`l${i}`}>
              <rect x={x - w / 2} y={y - 9} width={w} height={18} rx={4} className="fill-fd-card" />
              <text x={x} y={y + 3.5} textAnchor="middle" className={`text-[10.5px] font-medium ${TEXT[e.tone ?? "neutral"]}`}>
                {e.label}
              </text>
            </g>
          );
        })}
    </svg>
  );
}

const W = 340;

export function ProxyDiagram() {
  return (
    <figure className="not-prose my-6">
      <div className="grid items-start gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-fd-border bg-fd-card p-3">
          <p className="mb-1 flex items-baseline justify-between gap-2 px-1 text-[13.5px] font-semibold text-fd-foreground">
            Traefik
            <span className="text-[11.5px] font-medium text-destructive">Can see every project</span>
          </p>
          <Graph
            title="Traefik: the proxy handling public traffic reads Secrets in every project, certificates and your variables alike."
            width={W}
            height={346}
            nodes={[
              { x: 170, y: 34, w: 150, h: 38, title: "Internet" },
              { x: 170, y: 140, w: 270, h: 52, title: "Traefik", note: "Handles public traffic · holds cluster credentials", tone: "danger" },
              { x: 94, y: 300, w: 140, h: 50, title: "Project A", note: "Certificate + variables", tone: "danger" },
              { x: 246, y: 300, w: 140, h: 50, title: "Project B", note: "Certificate + variables", tone: "danger" },
            ]}
            groups={[{ x: 12, y: 238, w: 316, h: 96, label: "Your projects" }]}
            edges={[
              { d: "M170 53 V112", label: "requests", at: [170, 84] },
              { d: "M170 166 V206 H94 V273", tone: "danger" },
              { d: "M170 206 H246 V273", tone: "danger" },
              { d: "M170 206 V206", label: "reads Secrets in every project", at: [170, 200], tone: "danger", arrow: false },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-fd-border bg-fd-card p-3">
          <p className="mb-1 flex items-baseline justify-between gap-2 px-1 text-[13.5px] font-semibold text-fd-foreground">
            Envoy Gateway
            <span className="text-[11.5px] font-medium text-success">Sees no Secrets</span>
          </p>
          <Graph
            title="Envoy Gateway: the proxy handling public traffic holds no cluster credentials. A controller reads only the certificates and hands them to it. Your variables stay in your projects."
            width={W}
            height={560}
            nodes={[
              { x: 170, y: 34, w: 150, h: 38, title: "Internet" },
              { x: 170, y: 140, w: 270, h: 52, title: "Envoy proxy", note: "Handles public traffic · no cluster credentials", tone: "safe" },
              { x: 170, y: 262, w: 230, h: 52, title: "Controller", note: "Never handles public traffic" },
              { x: 170, y: 384, w: 230, h: 52, title: "Certificates", note: "Kept in a place of their own" },
              { x: 94, y: 500, w: 140, h: 50, title: "Project A", note: "Your variables only", tone: "safe" },
              { x: 246, y: 500, w: 140, h: 50, title: "Project B", note: "Your variables only", tone: "safe" },
            ]}
            groups={[{ x: 12, y: 438, w: 316, h: 96, label: "Your projects · out of the proxy's reach", tone: "safe" }]}
            edges={[
              { d: "M170 53 V112", label: "requests", at: [170, 84] },
              { d: "M170 236 V168", label: "routes + certificates", at: [170, 202] },
              { d: "M170 288 V356", label: "reads only these", at: [170, 322] },
            ]}
          />
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[12px] text-fd-muted-foreground">
        What the part handling public traffic can see.
      </figcaption>
    </figure>
  );
}

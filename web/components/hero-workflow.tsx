/**
 * Ambient hero backdrop: a subtle CI-pipeline graph — jobs (nodes) fan out and
 * merge, data pulses flow along the edges, and small packets travel through the
 * pipeline. Pure SVG + CSS (no JS runtime); animations live in globals.css and
 * are frozen under prefers-reduced-motion. Decorative only (aria-hidden).
 */

type Node = { x: number; y: number; r: number; pulse?: boolean };

const NODES: Node[] = [
  { x: 130, y: 190, r: 7, pulse: true },
  { x: 470, y: 92, r: 6 },
  { x: 470, y: 190, r: 6, pulse: true },
  { x: 470, y: 288, r: 6 },
  { x: 820, y: 190, r: 8, pulse: true },
  { x: 1080, y: 190, r: 7, pulse: true },
];

const EDGES = [
  "M130 190 L470 92",
  "M130 190 L470 190",
  "M130 190 L470 288",
  "M470 92 L820 190",
  "M470 190 L820 190",
  "M470 288 L820 190",
  "M820 190 L1080 190",
];

// Staggered so packets appear to flow entry → jobs → merge → deploy.
const PACKET_DELAY = [0, 0.35, 0.7, 1.6, 1.95, 2.3, 3.1];

export function HeroWorkflow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] overflow-hidden text-primary [mask-image:linear-gradient(to_top,black,black_35%,transparent)]"
    >
      <svg
        viewBox="0 0 1200 380"
        preserveAspectRatio="xMidYMax meet"
        className="h-full w-full opacity-60"
        fill="none"
      >
        {EDGES.map((d, i) => (
          <g key={`e${i}`}>
            <path d={d} stroke="currentColor" strokeOpacity={0.13} strokeWidth={1.5} />
            <path
              d={d}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth={1.5}
              strokeDasharray="5 11"
              className="wf-flow"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          </g>
        ))}

        {EDGES.map((d, i) => (
          <circle
            key={`p${i}`}
            r={3.5}
            fill="currentColor"
            className="wf-packet"
            style={{ offsetPath: `path('${d}')`, animationDelay: `${PACKET_DELAY[i]}s` }}
          />
        ))}

        {NODES.map((n, i) => (
          <g key={`n${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r + 4}
              stroke="currentColor"
              strokeOpacity={0.22}
              strokeWidth={1}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="currentColor"
              fillOpacity={0.5}
              className={n.pulse ? "wf-node" : undefined}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

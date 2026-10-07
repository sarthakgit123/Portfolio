"use client";

import { cn } from "@/lib/utils";

/**
 * Schematic preview art, one per project. Deliberately abstract rather than a
 * fake screenshot: each illustrates the project's mechanism without pretending
 * to be UI that may not look like this.
 */

/**
 * Deterministic pseudo-random in [0,1).
 *
 * Rounded to 4dp so the value serialises identically on server and client —
 * Math.sin can differ in the final ulp between JS engines, which React reports
 * as a hydration mismatch.
 */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 10000) / 10000;
}

/** Same reasoning as `rand` — keep derived geometry stable across engines. */
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Battery: capacity fading across cycles toward the 80% end-of-life line. */
function CapacityFade() {
  const points = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    // Gentle fade from 100% toward ~75%, with a little measurement noise.
    const capacity = 100 - 25 * Math.pow(t, 1.6) + (rand(i + 3) - 0.5) * 2.2;
    return {
      x: round(20 + t * 280),
      y: round(170 - ((capacity - 70) / 32) * 130),
    };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  // 80% capacity mapped onto the same scale as the points above.
  const eolY = round(170 - ((80 - 70) / 32) * 130);

  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="pv-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="20"
          x2="300"
          y1={40 + i * 36}
          y2={40 + i * 36}
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
        />
      ))}

      <path d={`${path} L300,180 L20,180 Z`} fill="url(#pv-fade)" />
      <path
        d={path}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.4"
        opacity="0.85"
      />

      <line
        x1="20"
        x2="300"
        y1={eolY}
        y2={eolY}
        stroke="#e4e4e7"
        strokeWidth="1"
        strokeDasharray="4 5"
        opacity="0.6"
      />
      <text
        x="300"
        y={eolY - 6}
        textAnchor="end"
        className="fill-[#b4c2c6]"
        style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace" }}
      >
        EOL 80%
      </text>

      {points
        .filter((_, i) => i % 6 === 0)
        .map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2.2"
            fill="#ffffff"
            opacity="0.7"
          />
        ))}
    </svg>
  );
}

/** Expense manager: categorised spend against a budget threshold. */
function AnalyticsField() {
  const bars = [38, 62, 46, 78, 54, 88, 66, 96, 58, 72, 84, 50];

  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="pv-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="16"
          x2="304"
          y1={44 + i * 36}
          y2={44 + i * 36}
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
        />
      ))}

      {bars.map((value, i) => {
        const h = (value / 100) * 110;
        return (
          <rect
            key={i}
            x={20 + i * 24}
            y={round(160 - h)}
            width="11"
            height={round(h)}
            rx="3"
            fill="url(#pv-bar)"
            opacity={i === 7 ? 1 : 0.45}
          />
        );
      })}

      {/* Budget threshold — what fires the alert. */}
      <line
        x1="16"
        x2="304"
        y1="66"
        y2="66"
        stroke="#e4e4e7"
        strokeWidth="1"
        strokeDasharray="4 5"
        opacity="0.6"
      />
      <circle cx="205" cy="66" r="3.5" fill="#ffffff" />
    </svg>
  );
}

/** RecruitAI: an embedding field with a cluster of ranked matches. */
function EmbeddingField() {
  const cols = 16;
  const rows = 10;
  const dots = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const n = rand(i + 1);
    const inCluster = col > 9 && row > 1 && row < 6 && n > 0.45;
    return { i, col, row, n, inCluster };
  });

  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="pv-cluster" cx="72%" cy="38%" r="34%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pv-edge" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <rect width="320" height="200" fill="url(#pv-cluster)" />

      {dots.map(({ i, col, row, n, inCluster }) => (
        <circle
          key={i}
          cx={18 + col * 18.5}
          cy={20 + row * 17.5}
          r={inCluster ? 2.6 : 1.5}
          fill="#ffffff"
          opacity={round(inCluster ? 0.6 + n * 0.4 : 0.09 + n * 0.12)}
        />
      ))}

      {/* Query vector reaching into the cluster. */}
      <line
        x1="24"
        y1="168"
        x2="238"
        y2="74"
        stroke="url(#pv-edge)"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.8"
      />
      <circle cx="24" cy="168" r="3.5" fill="#71717a" />
      <circle cx="238" cy="74" r="3.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * Nexavir: clinical demand narrowing into prescriptions.
 *
 * Back on the SVG midpoint. It used to sit at x=212 to dodge the copy panel,
 * which overlapped the visual's left edge in the old layout; the panels no
 * longer overlap, so the offset would now just look off-centre.
 */
const FUNNEL_CX = 160;

function ConversionFunnel() {
  const stages = [
    { label: "Alerts", width: 178, opacity: 0.5 },
    { label: "Positive", width: 134, opacity: 0.38 },
    { label: "Prescribed", width: 84, opacity: 0.95 },
  ];

  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      {stages.map((stage, i) => {
        const x = round(FUNNEL_CX - stage.width / 2);
        const y = 38 + i * 46;
        return (
          <g key={stage.label}>
            <rect
              x={x}
              y={y}
              width={stage.width}
              height="26"
              rx="13"
              fill="#ffffff"
              opacity={stage.opacity}
            />
            <text
              x={FUNNEL_CX}
              y={y + 17}
              textAnchor="middle"
              className={i === 2 ? "fill-[#08080a]" : "fill-[#f5f5f5]"}
              style={{ fontSize: 10, fontFamily: "var(--font-mono), monospace" }}
            >
              {stage.label}
            </text>

            {i < stages.length - 1 ? (
              <line
                x1={FUNNEL_CX}
                y1={y + 28}
                x2={FUNNEL_CX}
                y2={y + 44}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
            ) : null}
          </g>
        );
      })}

      <text
        x={FUNNEL_CX}
        y="188"
        textAnchor="middle"
        className="fill-[#b4c2c6]"
        style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace" }}
      >
        41.6% convert within 30 days
      </text>
    </svg>
  );
}

/**
 * Ice Cream Shop: three roles, one order record.
 *
 * The point of the project is the permission model, so the diagram draws the
 * roles as separate lanes that all touch the same object rather than drawing
 * a storefront.
 */
function RoleLanes() {
  const roles = [
    { label: "Customer", y: 46, reach: 0.95 },
    { label: "Vendor", y: 100, reach: 0.95 },
    { label: "Admin", y: 154, reach: 0.95 },
  ];

  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden="true">
      {roles.map((role) => (
        <g key={role.label}>
          <rect
            x="18"
            y={role.y - 13}
            width="88"
            height="26"
            rx="13"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1"
          />
          <text
            x="62"
            y={role.y + 4}
            textAnchor="middle"
            className="fill-[#cdd9dd]"
            style={{ fontSize: 10, fontFamily: "var(--font-mono), monospace" }}
          >
            {role.label}
          </text>

          {/* Lane into the shared record. */}
          <line
            x1="108"
            y1={role.y}
            x2="214"
            y2="100"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        </g>
      ))}

      {/* The order record every lane converges on. */}
      <circle cx="232" cy="100" r="30" fill="rgba(255,255,255,0.07)" />
      <circle
        cx="232"
        cy="100"
        r="30"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.2"
      />
      <text
        x="232"
        y="97"
        textAnchor="middle"
        className="fill-[#f2f7f8]"
        style={{ fontSize: 10, fontFamily: "var(--font-mono), monospace" }}
      >
        Order
      </text>
      <text
        x="232"
        y="110"
        textAnchor="middle"
        className="fill-[#9fb0b5]"
        style={{ fontSize: 8, fontFamily: "var(--font-mono), monospace" }}
      >
        scoped
      </text>
    </svg>
  );
}

const VISUALS: Record<string, () => React.JSX.Element> = {
  "battery-state-estimation": CapacityFade,
  "smart-expense-manager": AnalyticsField,
  recruitai: EmbeddingField,
  "nexavir-case-study": ConversionFunnel,
  "ice-cream-shop": RoleLanes,
};

export function ProjectVisual({
  variant,
  className,
}: {
  variant: string;
  className?: string;
}) {
  const Visual = VISUALS[variant] ?? EmbeddingField;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Visual />
    </div>
  );
}

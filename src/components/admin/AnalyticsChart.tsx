"use client";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  data: DataPoint[];
  type: "bar" | "line" | "pie";
  title: string;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

function BarChart({ data }: { data: DataPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-text-muted" title={d.label}>
            {d.label}
          </span>
          <div className="h-5 flex-1 overflow-hidden rounded bg-bg">
            <div
              className="h-full rounded transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color ?? COLORS[i % COLORS.length] }}
            />
          </div>
          <span className="w-12 text-right text-xs font-medium text-text-primary">{d.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 600;
  const h = 160;
  const pad = { top: 10, right: 10, bottom: 30, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    x: pad.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: pad.top + chartH - (d.value / max) * chartH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`;

  // x-axis labels: show up to 7 evenly spaced
  const labelStep = Math.max(Math.ceil(data.length / 7), 1);
  const xLabels = data
    .filter((_, i) => i % labelStep === 0 || i === data.length - 1)
    .map((d, _, arr) => d);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[400px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={pad.left}
            y1={pad.top + chartH * (1 - pct)}
            x2={w - pad.right}
            y2={pad.top + chartH * (1 - pct)}
            stroke="#374151"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#10b981" />
        ))}
        {data.map((d, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null;
          const x = pad.left + (i / Math.max(data.length - 1, 1)) * chartW;
          const short = d.label.length > 5 ? d.label.slice(5) : d.label;
          return (
            <text key={i} x={x} y={h - 5} textAnchor="middle" fill="#9ca3af" fontSize="9">
              {short || d.label}
            </text>
          );
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <text
            key={pct}
            x={pad.left - 5}
            y={pad.top + chartH * (1 - pct) + 3}
            textAnchor="end"
            fill="#9ca3af"
            fontSize="9"
          >
            {Math.round(max * pct)}
          </text>
        ))}
      </svg>
    </div>
  );
}

function PieChart({ data }: { data: DataPoint[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const pct = ((d.value / total) * 100).toFixed(1);
        const color = d.color ?? COLORS[i % COLORS.length];
        return (
          <div key={d.label} className="flex items-center gap-3">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: color }} />
            <span className="w-24 shrink-0 truncate text-xs text-text-muted">{d.label}</span>
            <div className="h-4 flex-1 overflow-hidden rounded bg-bg">
              <div className="h-full rounded transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            <span className="w-16 text-right text-xs text-text-primary">
              {d.value.toLocaleString()} ({pct}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsChart({ data, type, title }: AnalyticsChartProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text-muted">{title}</h3>
      {type === "bar" && <BarChart data={data} />}
      {type === "line" && <LineChart data={data} />}
      {type === "pie" && <PieChart data={data} />}
    </div>
  );
}

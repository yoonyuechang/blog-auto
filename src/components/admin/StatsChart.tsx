"use client";

interface BarData {
  label: string;
  value: number;
  color: string;
}

export default function StatsChart({
  data,
  title,
}: {
  data: BarData[];
  title: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text-muted">{title}</h3>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 truncate text-xs text-text-muted">
              {d.label}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded bg-bg">
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  backgroundColor: d.color,
                }}
              />
            </div>
            <span className="w-10 text-right text-xs font-medium text-text-primary">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

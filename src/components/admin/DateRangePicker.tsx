"use client";

const presets = [
  { key: "7d", label: "최근 7일" },
  { key: "30d", label: "최근 30일" },
  { key: "90d", label: "최근 90일" },
  { key: "all", label: "전체" },
] as const;

export type DateRange = "7d" | "30d" | "90d" | "all";

export default function DateRangePicker({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
      {presets.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === p.key ? "bg-emerald-500 text-white" : "text-text-muted hover:text-text-primary"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

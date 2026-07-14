import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  change?: string;
}

export default function StatsCard({ icon: Icon, value, label, change }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
          <Icon size={20} className="text-emerald-400" />
        </div>
        {change && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
            <span>↑</span> {change}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-text-primary">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="mt-0.5 text-sm text-text-muted">{label}</p>
    </div>
  );
}

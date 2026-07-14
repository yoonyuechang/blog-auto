type Level = "입문/초급" | "중급" | "고급";
type Variant = "emerald" | "cyan" | "yellow" | "red" | "purple" | "blue" | "amber" | "violet" | "rose";

interface BadgeProps {
  children?: React.ReactNode;
  level?: Level;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

const LEVEL_TO_VARIANT: Record<Level, Variant> = {
  "입문/초급": "emerald",
  "중급": "amber",
  "고급": "red",
};

const VARIANT_STYLES: Record<Variant, string> = {
  emerald: "bg-emerald-950 text-emerald-400 border-emerald-600",
  cyan: "bg-cyan-950 text-cyan-400 border-cyan-600",
  yellow: "bg-yellow-950 text-yellow-400 border-yellow-600",
  red: "bg-red-950 text-red-400 border-red-600",
  purple: "bg-purple-950 text-purple-400 border-purple-600",
  blue: "bg-blue-950 text-blue-400 border-blue-600",
  amber: "bg-amber-950 text-amber-400 border-amber-600",
  violet: "bg-violet-950 text-violet-400 border-violet-600",
  rose: "bg-rose-950 text-rose-400 border-rose-600",
};

const DOT_COLORS: Record<Variant, string> = {
  emerald: "bg-emerald-400",
  cyan: "bg-cyan-400",
  yellow: "bg-yellow-400",
  red: "bg-red-400",
  purple: "bg-purple-400",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
  rose: "bg-rose-400",
};

const SIZE_STYLES = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export default function Badge({ children, level, variant, size = "sm", dot = false }: BadgeProps) {
  const v = variant ?? (level ? LEVEL_TO_VARIANT[level] : "emerald");
  const label = children ?? level ?? "";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${VARIANT_STYLES[v]} ${SIZE_STYLES[size]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[v]}`} />}
      {label}
    </span>
  );
}

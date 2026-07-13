interface BadgeProps {
  level: "입문/초급" | "중급" | "고급";
  size?: "sm" | "md";
}

const levelStyles: Record<string, string> = {
  "입문/초급": "bg-emerald-950 text-emerald-400 border-emerald-600",
  "중급": "bg-amber-950 text-amber-400 border-amber-600",
  "고급": "bg-red-950 text-red-400 border-red-600",
};

export default function Badge({ level, size = "sm" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-medium ${levelStyles[level] || ""} ${
        size === "md" ? "px-3 py-1 text-sm" : ""
      }`}
    >
      {level}
    </span>
  );
}

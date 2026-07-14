"use client";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

const FALLBACK_COLORS = [
  "from-emerald-400 to-cyan-400",
  "from-violet-400 to-fuchsia-400",
  "from-amber-400 to-orange-400",
  "from-rose-400 to-pink-400",
  "from-sky-400 to-blue-400",
];

function getFallbackColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

export default function Avatar({ src, name, size = "md", online }: AvatarProps) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${SIZES[size]} rounded-full object-cover`} />
      ) : (
        <div className={`flex items-center justify-center rounded-full bg-gradient-to-br ${getFallbackColor(name)} font-bold text-white ${SIZES[size]}`}>
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 rounded-full border-2 border-card bg-emerald-400 ${
          size === "lg" ? "h-3.5 w-3.5" : size === "md" ? "h-2.5 w-2.5" : "h-2 w-2"
        } ${!online ? "bg-text-muted" : ""}`} />
      )}
    </div>
  );
}

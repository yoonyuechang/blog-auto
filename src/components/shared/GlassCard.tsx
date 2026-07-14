"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg";
}

const blurMap = { sm: "blur(8px)", md: "blur(12px)", lg: "blur(20px)" };

export default function GlassCard({ children, className = "", blur = "md" }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_24px_rgba(52,211,153,0.08)] ${className}`}
      style={{ backdropFilter: blurMap[blur], WebkitBackdropFilter: blurMap[blur] }}
    >
      {children}
    </div>
  );
}

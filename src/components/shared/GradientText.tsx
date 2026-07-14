import type { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  from?: string;
  to?: string;
  className?: string;
}

export default function GradientText({ children, from = "#34D399", to = "#22D3EE", className = "" }: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

"use client";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export default function GradientBorder({
  children,
  className = "",
  from = "#34D399",
  to = "#22D3EE",
}: GradientBorderProps) {
  return (
    <div
      className={`gradient-border rounded-xl ${className}`}
      style={{ "--border-from": from, "--border-to": to } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

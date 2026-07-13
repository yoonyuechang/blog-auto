"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  accentColor?: string;
}

export default function Card({ children, href, className = "", accentColor = "#34D399" }: CardProps) {
  const baseStyles =
    "group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3),0_0_12px_rgba(52,211,153,0.08)] overflow-hidden";

  const accent = (
    <span
      className="absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all duration-200 group-hover:w-1.5"
      style={{ backgroundColor: accentColor }}
    />
  );

  if (href) {
    return (
      <a href={href} className={`${baseStyles} block ${className}`}>
        {accent}
        {children}
      </a>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`}>
      {accent}
      {children}
    </div>
  );
}

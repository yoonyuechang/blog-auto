"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function Card({ children, href, className = "" }: CardProps) {
  const baseStyles =
    "group rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]";

  if (href) {
    return (
      <a href={href} className={`${baseStyles} block ${className}`}>
        {children}
      </a>
    );
  }

  return <div className={`${baseStyles} ${className}`}>{children}</div>;
}

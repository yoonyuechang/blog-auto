"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function GlowCard({ children, className = "", glowColor = "rgba(52,211,153,0.15)" }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
    el.style.setProperty("--glow-color", glowColor);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`glow-card relative ${className}`}
    >
      {children}
    </div>
  );
}

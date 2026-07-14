"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

const OFFSETS: Record<Direction, string> = {
  up: "translateY(20px)",
  down: "translateY(-20px)",
  left: "translateX(20px)",
  right: "translateX(-20px)",
};

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transform: OFFSETS[direction] }}
    >
      {children}
    </div>
  );
}

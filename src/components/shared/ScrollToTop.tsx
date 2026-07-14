"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setShow(y > 300);
        setProgress(max > 0 ? Math.min(y / max, 1) : 0);
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-opacity hover:bg-emerald-600"
    >
      <svg className="absolute inset-0 -rotate-90" width="48" height="48">
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3"
        />
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="none" stroke="url(#emerald-cyan-gradient)" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      <defs>
        <linearGradient id="emerald-cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <ArrowUp size={20} className="relative z-10" />
    </button>
  );
}

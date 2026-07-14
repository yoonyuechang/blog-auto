"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Newspaper, ThumbsUp } from "lucide-react";

interface SocialProofProps {
  subscribers: number;
  articles: number;
  satisfaction: number;
}

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{value.toLocaleString()}</>;
}

export default function SocialProof({ subscribers, articles, satisfaction }: SocialProofProps) {
  const stats = [
    { icon: Users, value: subscribers, suffix: "+", label: "구독자", color: "text-emerald-400" },
    { icon: Newspaper, value: articles, suffix: "+", label: "아티클", color: "text-cyan-400" },
    { icon: ThumbsUp, value: satisfaction, suffix: "%", label: "만족도", color: "text-emerald-400" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {stats.map(({ icon: Icon, value, suffix, label, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border">
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-text-primary">
                <AnimatedCounter target={value} />{suffix}
              </p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

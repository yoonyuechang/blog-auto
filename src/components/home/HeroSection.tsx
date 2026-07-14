"use client";

import { useState, useEffect, useRef } from "react";
import { Newspaper, FolderOpen, RefreshCw, Tag } from "lucide-react";
import Button from "@/components/shared/Button";

interface HeroSectionProps {
  totalArticles: number;
  todayArticles: number;
  trendingTags?: string[];
}

const DEFAULT_TAGS = ["React", "Next.js", "AI", "Rust", "Docker", "TypeScript", "Python", "Kubernetes"];

export default function HeroSection({
  totalArticles,
  todayArticles,
  trendingTags = DEFAULT_TAGS,
}: HeroSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animated counters
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayToday, setDisplayToday] = useState(0);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    const start = performance.now();
    const duration = 1500;
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplayTotal(Math.round(ease * totalArticles));
      setDisplayToday(Math.round(ease * todayArticles));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [totalArticles, todayArticles]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 text-center md:py-32">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.12),transparent_70%)]" />
        <div className="absolute left-1/2 top-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06),transparent_70%)]" />
      </div>

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
        매일 자동 수집 · AI 요약
      </div>

      {/* Headline */}
      <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">
        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
          DevPulse
        </span>
        <br />
        <span className="mt-2 block text-text-primary">
          매일 AI가 요약하는
          <br className="hidden md:block" />
          IT 트렌드
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary md:text-lg">
        주니어 개발자를 위한 기술 펄스 — 하루 5분, 오늘의 기술 트렌드를 한눈에
      </p>

      {/* Stats */}
      <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted md:gap-10">
        <div className="flex items-center gap-2">
          <Newspaper size={18} className="text-emerald-400" />
          <span>총 <strong className="text-text-primary">{displayTotal.toLocaleString()}</strong>개 글</span>
        </div>
        <div className="flex items-center gap-2">
          <FolderOpen size={18} className="text-cyan-400" />
          <span><strong className="text-text-primary">6</strong>개 카테고리</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw size={18} className="text-emerald-400" />
          <span><strong className="text-emerald-400">{displayToday.toLocaleString()}</strong>개 오늘 수집</span>
        </div>
      </div>

      {/* Trending tags */}
      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
        <Tag size={14} className="mr-1 text-text-muted" />
        {trendingTags.map((tag) => (
          <a
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-emerald-400/50 hover:text-emerald-400"
          >
            {tag}
          </a>
        ))}
      </div>

      {/* Subscribe form */}
      <form onSubmit={handleSubscribe} aria-label="뉴스레터 구독" className="mx-auto mt-10 flex max-w-md gap-2">
        <label htmlFor="hero-email" className="sr-only">이메일 주소</label>
        <input
          id="hero-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          className="flex-1 rounded-lg border border-border bg-card/60 px-4 py-3 text-sm text-text-primary placeholder-text-muted backdrop-blur-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
          required
        />
        <Button type="submit" disabled={subscribed || loading} size="lg">
          {subscribed ? "구독 완료!" : loading ? "구독 중..." : "구독하기"}
        </Button>
      </form>
    </section>
  );
}

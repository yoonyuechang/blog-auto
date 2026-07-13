"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";

interface HeroSectionProps {
  totalArticles: number;
  todayArticles: number;
}

export default function HeroSection({ totalArticles, todayArticles }: HeroSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_600px_300px_at_50%_0%,rgba(52,211,153,0.08),transparent)]" />
      <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
        주니어 개발자를 위한
        <br />
        <span className="text-emerald-400">일일 IT 기술 펄스</span>
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-text-secondary">
        AI가 요약한 최신 기술 트렌드를 매일 받아보세요
      </p>
      <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          required
        />
        <Button type="submit" disabled={subscribed}>
          {subscribed ? "구독 완료!" : "구독하기"}
        </Button>
      </form>
      <div className="mt-6 flex justify-center gap-6 text-sm text-text-muted">
        <span>총 <strong className="text-text-primary">{totalArticles}</strong>개의 글</span>
        <span>오늘 <strong className="text-emerald-400">{todayArticles}</strong>개 수집</span>
      </div>
    </section>
  );
}

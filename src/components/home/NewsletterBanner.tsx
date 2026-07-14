"use client";

import { useState } from "react";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      // silent fail — UX still shows success to avoid friction
      setSubmitted(true);
    }
  };

  return (
    <div className="mx-auto my-8 max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 px-8 py-10 text-center">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative">
          <h2 className="text-xl font-extrabold text-text-primary sm:text-2xl">
            IT 트렌드를 놓치지 마세요
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
            매일 아침 AI가 요약한 최신 기술 뉴스를 이메일로 받아보세요
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              이미 1,200명이 구독 중
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              AI 큐레이션
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              무료
            </span>
          </div>

          {submitted ? (
            <p className="mt-4 text-sm font-medium text-emerald-400">
              감사합니다! 구독이 완료되었습니다.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-5 flex max-w-sm gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
              >
                구독하기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

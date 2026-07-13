"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [prefs, setPrefs] = useState<string[]>([]);

  const categories = ["인공지능", "웹개발", "오픈소스", "논문/리서치", "커리어", "기타"];

  const togglePref = (cat: string) => {
    setPrefs((prev) => prev.includes(cat) ? prev.filter((p) => p !== cat) : [...prev, cat]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, preferences: prefs }),
    });
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-extrabold text-text-primary">구독 감사합니다! 🎉</h1>
        <p className="text-text-secondary">매주 월요일 아침, AI 요약 테크 뉴스레터를 받아보실 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-2 text-2xl font-extrabold text-text-primary">뉴스레터 구독</h1>
      <p className="mb-8 text-text-secondary">매주 월요일 아침, 주니어 개발자를 위한 AI 요약 테크 뉴스레터를 받아보세요</p>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="이메일을 입력하세요"
          className="mb-6 w-full rounded-lg border border-border bg-card px-4 py-3 text-text-primary placeholder-text-muted focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400" />
        <p className="mb-3 text-sm font-medium text-text-secondary">관심 카테고리</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} type="button" onClick={() => togglePref(cat)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${prefs.includes(cat) ? "bg-emerald-500 text-white" : "bg-card border border-border text-text-muted hover:text-text-primary"}`}>
              {cat}
            </button>
          ))}
        </div>
        <Button type="submit" className="w-full">구독하기</Button>
      </form>
    </div>
  );
}

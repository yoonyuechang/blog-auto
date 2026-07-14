"use client";

import { useState } from "react";
import { Check, ChevronDown, Mail, Sparkles, Users, Zap } from "lucide-react";
import Button from "@/components/shared/Button";

const benefits = [
  { icon: Zap, text: "매일 AI가 요약한 IT 트렌드" },
  { icon: Users, text: "주니어 개발자를 위한 맞춤 콘텐츠" },
  { icon: Check, text: "무료, 언제든 구독 취소 가능" },
];

const faqs = [
  {
    q: "뉴스레터는 언제 보내나요?",
    a: "매주 월요일 아침, 한 주간의 주요 IT 트렌드를 AI가 요약해서 보내드립니다.",
  },
  {
    q: "구독비가 있나요?",
    a: "완전 무료입니다. 신용카드 정보도 필요 없습니다.",
  },
  {
    q: "구독 취소는 어떻게 하나요?",
    a: "뉴스레터 하단의 구독 취소 버튼을 클릭하면 즉시 처리됩니다.",
  },
  {
    q: "어떤 콘텐츠를 다루나요?",
    a: "인공지능, 웹개발, 오픈소스, 논문/리서치, 커리어 등 주니어 개발자에게 유용한 기술 트렌드를 다룹니다.",
  },
];

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubscribed(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="relative mx-auto max-w-lg px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.12),transparent_70%)]" />
        </div>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Check size={32} className="text-emerald-400" />
        </div>
        <h1 className="mb-4 text-2xl font-extrabold text-text-primary">구독 감사합니다!</h1>
        <p className="text-text-secondary">매주 월요일 아침, AI 요약 테크 뉴스레터를 받아보실 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.1),transparent_70%)]" />
      </div>

      <section className="text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
          <Sparkles size={14} className="text-emerald-400" />
          AI 기반 테크 뉴스레터
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            DevPulse
          </span>
          <br />
          <span className="mt-2 block text-text-primary">뉴스레터</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary md:text-lg">
          매주 월요일 아침, AI가 요약한 주간 IT 트렌드를 이메일로 받아보세요
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-md">
        <div className="space-y-4">
          {benefits.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Icon size={18} className="text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-text-primary">{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-md">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <label htmlFor="subscribe-email" className="sr-only">이메일 주소</label>
            <input
              id="subscribe-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="이메일을 입력하세요"
              className="w-full rounded-lg border border-border bg-card/60 py-3 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted backdrop-blur-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "구독 중..." : "구독하기"}
          </Button>
        </form>
        {error && (
          <p className="mt-2 text-center text-sm text-red-400">오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
      </section>

      <section className="mx-auto mt-12 text-center">
        <p className="text-sm text-text-muted">
          이미 <strong className="text-text-primary">1,200+ 개발자</strong>가 구독 중
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {["🧑‍💻", "👩‍💻", "👨‍💻", "🧑‍🔬", "👩‍🔬"].map((emoji, i) => (
            <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-base">
              {emoji}
            </div>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-xs font-medium text-text-muted">
            +1.2k
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { value: "1,200+", label: "구독자" },
          { value: "500+", label: "아티클" },
          { value: "98%", label: "만족도" },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-xl border border-border bg-card px-6 py-5 text-center">
            <p className="text-2xl font-extrabold text-emerald-400">{value}</p>
            <p className="mt-1 text-sm text-text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-6 text-center text-lg font-bold text-text-primary">개발자들의 목소리</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { quote: "매주 화요일마다 꼭 확인합니다", name: "김개발", role: "시니어 엔지니어" },
            { quote: "AI가 선별해주는 덕분에 시간을 절약합니다", name: "박프론트", role: "프론트엔드 개발자" },
            { quote: "최신 트렌드를 놓치지 않을 수 있어 좋습니다", name: "이백엔드", role: "백엔드 개발자" },
          ].map(({ quote, name, role }) => (
            <div key={name} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-text-secondary">"{quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
                <div>
                  <p className="text-xs font-medium text-text-primary">{name}</p>
                  <p className="text-[11px] text-text-muted">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-xl rounded-xl border border-border bg-card px-6 py-5 text-center">
        <p className="text-sm font-medium text-text-primary">🛡️ 언제든 구독 취소 가능</p>
        <p className="mt-1 text-xs text-text-muted">약정 없음 · 신용카드 불필요 · 완전 무료</p>
      </section>

      <section className="mx-auto mt-16 max-w-xl">
        <h2 className="mb-6 text-center text-lg font-bold text-text-primary">자주 묻는 질문</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-card">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-text-primary"
              >
                {faq.q}
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-text-muted transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="border-t border-border px-5 py-4 text-sm text-text-secondary">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

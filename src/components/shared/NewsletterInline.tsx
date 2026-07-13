"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus("done");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mb-3 text-2xl">📬</div>
        <h3 className="mb-1 text-lg font-bold text-text-primary">매일 기술 트렌드 받아보기</h3>
        <p className="mb-4 text-sm text-text-muted">매일 엄선된 기술 뉴스를 이메일로 받아보세요</p>
        {status === "done" ? (
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <Check size={18} />
            <span className="text-sm font-medium">구독해 주셔서 감사합니다!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
            <label htmlFor="newsletter-email" className="sr-only">이메일 주소</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
            >
              <Mail size={14} />
              구독
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

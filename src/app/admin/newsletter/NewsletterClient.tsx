"use client";

import { useState } from "react";
import { Mail, Send, Download, Users, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  source: string;
  sourceUrl: string;
}

interface NewsletterData {
  subscribers: Subscriber[];
  totalActive: number;
  growthData: { date: string; count: number }[];
  articles: Article[];
}

export default function NewsletterClient({ data }: { data: NewsletterData }) {
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const handleSendNewsletter = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: data.articles }),
      });
      const result = await res.json();
      setSendResult(result.message || result.error);
    } catch {
      setSendResult("전송 실패");
    } finally {
      setSending(false);
    }
  };

  const handleExportCSV = () => {
    const activeSubscribers = data.subscribers.filter((s) => s.isActive);
    const csv = "email,subscribedAt,active\n" + activeSubscribers.map((s) => `${s.email},${s.subscribedAt},${s.isActive}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxGrowth = Math.max(...data.growthData.map((d) => d.count), 1);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">뉴스레터 관리</h1>
        <p className="mt-1 text-sm text-text-muted">구독자 관리 및 뉴스레터 발송</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <Users size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{data.totalActive}</p>
              <p className="text-sm text-text-muted">활성 구독자</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Mail size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{data.subscribers.length}</p>
              <p className="text-sm text-text-muted">전체 구독자</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-3">
              <TrendingUp size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {data.growthData.reduce((sum, d) => sum + d.count, 0)}
              </p>
              <p className="text-sm text-text-muted">최근 30일 신규</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-muted">구독자 성장 추이 (30일)</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              <Download size={14} />
              CSV 내보내기
            </button>
            <button
              onClick={handleSendNewsletter}
              disabled={sending || data.totalActive === 0}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
            >
              <Send size={14} />
              {sending ? "발송 중..." : "뉴스레터 보내기"}
            </button>
          </div>
        </div>
        {sendResult && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">{sendResult}</div>
        )}
        <div className="flex items-end gap-1" style={{ height: 120 }}>
          {data.growthData.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.count}명`}>
              <div
                className="w-full rounded-t bg-emerald-500/60 transition-all"
                style={{ height: `${(d.count / maxGrowth) * 80}px`, minHeight: d.count > 0 ? 4 : 0 }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-text-muted">
          <span>{data.growthData[0]?.date}</span>
          <span>{data.growthData[data.growthData.length - 1]?.date}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold text-text-muted">구독자 목록</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2.5 text-left font-mono text-xs uppercase text-text-muted">이메일</th>
                <th className="px-4 py-2.5 text-left font-mono text-xs uppercase text-text-muted">구독일</th>
                <th className="px-4 py-2.5 text-center font-mono text-xs uppercase text-text-muted">상태</th>
              </tr>
            </thead>
            <tbody>
              {data.subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-text-muted">구독자가 없습니다</td>
                </tr>
              ) : (
                data.subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-text-primary">{s.email}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(s.subscribedAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <CheckCircle size={14} /> 활성
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400">
                          <XCircle size={14} /> 비활성
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

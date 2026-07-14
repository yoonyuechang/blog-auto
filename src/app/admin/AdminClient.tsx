"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ListChecks, Rss, Users, BarChart3, FileText, Eye, Mail, Globe, Plus, Download } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import ApprovalQueue from "@/components/admin/ApprovalQueue";
import SourceManager from "@/components/admin/SourceManager";
import SubscriberList from "@/components/admin/SubscriberList";
import StatsChart from "@/components/admin/StatsChart";

interface AdminData {
  kpi: {
    totalArticles: number;
    pendingArticles: number;
    totalSubscribers: number;
    totalViews: number;
    sourcesCount: number;
    articlesThisWeek: number;
  };
  pendingArticles: {
    id: number;
    title: string;
    source: string;
    difficultyLevel: string;
    aiSummary: string;
    createdAt: string;
  }[];
  sources: {
    id: number;
    name: string;
    type: string;
    url: string;
    fetchInterval: string;
    isActive: boolean;
    category: string;
  }[];
  subscribers: {
    id: number;
    email: string;
    subscribedAt: string;
    isActive: boolean;
  }[];
  recentArticles: {
    id: number;
    title: string;
    category: string;
    viewCount: number;
    createdAt: string;
  }[];
}

interface Stats {
  totalArticles: number;
  totalViews: number;
  totalSubscribers: number;
  topCategories: { category: string; count: number }[];
  recentArticles: { id: number; title: string; viewCount: number; category: string; publishedAt: string }[];
}

const categoryColors: Record<string, string> = {
  "AI/ML": "#10b981",
  프론트엔드: "#3b82f6",
  백엔드: "#f59e0b",
  DevOps: "#ef4444",
  모바일: "#8b5cf6",
  데이터: "#ec4899",
};

const tabs = [
  { key: "stats" as const, label: "통계", icon: BarChart3 },
  { key: "queue" as const, label: "승인 큐", icon: ListChecks },
  { key: "sources" as const, label: "소스 관리", icon: Rss },
  { key: "subscribers" as const, label: "구독자", icon: Users },
];

export default function AdminClient({ data }: { data: AdminData }) {
  const [tab, setTab] = useState<"stats" | "queue" | "sources" | "subscribers">("stats");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleApprove = async (id: number) => {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    window.location.reload();
  };

  const handleReject = async (id: number) => {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    window.location.reload();
  };

  const handleToggleSource = async (id: number, isActive: boolean) => {
    await fetch(`/api/sources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    window.location.reload();
  };

  const handleAddSource = async (source: {
    name: string;
    url: string;
    type: string;
    fetchInterval: string;
    isActive: boolean;
    category: string;
  }) => {
    await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(source),
    });
    window.location.reload();
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">DevPulse 관리자</h1>
          <p className="mt-1 text-sm text-text-muted">{today}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/sources"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            <Download size={16} />
            아티클 수집
          </Link>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            <Plus size={16} />
            새 아티클
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={FileText} value={data.kpi.totalArticles} label="총 아티클" change={`이번 주 +${data.kpi.articlesThisWeek}`} />
        <StatsCard icon={Eye} value={data.kpi.totalViews} label="총 조회수" />
        <StatsCard icon={Mail} value={data.kpi.totalSubscribers} label="뉴스레터 구독자" />
        <StatsCard icon={Globe} value={data.kpi.sourcesCount} label="활성 소스" />
      </div>

      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === key ? "bg-emerald-500 text-white" : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === "stats" && (
        <div className="space-y-6">
          {/* Recent articles table */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-text-muted">최근 아티클</h2>
            {data.recentArticles.length === 0 ? (
              <p className="text-sm text-text-muted">아티클이 없습니다</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left font-mono text-xs uppercase text-text-muted">제목</th>
                      <th className="px-4 py-2.5 text-left font-mono text-xs uppercase text-text-muted">카테고리</th>
                      <th className="px-4 py-2.5 text-right font-mono text-xs uppercase text-text-muted">조회수</th>
                      <th className="px-4 py-2.5 text-right font-mono text-xs uppercase text-text-muted">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentArticles.map((article) => (
                      <tr key={article.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3">
                          <a href={`/article/${article.id}`} className="text-text-primary hover:text-emerald-400">
                            {article.title}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs"
                            style={{
                              backgroundColor: `${categoryColors[article.category] ?? "#6b7280"}20`,
                              color: categoryColors[article.category] ?? "#6b7280",
                            }}
                          >
                            {article.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-text-muted">{article.viewCount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-text-muted">{article.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {stats && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <StatsChart
                  title="카테고리별 아티클 수"
                  data={stats.topCategories.map((c) => ({
                    label: c.category,
                    value: c.count,
                    color: categoryColors[c.category] ?? "#6b7280",
                  }))}
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <StatsChart
                  title="최근 아티클 조회수"
                  data={stats.recentArticles.map((a) => ({
                    label: a.title.length > 14 ? a.title.slice(0, 14) + "…" : a.title,
                    value: a.viewCount,
                    color: categoryColors[a.category] ?? "#6b7280",
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        {tab === "queue" && <ApprovalQueue articles={data.pendingArticles} onApprove={handleApprove} onReject={handleReject} />}
        {tab === "sources" && <SourceManager sources={data.sources} onToggle={handleToggleSource} onAdd={handleAddSource} />}
        {tab === "subscribers" && <SubscriberList subscribers={data.subscribers} />}
      </div>
    </div>
  );
}

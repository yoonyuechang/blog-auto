"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ListChecks, Rss, Users, BarChart3, FileText, Eye, Mail, Globe, Plus, Download, Sparkles, TrendingUp } from "lucide-react";
import { Activity } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import ApprovalQueue from "@/components/admin/ApprovalQueue";
import SourceManager from "@/components/admin/SourceManager";
import SubscriberList from "@/components/admin/SubscriberList";
import StatsChart from "@/components/admin/StatsChart";
import ArticleTable from "@/components/admin/ArticleTable";
import HealthDashboard from "@/components/admin/HealthDashboard";

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
    lastFetched?: string;
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
  { key: "stats" as const, label: "대시보드", icon: BarChart3 },
  { key: "articles" as const, label: "아티클 관리", icon: FileText },
  { key: "queue" as const, label: "승인 큐", icon: ListChecks },
  { key: "sources" as const, label: "소스 관리", icon: Rss },
  { key: "subscribers" as const, label: "구독자", icon: Users },
  { key: "analytics" as const, label: "분석", icon: TrendingUp },
  { key: "system" as const, label: "시스템", icon: Activity },
];

export default function AdminClient({ data }: { data: AdminData }) {
  const [tab, setTab] = useState<"stats" | "articles" | "queue" | "sources" | "subscribers" | "analytics" | "system">("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [bulkAnalyzing, setBulkAnalyzing] = useState(false);

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

  const handleAnalyzeOne = async (articleId: number) => {
    setAnalyzing(true);
    try {
      await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });
      window.location.reload();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBulkAnalyze = async () => {
    setBulkAnalyzing(true);
    try {
      await fetch("/api/analyze", { method: "POST" });
      window.location.reload();
    } finally {
      setBulkAnalyzing(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
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

          {/* Content Calendar */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-text-muted">콘텐츠 캘린더 (이번 주)</h2>
            <ContentCalendar articles={data.recentArticles} />
          </div>

          {/* Source Health */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-text-muted">소스 상태</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.sources.map((source) => (
                <div key={source.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${source.isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{source.name}</p>
                    <p className="text-xs text-text-muted">
                      {source.lastFetched ? `마지막 수집: ${source.lastFetched}` : "수집 이력 없음"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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

      {tab === "articles" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-muted">전체 아티클</h2>
            <div className="flex gap-2">
              <button
                onClick={handleBulkAnalyze}
                disabled={bulkAnalyzing}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
              >
                <Sparkles size={14} />
                {bulkAnalyzing ? "분석 중..." : "전체 분석"}
              </button>
            </div>
          </div>
          <ArticleTable onDelete={handleDeleteArticle} />
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6">
        {tab === "queue" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-muted">승인 대기</h2>
              <button
                onClick={handleBulkAnalyze}
                disabled={bulkAnalyzing}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary disabled:opacity-50"
              >
                <Sparkles size={14} />
                {bulkAnalyzing ? "분석 중..." : "AI 전체 분석"}
              </button>
            </div>
            <ApprovalQueue articles={data.pendingArticles} onApprove={handleApprove} onReject={handleReject} />
          </div>
        )}
        {tab === "sources" && <SourceManager sources={data.sources} onToggle={handleToggleSource} onAdd={handleAddSource} />}
        {tab === "subscribers" && <SubscriberList subscribers={data.subscribers} />}
        {tab === "analytics" && (
          <div className="text-center">
            <p className="mb-4 text-sm text-text-muted">상세 분석 대시보드</p>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
            >
              <TrendingUp size={16} />
              분석 대시보드 열기
            </Link>
          </div>
        )}
        {tab === "system" && <HealthDashboard />}
      </div>
    </div>
  );
}

function ContentCalendar({ articles }: { articles: { id: number; title: string; createdAt: string; category: string }[] }) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const weekArticles: Record<string, typeof articles> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const key = d.toISOString().split("T")[0];
    weekArticles[key] = [];
  }

  articles.forEach((a) => {
    const dateStr = typeof a.createdAt === "string" ? a.createdAt : new Date(a.createdAt).toISOString().split("T")[0];
    if (weekArticles[dateStr]) {
      weekArticles[dateStr].push(a);
    }
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const key = d.toISOString().split("T")[0];
        const isToday = key === now.toISOString().split("T")[0];
        return (
          <div key={day} className={`rounded-lg border p-2 ${isToday ? "border-emerald-500 bg-emerald-500/10" : "border-border"}`}>
            <div className="mb-1 text-center text-xs font-medium text-text-muted">{day} {d.getDate()}</div>
            <div className="space-y-1">
              {weekArticles[key]?.map((a) => (
                <div key={a.id} className="truncate rounded bg-card px-1.5 py-0.5 text-[10px] text-text-primary" title={a.title}>
                  {a.title.length > 8 ? a.title.slice(0, 8) + "…" : a.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

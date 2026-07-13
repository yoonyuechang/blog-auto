"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, ListChecks, Rss, Users, BarChart3 } from "lucide-react";
import KPICards from "@/components/admin/KPICards";
import ApprovalQueue from "@/components/admin/ApprovalQueue";
import SourceManager from "@/components/admin/SourceManager";
import SubscriberList from "@/components/admin/SubscriberList";
import StatsChart from "@/components/admin/StatsChart";

interface AdminData {
  kpi: { totalArticles: number; pendingArticles: number; totalSubscribers: number; totalViews: number };
  pendingArticles: { id: number; title: string; source: string; difficultyLevel: string; aiSummary: string; createdAt: string }[];
  sources: { id: number; name: string; type: string; url: string; fetchInterval: string; isActive: boolean; category: string }[];
  subscribers: { id: number; email: string; subscribedAt: string; isActive: boolean }[];
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
    await fetch(`/api/articles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved" }) });
    window.location.reload();
  };

  const handleReject = async (id: number) => {
    await fetch(`/api/articles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "rejected" }) });
    window.location.reload();
  };

  const handleToggleSource = async (id: number, isActive: boolean) => {
    await fetch(`/api/sources/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive }) });
    window.location.reload();
  };

  const handleAddSource = async (source: { name: string; url: string; type: string; fetchInterval: string; isActive: boolean; category: string }) => {
    await fetch("/api/sources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(source) });
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <LayoutDashboard size={24} className="text-emerald-400" />
        <h1 className="text-2xl font-extrabold text-text-primary">관리자 대시보드</h1>
      </div>
      <KPICards data={data.kpi} />
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-card p-1">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-emerald-500 text-white" : "text-text-muted hover:text-text-primary"}`}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        {tab === "stats" && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-bg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.totalArticles}</div>
                <div className="text-xs text-text-muted">승인된 아티클</div>
              </div>
              <div className="rounded-lg bg-bg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.totalViews.toLocaleString()}</div>
                <div className="text-xs text-text-muted">총 조회수</div>
              </div>
              <div className="rounded-lg bg-bg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.totalSubscribers}</div>
                <div className="text-xs text-text-muted">구독자</div>
              </div>
            </div>
            <StatsChart
              title="카테고리별 아티클 수"
              data={stats.topCategories.map((c) => ({
                label: c.category,
                value: c.count,
                color: categoryColors[c.category] ?? "#6b7280",
              }))}
            />
            <StatsChart
              title="최근 아티클 조회수"
              data={stats.recentArticles.map((a) => ({
                label: a.title.length > 14 ? a.title.slice(0, 14) + "…" : a.title,
                value: a.viewCount,
                color: categoryColors[a.category] ?? "#6b7280",
              }))}
            />
          </div>
        )}
        {tab === "queue" && <ApprovalQueue articles={data.pendingArticles} onApprove={handleApprove} onReject={handleReject} />}
        {tab === "sources" && <SourceManager sources={data.sources} onToggle={handleToggleSource} onAdd={handleAddSource} />}
        {tab === "subscribers" && <SubscriberList subscribers={data.subscribers} />}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { LayoutDashboard, ListChecks, Rss, Users } from "lucide-react";
import KPICards from "@/components/admin/KPICards";
import ApprovalQueue from "@/components/admin/ApprovalQueue";
import SourceManager from "@/components/admin/SourceManager";
import SubscriberList from "@/components/admin/SubscriberList";

interface AdminData {
  kpi: { totalArticles: number; pendingArticles: number; totalSubscribers: number; totalViews: number };
  pendingArticles: { id: number; title: string; source: string; difficultyLevel: string; aiSummary: string; createdAt: string }[];
  sources: { id: number; name: string; type: string; url: string; fetchInterval: string; isActive: boolean; category: string }[];
  subscribers: { id: number; email: string; subscribedAt: string; isActive: boolean }[];
}

const tabs = [
  { key: "queue" as const, label: "승인 큐", icon: ListChecks },
  { key: "sources" as const, label: "소스 관리", icon: Rss },
  { key: "subscribers" as const, label: "구독자", icon: Users },
];

export default function AdminClient({ data }: { data: AdminData }) {
  const [tab, setTab] = useState<"queue" | "sources" | "subscribers">("queue");

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
        {tab === "queue" && <ApprovalQueue articles={data.pendingArticles} onApprove={handleApprove} onReject={handleReject} />}
        {tab === "sources" && <SourceManager sources={data.sources} onToggle={handleToggleSource} onAdd={handleAddSource} />}
        {tab === "subscribers" && <SubscriberList subscribers={data.subscribers} />}
      </div>
    </div>
  );
}

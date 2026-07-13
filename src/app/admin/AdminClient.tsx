"use client";

import { useState } from "react";
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
      <h1 className="mb-8 text-2xl font-extrabold text-text-primary">관리자 대시보드</h1>
      <KPICards data={data.kpi} />
      <div className="mb-6 flex gap-2 border-b border-border">
        {([["queue", "승인 큐"], ["sources", "소스 관리"], ["subscribers", "구독자"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`border-b-2 px-4 py-2 text-sm transition-colors ${tab === key ? "border-emerald-400 text-text-primary" : "border-transparent text-text-muted hover:text-text-secondary"}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === "queue" && <ApprovalQueue articles={data.pendingArticles} onApprove={handleApprove} onReject={handleReject} />}
      {tab === "sources" && <SourceManager sources={data.sources} onToggle={handleToggleSource} onAdd={handleAddSource} />}
      {tab === "subscribers" && <SubscriberList subscribers={data.subscribers} />}
    </div>
  );
}

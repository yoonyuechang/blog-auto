"use client";

import { useState, useEffect } from "react";
import { Eye, TrendingUp, FileText, Users, Download } from "lucide-react";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import DateRangePicker, { type DateRange } from "@/components/admin/DateRangePicker";

interface AnalyticsData {
  totalArticles: number;
  totalViews: number;
  totalSubscribers: number;
  topCategories: { category: string; count: number; totalViews: number }[];
  weeklyTrend: { date: string; count: number }[];
  topByViews: { id: number; title: string; fullTitle: string; viewCount: number; category: string }[];
  tagFrequency: { tag: string; count: number }[];
  subscriberGrowth: { date: string; count: number }[];
}

const categoryColors: Record<string, string> = {
  "AI/ML": "#10b981",
  프론트엔드: "#3b82f6",
  백엔드: "#f59e0b",
  DevOps: "#ef4444",
  모바일: "#8b5cf6",
  데이터: "#ec4899",
};

function exportCSV(data: AnalyticsData) {
  const rows = [["제목", "카테고리", "조회수"]];
  data.topByViews.forEach((a) => rows.push([a.fullTitle, a.category, String(a.viewCount)]));
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "analytics.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch(`/api/admin/stats?range=${range}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [range]);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-text-muted">로딩 중...</div>
      </div>
    );
  }

  const avgViews = data.totalArticles > 0 ? Math.round(data.totalViews / data.totalArticles) : 0;
  const topArticle = data.topByViews[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">콘텐츠 분석</h1>
          <p className="text-sm text-text-muted">아티클 성과 및 트렌드</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker value={range} onChange={setRange} />
          <button
            onClick={() => exportCSV(data)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            <Download size={14} />
            CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Eye size={20} className="text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-text-primary">{data.totalViews.toLocaleString()}</p>
          <p className="mt-0.5 text-sm text-text-muted">총 조회수</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <TrendingUp size={20} className="text-blue-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-text-primary">{avgViews.toLocaleString()}</p>
          <p className="mt-0.5 text-sm text-text-muted">평균 조회수/아티클</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <FileText size={20} className="text-amber-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-text-primary truncate" title={topArticle?.fullTitle}>
            {topArticle?.fullTitle ?? "-"}
          </p>
          <p className="mt-0.5 text-sm text-text-muted">인기 아티클</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Users size={20} className="text-purple-400" />
          </div>
          <p className="mt-3 text-2xl font-bold text-text-primary">
            {data.totalViews > 0 ? ((data.totalSubscribers / data.totalViews) * 100).toFixed(2) : 0}%
          </p>
          <p className="mt-0.5 text-sm text-text-muted">뉴스레터 전환율</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <AnalyticsChart
          type="line"
          title="일별 아티클 수 (조회수 추이)"
          data={data.weeklyTrend.map((d) => ({ label: d.date, value: d.count }))}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <AnalyticsChart
            type="bar"
            title="카테고리별 조회수"
            data={data.topCategories.map((c) => ({
              label: c.category,
              value: c.totalViews,
              color: categoryColors[c.category] ?? "#6b7280",
            }))}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <AnalyticsChart
            type="pie"
            title="카테고리 분포"
            data={data.topCategories.map((c) => ({
              label: c.category,
              value: c.count,
              color: categoryColors[c.category] ?? "#6b7280",
            }))}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <AnalyticsChart
            type="bar"
            title="조회수 TOP 10"
            data={data.topByViews.map((a) => ({
              label: a.title,
              value: a.viewCount,
              color: categoryColors[a.category] ?? "#6b7280",
            }))}
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <AnalyticsChart
            type="bar"
            title="인기 태그"
            data={data.tagFrequency.map((t) => ({
              label: t.tag,
              value: t.count,
            }))}
          />
        </div>
      </div>

      {data.subscriberGrowth.some((d) => d.count > 0) && (
        <div className="rounded-xl border border-border bg-card p-6">
          <AnalyticsChart
            type="line"
            title="구독자 증가 추이"
            data={data.subscriberGrowth.map((d) => ({ label: d.date, value: d.count }))}
          />
        </div>
      )}
    </div>
  );
}

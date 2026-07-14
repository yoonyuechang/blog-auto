"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface HealthData {
  status: "ok" | "degraded" | "down";
  dbConnected: boolean;
  dbLatencyMs: number;
  uptime: number;
  memory: { heapUsedMB: number; heapTotalMB: number; rssMB: number };
  sourceStats: { total: number; active: number };
  recentErrors: { level: string; message: string; timestamp: string }[];
}

const statusColor: Record<string, string> = {
  ok: "bg-emerald-400",
  degraded: "bg-yellow-400",
  down: "bg-red-400",
};

const statusLabel: Record<string, string> = {
  ok: "정상",
  degraded: "주의",
  down: "다운",
};

export default function HealthDashboard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div className="text-sm text-text-muted">로딩 중...</div>;
  }

  const heapPercent = Math.round((data.memory.heapUsedMB / data.memory.heapTotalMB) * 100);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}시간 ${m}분`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted">시스템 상태</h2>
        <button onClick={fetchHealth} disabled={loading} className="text-text-muted hover:text-text-primary disabled:opacity-50">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Indicator label="전체 상태" value={statusLabel[data.status]} color={statusColor[data.status]} />
        <Indicator label="데이터베이스" value={data.dbConnected ? "연결됨" : "연결 끊김"} color={data.dbConnected ? "bg-emerald-400" : "bg-red-400"} />
        <Indicator label="DB 지연 시간" value={`${data.dbLatencyMs}ms`} color={data.dbLatencyMs < 200 ? "bg-emerald-400" : data.dbLatencyMs < 1000 ? "bg-yellow-400" : "bg-red-400"} />
        <Indicator label="소스" value={`${data.sourceStats.active}/${data.sourceStats.total} 활성`} color={data.sourceStats.active === data.sourceStats.total ? "bg-emerald-400" : "bg-yellow-400"} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-muted">메모리 사용량</span>
          <span className="font-mono text-text-primary">{data.memory.heapUsedMB}MB / {data.memory.heapTotalMB}MB ({heapPercent}%)</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all ${heapPercent > 90 ? "bg-red-400" : heapPercent > 70 ? "bg-yellow-400" : "bg-emerald-400"}`}
            style={{ width: `${heapPercent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-text-muted">RSS: {data.memory.rssMB}MB</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-text-muted">가동 시간: <span className="font-mono text-text-primary">{formatUptime(data.uptime)}</span></p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-text-muted">최근 오류 로그</h3>
        {data.recentErrors.length === 0 ? (
          <p className="text-sm text-text-muted">오류 없음</p>
        ) : (
          <div className="space-y-2">
            {data.recentErrors.map((e, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3 text-xs">
                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${e.level === "critical" ? "bg-red-500" : e.level === "error" ? "bg-red-400" : "bg-yellow-400"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary">{e.message}</p>
                  <p className="mt-0.5 text-text-muted">{new Date(e.timestamp).toLocaleString("ko-KR")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Indicator({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span className="text-sm font-medium text-text-primary">{value}</span>
      </div>
    </div>
  );
}

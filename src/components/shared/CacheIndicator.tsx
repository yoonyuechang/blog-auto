"use client";

import { useEffect, useState } from "react";

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
}

export default function CacheIndicator() {
  const [stats, setStats] = useState<CacheStats | null>(null);

  useEffect(() => {
    const fetchStats = () => {
      fetch("/api/admin/stats")
        .then(r => r.json())
        .then(d => {
          if (d.cacheStats) setStats(d.cacheStats);
        })
        .catch(() => {});
    };
    fetchStats();
    const iv = setInterval(fetchStats, 10_000);
    return () => clearInterval(iv);
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
      <span title="Cache hit rate">
        HIT {stats.hitRate}%
      </span>
      <span title="Cache entries">
        {stats.size} entries
      </span>
      <span title="Hits / Misses">
        {stats.hits}/{stats.misses}
      </span>
    </div>
  );
}

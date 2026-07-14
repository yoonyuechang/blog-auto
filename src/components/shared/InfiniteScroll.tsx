"use client";

import { useEffect, useRef } from "react";
import Skeleton from "./Skeleton";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({ onLoadMore, hasMore, loading, children }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <div>
      {children}
      <div ref={sentinelRef} className="flex justify-center py-8">
        {loading && (
          <div className="grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
                <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-border" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-3 mb-2 h-5 w-full" />
                <Skeleton className="mb-2 h-4 w-2/3" />
                <div className="flex gap-1"><Skeleton className="h-5 w-12 rounded-full" /><Skeleton className="h-5 w-14 rounded-full" /></div>
              </div>
            ))}
          </div>
        )}
        {!hasMore && !loading && (
          <p className="text-sm text-text-muted">더 이상 아티클이 없습니다</p>
        )}
      </div>
    </div>
  );
}

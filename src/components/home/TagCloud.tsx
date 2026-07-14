"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Hash } from "lucide-react";

interface TagCloudProps {
  tags: Record<string, number>;
}

export default function TagCloud({ tags }: TagCloudProps) {
  const sorted = useMemo(() => {
    return Object.entries(tags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [tags]);

  if (!sorted.length) return null;

  const max = sorted[0][1];
  const min = sorted[sorted.length - 1][1];

  const getSize = (count: number) => {
    if (max === min) return 1;
    const ratio = (count - min) / (max - min);
    return 0.75 + ratio * 1;
  };

  const getOpacity = (count: number) => {
    if (max === min) return 0.8;
    const ratio = (count - min) / (max - min);
    return 0.5 + ratio * 0.5;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
        <Hash size={16} className="text-emerald-400" />
        인기 태그
      </h3>
      <div className="flex flex-wrap gap-2">
        {sorted.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-text-secondary transition-all hover:border-emerald-400 hover:text-emerald-400"
            style={{
              fontSize: `${getSize(count)}rem`,
              opacity: getOpacity(count),
            }}
          >
            #{tag}
            <span className="text-[0.65em] text-text-muted">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

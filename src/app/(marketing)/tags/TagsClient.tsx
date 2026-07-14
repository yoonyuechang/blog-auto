"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, Hash } from "lucide-react";

interface Tag {
  name: string;
  count: number;
}

export default function TagsClient({ tags }: { tags: Tag[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"count" | "alpha">("count");

  const filtered = useMemo(() => {
    let list = tags;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q));
    }
    if (sortKey === "alpha") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }
    return list;
  }, [tags, query, sortKey]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="태그 검색..."
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setSortKey(sortKey === "count" ? "alpha" : "count")}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowUpDown size={14} />
          {sortKey === "count" ? "인기순" : "가나다순"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-text-muted">일치하는 태그가 없습니다</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((tag) => (
            <Link
              key={tag.name}
              href={`/search?q=${encodeURIComponent(tag.name)}`}
              className="group flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/5"
            >
              <Hash size={14} className="shrink-0 text-emerald-400 opacity-60 transition-opacity group-hover:opacity-100" />
              <span className="truncate text-sm font-medium text-text-primary">{tag.name}</span>
              <span className="ml-auto shrink-0 rounded-full bg-bg px-2 py-0.5 text-[10px] font-medium text-text-muted">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-text-muted">
        총 {tags.length}개의 태그
      </p>
    </div>
  );
}

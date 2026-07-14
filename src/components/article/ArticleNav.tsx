"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ArticleNavProps {
  prev: { id: number; title: string } | null;
  next: { id: number; title: string } | null;
}

export default function ArticleNav({ prev, next }: ArticleNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-8">
      {prev ? (
        <Link
          href={`/article/${prev.id}`}
          className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-emerald-400/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/20"
        >
          <ChevronLeft
            size={18}
            className="shrink-0 text-slate-500 transition-colors group-hover:text-emerald-400"
          />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">이전 글</p>
            <p className="mt-0.5 truncate text-sm font-medium text-text-primary group-hover:text-emerald-400">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/article/${next.id}`}
          className="group flex items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 text-right transition-all duration-300 hover:border-emerald-400/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/20"
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">다음 글</p>
            <p className="mt-0.5 truncate text-sm font-medium text-text-primary group-hover:text-emerald-400">
              {next.title}
            </p>
          </div>
          <ChevronRight
            size={18}
            className="shrink-0 text-slate-500 transition-colors group-hover:text-emerald-400"
          />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

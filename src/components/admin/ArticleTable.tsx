"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowUpDown, Trash2, ExternalLink } from "lucide-react";

interface Article {
  id: number;
  title: string;
  category: string;
  viewCount: number;
  createdAt: string;
  status: string;
}

type SortKey = "title" | "category" | "viewCount" | "createdAt";

const columns: { key: SortKey; label: string }[] = [
  { key: "title", label: "제목" },
  { key: "category", label: "카테고리" },
  { key: "viewCount", label: "조회수" },
  { key: "createdAt", label: "생성일" },
];

export default function ArticleTable({ onDelete }: { onDelete?: (id: number) => void }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const limit = 20;

  const fetchArticles = useCallback(async (p: number, s: SortKey, o: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/articles?page=${p}&limit=${limit}&sort=${s}&order=${o}`);
      const data = await res.json();
      setArticles(data.articles.map((a: any) => ({
        ...a,
        createdAt: a.createdAt?.split("T")[0] || a.createdAt,
      })));
      setTotal(data.total);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchArticles(page, sort, order); }, [page, sort, order, fetchArticles]);

  const handleSort = (key: SortKey) => {
    const newOrder = sort === key && order === "desc" ? "asc" : "desc";
    setSort(key);
    setOrder(newOrder);
  };

  const handleDelete = async (id: number) => {
    await onDelete?.(id);
    setConfirmDelete(null);
    fetchArticles(page, sort, order);
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              {columns.map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort(key)}
                    className="flex items-center gap-1 font-mono text-xs uppercase text-text-muted hover:text-text-primary"
                  >
                    {label}
                    <ArrowUpDown size={12} />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-right font-mono text-xs uppercase text-text-muted">상태</th>
              <th className="px-4 py-3 text-right font-mono text-xs uppercase text-text-muted">액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">로딩 중...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">아티클이 없습니다</td></tr>
            ) : articles.map((article) => (
              <tr key={article.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/article/${article.id}`} className="flex items-center gap-1.5 text-text-primary hover:text-emerald-400">
                    {article.title.length > 40 ? article.title.slice(0, 40) + "…" : article.title}
                    <ExternalLink size={12} className="shrink-0 text-text-muted" />
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted">{article.category}</td>
                <td className="px-4 py-3 text-right text-text-muted">{article.viewCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-text-muted">{article.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    article.status === "approved" ? "bg-emerald-500/15 text-emerald-400" :
                    article.status === "pending_approval" ? "bg-yellow-500/15 text-yellow-400" :
                    "bg-red-500/15 text-red-400"
                  }`}>
                    {article.status === "approved" ? "승인" : article.status === "pending_approval" ? "대기" : "반려"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {confirmDelete === article.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs text-text-muted">삭제?</span>
                      <button onClick={() => handleDelete(article.id)} className="text-xs font-medium text-red-400 hover:text-red-300">예</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs font-medium text-text-muted hover:text-text-primary">아니오</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(article.id)} className="text-text-muted hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > limit && (
        <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
          <span>{total}개 중 {(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded border border-border px-3 py-1 hover:bg-card disabled:opacity-40"
            >
              이전
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total}
              className="rounded border border-border px-3 py-1 hover:bg-card disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

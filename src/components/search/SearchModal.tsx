"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: number; title: string; category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
        window.location.href = `/article/${results[activeIndex].id}`;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, activeIndex]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/articles?q=${encodeURIComponent(query)}&limit=5&status=approved`);
      const data = await res.json();
      setResults(data.articles || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => { setActiveIndex(-1); }, [query]);

  if (!open) return null;
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="글 검색"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <Search size={20} className="shrink-0 text-text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="글 검색... (Ctrl+K)"
            aria-label="글 검색"
            className="flex-1 bg-transparent text-text-primary outline-none"
          />
          <button onClick={close} aria-label="검색 닫기">
            <X size={20} className="text-text-muted" />
          </button>
        </div>
        {query.trim() && loading && (
          <div className="mt-4 flex justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-emerald-400" />
          </div>
        )}
        {results.length > 0 && (
          <ul role="listbox" aria-label="검색 결과" className="mt-4 space-y-2">
            {results.map((r, i) => (
              <li key={r.id} role="option" aria-selected={i === activeIndex}>
                <a href={`/article/${r.id}`} onClick={close}
                  className={`block rounded-lg p-3 transition-colors ${
                    i === activeIndex ? "bg-emerald-950/50 text-emerald-400" : "hover:bg-border"
                  }`}>
                  <p className="text-sm font-medium text-text-primary">{r.title}</p>
                  <p className="mt-1 text-xs text-text-muted">{r.category}</p>
                </a>
              </li>
            ))}
          </ul>
        )}
        {query.trim() && !loading && results.length === 0 && (
          <p className="mt-4 text-center text-sm text-text-muted">검색 결과가 없습니다</p>
        )}
      </div>
    </div>
  );
}

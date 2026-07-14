"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Clock, TrendingUp, Eye, SlidersHorizontal, ChevronDown, FileX, RefreshCw } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Card from "@/components/shared/Card";
import GlowCard from "@/components/shared/GlowCard";
import Badge from "@/components/shared/Badge";
import Skeleton from "@/components/shared/Skeleton";
import DateFormatter from "@/components/shared/DateFormatter";
import InfiniteScroll from "@/components/shared/InfiniteScroll";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  category: string;
  difficultyLevel: string;
  source: string;
  tags: string;
  publishedAt: string;
  viewCount: number;
}

const CATEGORIES = [
  { slug: "ai", label: "AI/ML" },
  { slug: "web", label: "웹개발" },
  { slug: "opensource", label: "오픈소스" },
  { slug: "research", label: "논문/리서치" },
  { slug: "career", label: "커리어" },
  { slug: "other", label: "기타" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "최신순", icon: Clock },
  { value: "popular", label: "인기순", icon: TrendingUp },
  { value: "views", label: "조회수순", icon: Eye },
];

const DATE_RANGES = [
  { value: "", label: "전체" },
  { value: "7", label: "최근 1주" },
  { value: "30", label: "최근 1개월" },
  { value: "90", label: "최근 3개월" },
];

const POPULAR_SEARCHES = ["React 19", "AI 에이전트", "Next.js", "TypeScript", "Python", "GraphQL", "Kubernetes", "보안"];

function estimateReadingTime(content?: string): string {
  if (!content) return "3분";
  return Math.max(1, Math.ceil(content.length / 200)) + "분";
}

function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("devpulse_recent_searches");
      if (saved) setSearches(JSON.parse(saved));
    } catch {}
  }, []);

  const addSearch = useCallback((term: string) => {
    setSearches(prev => {
      const next = [term, ...prev.filter(s => s !== term)].slice(0, 8);
      try { localStorage.setItem("devpulse_recent_searches", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearches([]);
    try { localStorage.removeItem("devpulse_recent_searches"); } catch {}
  }, []);

  return { searches, addSearch, clearHistory };
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get("category");
    return cat ? cat.split(",") : [];
  });
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [dateRange, setDateRange] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { searches, addSearch, clearHistory } = useRecentSearches();
  const initialized = useRef(false);

  const fetchResults = useCallback(async (q: string, cats: string[], s: string, pg: number, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (cats.length) params.set("category", cats.join(","));
      params.set("sort", s);
      params.set("page", String(pg));
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      if (append) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
        setSuggestions(data.suggestions || []);
      }
      setTotal(data.total);
      setHasMore(data.articles.length === 12);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUrl = useCallback((q: string, cats: string[], s: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cats.length) params.set("category", cats.join(","));
    if (s !== "newest") params.set("sort", s);
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const q = searchParams.get("q") || "";
      const cat = searchParams.get("category");
      const s = searchParams.get("sort") || "newest";
      const cats = cat ? cat.split(",") : [];
      if (q || cats.length) {
        fetchResults(q, cats, s, 1);
      }
    }
  }, []);

  const handleSearch = useCallback((term?: string) => {
    const q = term ?? inputValue;
    if (!q.trim() && selectedCategories.length === 0) return;
    setQuery(q);
    setPage(1);
    if (q.trim()) addSearch(q.trim());
    updateUrl(q, selectedCategories, sort);
    fetchResults(q, selectedCategories, sort, 1);
  }, [inputValue, selectedCategories, sort, addSearch, updateUrl, fetchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      updateUrl(query, next, sort);
      return next;
    });
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    setPage(1);
    updateUrl(query, selectedCategories, s);
    fetchResults(query, selectedCategories, s, 1);
  };

  const handleLoadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchResults(query, selectedCategories, sort, next, true);
  }, [page, query, selectedCategories, sort, fetchResults]);

  useEffect(() => {
    if (selectedCategories.length > 0 || query) {
      fetchResults(query, selectedCategories, sort, 1);
    }
  }, [selectedCategories, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-extrabold text-text-primary">글 검색</h1>
      <p className="mt-1 text-sm text-text-muted">원하는 주제의 아티클을 찾아보세요</p>

      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요..."
            className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-11 text-sm text-text-primary outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          {inputValue && (
            <button onClick={() => { setInputValue(""); setQuery(""); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => handleSearch()}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          <Search size={16} />
          검색
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategories.includes(cat.slug)
                  ? "bg-emerald-500 text-white"
                  : "bg-card text-text-muted hover:text-text-primary border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-text-muted hover:text-text-primary"
        >
          <SlidersHorizontal size={14} />
          필터
          <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">정렬</label>
            <div className="flex gap-1.5">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    sort === opt.value
                      ? "bg-card text-text-primary border border-border"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  <opt.icon size={12} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">기간</label>
            <div className="flex gap-1.5">
              {DATE_RANGES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setDateRange(r.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    dateRange === r.value
                      ? "bg-card text-text-primary border border-border"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(query || selectedCategories.length > 0) && !loading && (
        <p className="mt-4 text-sm text-text-muted">
          총 <span className="text-emerald-400">{total}</span>개의 검색 결과
          {query && <span> ( &ldquo;{query}&rdquo; )</span>}
        </p>
      )}

      {!query && selectedCategories.length === 0 && searches.length === 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold text-text-primary">인기 검색어</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => { setInputValue(term); setQuery(term); addSearch(term); updateUrl(term, selectedCategories, sort); fetchResults(term, selectedCategories, sort, 1); }}
                className="rounded-full border border-border bg-card px-4 py-2 text-xs text-text-muted transition-colors hover:border-emerald-500 hover:text-emerald-400"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {!query && selectedCategories.length === 0 && searches.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary">최근 검색</h2>
            <button onClick={clearHistory} className="text-xs text-text-muted hover:text-text-primary">전체 삭제</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {searches.map(term => (
              <button
                key={term}
                onClick={() => { setInputValue(term); setQuery(term); addSearch(term); updateUrl(term, selectedCategories, sort); fetchResults(term, selectedCategories, sort, 1); }}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs text-text-muted hover:text-text-primary"
              >
                <Clock size={12} />
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && articles.length === 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
              <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-border" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-3 mb-2 h-5 w-full" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-3 h-4 w-2/3" />
              <div className="mt-3 flex gap-3">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && articles.length > 0 && (
        <InfiniteScroll onLoadMore={handleLoadMore} hasMore={hasMore} loading={loading}>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(article => (
              <GlowCard key={article.id}>
                <Card href={`/article/${article.id}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">{article.category}</span>
                    <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
                  </div>
                  <h3 className="mt-3 mb-2 text-sm font-bold leading-tight text-text-primary line-clamp-2">{article.title}</h3>
                  <p className="mb-3 text-xs leading-relaxed text-text-secondary line-clamp-2">{article.aiSummary}</p>
                  <div className="flex flex-wrap gap-1">
                    {JSON.parse(article.tags || "[]").slice(0, 3).map((tag: string) => (
                      <span key={tag} className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] text-text-muted">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[10px] text-text-muted">
                    <span className="flex items-center gap-1"><Eye size={10} />{article.viewCount ?? 0}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{estimateReadingTime()}</span>
                    <span><DateFormatter date={article.publishedAt} /></span>
                  </div>
                </Card>
              </GlowCard>
            ))}
          </div>
        </InfiniteScroll>
      )}

      {(query || selectedCategories.length > 0) && !loading && articles.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
          <FileX size={40} className="mb-3 text-text-muted" />
          <p className="text-lg font-medium text-text-primary">검색 결과가 없습니다</p>
          <p className="mt-1 text-sm text-text-muted">다른 검색어나 카테고리를 시도해 보세요</p>
          {suggestions.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs text-text-muted">추천 검색어</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setInputValue(s); setQuery(s); }}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-text-muted hover:text-emerald-400"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

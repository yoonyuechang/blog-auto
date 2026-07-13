"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "@/components/home/CategoryTabs";
import TrendingCards from "@/components/home/TrendingCards";
import ArticleGrid from "@/components/home/ArticleGrid";
import AdSense from "@/components/shared/AdSense";

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

interface HomeClientProps {
  initialTrending: Article[];
  categories: string[];
}

const PAGE_SIZE = 12;

export default function HomeClient({ initialTrending, categories }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    fetchArticles(1, true);
  }, [activeCategory]);

  const fetchArticles = async (pageNum: number, replace = false) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(pageNum),
      limit: String(PAGE_SIZE),
      status: "approved",
    });
    if (activeCategory !== "전체") params.set("category", activeCategory);

    const res = await fetch(`/api/articles?${params}`);
    const data = await res.json();

    if (replace) setArticles(data.articles);
    else setArticles((prev) => [...prev, ...data.articles]);
    setHasMore(data.articles.length === PAGE_SIZE);
    setLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  return (
    <>
      <CategoryTabs categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      <TrendingCards articles={initialTrending} />
      <AdSense slot="0000000000" format="horizontal" />
      <ArticleGrid articles={articles} loading={loading} onLoadMore={handleLoadMore} hasMore={hasMore} />
    </>
  );
}

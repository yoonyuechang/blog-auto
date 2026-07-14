"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "@/components/home/CategoryTabs";
import TrendingCards from "@/components/home/TrendingCards";
import WeeklyDigest from "@/components/home/WeeklyDigest";
import ArticleGrid from "@/components/home/ArticleGrid";
import FeaturedArticle from "@/components/home/FeaturedArticle";
import AdSense from "@/components/shared/AdSense";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import NewsletterBanner from "@/components/home/NewsletterBanner";
import TagCloud from "@/components/home/TagCloud";

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

interface WeeklyArticle {
  id: number;
  title: string;
  category: string;
  difficultyLevel: string;
  viewCount: number;
}

interface HomeClientProps {
  initialTrending: Article[];
  featuredArticle: Article | null;
  weeklyTop: WeeklyArticle[];
  categories: string[];
  categoryCounts: Record<string, number>;
  tagCounts: Record<string, number>;
}

const PAGE_SIZE = 12;

export default function HomeClient({ initialTrending, featuredArticle, weeklyTop, categories, categoryCounts, tagCounts }: HomeClientProps) {
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
    try {
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
    } catch {
      // network or parse error — leave articles as-is
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  return (
    <>
      {featuredArticle && <FeaturedArticle {...featuredArticle} />}
      <CategoryShowcase counts={categoryCounts} />
      <TagCloud tags={tagCounts} />
      <CategoryTabs categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      <TrendingCards articles={initialTrending} />
      <WeeklyDigest articles={weeklyTop} />
      <NewsletterBanner />
      <AdSense slot="0000000000" format="horizontal" />
      <ArticleGrid articles={articles} loading={loading} onLoadMore={handleLoadMore} hasMore={hasMore} />
    </>
  );
}

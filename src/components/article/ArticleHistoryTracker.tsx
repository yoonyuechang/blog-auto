"use client";

import { useEffect } from "react";
import { trackArticleView } from "@/components/shared/ReadingHistory";

interface Props {
  articleId: number;
  title: string;
  category: string;
}

export default function ArticleHistoryTracker({ articleId, title, category }: Props) {
  useEffect(() => {
    trackArticleView(articleId, title, category);
  }, [articleId, title, category]);

  return null;
}

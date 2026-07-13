"use client";

import { useState } from "react";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  difficultyLevel: string;
  source: string;
  tags: string;
  publishedAt: string;
}

const difficulties = ["전체", "입문/초급", "중급", "고급"];

export default function CategoryClient({ initialArticles }: { initialArticles: Article[] }) {
  const [difficulty, setDifficulty] = useState("전체");
  const filtered = difficulty === "전체" ? initialArticles : initialArticles.filter((a) => a.difficultyLevel === difficulty);

  return (
    <>
      <div className="mb-6 flex gap-2">
        {difficulties.map((d) => (
          <button key={d} onClick={() => setDifficulty(d)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${difficulty === d ? "bg-emerald-500 text-white" : "bg-card text-text-muted hover:text-text-primary"}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
            <h3 className="mt-2 text-sm font-bold text-text-primary line-clamp-2">{article.title}</h3>
            <p className="mt-1 text-xs text-text-secondary line-clamp-2">{article.aiSummary}</p>
            <p className="mt-2 text-[10px] text-text-muted">{article.publishedAt}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

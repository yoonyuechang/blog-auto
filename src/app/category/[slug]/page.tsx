import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await db.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const articles = await db.article.findMany({
    where: { category: category.name, status: "approved" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-text-primary">{category.name}</h1>
        <p className="mt-2 text-text-secondary">{category.description}</p>
      </div>
      <CategoryClient
        initialArticles={articles.map((a) => ({
          ...a, tags: a.tags, publishedAt: a.publishedAt.toISOString().split("T")[0],
        }))}
      />
    </div>
  );
}

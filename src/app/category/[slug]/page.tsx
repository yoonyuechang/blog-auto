import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

const ICON_MAP: Record<string, string> = {
  "인공지능": "Brain",
  "웹개발": "Globe",
  "오픈소스": "Github",
  "논문/리서치": "BookOpen",
  "커리어": "Briefcase",
  "기타": "Layers",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await db.category.findUnique({ where: { slug: params.slug } });
  if (!category) return {};

  const articleCount = await db.article.count({
    where: { category: category.name, status: "approved" },
  });

  return {
    title: `${category.name} | DevPulse`,
    description: category.description || `${category.name} 카테고리의 최신 IT 트렌드와 기술 뉴스 — 총 ${articleCount}개의 아티클`,
    openGraph: {
      title: `${category.name} | DevPulse`,
      description: category.description || `${category.name} 카테고리`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await db.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const articles = await db.article.findMany({
    where: { category: category.name, status: "approved" },
    orderBy: { publishedAt: "desc" },
  });

  const totalCount = articles.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `/category/${params.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount,
      itemListElement: articles.slice(0, 20).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `/article/${a.id}`,
        name: a.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ICON_MAP[category.icon] || "Folder"}</span>
            <div>
              <h1 className="text-2xl font-extrabold text-text-primary">{category.name}</h1>
              {category.description && (
                <p className="mt-1 text-text-secondary">{category.description}</p>
              )}
            </div>
            <span className="ml-auto rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-text-muted">
              {totalCount}개 아티클
            </span>
          </div>
        </div>
        <CategoryClient
          categoryColor={category.color}
          initialArticles={articles.map((a) => ({
            ...a, tags: a.tags, publishedAt: a.publishedAt.toISOString().split("T")[0],
          }))}
        />
      </div>
    </>
  );
}

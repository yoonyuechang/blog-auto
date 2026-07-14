import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

const ICON_MAP: Record<string, string> = {
  "brain": "\uD83E\uDDE0",
  "code": "\uD83D\uDCBB",
  "git-branch": "\uD83D\uDD00",
  "file-text": "\uD83D\uDCC4",
  "briefcase": "\uD83D\uDCBC",
  "layers": "\uD83D\uDCDA",
};

const SITE_URL = "https://blog-auto-woad.vercel.app";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await db.category.findUnique({ where: { slug: params.slug } });
  if (!category) return {};

  const articleCount = await db.article.count({
    where: { category: category.name, status: "approved" },
  });

  const ogTitle = `DevPulse - ${category.name} \uC544\uD2F0\uD074`;
  const ogDescription = `DevPulse\uC5D0\uC11C ${category.name} \uAD00\uB828 \uCD5C\uC2E0 \uC544\uD2F0\uD074\uC744 \uD655\uC778\uD558\uC138\uC694`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(category.name)}&category=${encodeURIComponent(category.slug)}`;

  return {
    title: `${category.name} | DevPulse`,
    description: category.description || `${category.name} \uCEA4\uB3C4\uC758 \uCD5C\uC2E0 IT \uD2B8\uB808\uB4DC\uC640 \uAE30\uC220 \uB274\uC2A4 \u2014 \uCD1D ${articleCount}\uAC1C\uC758 \uC544\uD2F0\uD074`,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${SITE_URL}/category/${params.slug}`,
      siteName: "DevPulse",
      type: "website",
      locale: "ko_KR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@devpulse",
      creator: "@devpulse",
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImage, alt: category.name }],
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
        <Breadcrumb
          items={[
            { label: "\uD648", href: "/" },
            { label: category.name },
          ]}
        />
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
              {totalCount}\uAC1C \uC544\uD2F0\uD074
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

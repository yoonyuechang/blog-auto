"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import Accordion from "@/components/shared/Accordion";

interface EndpointParam {
  name: string;
  type: string;
  default: string;
  desc: string;
}

interface Endpoint {
  method: string;
  path: string;
  params: EndpointParam[];
  body?: string;
  example: string;
  curl: string;
}

interface SectionContent {
  description: string;
  note?: string;
  curl?: string;
  endpoints?: Endpoint[];
  example?: string;
}

const SECTIONS: { id: string; title: string; content: SectionContent }[] = [
  {
    id: "overview",
    title: "개요",
    content: {
      description: "DevPulse API는 IT 트렌드 블로그의 콘텐츠와 데이터에 접근할 수 있는 RESTful API입니다. 아티클 목록 조회, 검색, 통계, 뉴스레터 구독 등의 기능을 제공합니다.",
      note: "모든 API는 기본적으로 공개되어 있으며, 관리자 기능(생성/수정/삭제)은 API 키 인증이 필요합니다.",
    },
  },
  {
    id: "auth",
    title: "인증",
    content: {
      description: "공개 읽기 API는 인증 없이 사용 가능합니다. 쓰기/관리 API는 Admin API 키가 필요합니다.",
      curl: `# 공개 API (인증 불필요)
curl https://blog-auto-woad.vercel.app/api/articles

# 관리자 API (API 키 필요)
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  -X POST https://blog-auto-woad.vercel.app/api/articles \\
  -d '{"title":"New Article","source":"blog","sourceUrl":"https://example.com"}'`,
    },
  },
  {
    id: "articles",
    title: "Articles API",
    content: {
      description: "아티클 목록과 상세 정보를 조회합니다. 페이지네이션, 카테고리 필터, 검색 기능을 지원합니다.",
      endpoints: [
        {
          method: "GET",
          path: "/api/articles",
          params: [
            { name: "page", type: "number", default: "1", desc: "페이지 번호" },
            { name: "limit", type: "number", default: "12", desc: "페이지당 항목 수 (최대 100)" },
            { name: "category", type: "string", default: "-", desc: "카테고리 필터" },
            { name: "q", type: "string", default: "-", desc: "검색어 (제목, 요약, 태그)" },
            { name: "status", type: "string", default: "-", desc: "상태 필터 (approved 등)" },
            { name: "difficulty", type: "string", default: "-", desc: "난이도 필터" },
            { name: "tags", type: "string", default: "-", desc: "태그 필터 (쉼표 구분)" },
          ],
          example: `{
  "articles": [
    {
      "id": 1,
      "title": "TypeScript 5.0 마이그레이션 가이드",
      "category": "웹개발",
      "viewCount": 1234,
      "publishedAt": "2026-01-15T09:00:00.000Z"
    }
  ],
  "total": 87,
  "page": 1,
  "limit": 12
}`,
          curl: 'curl "https://blog-auto-woad.vercel.app/api/articles?page=1&limit=10&category=web"',
        },
        {
          method: "GET",
          path: "/api/articles/:id",
          params: [
            { name: "id", type: "number", default: "-", desc: "아티클 ID" },
          ],
          example: `{
  "id": 1,
  "title": "TypeScript 5.0 마이그레이션 가이드",
  "summary": "...",
  "aiSummary": "AI가 분석한 요약...",
  "content": "본문...",
  "category": "웹개발",
  "tags": "TypeScript,Web",
  "viewCount": 1234,
  "publishedAt": "2026-01-15T09:00:00.000Z"
}`,
          curl: "curl https://blog-auto-woad.vercel.app/api/articles/1",
        },
      ],
    },
  },
  {
    id: "search",
    title: "Search API",
    content: {
      description: "아티클을 텍스트로 검색합니다. 제목, 요약, 본문에서 검색어를 찾습니다.",
      endpoints: [
        {
          method: "GET",
          path: "/api/search",
          params: [
            { name: "q", type: "string", default: "-", desc: "검색어" },
            { name: "category", type: "string", default: "-", desc: "카테고리 슬러그" },
            { name: "sort", type: "string", default: "newest", desc: "정렬 (newest, popular)" },
            { name: "page", type: "number", default: "1", desc: "페이지 번호" },
            { name: "limit", type: "number", default: "12", desc: "페이지당 항목 수 (최대 50)" },
          ],
          example: `{
  "articles": [...],
  "total": 5,
  "page": 1,
  "limit": 12,
  "suggestions": ["TypeScript", "React"]
}`,
          curl: 'curl "https://blog-auto-woad.vercel.app/api/search?q=TypeScript&sort=popular"',
        },
      ],
    },
  },
  {
    id: "newsletter",
    title: "Newsletter API",
    content: {
      description: "뉴스레터 구독을 관리합니다. 이메일 구독, 해지 기능을 제공합니다.",
      endpoints: [
        {
          method: "POST",
          path: "/api/newsletter",
          params: [],
          body: `{ "email": "user@example.com", "preferences": ["ai", "web"] }`,
          example: `// 201 Created
{ "id": 1, "email": "user@example.com", "isActive": true }

// 200 (이미 구독됨)
{ "message": "Already subscribed" }`,
          curl: "curl -X POST https://blog-auto-woad.vercel.app/api/newsletter \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"email\":\"user@example.com\"}'",
        },
      ],
    },
  },
  {
    id: "stats",
    title: "Stats API",
    content: {
      description: "대시보드 통계를 조회합니다. 총 아티클 수, 조회수, 구독자 수 등의 집계 데이터를 제공합니다.",
      endpoints: [
        {
          method: "GET",
          path: "/api/stats",
          params: [],
          example: `{
  "totalArticles": 87,
  "totalViews": 45230,
  "totalSubscribers": 312,
  "topCategories": [
    { "category": "인공지능", "count": 32 },
    { "category": "웹개발", "count": 28 }
  ],
  "articlesThisWeek": 12,
  "avgViewsPerArticle": 520
}`,
          curl: "curl https://blog-auto-woad.vercel.app/api/stats",
        },
      ],
    },
  },
  {
    id: "feed",
    title: "Feed API (RSS)",
    content: {
      description: "RSS 피드를 XML 형식으로 제공합니다. 뉴스 리더기나 구독 서비스에서 사용할 수 있습니다.",
      endpoints: [
        {
          method: "GET",
          path: "/api/feed",
          params: [],
          example: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>DevPulse</title>
    <description>AI가 요약한 최신 기술 트렌드</description>
    <item>
      <title>최신 아티클 제목</title>
      <description>AI 요약...</description>
      <category>인공지능</category>
    </item>
  </channel>
</rss>`,
          curl: "curl https://blog-auto-woad.vercel.app/api/feed",
        },
      ],
    },
  },
  {
    id: "recommendations",
    title: "Recommendations API",
    content: {
      description: "추천 아티클을 제공합니다. 관련 아티클, 트렌딩, 개인화 추천 전략을 지원합니다.",
      endpoints: [
        {
          method: "GET",
          path: "/api/recommendations",
          params: [
            { name: "articleId", type: "number", default: "-", desc: "기준 아티클 ID (related 전략)" },
            { name: "limit", type: "number", default: "5", desc: "반환할 아티클 수 (최대 20)" },
            { name: "strategy", type: "string", default: "related", desc: "전략 (related, trending, personalized)" },
          ],
          example: `{
  "articles": [
    { "id": 2, "title": "추천 아티클", "category": "인공지능" }
  ]
}`,
          curl: 'curl "https://blog-auto-woad.vercel.app/api/recommendations?strategy=trending&limit=5"',
        },
      ],
    },
  },
  {
    id: "health",
    title: "Health Check",
    content: {
      description: "API 및 데이터베이스 상태를 확인합니다. 모니터링이나 로드밸런서 헬스체크에 활용할 수 있습니다.",
      endpoints: [
        {
          method: "GET",
          path: "/api/health",
          params: [],
          example: `{
  "status": "ok",
  "timestamp": "2026-01-15T09:00:00.000Z",
  "dbConnected": true
}`,
          curl: "curl https://blog-auto-woad.vercel.app/api/health",
        },
      ],
    },
  },
];

function CodeBlock({ children, label }: { children: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative mt-3 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-bg/50 px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{label}</span>
        <button onClick={copy} className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-text-muted hover:bg-border/50 hover:text-text-secondary">
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#1a1b26] p-3 text-xs leading-relaxed text-text-secondary">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function CollapsibleSection({ section }: {
  section: { id: string; title: string; content: SectionContent };
}) {
  return (
    <div>
          <div className="pb-4 text-sm text-text-secondary leading-relaxed">
          <p>{section.content.description}</p>

          {section.content.note && (
            <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400">
              {section.content.note}
            </div>
          )}

          {section.content.curl && (
            <CodeBlock label="cURL">{section.content.curl}</CodeBlock>
          )}

          {section.content.endpoints?.map((ep, i) => (
            <div key={i} className="mt-4">
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${ep.method === "GET" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                  {ep.method}
                </span>
                <code className="text-xs text-text-primary">{ep.path}</code>
              </div>

              {ep.params && ep.params.length > 0 && (
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border text-left text-text-muted">
                        <th className="pb-1 pr-4 font-medium">파라미터</th>
                        <th className="pb-1 pr-4 font-medium">타입</th>
                        <th className="pb-1 pr-4 font-medium">기본값</th>
                        <th className="pb-1 font-medium">설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.params.map((p) => (
                        <tr key={p.name} className="border-b border-border/30">
                          <td className="py-1.5 pr-4 font-mono text-emerald-400">{p.name}</td>
                          <td className="py-1.5 pr-4 text-text-muted">{p.type}</td>
                          <td className="py-1.5 pr-4 text-text-muted">{p.default}</td>
                          <td className="py-1.5 text-text-secondary">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {"body" in ep && (ep as Endpoint).body && (
                <CodeBlock label="Request Body">{(ep as Endpoint).body!}</CodeBlock>
              )}

              {ep.example && (
                <CodeBlock label="Response">{ep.example}</CodeBlock>
              )}

              {ep.curl && (
                <CodeBlock label="cURL">{ep.curl}</CodeBlock>
              )}
            </div>
          ))}

          {section.content.example && !section.content.endpoints && (
            <CodeBlock label="Response">{section.content.example}</CodeBlock>
          )}
        </div>
    </div>
  );
}

export default function DocsClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  const accordionItems = SECTIONS.map((s) => ({
    title: s.title,
    content: <CollapsibleSection section={s} />,
  }));

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12">
      <div className="lg:flex lg:gap-8">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-60 border-r border-border bg-bg/95 p-4 backdrop-blur-xl
          transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-56 lg:translate-x-0 lg:border-r lg:bg-transparent lg:backdrop-blur-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="text-sm font-bold text-text-primary">목차</span>
            <button onClick={() => setSidebarOpen(false)} className="text-text-muted">✕</button>
          </div>
          <nav className="space-y-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="block w-full rounded-md px-3 py-1.5 text-left text-xs transition-colors text-text-muted hover:bg-card hover:text-text-secondary"
              >
                {s.title}
              </button>
            ))}
          </nav>

          {/* API Tester in sidebar */}
          <div className="mt-6 hidden lg:block">
            {children}
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-30 flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-primary shadow-lg lg:hidden"
        >
          <ExternalLink size={12} /> 목차
        </button>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <Accordion items={accordionItems} allowMultiple defaultOpen={[0]} />

          {/* Mobile API tester */}
          <div className="mt-8 lg:hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

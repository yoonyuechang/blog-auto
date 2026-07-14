import type { Metadata } from "next";
import { FileCode, Zap } from "lucide-react";
import DocsClient from "./DocsClient";
import ApiTester from "./ApiTester";

export const metadata: Metadata = {
  title: "DevPulse API 문서 | 개발자 문서",
  description:
    "DevPulse REST API 문서. 아티클 조회, 검색, 뉴스레터, 통계, 추천 등 API 엔드포인트를 확인하세요.",
  openGraph: {
    title: "DevPulse API 문서",
    description: "DevPulse REST API 개발자 문서",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  name: "DevPulse API 문서",
  description: "DevPulse REST API 개발자 문서",
  url: "/docs",
  publisher: { "@type": "Organization", name: "DevPulse" },
};

export default function DocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="gradient-mesh-emerald relative overflow-hidden border-b border-border">
        <div className="floating-dots">
          {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
            <FileCode size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-text-primary">Developer Docs</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
            DevPulse <span className="gradient-text">API 문서</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-text-secondary">
            DevPulse의 콘텐츠와 데이터에 REST API로 접근하세요.
            <br />
            인증 없이 공개 읽기 API를 사용할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#overview"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-bg transition-colors hover:bg-emerald-400"
            >
              빠른 시작
            </a>
            <a
              href="#articles"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              <Zap size={14} className="mr-1 inline text-emerald-400" />
              API 엔드포인트
            </a>
          </div>
        </div>
      </div>

      {/* Docs content */}
      <DocsClient>
        <ApiTester />
      </DocsClient>
    </>
  );
}

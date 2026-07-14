import type { Metadata } from "next";
import { Zap, Brain, Rss, BarChart3, Users, Github } from "lucide-react";
import Accordion from "@/components/shared/Accordion";

const SITE_URL = "https://blog-auto-woad.vercel.app";

export const metadata: Metadata = {
  title: "소개 | DevPulse",
  description: "DevPulse는 AI가 큐레이션하는 IT 트렌드 블로그입니다. 실시간으로 최신 기술 뉴스를 수집하고 전문적으로 분석합니다.",
  openGraph: {
    title: "소개 | DevPulse",
    description: "AI가 큐레이션하는 IT 트렌드 블로그",
    url: `${SITE_URL}/about`,
    siteName: "DevPulse",
    type: "website",
    locale: "ko_KR",
    images: [{ url: `${SITE_URL}/api/og?title=DevPulse%20About`, width: 1200, height: 630, alt: "DevPulse 소개" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@devpulse",
    creator: "@devpulse",
    title: "소개 | DevPulse",
    description: "AI가 큐레이션하는 IT 트렌드 블로그",
    images: [{ url: `${SITE_URL}/api/og?title=DevPulse%20About`, alt: "DevPulse 소개" }],
  },
};

const FEATURES = [
  {
    icon: Brain,
    title: "AI 큐레이션",
    desc: "AI가 최신 기술 트렌드를 분석하고, 중요도에 따라 아티클을 자동 큐레이션합니다.",
  },
  {
    icon: Rss,
    title: "실시간 수집",
    desc: "전 세계 주요 기술 블로그와 뉴스 소스에서 실시간으로 아티클을 수집합니다.",
  },
  {
    icon: BarChart3,
    title: "전문 분석",
    desc: "각 아티클의 핵심 내용을 AI가 요약하고, 난이도와 핵심 포인트를 제공합니다.",
  },
];

const TEAM = [
  { name: "DevPulse Team", role: "운영 및 개발" },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "DevPulse 소개",
    description: "AI가 큐레이션하는 IT 트렌드 블로그",
    url: "/about",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
            <Zap size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-text-primary">DevPulse</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
            AI가 큐레이션하는<br />IT 트렌드 블로그
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-text-secondary">
            DevPulse는 전 세계 기술 뉴스를 실시간으로 수집하고, AI가 핵심 내용을 분석·요약하여 개발자에게 전달합니다.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6 text-center">
              <Icon size={24} className="mx-auto mb-3 text-emerald-400" />
              <h3 className="text-sm font-bold text-text-primary">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">{desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-xl font-bold text-text-primary">서비스 흐름</h2>
          <div className="flex flex-col items-center gap-4">
            {[
              "다양한 소스에서 기술 아티클을 수집합니다",
              "AI가 아티클의 핵심 내용을 분석하고 요약합니다",
              "난이도와 카테고리로 분류하여 큐레이션합니다",
              "최신 트렌드를 뉴스레터로 전달합니다",
            ].map((step, i) => (
              <div key={i} className="flex w-full max-w-md items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-400">
                  {i + 1}
                </span>
                <p className="text-sm text-text-secondary">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-xl font-bold text-text-primary">팀</h2>
          <div className="flex justify-center">
            {TEAM.map(({ name, role }) => (
              <div key={name} className="flex items-center gap-4 rounded-xl border border-border bg-card px-6 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <Users size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{name}</p>
                  <p className="text-xs text-text-muted">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="mb-6 text-center text-xl font-bold text-text-primary">자주 묻는 질문</h2>
          <Accordion
            items={[
              {
                title: "DevPulse는 어떤 서비스인가요?",
                content: "DevPulse는 전 세계 기술 뉴스를 실시간으로 수집하고, AI가 핵심 내용을 분석·요약하여 개발자에게 전달하는 IT 트렌드 블로그입니다.",
              },
              {
                title: "아티클은 얼마나 자주 업데이트되나요?",
                content: "AI 큐레이션이 실시간으로 작동하여, 새로운 기술 아티클이 수집되는 즉시 분석 및 요약 과정을 거쳐 업데이트됩니다.",
              },
              {
                title: "API를 사용할 수 있나요?",
                content: "네, RESTful API를 통해 아티클 목록 조회, 검색, 통계, 뉴스레터 구독 등의 기능을 프로그래밍 방식으로 이용할 수 있습니다. 자세한 내용은 docs 페이지를 참고하세요.",
              },
              {
                title: "뉴스레터는 어떻게 구독하나요?",
                content: "뉴스레터 구독 페이지에서 이메일 주소를 입력하면 됩니다.感兴趣的 카테고리를 선택하여 맞춤형 뉴스레터를 받아볼 수 있습니다.",
              },
            ]}
          />
        </div>

        {/* Contact / Links */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <Github size={16} />
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}

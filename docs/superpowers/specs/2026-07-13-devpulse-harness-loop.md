# DevPulse — Harness & Loop Engineering 설계

## Harness Engineering (선수 제약 시스템)

Harness Engineering은 시스템이 규칙을 위반하지 않도록 **사전에 구조를 제약**하는 접근법이다. Base44의 디자인 파운데이션에서 추출한 패턴을 체계화한다.

### 1. Design Token System (디자인 토큰 시스템)

Base44는 "1 primary, 1 secondary, 1 accent, 3-5 neutral grays" 규칙을 따른다. 이를 DevPulse에 적용:

```typescript
// src/lib/tokens.ts — Single source of truth
export const tokens = {
  color: {
    // Primary: Emerald (브랜드 아이덴티티)
    primary: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399',  // 메인 포인트
      500: '#10B981',
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
      950: '#022C22',
    },
    // Secondary: Cyan (보조 포인트)
    secondary: {
      400: '#22D3EE',
      500: '#06B6D4',
      600: '#0891B2',
    },
    // Neutral: Slate (배경/서피스/보더)
    neutral: {
      50: '#F8FAFC',   // text-primary
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',  // text-secondary
      500: '#64748B',  // text-muted
      600: '#475569',
      700: '#334155',  // border
      800: '#1E293B',  // card
      900: '#0F172A',
      950: '#0B0F19',  // bg
    },
    // Semantic
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#22D3EE',
  },
  // Base44 spacing scale: 4, 8, 12, 16, 24
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
  },
  // Typography roles (Base44 패턴)
  fontSize: {
    xs: '0.75rem',    // metadata
    sm: '0.875rem',   // labels
    base: '1rem',     // body
    lg: '1.125rem',   // subheading
    xl: '1.25rem',    // section heading
    '2xl': '1.5rem',  // page title
    '3xl': '2rem',    // hero
    '4xl': '2.5rem',  // hero large
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  // Shadow system
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.3)',
    lg: '0 10px 15px rgba(0,0,0,0.3)',
    glow: '0 0 20px rgba(52,211,153,0.15)',
    glowCyan: '0 0 20px rgba(34,211,238,0.15)',
  },
} as const;
```

### 2. Component Harness (컴포넌트 하네스)

Base44의 "Standardize core elements" 패턴을 적용. 모든 컴포넌트는 **variant + size + state** 3축으로 구성:

```typescript
// src/components/harness/types.ts
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Size = 'sm' | 'md' | 'lg';
export type State = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

// Button Harness
export interface ButtonHarness {
  variant: Variant;
  size: Size;
  state: State;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Card Harness
export interface CardHarness {
  variant: 'elevated' | 'outlined' | 'filled';
  padding: 'none' | 'sm' | 'md' | 'lg';
  interactive: boolean;  // hover 효과 활성화
  href?: string;
}

// Badge Harness
export interface BadgeHarness {
  variant: 'difficulty' | 'category' | 'status' | 'tag';
  size: Size;
  color?: string;
}

// Input Harness
export interface InputHarness {
  size: Size;
  state: 'default' | 'focus' | 'error' | 'disabled';
  label?: string;
  helper?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}
```

### 3. Page Template Harness (페이지 템플릿 하네스)

Base44의 페이지 타입 체계를 DevPulse에 적용:

```typescript
// src/lib/page-templates.ts
export const pageTemplates = {
  // 랜딩/마케팅 페이지 (메인 홈)
  landing: {
    maxWidth: '1200px',
    sections: ['hero', 'trending', 'feed'],
    heroHeight: 'auto',  // 콘텐츠 높이에 맞춤
    gridColumns: { mobile: 1, tablet: 2, desktop: 3 },
  },
  // 상세 페이지 (글 상세)
  detail: {
    maxWidth: '720px',
    sections: ['header', 'ai-summary', 'content', 'related'],
    contentPadding: { mobile: '16px', desktop: '48px' },
  },
  // 대시보드 (관리자)
  dashboard: {
    maxWidth: '1200px',
    sections: ['kpi', 'tabs', 'content'],
    kpiColumns: { mobile: 2, tablet: 2, desktop: 4 },
  },
  // 목록/테이블 (카테고리)
  list: {
    maxWidth: '1200px',
    sections: ['header', 'filters', 'grid'],
    gridColumns: { mobile: 1, tablet: 2, desktop: 3 },
  },
  // 폼 (구독)
  form: {
    maxWidth: '480px',
    sections: ['header', 'form', 'social-proof'],
    formLayout: 'single-column',
  },
} as const;
```

### 4. Responsive Harness (반응형 하네스)

Base44의 모바일 우선 접근법을 체계화:

```typescript
// src/lib/responsive.ts
export const breakpoints = {
  mobile: 0,      // 0-767px: 1열, 풀 너비
  tablet: 768,    // 768-1023px: 2열
  desktop: 1024,  // 1024px+: 3열
} as const;

// 컴포넌트별 반응형 규칙
export const responsiveRules = {
  header: {
    mobile: 'hamburger-menu',
    tablet: 'hamburger-menu',
    desktop: 'full-nav',
  },
  hero: {
    mobile: 'stacked',      // 제목 + 설명 + 폼 세로 배치
    tablet: 'stacked',
    desktop: 'centered',    // 중앙 정렬 + 넉넉한 패딩
  },
  cardGrid: {
    mobile: '1-col',
    tablet: '2-col',
    desktop: '3-col',
  },
  articleHeader: {
    mobile: 'compact',      // 배지+제목만
    tablet: 'standard',
    desktop: 'full',        // 배지+제목+메타+원문링크
  },
  adminTable: {
    mobile: 'card-view',    // 테이블 대신 카드
    tablet: 'scrollable',   // 가로 스크롤
    desktop: 'full-table',
  },
} as const;
```

### 5. Accessibility Harness (접근성 하네스)

Base44의 접근성 가이드를 적용:

```typescript
// src/lib/accessibility.ts
export const a11yRules = {
  // 색상 대비: WCAG AA 기준 4.5:1
  contrast: {
    textOnBg: 4.5,        // 일반 텍스트
    textOnBgLarge: 3.0,   // 큰 텍스트 (18px+)
    uiComponent: 3.0,     // UI 컴포넌트
  },
  // 터치 타겟: 최소 44x44px
  touchTarget: {
    minSize: 44,
    minGap: 8,
  },
  // 포커스 관리
  focus: {
    style: 'outline-2 outline-offset-2 outline-emerald-400',
    trapInModal: true,
    skipLinks: true,
  },
  // 스크린 리더
  sr: {
    ariaLabels: true,
    roleAttributes: true,
    liveRegions: true,  // 동적 콘텐츠 업데이트 알림
  },
  // 모션
  motion: {
    respectReducedMotion: true,
    maxAnimationDuration: 300,
  },
} as const;
```

---

## Loop Engineering (피드백 루프 시스템)

Loop Engineering은 시스템이 **자기 개선**할 수 있도록 데이터를 수집하고 분석하는 구조를 만든다.

### 1. Performance Monitoring Loop (성능 모니터링 루프)

```typescript
// src/lib/analytics.ts
export interface AnalyticsEvent {
  type: 'page_view' | 'article_read' | 'subscribe' | 'search' | 'filter';
  payload: Record<string, unknown>;
  timestamp: number;
}

// Core Web Vitals 추적
export function reportWebVitals(metric: {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}) {
  // Vercel Analytics 또는自行 구현
  console.log(`[WebVitals] ${metric.name}: ${metric.value} (${metric.rating})`);
}

// 사용자 행동 추적
export function trackEvent(event: AnalyticsEvent) {
  // 로컬 스토리지 + 서버 전송
  const events = JSON.parse(localStorage.getItem('dp_events') || '[]');
  events.push({ ...event, timestamp: Date.now() });
  localStorage.setItem('dp_events', JSON.stringify(events.slice(-100)));

  // 서버 전송 (배치)
  if (events.length >= 10) {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: events.slice(0, 10) }),
    });
  }
}
```

### 2. Content Quality Loop (콘텐츠 품질 루프)

```typescript
// src/lib/content-loop.ts
// AI 분석 품질 자동 평가

export interface QualityMetrics {
  summaryLength: number;      // 요약 길이 (100-200자 권장)
  keywordRelevance: number;   // 키워드 관련성 (0-1)
  difficultyAccuracy: number; // 난이도 정확도 (사용자 피드백 기반)
  readTimeEstimate: number;   // 예상 읽기 시간 (분)
}

export function evaluateQuality(article: {
  aiSummary: string;
  keyPoints: string;
  difficultyLevel: string;
  content: string;
}): QualityMetrics {
  return {
    summaryLength: article.aiSummary.length,
    keywordRelevance: calculateKeywordRelevance(article),
    difficultyAccuracy: 0,  // 사용자 피드백으로 채움
    readTimeEstimate: Math.ceil(article.content.split(/\s+/).length / 350),
  };
}

function calculateKeywordRelevance(article: any): number {
  const keywords = JSON.parse(article.keyPoints || '[]');
  const content = article.content.toLowerCase();
  const matches = keywords.filter((k: string) => content.includes(k.toLowerCase()));
  return keywords.length > 0 ? matches.length / keywords.length : 0;
}
```

### 3. User Feedback Loop (사용자 피드백 루프)

```typescript
// src/components/feedback/ArticleFeedback.tsx
"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface ArticleFeedbackProps {
  articleId: number;
}

export default function ArticleFeedback({ articleId }: ArticleFeedbackProps) {
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);

  const handleFeedback = async (type: "helpful" | "not-helpful") => {
    setFeedback(type);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, type }),
    });
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <span className="text-sm text-text-muted">이 글이 도움이 되었나요?</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback("helpful")}
          className={`rounded-lg p-2 transition-colors ${
            feedback === "helpful"
              ? "bg-emerald-950 text-emerald-400"
              : "text-text-muted hover:text-emerald-400"
          }`}
        >
          <ThumbsUp size={18} />
        </button>
        <button
          onClick={() => handleFeedback("not-helpful")}
          className={`rounded-lg p-2 transition-colors ${
            feedback === "not-helpful"
              ? "bg-red-950 text-red-400"
              : "text-text-muted hover:text-red-400"
          }`}
        >
          <ThumbsDown size={18} />
        </button>
      </div>
    </div>
  );
}
```

### 4. Content Discovery Loop (콘텐츠 발견 루프)

```typescript
// src/lib/discovery-loop.ts
// 인기 글 자동 선정 + 트렌딩 알고리즘

export interface TrendingScore {
  articleId: number;
  score: number;
  reason: string;
}

export function calculateTrendingScore(articles: {
  id: number;
  viewCount: number;
  publishedAt: Date;
  aiSummary: string;
}[]): TrendingScore[] {
  const now = Date.now();
  const DAY = 86400000;

  return articles
    .map((article) => {
      const ageInDays = (now - article.publishedAt.getTime()) / DAY;
      const recencyBoost = Math.max(0, 1 - ageInDays / 7); // 7일 이내 감점 없음
      const viewBoost = Math.log10(article.viewCount + 1) / 6; // 로그 스케일
      const summaryQuality = article.aiSummary.length > 50 ? 0.1 : 0; // 요약 품질

      const score = recencyBoost * 0.6 + viewBoost * 0.3 + summaryQuality;
      const reason = ageInDays < 1 ? '최신' : ageInDays < 3 ? '인기' : '베스트';

      return { articleId: article.id, score, reason };
    })
    .sort((a, b) => b.score - a.score);
}
```

### 5. SEO Optimization Loop (SEO 최적화 루프)

```typescript
// src/lib/seo-loop.ts
export function generateArticleSchema(article: {
  title: string;
  aiSummary: string;
  source: string;
  publishedAt: string;
  category: string;
  difficultyLevel: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.aiSummary,
    author: { '@type': 'Organization', name: 'DevPulse' },
    publisher: {
      '@type': 'Organization',
      name: 'DevPulse',
      logo: { '@type': 'ImageObject', url: '/logo.png' },
    },
    datePublished: article.publishedAt,
    about: {
      '@type': 'Thing',
      name: article.category,
    },
  };
}

// Open Graph 메타태그 자동 생성
export function generateOGTags(article: {
  title: string;
  aiSummary: string;
  id: number;
}) {
  return {
    'og:title': article.title,
    'og:description': article.aiSummary,
    'og:type': 'article',
    'og:url': `/article/${article.id}`,
    'og:site_name': 'DevPulse',
    'twitter:card': 'summary_large_image',
    'twitter:title': article.title,
    'twitter:description': article.aiSummary,
  };
}
```

### 6. A/B Testing Loop (A/B 테스트 루프)

```typescript
// src/lib/ab-test.ts
export interface ABTest {
  id: string;
  name: string;
  variants: string[];
  weights: number[];
}

export const tests: ABTest[] = [
  {
    id: 'hero-cta',
    name: 'Hero CTA 문구',
    variants: ['구독하기', '무료로 받아보기', '지금 시작하기'],
    weights: [0.33, 0.33, 0.34],
  },
  {
    id: 'card-layout',
    name: '카드 레이아웃',
    variants: ['3열', '2열'],
    weights: [0.5, 0.5],
  },
];

export function getVariant(testId: string): string {
  const test = tests.find((t) => t.id === testId);
  if (!test) return '';

  const stored = localStorage.getItem(`ab_${testId}`);
  if (stored) return stored;

  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < test.variants.length; i++) {
    cumulative += test.weights[i];
    if (random < cumulative) {
      localStorage.setItem(`ab_${testId}`, test.variants[i]);
      return test.variants[i];
    }
  }
  return test.variants[0];
}
```

### 7. Automated Content Pipeline Loop (자동화 콘텐츠 파이프라인 루프)

```yaml
# .github/workflows/content-loop.yml
name: Content Quality Loop

on:
  schedule:
    # 매일 오전 6시 KST 수집
    - cron: '0 21 * * *'
    # 매주 일요일 품질 리포트
    - cron: '0 15 * * 0'
  workflow_dispatch:

jobs:
  fetch:
    if: github.event.schedule == '0 21 * * *'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: curl -X POST ${{ secrets.APP_URL }}/api/fetch
      - run: curl -X POST ${{ secrets.APP_URL }}/api/analyze

  quality-report:
    if: github.event.schedule == '0 15 * * 0'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: curl -X POST ${{ secrets.APP_URL }}/api/quality-report
```

---

## 통합: 최상위 블로그를 위한 추가 컴포넌트

### 1. Reading Progress Bar (읽기 진행률)

```tsx
// src/components/article/ReadingProgress.tsx
"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-0.5 bg-emerald-400 transition-all duration-150"
      style={{ width: `${progress}%` }}
    />
  );
}
```

### 2. Back to Top Button

```tsx
// src/components/shared/BackToTop.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 p-3 text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-glow"
      aria-label="맨 위로 돌아가기"
    >
      <ArrowUp size={20} />
    </button>
  );
}
```

### 3. Search Modal

```tsx
// src/components/search/SearchModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number;
  title: string;
  category: string;
  aiSummary: string;
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/articles?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setResults(data.articles || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <Search size={20} className="text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="글 검색... (⌘K)"
            className="flex-1 bg-transparent text-text-primary outline-none placeholder-text-muted"
          />
          <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  router.push(`/article/${r.id}`);
                  setOpen(false);
                }}
                className="block w-full rounded-lg p-3 text-left transition-colors hover:bg-border"
              >
                <p className="text-sm font-medium text-text-primary">{r.title}</p>
                <p className="mt-1 text-xs text-text-muted">{r.category}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4. Skeleton Variants (다양한 스켈레톤)

```tsx
// src/components/shared/Skeleton.tsx
interface SkeletonProps {
  variant?: 'text' | 'title' | 'card' | 'avatar' | 'image';
  className?: string;
}

export default function Skeleton({ variant = 'text', className = '' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-7 w-3/4',
    card: 'h-48 w-full rounded-lg',
    avatar: 'h-10 w-10 rounded-full',
    image: 'h-40 w-full rounded-lg',
  };

  return (
    <div className={`skeleton ${variants[variant]} ${className}`} />
  );
}
```

---

## 성능 최적화 전략

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용 (자동 WebP 변환)
- 레이지 로딩 적용
- 적절한 크기 지정 (srcSet)

### 2. 코드 스플리팅
- 각 페이지별 동적 임포트
- 무거운 라이브러리 (react-markdown) 동적 로드

```tsx
// 예시: 동적 임포트
const MarkdownBody = dynamic(() => import('@/components/article/MarkdownBody'), {
  loading: () => <Skeleton variant="card" className="h-96" />,
});
```

### 3. 데이터 캐시 전략
- ISR (Incremental Static Regeneration) 활용
- SWR 또는 React Query로 클라이언트 캐시
- API 응답 캐시 헤더 설정

### 4. 검색 엔진 최적화
- sitemap.xml 자동 생성
- robots.txt 설정
- Open Graph / Twitter Card 메타태그
- JSON-LD 구조화 데이터

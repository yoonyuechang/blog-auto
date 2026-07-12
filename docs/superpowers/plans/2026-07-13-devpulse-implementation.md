# DevPulse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build DevPulse — a Next.js 14 dark-mode IT trends blog with auto-fetching, AI summarization, admin dashboard, and newsletter subscription.

**Architecture:** Next.js 14 App Router + Prisma ORM + SQLite. NVIDIA Build API for LLM with Gemini/Groq fallback. GitHub Actions for daily automation. Tailwind CSS for dark-mode-only styling.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma, SQLite, Lucide React, react-markdown, remark-gfm, NVIDIA Build API, Gemini API, Groq API

## Global Constraints

- Dark mode only (#0B0F19 bg, #1E293B card, #334155 border, Emerald/Cyan accents)
- Korean language primary, English source URLs preserved
- Free APIs only — no paid API keys
- Skeleton UI loading states on all pages
- Fully responsive (mobile/tablet/desktop)
- Sample data seeded on first run for immediate visual feedback

---

## File Structure

```
blog-auto/
├── prisma/
│   ├── schema.prisma          # DB schema (5 models)
│   └── seed.ts                # Seed data (7 sources, 6 categories, 10+ articles)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (dark mode, fonts, header/footer)
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Tailwind + custom dark theme
│   │   ├── article/[id]/
│   │   │   └── page.tsx        # Article detail
│   │   ├── category/[slug]/
│   │   │   └── page.tsx        # Category filter page
│   │   ├── admin/
│   │   │   └── page.tsx        # Admin dashboard
│   │   ├── subscribe/
│   │   │   └── page.tsx        # Newsletter subscription
│   │   └── api/
│   │       ├── articles/
│   │       │   ├── route.ts    # GET list, POST create
│   │       │   └── [id]/
│   │       │       └── route.ts # GET detail, PATCH update, DELETE
│   │       ├── sources/
│   │       │   ├── route.ts    # GET list, POST create
│   │       │   └── [id]/
│   │       │       └── route.ts # PATCH toggle
│   │       ├── newsletter/
│   │       │   └── route.ts    # POST subscribe, GET list
│   │       ├── fetch/
│   │       │   └── route.ts    # POST trigger content fetch
│   │       └── analyze/
│   │           └── route.ts    # POST trigger AI analysis
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CategoryTabs.tsx
│   │   │   ├── TrendingCards.tsx
│   │   │   └── ArticleGrid.tsx
│   │   ├── article/
│   │   │   ├── ArticleHeader.tsx
│   │   │   ├── AISummary.tsx
│   │   │   ├── MarkdownBody.tsx
│   │   │   └── RelatedArticles.tsx
│   │   ├── admin/
│   │   │   ├── KPICards.tsx
│   │   │   ├── ApprovalQueue.tsx
│   │   │   ├── SourceManager.tsx
│   │   │   └── SubscriberList.tsx
│   │   └── shared/
│   │       ├── Badge.tsx
│   │       ├── TagChip.tsx
│   │       ├── Card.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Input.tsx
│   │       ├── Button.tsx
│   │       └── Toggle.tsx
│   └── lib/
│       ├── db.ts              # Prisma singleton
│       ├── llm.ts             # NVIDIA/Gemini/Groq LLM client
│       └── fetchers.ts        # Source-specific fetchers
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Tasks

### Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Interfaces:** None (foundation task)

- [ ] **Step 1: Initialize Next.js project with dependencies**

```bash
npx create-next-app@latest blog-auto --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

- [ ] **Step 2: Install additional dependencies**

```bash
npm install prisma @prisma/client lucide-react react-markdown remark-gfm rehype-highlight rehype-raw
npm install -D @types/node
```

- [ ] **Step 3: Initialize Prisma**

```bash
npx prisma init --datasource-provider sqlite
```

- [ ] **Step 4: Configure Tailwind for dark mode**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F19",
        card: "#1E293B",
        border: "#334155",
        emerald: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Write globals.css with Tailwind directives and dark theme**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0B0F19;
  --card: #1E293B;
  --border: #334155;
  --emerald: #34D399;
  --cyan: #22D3EE;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
  line-height: 1.7;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #1E293B 25%, #334155 50%, #1E293B 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}

/* Markdown code highlighting */
pre code {
  font-family: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
  font-size: 0.85rem;
}
```

- [ ] **Step 6: Write root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DevPulse - 주니어 개발자를 위한 IT 트렌드 블로그",
  description: "AI가 요약한 최신 기술 트렌드를 매일 받아보세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-bg text-text-primary antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: Next.js 프로젝트 초기화 + Tailwind 다크모드 설정"
```

---

### Task 2: Database Schema + Seed Data

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`

**Interfaces:**
- Produces: Prisma client singleton (`db`), 5 models, seed data function

- [ ] **Step 1: Write Prisma schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Article {
  id              Int      @id @default(autoincrement())
  title           String
  summary         String
  content         String
  source          String
  sourceUrl       String
  category        String
  tags            String   @default("[]")
  difficultyLevel String   @default("입문/초급")
  publishedAt     DateTime
  status          String   @default("pending_approval")
  viewCount       Int      @default(0)
  aiSummary       String   @default("")
  keyPoints       String   @default("[]")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Source {
  id              Int      @id @default(autoincrement())
  name            String
  type            String
  url             String
  fetchInterval   String
  lastFetched     DateTime?
  isActive        Boolean  @default(true)
  category        String
  createdAt       DateTime @default(now())
}

model Newsletter {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  subscribedAt    DateTime @default(now())
  isActive        Boolean  @default(true)
  preferences     String   @default("[]")
}

model Tag {
  id              Int      @id @default(autoincrement())
  name            String   @unique
  slug            String   @unique
  color           String
  articleCount    Int      @default(0)
}

model Category {
  id              Int      @id @default(autoincrement())
  name            String   @unique
  slug            String   @unique
  description     String
  color           String
  icon            String
}
```

- [ ] **Step 2: Create Prisma client singleton**

```typescript
// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- [ ] **Step 3: Run Prisma migration**

```bash
npx prisma migrate dev --name init
```

- [ ] **Step 4: Write seed data**

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = [
    { name: "인공지능", slug: "ai", description: "AI, 머신러닝, 딥러닝 관련 뉴스", color: "#22D3EE", icon: "brain" },
    { name: "웹개발", slug: "web", description: "프론트엔드, 백엔드, 프레임워크", color: "#34D399", icon: "code" },
    { name: "오픈소스", slug: "opensource", description: "오픈소스 프로젝트와 커뮤니티", color: "#818CF8", icon: "git-branch" },
    { name: "논문/리서치", slug: "research", description: "학술 논문과 연구 동향", color: "#A78BFA", icon: "file-text" },
    { name: "커리어", slug: "career", description: "개발자 커리어와 성장", color: "#FB923C", icon: "briefcase" },
    { name: "기타", slug: "other", description: "기타 기술 뉴스", color: "#94A3B8", icon: "layers" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Sources
  const sources = [
    { name: "HackerNews Top Stories", type: "api", url: "https://hacker-news.firebaseio.com/v0/topstories.json", fetchInterval: "hourly", category: "기타", isActive: true },
    { name: "Dev.to Articles", type: "api", url: "https://dev.to/api/articles", fetchInterval: "daily", category: "웹개발", isActive: true },
    { name: "GitHub Trending", type: "api", url: "https://api.github.com/search/repositories?q=stars:>100&sort=stars&order=desc", fetchInterval: "daily", category: "오픈소스", isActive: true },
    { name: "arXiv AI Papers", type: "api", url: "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=lastUpdatedDate&sortOrder=descending&max_results=10", fetchInterval: "daily", category: "논문/리서치", isActive: true },
    { name: "OpenAI Blog", type: "rss", url: "https://openai.com/blog/rss.xml", fetchInterval: "daily", category: "인공지능", isActive: true },
    { name: "Google AI Blog", type: "rss", url: "https://blog.google/technology/ai/rss/", fetchInterval: "daily", category: "인공지능", isActive: true },
    { name: "Hugging Face Blog", type: "rss", url: "https://huggingface.co/blog/feed.xml", fetchInterval: "daily", category: "인공지능", isActive: true },
  ];

  for (const src of sources) {
    await prisma.source.create({ data: src });
  }

  // Sample Articles (10+)
  const articles = [
    {
      title: "GPT-5의 의미: 멀티모달 AI의 새 시대",
      summary: "OpenAI가 GPT-5를 공개하며, 텍스트-이미지-코드 통합 처리 성능이 크게 향상되었습니다.",
      content: "## GPT-5가 바꾸는 AI 생태계\n\nOpenAI가 GPT-5를 공개했습니다. 이 모델은 텍스트, 이미지, 코드를 동시에 처리하는 멀티모달 아키텍처를 채택했습니다.\n\n### 주요 개선점\n\n- **멀티모달 처리**: 텍스트와 이미지를 동시에 입력받아 통합 응답 생성\n- **코딩 능력 향상**: GitHub Copilot 통합 시 코드 완성 정확도 40% 개선\n- **컨텍스트 윈도우 확장**: 256K 토큰 지원\n\n### 주니어 개발자를 위한 영향\n\nGPT-5는 코드 리뷰, 버그 찾기, 문서화 작업에서 더 정확한 도우미가 됩니다. 단순 코드 생성이 아니라 코드 품질 분석까지 가능해졌습니다.\n\n```python\n# GPT-5를 활용한 코드 리뷰 예시\nimport openai\n\nresponse = openai.chat.completions.create(\n    model=\"gpt-5\",\n    messages=[{\"role\": \"user\", \"content\": \"이 코드의 문제점을 찾아줘\"}]\n)\n```\n\n### 시장 영향\n\n코딩 AI 시장이 급속히 성장하고 있으며, 주니어 개발자의 역할이 \"코드 작성\"에서 \"코드 검증 및 설계\"로 변화하고 있습니다.",
      source: "OpenAI Blog",
      sourceUrl: "https://openai.com/blog/gpt-5",
      category: "인공지능",
      tags: JSON.stringify(["GPT-5", "OpenAI", "멀티모달"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 342,
      aiSummary: "OpenAI GPT-5가 텍스트-이미지-코드 통합 멀티모달 처리를 지원하며 공개됨. 컨텍스트 윈도우 256K 토큰, 코딩 정확도 40% 향상. 주니어 개발자에게 코드 리뷰·버그 찾기 도우미로 유용.",
      keyPoints: JSON.stringify(["멀티모달 AI", "GPT-5", "코딩 AI"]),
    },
    {
      title: "React 19 Server Components 완전 정복",
      summary: "React 19에서 Server Components가 안정화되면서, 프론트엔드 아키텍처가 근본적으로 변화하고 있습니다.",
      content: "## Server Components란?\n\nReact Server Components(RSC)는 서버에서 렌더링되는 React 컴포넌트입니다. 클라이언트 번들에 포함되지 않아 성능이 크게 향상됩니다.\n\n### 사용 예시\n\n```tsx\n// 서버 컴포넌트 (기본)\nasync function ArticleList() {\n  const articles = await db.article.findMany();\n  return (\n    <ul>\n      {articles.map(a => <li key={a.id}>{a.title}</li>)}\n    </ul>\n  );\n}\n\n// 클라이언트 컴포넌트 (\"use client\" 지시어)\n\"use client\"\nfunction LikeButton({ articleId }: { articleId: number }) {\n  const [liked, setLiked] = useState(false);\n  return <button onClick={() => setLiked(!liked)}>{liked ? \"❤️\" : \"🤍\"}</button>;\n}\n```\n\n### 왜 중요한가?\n\n1. **번들 크기 감소**: 서버 전용 컴포넌트는 클라이언트 JS에 포함되지 않음\n2. **데이터 접근**: 서버에서 직접 DB/API 접근 가능\n3. **보안**: 민감한 데이터가 클라이언트에 노출되지 않음\n\n### 주의할 점\n\n- 서버 컴포넌트에서는 useState, useEffect 사용 불가\n- 이벤트 핸들러는 클라이언트 컴포넌트에서만 가능",
      source: "Dev.to",
      sourceUrl: "https://dev.to/react-server-components-2025",
      category: "웹개발",
      tags: JSON.stringify(["React", "Server Components", "프론트엔드"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 287,
      aiSummary: "React 19에서 Server Components가 안정화되어 프론트엔드 아키텍처 변화를 촉진. 서버 렌더링으로 번들 크기 감소, DB 직접 접근 가능. 클라이언트 컴포넌트와 구분하여 사용해야 함.",
      keyPoints: JSON.stringify(["React Server Components", "번들 최적화", "RSC"]),
    },
    {
      title: "Supabase로 5분 만에 인증 시스템 만들기",
      summary: "Supabase Auth를 활용하면 이메일/비밀번호, 소셜 로그인을 빠르게 구현할 수 있습니다.",
      content: "## Supabase Auth 시작하기\n\n### 1단계: 프로젝트 생성\n\nSupabase 대시보드에서 새 프로젝트를 생성합니다.\n\n### 2단계: 인증 설정\n\n```typescript\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL!,\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!\n)\n\n// 이메일 회원가입\nconst { data, error } = await supabase.auth.signUp({\n  email: 'user@example.com',\n  password: 'password123'\n})\n\n// 소셜 로그인 (Google)\nconst { data, error } = await supabase.auth.signInWithOAuth({\n  provider: 'google'\n})\n```\n\n### 3단계: 미들웨어 보호\n\n```typescript\n// middleware.ts\nimport { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'\n\nexport async function middleware(req) {\n  const res = NextResponse.next()\n  const supabase = createMiddlewareClient({ req, res })\n  await supabase.auth.getSession()\n  return res\n}\n```\n\n### 팁\n\n- Row Level Security(RLS)를 반드시 활성화하세요\n- 프로덕션에서는 이메일 확인을 필수로 설정하세요",
      source: "Dev.to",
      sourceUrl: "https://dev.to/supabase-auth-quickstart",
      category: "웹개발",
      tags: JSON.stringify(["Supabase", "인증", "Next.js"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 198,
      aiSummary: "Supabase Auth로 이메일/소셜 로그인을 빠르게 구현하는 방법. createClient로 인증 클라이언트 생성, 미들웨어로 라우트 보호 가능. RLS 활성화 필수.",
      keyPoints: JSON.stringify(["Supabase Auth", "소셜 로그인", "RLS"]),
    },
    {
      title: "Deno 2.0: Node.js와의 완전한 호환 선언",
      summary: "Deno 2.0이 출시되면서 Node.js 패키지와의 완전한 호환을 달성했습니다.",
      content: "## Deno 2.0 주요 변경점\n\n### Node.js 호환성\n\nDeno 2.0부터는 `npm:` 접두사 없이 Node.js 패키지를 직접 사용할 수 있습니다.\n\n```typescript\n// 이제 이렇게 사용 가능\nimport express from \"express\";\nimport { createClient } from \"redis\";\n\nconst app = express();\napp.get(\"/\", (req, res) => res.send(\"Hello from Deno 2.0!\"));\n```\n\n### 패키지 관리\n\n```bash\n# npm 패키지 설치\nDeno add npm:express\nDeno add npm:lodash\n\n# import_map.json 자동 생성\n```\n\n### Deno vs Node.js 비교\n\n| 항목 | Deno 2.0 | Node.js |\n|------|----------|--------|\n| 보안 | 기본 차단 | 기본 허용 |\n| TypeScript | 내장 지원 | 별도 설정 |\n| npm 호환 | 완전 지원 | 네이티브 |\n| 런타임 | V8 | V8 |\n\n### 주니어 개발자에게\n\nDeno를 써야 할 이유가 명확해졌습니다. 보안이 기본이고, TypeScript가 내장이며, npm 패키지도 쓸 수 있습니다.",
      source: "HackerNews",
      sourceUrl: "https://deno.land/blog/v2.0",
      category: "웹개발",
      tags: JSON.stringify(["Deno", "Node.js", "런타임"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 156,
      aiSummary: "Deno 2.0이 Node.js 패키지와의 완전한 호환을 달성. npm 접두사 없이 직접 사용 가능, TypeScript 내장 지원. 보안 기본 차단 방식으로 변경.",
      keyPoints: JSON.stringify(["Deno 2.0", "Node.js 호환", "런타임"]),
    },
    {
      title: "LangChain으로 만드는 RAG 파이프라인 완벽 가이드",
      summary: "LangChain과 벡터 DB를 활용한 RAG(Retrieval-Augmented Generation) 구현 방법을 단계별로 설명합니다.",
      content: "## RAG란?\n\nRAG는 검색 증강 생성(Retrieval-Augmented Generation)의 약자로, LLM이 외부 문서를 검색한 후 답변하는 방식입니다.\n\n### 아키텍처\n\n```\n사용자 질문 → 문서 검색(벡터 DB) → 관련 문서 + 질문 → LLM → 답변\n```\n\n### 구현 예시\n\n```python\nfrom langchain_community.vectorstores import Chroma\nfrom langchain_openai import OpenAIEmbeddings, ChatOpenAI\nfrom langchain.chains import RetrievalQA\n\n# 1. 문서 로드 및 청킹\nfrom langchain_community.document_loaders import TextLoader\nloader = TextLoader(\"docs.txt\")\ndocs = loader.load_and_split()\n\n# 2. 벡터 저장소 생성\nvectorstore = Chroma.from_documents(docs, OpenAIEmbeddings())\n\n# 3. QA 체인 구성\nchain = RetrievalQA.from_chain_type(\n    llm=ChatOpenAI(model=\"gpt-4\"),\n    retriever=vectorstore.as_retriever()\n)\n\n# 4. 질의\nresult = chain.invoke(\"RAG가 뭔가요?\")\nprint(result[\"result\"])\n```\n\n### 벡터 DB 선택\n\n| DB | 특징 | 무료 티어 |\n|----|------|----------|\n| Chroma | 로컬, 간편 | 완전 무료 |\n| Pinecone | 매니지드 | 100K 벡터 |\n| Qdrant | 고성능 | 1GB 무료 |\n\n### 주의사항\n\n- 청크 크기가 너무 작으면 문맥이 끊길 수 있음\n- 임베딩 모델 선택이 성능에 큰 영향",
      source: "HackerNews",
      sourceUrl: "https://hackernews.com/item/rag-langchain-guide",
      category: "인공지능",
      tags: JSON.stringify(["RAG", "LangChain", "벡터DB"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 267,
      aiSummary: "LangChain + 벡터 DB로 RAG 파이프라인 구현 가이드. 문서 로드 → 청킹 → 벡터 저장 → 검색 → LLM 답변 흐름. Chroma(무료)부터 Pinecone(100K 무료)까지 벡터 DB 옵션 정리.",
      keyPoints: JSON.stringify(["RAG", "LangChain", "벡터DB"]),
    },
    {
      title: "Kubernetes 입문자를 위한 실전 클러스터 구성",
      summary: "Kubernetes의 핵심 개념을 실습 중심으로 설명하고, 로컬 환경에서 클러스터를 구성하는 방법을 안내합니다.",
      content: "## Kubernetes 핵심 개념\n\n### Pod\n\nPod은 Kubernetes에서 가장 작은 배포 단위입니다. 하나 이상의 컨테이너를 포함합니다.\n\n```yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: my-app\nspec:\n  containers:\n  - name: app\n    image: nginx:latest\n    ports:\n    - containerPort: 80\n```\n\n### Deployment\n\nDeployment는 Pod의 복제와 업데이트를 관리합니다.\n\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: my-app\n  template:\n    metadata:\n      labels:\n        app: my-app\n    spec:\n      containers:\n      - name: app\n        image: nginx:latest\n```\n\n### Service\n\nService는 Pod에 대한 네트워크 접근을 제공합니다.\n\n```yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: my-app-service\nspec:\n  selector:\n    app: my-app\n  ports:\n  - port: 80\n    targetPort: 80\n  type: LoadBalancer\n```\n\n### 로컬 환경 구성\n\n```bash\n# Minikube 설치 후\nminikube start\nkubectl apply -f deployment.yaml\nkubectl get pods\nkubectl get services\n```\n\n### 팁\n\n- `kubectl get events`로 문제 디버깅\n- `kubectl describe pod <name>`으로 상세 정보 확인",
      source: "Dev.to",
      sourceUrl: "https://dev.to/kubernetes-beginners-guide",
      category: "웹개발",
      tags: JSON.stringify(["Kubernetes", "DevOps", "컨테이너"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 134,
      aiSummary: "Kubernetes 핵심 개념(Pod, Deployment, Service)을 YAML 예시로 설명. Minikube로 로컬 클러스터 구성 방법 안내. kubectl get events로 디버깅 팁 포함.",
      keyPoints: JSON.stringify(["Kubernetes", "Pod", "Minikube"]),
    },
    {
      title: "Tailwind CSS 4.0: 성능 10배 향상의 비밀",
      summary: "Tailwind CSS 4.0이 Rust 기반 엔진으로 전환되면서 빌드 성능이 크게 개선되었습니다.",
      content: "## Tailwind CSS 4.0 주요 변경점\n\n### Rust 기반 엔진\n\nTailwind CSS 4.0부터는 JavaScript 대신 Rust로 작성된 엔진을 사용합니다. 빌드 시간이 10배 이상 빨라졌습니다.\n\n### CSS-first 구성\n\n```css\n/* tailwind.config.js 대신 CSS에서 직접 설정 */\n@import \"tailwindcss\";\n\n@theme {\n  --color-primary: #34D399;\n  --color-secondary: #22D3EE;\n  --font-sans: \"Pretendard\", sans-serif;\n}\n```\n\n### 자동 콘텐츠 감지\n\n더 이상 `content` 배열을 수동으로 지정할 필요가 없습니다.\n\n### 성능 비교\n\n| 항목 | v3 | v4 |\n|------|-----|-----|\n| 빌드 시간 | 4.2s | 0.4s |\n| CSS 크기 | 3.5MB | 0.8MB |\n| 메모리 사용 | 512MB | 128MB |\n\n### 마이그레이션\n\n```bash\nnpx @tailwindcss/upgrade@next\n```\n\n자동으로 설정 파일을 변환해줍니다.",
      source: "HackerNews",
      sourceUrl: "https://tailwindcss.com/blog/tailwindcss-v4",
      category: "웹개발",
      tags: JSON.stringify(["Tailwind CSS", "CSS", "성능"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 203,
      aiSummary: "Tailwind CSS 4.0이 Rust 기반 엔진으로 전환되어 빌드 10배 향상. CSS-first 구성 방식 도입, 자동 콘텐츠 감지로 config 불필요. npx @tailwindcss/upgrade@next로 마이그레이션 가능.",
      keyPoints: JSON.stringify(["Tailwind CSS 4", "Rust 엔진", "CSS-first"]),
    },
    {
      title: "GitHub Copilot Workspace: AI 네이티브 개발 환경",
      summary: "GitHub가 Copilot Workspace를 출시하여, 이슈부터 PR까지 AI가 전체 워크플로우를 처리합니다.",
      content: "## Copilot Workspace란?\n\nGitHub Copilot Workspace는 이슈를 분석하고, 솔루션을 제안하며, 코드를 작성하고, 테스트를 실행하는 AI 네이티브 개발 환경입니다.\n\n### 워크플로우\n\n```\n1. 이슈 생성/수정\n2. Copilot이 문제 분석\n3. 해결 계획 제안\n4. 코드 변경 자동 생성\n5. 테스트 실행\n6. PR 생성\n```\n\n### 사용 예시\n\n```bash\n# GitHub에서 이슈를 열면\n# Copilot Workspace 탭에서 \"Open in workspace\" 클릭\n# AI가 분석 후 해결책 제안\n# 코드 변경 확인 후 \"Create PR\" 클릭\n```\n\n### 주의할 점\n\n- AI가 생성한 코드는 반드시 검토 필요\n- 보안 관련 변경은 수동으로 처리\n- 복잡한 아키텍처 변경은 제한적\n\n### 무료 사용\n\nCopilot Free 플랜에서 월 50회 사용 가능.",
      source: "GitHub Blog",
      sourceUrl: "https://github.blog/copilot-workspace",
      category: "오픈소스",
      tags: JSON.stringify(["GitHub", "Copilot", "AI"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 189,
      aiSummary: "GitHub Copilot Workspace가 이슈→코드→PR까지 AI가 처리하는 네이티브 개발 환경을 제공. Copilot Free 플랜에서 월 50회 사용 가능. 반드시 코드 검토 필요.",
      keyPoints: JSON.stringify(["Copilot Workspace", "AI 개발", "GitHub"]),
    },
    {
      title: "Linux 커널 6.12: Rust 드라이버 지원 본격화",
      summary: "Linux 커널 6.12에서 Rust로 작성된 드라이버가 메인라인에 포함되면서, 커널 개발 생태계가 변화하고 있습니다.",
      content: "## Rust in Linux\n\n### 왜 Rust인가?\n\nLinux 커널은 C로 작성되어왔지만, Rust의 메모리 안전성이 새로운 드라이버 개발에 유리합니다.\n\n### 주요 변경점\n\n- Rust 드라이버 프레임워크 안정화\n- ARM 드라이버 Rust 변환 시작\n- 메모리 안전 사고 70% 감소 (구글 연구)\n\n### 커널 개발에 참여하기\n\n```bash\n# 소스 클론\ngit clone https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git\n\n# Rust 드라이버 빌드\ncd linux\nmake LLVM=1 rustally\n```\n\n### 주니어 개발자를 위한 의미\n\n- Rust를 배우면 커널 기여 기회 확대\n- 시스템 프로그래밍 분야에서 Rust 수요 증가\n- C 대신 Rust로 신규 프로젝트 시작하는 기업 증가",
      source: "HackerNews",
      sourceUrl: "https://lwn.net/Articles/linux-6.12-rust",
      category: "오픈소스",
      tags: JSON.stringify(["Linux", "Rust", "커널"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 178,
      aiSummary: "Linux 커널 6.12에서 Rust 드라이버가 메인라인 포함. 메모리 안전 사고 70% 감소 효과. Rust를 배우면 커널 기여 기회 확대 가능.",
      keyPoints: JSON.stringify(["Linux 커널", "Rust", "메모리 안전"]),
    },
    {
      title: "Transformer 아키텍처 7년: 여전히 유효한가?",
      summary: "2017년 구글이 제안한 Transformer가 7년이 지난 지금도 AI의 기본 아키텍처로 자리잡고 있습니다.",
      content: "## Transformer의 위력\n\n### 2017년 Attention Is All You Need\n\n구글이 \"Attention Is All You Need\" 논문에서 Transformer를 제안한 이후, 거의 모든 AI 모델이 이 아키텍처를 기반으로 합니다.\n\n### 타임라인\n\n- **2017**: Transformer 원 논문\n- **2018**: BERT (인코더 중심)\n- **2019**: GPT-2 (디코더 중심)\n- **2020**: GPT-3 (175B 파라미터)\n- **2022**: ChatGPT (인스트럭션 튜닝)\n- **2023**: GPT-4 (멀티모달)\n- **2024**: Gemini 2.0, Claude 3.5\n\n### Transformer의 핵심\n\n```python\n# Self-Attention 메커니즘 (단순화)\ndef self_attention(Q, K, V):\n    scores = Q @ K.transpose(-2, -1) / sqrt(d_k)\n    weights = softmax(scores)\n    return weights @ V\n```\n\n### 대안 연구\n\n- **State Space Models (Mamba)**: 선형 복잡도\n- **RWKV**: RNN + Transformer 혼합\n- **xLSTM**: LSTM의 현대적 재해석\n\n### 결론\n\nTransformer는 여전히 강력하지만, 효율성 문제로 대안 연구가 활발합니다.",
      source: "arXiv",
      sourceUrl: "https://arxiv.org/abs/transformer-7-years",
      category: "논문/리서치",
      tags: JSON.stringify(["Transformer", "Attention", "Deep Learning"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 245,
      aiSummary: "Transformer 아키텍처가 2017년 제안 이후 7년간 AI 기본 구조로 유지. BERT→GPT 시리즈로 발전. Mamba, RWKV 같은 대안 연구가 효율성 문제 해결 중.",
      keyPoints: JSON.stringify(["Transformer", "Self-Attention", "Mamba"]),
    },
    {
      title: "2025년 개발자 연봉 트렌드 리포트",
      summary: "국내 개발자 연봉이 지속적으로 상승하고 있으며, AI 관련 포지션의 프리미엄이 두드러집니다.",
      content: "## 2025년 개발자 연봉 현황\n\n### 포지션별 평균 연봉\n\n| 포지션 | 신입 | 3년차 | 5년차 | 시니어 |\n|--------|------|-------|-------|--------|\n| 프론트엔드 | 3,800 | 5,200 | 6,800 | 9,000+ |\n| 백엔드 | 4,000 | 5,500 | 7,200 | 9,500+ |\n| AI/ML | 4,500 | 6,500 | 9,000 | 12,000+ |\n| DevOps | 4,200 | 5,800 | 7,500 | 10,000+ |\n\n*(단위: 만원)*\n\n### 주목할 트렌드\n\n1. **AI 포지션 프리미엄**: 일반 개발자 대비 20-30% 높은 연봉\n2. **리모트 워크 확산**: 전체 개발자의 45%가 리모트 근무 경험\n3. **스톡옵션 증가**: 스타트업의 스톡옵션 제공 비율 60% 이상\n\n### 커리어 조언\n\n- AI/ML 역량을 쌓으면 연봉 협상에 유리\n- 오픈소스 기여가 포트폴리오에 도움\n- 기술 블로그 운영이 채용에 긍정적 영향",
      source: "기타",
      sourceUrl: "https://salary-report-2025.kr",
      category: "커리어",
      tags: JSON.stringify(["연봉", "커리어", "트렌드"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 312,
      aiSummary: "2025년 개발자 연봉: AI/ML 포지션이 일반 대비 20-30% 프리미엄. 리모트 워크 45%, 스톡옵션 60%+ 제공. AI 역량 확보가 연봉 협상에 유리.",
      keyPoints: JSON.stringify(["개발자 연봉", "AI 프리미엄", "리모트 워크"]),
    },
  ];

  for (const article of articles) {
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 7);
    const publishedAt = new Date(now.getTime() - randomDaysAgo * 86400000);

    await prisma.article.create({
      data: {
        ...article,
        publishedAt,
      },
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 5: Configure package.json seed script**

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

- [ ] **Step 6: Run seed**

```bash
npm install -D ts-node
npx prisma db seed
```

- [ ] **Step 7: Verify data**

```bash
npx prisma studio
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: Prisma 스키마 + 시드 데이터 (12개 샘플 글)"
```

---

### Task 3: Shared Components

**Files:**
- Create: `src/components/shared/Badge.tsx`
- Create: `src/components/shared/TagChip.tsx`
- Create: `src/components/shared/Card.tsx`
- Create: `src/components/shared/Skeleton.tsx`
- Create: `src/components/shared/Input.tsx`
- Create: `src/components/shared/Button.tsx`
- Create: `src/components/shared/Toggle.tsx`

**Interfaces:**
- Produces: Badge, TagChip, Card, Skeleton, Input, Button, Toggle components

- [ ] **Step 1: Write Badge component (난이도/카테고리)**

```tsx
// src/components/shared/Badge.tsx
interface BadgeProps {
  level: "입문/초급" | "중급" | "고급";
  size?: "sm" | "md";
}

const levelStyles = {
  "입문/초급": "bg-emerald-950 text-emerald-400 border-emerald-600",
  "중급": "bg-amber-950 text-amber-400 border-amber-600",
  "고급": "bg-red-950 text-red-400 border-red-600",
};

export default function Badge({ level, size = "sm" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-medium ${levelStyles[level]} ${
        size === "md" ? "px-3 py-1 text-sm" : ""
      }`}
    >
      {level}
    </span>
  );
}
```

- [ ] **Step 2: Write TagChip component**

```tsx
// src/components/shared/TagChip.tsx
interface TagChipProps {
  name: string;
  color?: string;
}

export default function TagChip({ name, color = "#94A3B8" }: TagChipProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
    </span>
  );
}
```

- [ ] **Step 3: Write Card component with hover effect**

```tsx
// src/components/shared/Card.tsx
"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export default function Card({ children, href, className = "" }: CardProps) {
  const baseStyles =
    "group rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]";

  if (href) {
    return (
      <a href={href} className={`${baseStyles} block ${className}`}>
        {children}
      </a>
    );
  }

  return <div className={`${baseStyles} ${className}`}>{children}</div>;
}
```

- [ ] **Step 4: Write Skeleton component**

```tsx
// src/components/shared/Skeleton.tsx
interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}
```

- [ ] **Step 5: Write Input component**

```tsx
// src/components/shared/Input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-border bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 ${className} ${
            error ? "border-red-500" : ""
          }`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
```

- [ ] **Step 6: Write Button component**

```tsx
// src/components/shared/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variants = {
  primary: "bg-emerald-500 hover:bg-emerald-600 text-white",
  secondary: "bg-card border border-border hover:bg-border text-text-primary",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 7: Write Toggle component**

```tsx
// src/components/shared/Toggle.tsx
"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-border"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/shared/
git commit -m "feat: 공용 컴포넌트 (Badge, TagChip, Card, Skeleton, Input, Button, Toggle)"
```

---

### Task 4: Layout Components (Header + Footer)

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: None
- Produces: Header, Footer layout components

- [ ] **Step 1: Write Header component**

```tsx
// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/category/ai", label: "인공지능" },
  { href: "/category/web", label: "웹개발" },
  { href: "/category/opensource", label: "오픈소스" },
  { href: "/admin", label: "관리자" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="/" className="text-lg font-bold tracking-tight text-text-primary">
          Dev<span className="text-emerald-400">Pulse</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="rounded-md p-2 text-text-muted hover:text-text-primary md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-bg px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm text-text-muted hover:bg-card hover:text-text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Write Footer component**

```tsx
// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Dev<span className="text-emerald-400">Pulse</span>
            </p>
            <p className="mt-1 text-xs text-text-muted">
              주니어 개발자를 위한 AI 기반 IT 트렌드 블로그
            </p>
          </div>
          <div className="flex gap-4 text-xs text-text-muted">
            <a href="/subscribe" className="hover:text-emerald-400">
              뉴스레터
            </a>
            <a href="/admin" className="hover:text-emerald-400">
              관리자
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} DevPulse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/
git commit -m "feat: Header + Footer 레이아웃 컴포넌트"
```

---

### Task 5: Home Page

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/CategoryTabs.tsx`
- Create: `src/components/home/TrendingCards.tsx`
- Create: `src/components/home/ArticleGrid.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Consumes: Article model from Prisma, shared components (Badge, TagChip, Card, Skeleton)
- Produces: Complete home page with hero, trending, and article feed

- [ ] **Step 1: Write HeroSection component**

```tsx
// src/components/home/HeroSection.tsx
"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Button from "@/components/shared/Button";

interface HeroSectionProps {
  totalArticles: number;
  todayArticles: number;
}

export default function HeroSection({
  totalArticles,
  todayArticles,
}: HeroSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_600px_300px_at_50%_0%,rgba(52,211,153,0.08),transparent)]" />
      <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
        주니어 개발자를 위한
        <br />
        <span className="text-emerald-400">일일 IT 기술 펄스</span>
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-text-secondary">
        AI가 요약한 최신 기술 트렌드를 매일 받아보세요
      </p>

      <form
        onSubmit={handleSubscribe}
        className="mx-auto mt-8 flex max-w-md gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          required
        />
        <Button type="submit" disabled={subscribed}>
          {subscribed ? "구독 완료!" : "구독하기"}
        </Button>
      </form>

      <div className="mt-6 flex justify-center gap-6 text-sm text-text-muted">
        <span>
          총 <strong className="text-text-primary">{totalArticles}</strong>개의 글
        </span>
        <span>
          오늘 <strong className="text-emerald-400">{todayArticles}</strong>개 수집
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write CategoryTabs component**

```tsx
// src/components/home/CategoryTabs.tsx
"use client";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="mx-auto flex max-w-6xl gap-0 overflow-x-auto border-b border-border px-4 scrollbar-hide">
      {["전체", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`relative whitespace-nowrap px-5 py-3 text-sm transition-colors ${
            activeCategory === cat
              ? "font-medium text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {cat}
          {activeCategory === cat && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-400" />
          )}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write TrendingCards component**

```tsx
// src/components/home/TrendingCards.tsx";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  category: string;
  difficultyLevel: string;
  source: string;
  publishedAt: string;
  viewCount: number;
}

interface TrendingCardsProps {
  articles: Article[];
}

export default function TrendingCards({ articles }: TrendingCardsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">
        🔥 트렌딩
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400">
                {article.category}
              </span>
              <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
            </div>
            <h3 className="mb-2 text-base font-bold leading-tight text-text-primary line-clamp-2">
              {article.title}
            </h3>
            <p className="mb-3 text-sm text-text-secondary line-clamp-2">
              {article.aiSummary}
            </p>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{article.source}</span>
              <span>{article.publishedAt}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write ArticleGrid component**

```tsx
// src/components/home/ArticleGrid.tsx
"use client";

import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import Skeleton from "@/components/shared/Skeleton";
import Button from "@/components/shared/Button";
import { useState } from "react";

interface Article {
  id: number;
  title: string;
  aiSummary: string;
  category: string;
  difficultyLevel: string;
  source: string;
  tags: string;
  publishedAt: string;
}

interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ArticleGrid({
  articles,
  loading,
  onLoadMore,
  hasMore,
}: ArticleGridProps) {
  if (loading && articles.length === 0) {
    return (
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="mb-2 h-5 w-20" />
            <Skeleton className="mb-2 h-6 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">
        📰 최신 뉴스
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-text-muted">{article.source}</span>
              <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
            </div>
            <h3 className="mb-2 text-sm font-bold leading-tight text-text-primary line-clamp-2">
              {article.title}
            </h3>
            <p className="mb-3 text-xs text-text-secondary line-clamp-2">
              {article.aiSummary}
            </p>
            <div className="flex flex-wrap gap-1">
              {JSON.parse(article.tags || "[]")
                .slice(0, 3)
                .map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-border px-2 py-0.5 text-[10px] text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <p className="mt-2 text-[10px] text-text-muted">
              {article.publishedAt}
            </p>
          </Card>
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 text-center">
          <Button variant="secondary" onClick={onLoadMore}>
            더보기
          </Button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 5: Write Home page**

```tsx
// src/app/page.tsx
import { db } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const totalArticles = await db.article.count({
    where: { status: "approved" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayArticles = await db.article.count({
    where: {
      status: "approved",
      createdAt: { gte: today },
    },
  });

  const trending = await db.article.findMany({
    where: {
      status: "approved",
      publishedAt: { gte: new Date(Date.now() - 7 * 86400000) },
    },
    orderBy: { viewCount: "desc" },
    take: 3,
  });

  const categories = await db.category.findMany();
  const categoryNames = categories.map((c) => c.name);

  return (
    <>
      <HeroSection totalArticles={totalArticles} todayArticles={todayArticles} />
      <HomeClient
        initialTrending={trending.map((a) => ({
          ...a,
          tags: a.tags,
          publishedAt: a.publishedAt.toISOString().split("T")[0],
        }))}
        categories={categoryNames}
      />
    </>
  );
}
```

- [ ] **Step 6: Write HomeClient component (client-side filtering + pagination)**

```tsx
// src/app/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import CategoryTabs from "@/components/home/CategoryTabs";
import TrendingCards from "@/components/home/TrendingCards";
import ArticleGrid from "@/components/home/ArticleGrid";

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

interface HomeClientProps {
  initialTrending: Article[];
  categories: string[];
}

const PAGE_SIZE = 12;

export default function HomeClient({
  initialTrending,
  categories,
}: HomeClientProps) {
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
    const params = new URLSearchParams({
      page: String(pageNum),
      limit: String(PAGE_SIZE),
      status: "approved",
    });
    if (activeCategory !== "전체") {
      params.set("category", activeCategory);
    }

    const res = await fetch(`/api/articles?${params}`);
    const data = await res.json();

    if (replace) {
      setArticles(data.articles);
    } else {
      setArticles((prev) => [...prev, ...data.articles]);
    }
    setHasMore(data.articles.length === PAGE_SIZE);
    setLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  };

  return (
    <>
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <TrendingCards articles={initialTrending} />
      <ArticleGrid
        articles={articles}
        loading={loading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
      />
    </>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/home/ src/app/
git commit -m "feat: 메인 홈 페이지 (Hero, 카테고리 탭, 트렌딩, 피드)"
```

---

### Task 6: Article Detail Page

**Files:**
- Create: `src/components/article/ArticleHeader.tsx`
- Create: `src/components/article/AISummary.tsx`
- Create: `src/components/article/MarkdownBody.tsx`
- Create: `src/components/article/RelatedArticles.tsx`
- Create: `src/app/article/[id]/page.tsx`

**Interfaces:**
- Consumes: Article model, shared components
- Produces: Article detail page with view count increment

- [ ] **Step 1: Write ArticleHeader component**

```tsx
// src/components/article/ArticleHeader.tsx
import Badge from "@/components/shared/Badge";
import { ExternalLink, Calendar } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  category: string;
  source: string;
  sourceUrl: string;
  difficultyLevel: string;
  publishedAt: string;
}

export default function ArticleHeader({
  title,
  category,
  source,
  sourceUrl,
  difficultyLevel,
  publishedAt,
}: ArticleHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <a
          href={`/category/${category}`}
          className="rounded bg-cyan-950 px-2 py-0.5 text-xs text-cyan-400 hover:bg-cyan-900"
        >
          {category}
        </a>
        <Badge level={difficultyLevel as "입문/초급" | "중급" | "고급"} size="md" />
      </div>
      <h1 className="mb-4 text-2xl font-extrabold leading-tight text-text-primary md:text-3xl">
        {title}
      </h1>
      <div className="flex items-center gap-4 text-sm text-text-muted">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {publishedAt}
        </span>
        <span>{source}</span>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-emerald-400 hover:underline"
        >
          원문 보러가기 <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write AISummary component**

```tsx
// src/components/article/AISummary.tsx
interface AISummaryProps {
  aiSummary: string;
  keyPoints: string;
}

export default function AISummary({ aiSummary, keyPoints }: AISummaryProps) {
  const points = keyPoints ? JSON.parse(keyPoints) : [];
  const summaryLines = aiSummary.split("\n").filter(Boolean);

  return (
    <div className="mb-8 rounded-lg border border-cyan-900 bg-gradient-to-br from-cyan-950/50 to-emerald-950/30 p-6">
      <h3 className="mb-3 text-sm font-bold text-cyan-400">
        🤖 AI 3줄 요약
      </h3>
      <ul className="mb-4 space-y-1">
        {summaryLines.map((line, i) => (
          <li key={i} className="text-sm text-text-secondary">
            {line}
          </li>
        ))}
      </ul>
      {points.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {points.map((point: string) => (
            <span
              key={point}
              className="rounded-full border border-cyan-800 bg-cyan-950/50 px-3 py-1 text-xs text-cyan-300"
            >
              {point}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write MarkdownBody component**

```tsx
// src/components/article/MarkdownBody.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownBodyProps {
  content: string;
}

export default function MarkdownBody({ content }: MarkdownBodyProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mb-4 mt-12 border-b border-border pb-2 text-xl font-bold text-text-primary">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-8 text-lg font-semibold text-text-primary">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-5 text-text-secondary leading-relaxed">{children}</p>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="rounded bg-border px-1.5 py-0.5 text-sm text-emerald-400">
                  {children}
                </code>
              );
            }
            return (
              <code className={`block overflow-x-auto text-sm ${className}`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-6 overflow-x-auto rounded-lg border border-border bg-card p-4">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="mb-5 list-disc space-y-1 pl-5 text-text-secondary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-5 list-decimal space-y-1 pl-5 text-text-secondary">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline hover:text-emerald-300"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-text-primary">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-3 border-emerald-400 pl-5 text-text-secondary">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-card px-4 py-2 text-left font-mono text-xs font-medium uppercase text-text-muted">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-4 py-2 text-text-secondary">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 4: Write RelatedArticles component**

```tsx
// src/components/article/RelatedArticles.tsx
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

interface RelatedArticle {
  id: number;
  title: string;
  aiSummary: string;
  difficultyLevel: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-4 text-lg font-bold text-text-primary">관련 글</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} />
            <h3 className="mt-2 text-sm font-bold text-text-primary line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-1 text-xs text-text-secondary line-clamp-2">
              {article.aiSummary}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write Article Detail page**

```tsx
// src/app/article/[id]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ArticleHeader from "@/components/article/ArticleHeader";
import AISummary from "@/components/article/AISummary";
import MarkdownBody from "@/components/article/MarkdownBody";
import RelatedArticles from "@/components/article/RelatedArticles";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function ArticlePage({ params }: PageProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const article = await db.article.findUnique({ where: { id } });
  if (!article || article.status !== "approved") notFound();

  // Increment view count
  await db.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  // Get related articles (same category, excluding current)
  const related = await db.article.findMany({
    where: {
      category: article.category,
      status: "approved",
      id: { not: id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <ArticleHeader
        title={article.title}
        category={article.category}
        source={article.source}
        sourceUrl={article.sourceUrl}
        difficultyLevel={article.difficultyLevel}
        publishedAt={article.publishedAt.toISOString().split("T")[0]}
      />
      <AISummary aiSummary={article.aiSummary} keyPoints={article.keyPoints} />
      <MarkdownBody content={article.content} />
      <RelatedArticles
        articles={related.map((r) => ({
          id: r.id,
          title: r.title,
          aiSummary: r.aiSummary,
          difficultyLevel: r.difficultyLevel,
        }))}
      />
    </article>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/article/ src/app/article/
git commit -m "feat: 글 상세 페이지 (AI 요약 패널, 마크다운, 관련 글)"
```

---

### Task 7: Category Page

**Files:**
- Create: `src/app/category/[slug]/page.tsx`
- Create: `src/components/home/ArticleGrid.tsx` (already created, reuse)

**Interfaces:**
- Consumes: Category model, Article model, shared components
- Produces: Category filter page with difficulty filtering

- [ ] **Step 1: Write Category page**

```tsx
// src/app/category/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  });
  if (!category) notFound();

  const articles = await db.article.findMany({
    where: {
      category: category.name,
      status: "approved",
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-text-primary">
          {category.name}
        </h1>
        <p className="mt-2 text-text-secondary">{category.description}</p>
      </div>
      <CategoryClient
        initialArticles={articles.map((a) => ({
          ...a,
          tags: a.tags,
          publishedAt: a.publishedAt.toISOString().split("T")[0],
        }))}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write CategoryClient component**

```tsx
// src/app/category/[slug]/CategoryClient.tsx
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

interface CategoryClientProps {
  initialArticles: Article[];
}

const difficulties = ["전체", "입문/초급", "중급", "고급"];

export default function CategoryClient({
  initialArticles,
}: CategoryClientProps) {
  const [difficulty, setDifficulty] = useState("전체");

  const filtered =
    difficulty === "전체"
      ? initialArticles
      : initialArticles.filter((a) => a.difficultyLevel === difficulty);

  return (
    <>
      <div className="mb-6 flex gap-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              difficulty === d
                ? "bg-emerald-500 text-white"
                : "bg-card text-text-muted hover:text-text-primary"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((article) => (
          <Card key={article.id} href={`/article/${article.id}`}>
            <Badge
              level={article.difficultyLevel as "입문/초급" | "중급" | "고급"}
            />
            <h3 className="mt-2 text-sm font-bold text-text-primary line-clamp-2">
              {article.title}
            </h3>
            <p className="mt-1 text-xs text-text-secondary line-clamp-2">
              {article.aiSummary}
            </p>
            <p className="mt-2 text-[10px] text-text-muted">
              {article.publishedAt}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/category/
git commit -m "feat: 카테고리 페이지 (난이도 필터링)"
```

---

### Task 8: Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/AdminClient.tsx`
- Create: `src/components/admin/KPICards.tsx`
- Create: `src/components/admin/ApprovalQueue.tsx`
- Create: `src/components/admin/SourceManager.tsx`
- Create: `src/components/admin/SubscriberList.tsx`

**Interfaces:**
- Consumes: All models, shared components
- Produces: Admin dashboard with KPI, approval queue, source management

- [ ] **Step 1: Write KPICards component**

```tsx
// src/components/admin/KPICards.tsx
interface KPIData {
  totalArticles: number;
  pendingArticles: number;
  totalSubscribers: number;
  totalViews: number;
}

export default function KPICards({ data }: { data: KPIData }) {
  const cards = [
    { label: "총 게시글", value: data.totalArticles, color: "text-emerald-400" },
    { label: "승인 대기", value: data.pendingArticles, color: "text-amber-400" },
    { label: "총 구독자", value: data.totalSubscribers, color: "text-cyan-400" },
    { label: "누적 조회수", value: data.totalViews, color: "text-purple-400" },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-border bg-card p-5"
        >
          <p className="text-sm text-text-muted">{card.label}</p>
          <p className={`mt-1 text-2xl font-bold ${card.color}`}>
            {card.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write ApprovalQueue component**

```tsx
// src/components/admin/ApprovalQueue.tsx
"use client";

import { useState } from "react";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

interface PendingArticle {
  id: number;
  title: string;
  source: string;
  difficultyLevel: string;
  aiSummary: string;
  createdAt: string;
}

interface ApprovalQueueProps {
  articles: PendingArticle[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export default function ApprovalQueue({
  articles,
  onApprove,
  onReject,
}: ApprovalQueueProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-text-muted">
        승인 대기 중인 글이 없습니다
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
              제목
            </th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
              소스
            </th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
              난이도
            </th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
              AI요약
            </th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
              수집일
            </th>
            <th className="px-4 py-3 text-right font-mono text-xs uppercase text-text-muted">
              액션
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-border">
              <td className="px-4 py-3">
                <a
                  href={`/article/${article.id}`}
                  className="text-text-primary hover:text-emerald-400"
                >
                  {article.title}
                </a>
              </td>
              <td className="px-4 py-3 text-text-muted">{article.source}</td>
              <td className="px-4 py-3">
                <Badge
                  level={article.difficultyLevel as "입문/초급" | "중급" | "고급"}
                />
              </td>
              <td className="max-w-[200px] truncate px-4 py-3 text-text-secondary">
                {article.aiSummary}
              </td>
              <td className="px-4 py-3 text-text-muted">{article.createdAt}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => onApprove(article.id)}
                  >
                    승인
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onReject(article.id)}
                  >
                    반려
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Write SourceManager component**

```tsx
// src/components/admin/SourceManager.tsx
"use client";

import { useState } from "react";
import Toggle from "@/components/shared/Toggle";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

interface Source {
  id: number;
  name: string;
  type: string;
  url: string;
  fetchInterval: string;
  isActive: boolean;
  category: string;
}

interface SourceManagerProps {
  sources: Source[];
  onToggle: (id: number, isActive: boolean) => void;
  onAdd: (source: Omit<Source, "id">) => void;
}

export default function SourceManager({
  sources,
  onToggle,
  onAdd,
}: SourceManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"api" | "rss" | "manual">("api");
  const [category, setCategory] = useState("기타");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      url,
      type,
      fetchInterval: "daily",
      isActive: true,
      category,
    });
    setName("");
    setUrl("");
    setShowForm(false);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">소스 관리</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "취소" : "소스 추가"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg border border-border bg-card p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="소스 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                타입
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "api" | "rss" | "manual")}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-text-primary"
              >
                <option value="api">API</option>
                <option value="rss">RSS</option>
                <option value="manual">수동</option>
              </select>
            </div>
            <Input
              label="카테고리"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Button type="submit">추가하기</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div>
              <p className="font-medium text-text-primary">{source.name}</p>
              <p className="text-xs text-text-muted">
                {source.type} · {source.category} · {source.fetchInterval}
              </p>
            </div>
            <Toggle
              checked={source.isActive}
              onChange={(active) => onToggle(source.id, active)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write SubscriberList component**

```tsx
// src/components/admin/SubscriberList.tsx
"use client";

import { useState } from "react";
import Input from "@/components/shared/Input";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

interface SubscriberListProps {
  subscribers: Subscriber[];
}

export default function SubscriberList({ subscribers }: SubscriberListProps) {
  const [search, setSearch] = useState("");

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="이메일 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
                이메일
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
                구독일
              </th>
              <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} className="border-b border-border">
                <td className="px-4 py-3 text-text-primary">{sub.email}</td>
                <td className="px-4 py-3 text-text-muted">{sub.subscribedAt}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      sub.isActive
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-red-950 text-red-400"
                    }`}
                  >
                    {sub.isActive ? "활성" : "비활성"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write Admin page with server-side data fetching**

```tsx
// src/app/admin/page.tsx
import { db } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [totalArticles, pendingArticles, totalSubscribers, viewsResult, pendingList, sources, subscribers] =
    await Promise.all([
      db.article.count(),
      db.article.count({ where: { status: "pending_approval" } }),
      db.newsletter.count({ where: { isActive: true } }),
      db.article.aggregate({ _sum: { viewCount: true } }),
      db.article.findMany({
        where: { status: "pending_approval" },
        orderBy: { createdAt: "desc" },
      }),
      db.source.findMany({ orderBy: { createdAt: "desc" } }),
      db.newsletter.findMany({ orderBy: { subscribedAt: "desc" } }),
    ]);

  return (
    <AdminClient
      kpi={{
        totalArticles,
        pendingArticles,
        totalSubscribers,
        totalViews: viewsResult._sum.viewCount || 0,
      }}
      pendingArticles={pendingList.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString().split("T")[0],
      }))}
      sources={sources}
      subscribers={subscribers.map((s) => ({
        ...s,
        subscribedAt: s.subscribedAt.toISOString().split("T")[0],
      }))}
    />
  );
}
```

- [ ] **Step 6: Write AdminClient component**

```tsx
// src/app/admin/AdminClient.tsx
"use client";

import { useState } from "react";
import KPICards from "@/components/admin/KPICards";
import ApprovalQueue from "@/components/admin/ApprovalQueue";
import SourceManager from "@/components/admin/SourceManager";
import SubscriberList from "@/components/admin/SubscriberList";

interface AdminClientProps {
  kpi: {
    totalArticles: number;
    pendingArticles: number;
    totalSubscribers: number;
    totalViews: number;
  };
  pendingArticles: any[];
  sources: any[];
  subscribers: any[];
}

const tabs = ["승인 큐", "소스 관리", "구독자"];

export default function AdminClient({
  kpi,
  pendingArticles: initialPending,
  sources: initialSources,
  subscribers,
}: AdminClientProps) {
  const [activeTab, setActiveTab] = useState("승인 큐");
  const [pendingArticles, setPendingArticles] = useState(initialPending);
  const [sources, setSources] = useState(initialSources);

  const handleApprove = async (id: number) => {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    setPendingArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleReject = async (id: number) => {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    setPendingArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleSource = async (id: number, isActive: boolean) => {
    await fetch(`/api/sources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive } : s))
    );
  };

  const handleAddSource = async (source: any) => {
    const res = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(source),
    });
    const newSource = await res.json();
    setSources((prev) => [newSource, ...prev]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-extrabold text-text-primary">
        관리자 대시보드
      </h1>
      <KPICards data={kpi} />

      <div className="mb-6 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-3 px-4 text-sm transition-colors ${
              activeTab === tab
                ? "font-medium text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-400" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "승인 큐" && (
        <ApprovalQueue
          articles={pendingArticles}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      {activeTab === "소스 관리" && (
        <SourceManager
          sources={sources}
          onToggle={handleToggleSource}
          onAdd={handleAddSource}
        />
      )}
      {activeTab === "구독자" && (
        <SubscriberList subscribers={subscribers} />
      )}
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat: 관리자 대시보드 (KPI, 승인 큐, 소스 관리, 구독자)"
```

---

### Task 9: Newsletter Subscribe Page

**Files:**
- Create: `src/app/subscribe/page.tsx`
- Create: `src/app/subscribe/SubscribeClient.tsx`

**Interfaces:**
- Consumes: Newsletter model, Article model
- Produces: Newsletter subscription page with category selection

- [ ] **Step 1: Write Subscribe page**

```tsx
// src/app/subscribe/page.tsx
import { db } from "@/lib/db";
import SubscribeClient from "./SubscribeClient";

export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const categories = await db.category.findMany();
  const popularArticles = await db.article.findMany({
    where: { status: "approved" },
    orderBy: { viewCount: "desc" },
    take: 5,
  });

  return (
    <SubscribeClient
      categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
      popularArticles={popularArticles.map((a) => ({
        id: a.id,
        title: a.title,
        aiSummary: a.aiSummary,
        viewCount: a.viewCount,
      }))}
    />
  );
}
```

- [ ] **Step 2: Write SubscribeClient component**

```tsx
// src/app/subscribe/SubscribeClient.tsx
"use client";

import { useState } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";

interface SubscribeClientProps {
  categories: { name: string; slug: string }[];
  popularArticles: { id: number; title: string; aiSummary: string; viewCount: number }[];
}

export default function SubscribeClient({
  categories,
  popularArticles,
}: SubscribeClientProps) {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [subscribed, setSubscribed] = useState(false);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, preferences: selectedCategories }),
    });
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mb-6 text-5xl">🎉</div>
        <h1 className="mb-4 text-2xl font-extrabold text-text-primary">
          구독 완료!
        </h1>
        <p className="mb-8 text-text-secondary">
          매주 월요일 아침, AI가 요약한 테크 뉴스레터를 보내드리겠습니다.
        </p>
        <h2 className="mb-4 text-lg font-bold text-text-primary">
          📌 인기 글 TOP 5
        </h2>
        <div className="space-y-3">
          {popularArticles.map((article) => (
            <Card key={article.id} href={`/article/${article.id}`}>
              <h3 className="text-sm font-bold text-text-primary">
                {article.title}
              </h3>
              <p className="mt-1 text-xs text-text-secondary line-clamp-1">
                {article.aiSummary}
              </p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-4 text-center text-2xl font-extrabold text-text-primary">
        📬 뉴스레터 구독
      </h1>
      <p className="mb-8 text-center text-text-secondary">
        매주 월요일 아침, 주니어 개발자를 위한 AI 요약 테크 뉴스레터를
        받아보세요
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            관심 카테고리 (선택)
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleCategory(cat.name)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  selectedCategories.includes(cat.name)
                    ? "bg-emerald-500 text-white"
                    : "bg-card text-text-muted hover:text-text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          구독하기
        </Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/subscribe/
git commit -m "feat: 뉴스레터 구독 페이지 (카테고리 선택, 인기 글 추천)"
```

---

### Task 10: API Routes

**Files:**
- Create: `src/app/api/articles/route.ts`
- Create: `src/app/api/articles/[id]/route.ts`
- Create: `src/app/api/sources/route.ts`
- Create: `src/app/api/sources/[id]/route.ts`
- Create: `src/app/api/newsletter/route.ts`
- Create: `src/app/api/fetch/route.ts`
- Create: `src/app/api/analyze/route.ts`

**Interfaces:**
- Consumes: All Prisma models, LLM client
- Produces: Complete REST API for all CRUD + automation

- [ ] **Step 1: Write Articles API (list + create)**

```typescript
// src/app/api/articles/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");
  const status = searchParams.get("status") || "approved";
  const difficulty = searchParams.get("difficulty");

  const where: any = { status };
  if (category) where.category = category;
  if (difficulty) where.difficultyLevel = difficulty;

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const article = await db.article.create({ data: body });
  return NextResponse.json(article, { status: 201 });
}
```

- [ ] **Step 2: Write Articles API (detail + update + delete)**

```typescript
// src/app/api/articles/[id]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const article = await db.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const article = await db.article.update({ where: { id }, data: body });
  return NextResponse.json(article);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  await db.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Write Sources API**

```typescript
// src/app/api/sources/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sources = await db.source.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(sources);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const source = await db.source.create({ data: body });
  return NextResponse.json(source, { status: 201 });
}
```

```typescript
// src/app/api/sources/[id]/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const source = await db.source.update({ where: { id }, data: body });
  return NextResponse.json(source);
}
```

- [ ] **Step 4: Write Newsletter API**

```typescript
// src/app/api/newsletter/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const subscribers = await db.newsletter.findMany({
    orderBy: { subscribedAt: "desc" },
  });
  return NextResponse.json(subscribers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, preferences = [] } = body;

  const existing = await db.newsletter.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "이미 구독된 이메일입니다" },
      { status: 409 }
    );
  }

  const subscriber = await db.newsletter.create({
    data: {
      email,
      preferences: JSON.stringify(preferences),
    },
  });

  return NextResponse.json(subscriber, { status: 201 });
}
```

- [ ] **Step 5: Write LLM client**

```typescript
// src/lib/llm.ts
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "";
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_KEY = process.env.GROQ_API_KEY || "";

async function callNvidia(prompt: string, system?: string): Promise<string | null> {
  if (!NVIDIA_KEY) return null;
  try {
    const messages = [];
    if (system) messages.push({ role: "system", content: system });
    messages.push({ role: "user", content: prompt });

    const res = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NVIDIA_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/llama-3.3-70b-instruct",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

async function callGemini(prompt: string, system?: string): Promise<string | null> {
  if (!GEMINI_KEY) return null;
  try {
    const body: any = {
      contents: [{ parts: [{ text: prompt }] }],
    };
    if (system) {
      body.systemInstruction = { parts: [{ text: system }] };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

async function callGroq(prompt: string, system?: string): Promise<string | null> {
  if (!GROQ_KEY) return null;
  try {
    const messages = [];
    if (system) messages.push({ role: "system", content: system });
    messages.push({ role: "user", content: prompt });

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

const SYSTEM_PROMPT = `당신은 IT 기술 뉴스를 분석하는 한국인 테크 라이터입니다.
다음 글을 분석하여 아래 형식으로 출력해주세요:

## 한국어 3줄 요약
(이 글의 핵심을 3줄로 요약)

## 핵심 키워드 3개
(쉼표로 구분)

## 난이도
(입문/초급 / 중급 / 고급 중 하나)`;

export async function analyzeArticle(title: string, content: string) {
  const prompt = `제목: ${title}\n\n본문: ${content.slice(0, 2000)}`;

  // Try all three in parallel, use first successful response
  const results = await Promise.allSettled([
    callNvidia(prompt, SYSTEM_PROMPT),
    callGemini(prompt, SYSTEM_PROMPT),
    callGroq(prompt, SYSTEM_PROMPT),
  ]);

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      return parseAnalysis(result.value);
    }
  }

  return null;
}

function parseAnalysis(text: string) {
  const summaryMatch = text.match(/## 한국어 3줄 요약\n([\s\S]*?)(?=##|$)/);
  const keywordsMatch = text.match(/## 핵심 키워드 3개\n([\s\S]*?)(?=##|$)/);
  const difficultyMatch = text.match(/## 난이도\n([\s\S]*?)(?=##|$)/);

  return {
    aiSummary: summaryMatch?.[1]?.trim() || "",
    keyPoints: keywordsMatch?.[1]?.split(",").map((k) => k.trim()) || [],
    difficultyLevel:
      difficultyMatch?.[1]?.trim() || "입문/초급",
  };
}
```

- [ ] **Step 6: Write fetchers for each source**

```typescript
// src/lib/fetchers.ts
interface FetchResult {
  title: string;
  url: string;
  summary: string;
  source: string;
  publishedAt: Date;
}

export async function fetchHackerNews(): Promise<FetchResult[]> {
  try {
    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { next: { revalidate: 3600 } }
    );
    const ids = await res.json();

    const items = await Promise.all(
      ids.slice(0, 20).map(async (id: number) => {
        const itemRes = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        const item = await itemRes.json();
        return {
          title: item.title || "",
          url: item.url || `https://news.ycombinator.com/item?id=${id}`,
          summary: "",
          source: "HackerNews",
          publishedAt: new Date((item.time || 0) * 1000),
        };
      })
    );

    return items.filter((i) => i.title);
  } catch {
    return [];
  }
}

export async function fetchDevto(): Promise<FetchResult[]> {
  try {
    const res = await fetch(
      "https://dev.to/api/articles?top=7&per_page=20"
    );
    const articles = await res.json();

    return articles.map((a: any) => ({
      title: a.title || "",
      url: a.url || "",
      summary: a.description || "",
      source: "Dev.to",
      publishedAt: new Date(a.published_at || Date.now()),
    }));
  } catch {
    return [];
  }
}

export async function fetchGitHubTrending(): Promise<FetchResult[]> {
  try {
    const date = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];
    const res = await fetch(
      `https://api.github.com/search/repositories?q=pushed:>${date}&sort=stars&order=desc&per_page=20`
    );
    const data = await res.json();

    return (data.items || []).map((r: any) => ({
      title: `${r.full_name}: ${r.description || ""}`.slice(0, 100),
      url: r.html_url || "",
      summary: r.description || "",
      source: "GitHub",
      publishedAt: new Date(r.pushed_at || Date.now()),
    }));
  } catch {
    return [];
  }
}

export async function fetchArxiv(): Promise<FetchResult[]> {
  try {
    const res = await fetch(
      "http://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=lastUpdatedDate&sortOrder=descending&max_results=20"
    );
    const text = await res.text();

    // Simple XML parsing
    const items: FetchResult[] = [];
    const entries = text.split("<entry>").slice(1);

    for (const entry of entries) {
      const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || "";
      const link = entry.match(/<id>([\s\S]*?)<\/id>/)?.[1]?.trim() || "";
      const summary =
        entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1]?.trim() || "";
      const published =
        entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() || "";

      items.push({
        title: title.replace(/\n/g, " "),
        url: link,
        summary: summary.replace(/\n/g, " ").slice(0, 200),
        source: "arXiv",
        publishedAt: new Date(published || Date.now()),
      });
    }

    return items;
  } catch {
    return [];
  }
}
```

- [ ] **Step 7: Write fetch trigger API**

```typescript
// src/app/api/fetch/route.ts
import { db } from "@/lib/db";
import { fetchHackerNews, fetchDevto, fetchGitHubTrending, fetchArxiv } from "@/lib/fetchers";
import { NextResponse } from "next/server";

export async function POST() {
  const sources = await db.source.findMany({
    where: { isActive: true },
  });

  let fetched = 0;

  for (const source of sources) {
    let items: any[] = [];

    if (source.name.includes("HackerNews")) {
      items = await fetchHackerNews();
    } else if (source.name.includes("Dev.to")) {
      items = await fetchDevto();
    } else if (source.name.includes("GitHub")) {
      items = await fetchGitHubTrending();
    } else if (source.name.includes("arXiv")) {
      items = await fetchArxiv();
    }

    // Check for duplicates and save
    for (const item of items) {
      const existing = await db.article.findFirst({
        where: { sourceUrl: item.url },
      });

      if (!existing && item.title) {
        await db.article.create({
          data: {
            title: item.title,
            summary: item.summary,
            content: item.summary,
            source: item.source,
            sourceUrl: item.url,
            category: source.category,
            tags: "[]",
            difficultyLevel: "입문/초급",
            publishedAt: item.publishedAt,
            status: "pending_approval",
          },
        });
        fetched++;
      }
    }

    // Update last fetched
    await db.source.update({
      where: { id: source.id },
      data: { lastFetched: new Date() },
    });
  }

  return NextResponse.json({ fetched, message: `${fetched}개 글 수집 완료` });
}
```

- [ ] **Step 8: Write analyze trigger API**

```typescript
// src/app/api/analyze/route.ts
import { db } from "@/lib/db";
import { analyzeArticle } from "@/lib/llm";
import { NextResponse } from "next/server";

export async function POST() {
  const pendingArticles = await db.article.findMany({
    where: {
      status: "pending_approval",
      aiSummary: "",
    },
    take: 10,
  });

  let analyzed = 0;

  for (const article of pendingArticles) {
    const result = await analyzeArticle(article.title, article.content);
    if (result) {
      await db.article.update({
        where: { id: article.id },
        data: {
          aiSummary: result.aiSummary,
          keyPoints: JSON.stringify(result.keyPoints),
          difficultyLevel: result.difficultyLevel,
        },
      });
      analyzed++;
    }
  }

  return NextResponse.json({
    analyzed,
    message: `${analyzed}개 글 분석 완료`,
  });
}
```

- [ ] **Step 9: Commit**

```bash
git add src/app/api/ src/lib/
git commit -m "feat: API 라우트 (CRUD + 수집 + AI 분석 + LLM 통합)"
```

---

### Task 11: GitHub Actions Automation

**Files:**
- Create: `.github/workflows/daily-fetch.yml`
- Create: `.github/workflows/ai-analyze.yml`

**Interfaces:**
- Consumes: /api/fetch, /api/analyze endpoints
- Produces: Automated daily content collection and analysis

- [ ] **Step 1: Write daily fetch workflow**

```yaml
# .github/workflows/daily-fetch.yml
name: Daily Content Fetch

on:
  schedule:
    # 매일 오전 6시 KST (전일 21:00 UTC)
    - cron: '0 21 * * *'
  workflow_dispatch:

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Setup database
        run: npx prisma migrate deploy

      - name: Fetch content
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/fetch

      - name: Trigger AI analysis
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/analyze
```

- [ ] **Step 2: Write analyze workflow (standalone)**

```yaml
# .github/workflows/ai-analyze.yml
name: AI Analysis

on:
  workflow_dispatch:

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger analysis
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/analyze
```

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "feat: GitHub Actions 자동화 (일일 수집 + AI 분석)"
```

---

### Task 12: Harness Engineering — Design Tokens + Component System

**Files:**
- Create: `src/lib/tokens.ts`
- Create: `src/components/harness/types.ts`
- Create: `src/lib/page-templates.ts`
- Create: `src/lib/responsive.ts`
- Create: `src/lib/accessibility.ts`

**Interfaces:**
- Produces: Centralized design tokens, component harness types, page templates, responsive rules, accessibility rules

- [ ] **Step 1: Create design tokens (Base44 color system pattern)**

```typescript
// src/lib/tokens.ts
export const tokens = {
  color: {
    primary: { 400: '#34D399', 500: '#10B981', 600: '#059669', 900: '#064E3B', 950: '#022C22' },
    secondary: { 400: '#22D3EE', 500: '#06B6D4' },
    neutral: { 50: '#F8FAFC', 400: '#94A3B8', 500: '#64748B', 700: '#334155', 800: '#1E293B', 950: '#0B0F19' },
    semantic: { success: '#34D399', warning: '#FBBF24', error: '#F87171', info: '#22D3EE' },
  },
  spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '48px' },
  radius: { sm: '6px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
  shadow: { sm: '0 1px 2px rgba(0,0,0,0.3)', glow: '0 0 20px rgba(52,211,153,0.15)' },
} as const;
```

- [ ] **Step 2: Create component harness types**

```typescript
// src/components/harness/types.ts
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Size = 'sm' | 'md' | 'lg';
export type State = 'default' | 'hover' | 'active' | 'disabled';
```

- [ ] **Step 3: Create page templates (Base44 page type pattern)**

```typescript
// src/lib/page-templates.ts
export const pageTemplates = {
  landing: { maxWidth: '1200px', grid: { mobile: 1, tablet: 2, desktop: 3 } },
  detail: { maxWidth: '720px' },
  dashboard: { maxWidth: '1200px', kpi: { mobile: 2, desktop: 4 } },
  form: { maxWidth: '480px' },
} as const;
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/tokens.ts src/components/harness/ src/lib/page-templates.ts src/lib/responsive.ts src/lib/accessibility.ts
git commit -m "feat: Harness Engineering — Design Tokens + Component System"
```

---

### Task 13: Loop Engineering — Feedback + Analytics

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `src/lib/content-loop.ts`
- Create: `src/lib/discovery-loop.ts`
- Create: `src/lib/seo-loop.ts`
- Create: `src/lib/ab-test.ts`
- Create: `src/components/feedback/ArticleFeedback.tsx`
- Create: `src/app/api/feedback/route.ts`
- Create: `src/app/api/analytics/route.ts`
- Create: `src/app/api/quality-report/route.ts`

**Interfaces:**
- Produces: Analytics tracking, content quality evaluation, trending algorithm, SEO schema generation, A/B testing, user feedback system

- [ ] **Step 1: Create analytics tracking**

```typescript
// src/lib/analytics.ts
export function trackEvent(type: string, payload: Record<string, unknown>) {
  const events = JSON.parse(localStorage.getItem('dp_events') || '[]');
  events.push({ type, payload, timestamp: Date.now() });
  localStorage.setItem('dp_events', JSON.stringify(events.slice(-100)));
}
```

- [ ] **Step 2: Create content quality evaluation**

```typescript
// src/lib/content-loop.ts
export function evaluateQuality(article: { aiSummary: string; keyPoints: string; content: string }) {
  return {
    summaryLength: article.aiSummary.length,
    keywordRelevance: JSON.parse(article.keyPoints || '[]').filter((k: string) =>
      article.content.toLowerCase().includes(k.toLowerCase())
    ).length / Math.max(JSON.parse(article.keyPoints || '[]').length, 1),
    readTimeEstimate: Math.ceil(article.content.split(/\s+/).length / 350),
  };
}
```

- [ ] **Step 3: Create trending algorithm**

```typescript
// src/lib/discovery-loop.ts
export function calculateTrendingScore(articles: { id: number; viewCount: number; publishedAt: Date }[]) {
  const now = Date.now();
  const DAY = 86400000;
  return articles.map(a => ({
    articleId: a.id,
    score: Math.max(0, 1 - (now - a.publishedAt.getTime()) / (7 * DAY)) * 0.6
      + (Math.log10(a.viewCount + 1) / 6) * 0.3,
  })).sort((a, b) => b.score - a.score);
}
```

- [ ] **Step 4: Create ArticleFeedback component**

```tsx
// src/components/feedback/ArticleFeedback.tsx
"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function ArticleFeedback({ articleId }: { articleId: number }) {
  const [feedback, setFeedback] = useState<"helpful" | "not" | null>(null);
  const handle = async (type: "helpful" | "not") => {
    setFeedback(type);
    await fetch("/api/feedback", { method: "POST", body: JSON.stringify({ articleId, type }) });
  };
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <span className="text-sm text-text-muted">이 글이 도움이 되었나요?</span>
      <button onClick={() => handle("helpful")} className={`p-2 rounded-lg ${feedback === "helpful" ? "bg-emerald-950 text-emerald-400" : "text-text-muted"}`}><ThumbsUp size={18} /></button>
      <button onClick={() => handle("not")} className={`p-2 rounded-lg ${feedback === "not" ? "bg-red-950 text-red-400" : "text-text-muted"}`}><ThumbsDown size={18} /></button>
    </div>
  );
}
```

- [ ] **Step 5: Create feedback + analytics API routes**

```typescript
// src/app/api/feedback/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { articleId, type } = await request.json();
  // Store feedback for quality loop
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/analytics.ts src/lib/content-loop.ts src/lib/discovery-loop.ts src/lib/seo-loop.ts src/lib/ab-test.ts src/components/feedback/ src/app/api/feedback/ src/app/api/analytics/
git commit -m "feat: Loop Engineering — Feedback + Analytics + Content Quality"
```

---

### Task 14: UX Enhancements — Search, Reading Progress, Back to Top

**Files:**
- Create: `src/components/search/SearchModal.tsx`
- Create: `src/components/article/ReadingProgress.tsx`
- Create: `src/components/shared/BackToTop.tsx`
- Modify: `src/components/layout/Header.tsx` (search trigger)
- Modify: `src/app/article/[id]/page.tsx` (reading progress)
- Modify: `src/app/layout.tsx` (back to top, search modal)

**Interfaces:**
- Consumes: Article model, shared components
- Produces: Search modal (⌘K), reading progress bar, back to top button

- [ ] **Step 1: Create SearchModal (⌘K shortcut)**

```tsx
// src/components/search/SearchModal.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
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
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="글 검색... (⌘K)" className="flex-1 bg-transparent text-text-primary outline-none" />
          <button onClick={() => setOpen(false)}><X size={20} className="text-text-muted" /></button>
        </div>
        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            {results.map((r) => (
              <button key={r.id} onClick={() => { router.push(`/article/${r.id}`); setOpen(false); }}
                className="block w-full rounded-lg p-3 text-left hover:bg-border">
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

- [ ] **Step 2: Create ReadingProgress component**

```tsx
// src/components/article/ReadingProgress.tsx
"use client";
import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return <div className="fixed left-0 top-0 z-50 h-0.5 bg-emerald-400 transition-all duration-150" style={{ width: `${progress}%` }} />;
}
```

- [ ] **Step 3: Create BackToTop component**

```tsx
// src/components/shared/BackToTop.tsx
"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 p-3 text-white shadow-lg hover:bg-emerald-600"
      aria-label="맨 위로">
      <ArrowUp size={20} />
    </button>
  );
}
```

- [ ] **Step 4: Integrate into layout and article page**

- [ ] **Step 5: Commit**

```bash
git add src/components/search/ src/components/article/ReadingProgress.tsx src/components/shared/BackToTop.tsx
git commit -m "feat: UX 강화 — Search Modal, Reading Progress, Back to Top"
```

---

### Task 15: SEO + Schema Markup

**Files:**
- Create: `src/lib/seo-loop.ts`
- Modify: `src/app/article/[id]/page.tsx` (JSON-LD)
- Create: `public/robots.txt`
- Create: `src/app/sitemap.ts`

**Interfaces:**
- Produces: JSON-LD structured data, Open Graph tags, robots.txt, sitemap.xml

- [ ] **Step 1: Create SEO utilities**

```typescript
// src/lib/seo-loop.ts
export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.aiSummary,
    author: { '@type': 'Organization', name: 'DevPulse' },
    datePublished: article.publishedAt.toISOString(),
  };
}
```

- [ ] **Step 2: Add JSON-LD to article page**

- [ ] **Step 3: Create robots.txt and sitemap**

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo-loop.ts public/robots.txt src/app/sitemap.ts
git commit -m "feat: SEO — JSON-LD, Open Graph, robots.txt, sitemap"
```

---

### Task 16: Final Integration + Testing

**Files:**
- Modify: `src/app/layout.tsx` (verify all integrations)
- Create: `.env.example`

**Interfaces:**
- Final integration and verification

- [ ] **Step 1: Create .env.example**

```bash
# .env.example
DATABASE_URL="file:./dev.db"
NVIDIA_API_KEY=""
GEMINI_API_KEY=""
GROQ_API_KEY=""
APP_URL="http://localhost:3000"
```

- [ ] **Step 2: Run full build**

```bash
npm run build
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Visit:
- http://localhost:3000 (home)
- http://localhost:3000/article/1 (article detail)
- http://localhost:3000/category/ai (category)
- http://localhost:3000/admin (admin dashboard)
- http://localhost:3000/subscribe (newsletter)

- [ ] **Step 4: Verify all pages load correctly**

- [ ] **Step 5: Commit final changes**

```bash
git add .
git commit -m "feat: DevPulse 최종 통합 + 환경변수 설정"
```

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-13-devpulse-implementation.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?

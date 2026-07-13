import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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
    const existing = await prisma.source.findFirst({ where: { name: src.name } });
    if (!existing) await prisma.source.create({ data: src });
  }

  const articles = [
    {
      title: "GPT-5의 의미: 멀티모달 AI의 새 시대",
      summary: "OpenAI가 GPT-5를 공개하며, 텍스트-이미지-코드 통합 처리 성능이 크게 향상되었습니다.",
      content: "## GPT-5가 바꾸는 AI 생태계\n\nOpenAI가 GPT-5를 공개했습니다. 이 모델은 텍스트, 이미지, 코드를 동시에 처리하는 멀티모달 아키텍처를 채택했습니다.\n\n### 주요 개선점\n\n- **멀티모달 처리**: 텍스트와 이미지를 동시에 입력받아 통합 응답 생성\n- **코딩 능력 향상**: GitHub Copilot 통합 시 코드 완성 정확도 40% 개선\n- **컨텍스트 윈도우 확장**: 256K 토큰 지원\n\n### 주니어 개발자를 위한 영향\n\nGPT-5는 코드 리뷰, 버그 찾기, 문서화 작업에서 더 정확한 도우미가 됩니다.",
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
      content: "## Server Components란?\n\nReact Server Components(RSC)는 서버에서 렌더링되는 React 컴포넌트입니다. 클라이언트 번들에 포함되지 않아 성능이 크게 향상됩니다.\n\n### 왜 중요한가?\n\n1. **번들 크기 감소**: 서버 전용 컴포넌트는 클라이언트 JS에 포함되지 않음\n2. **데이터 접근**: 서버에서 직접 DB/API 접근 가능\n3. **보안**: 민감한 데이터가 클라이언트에 노출되지 않음",
      source: "Dev.to",
      sourceUrl: "https://dev.to/react-server-components-2025",
      category: "웹개발",
      tags: JSON.stringify(["React", "Server Components", "프론트엔드"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 287,
      aiSummary: "React 19에서 Server Components가 안정화되어 프론트엔드 아키텍처 변화를 촉진. 서버 렌더링으로 번들 크기 감소, DB 직접 접근 가능.",
      keyPoints: JSON.stringify(["React Server Components", "번들 최적화", "RSC"]),
    },
    {
      title: "Supabase로 5분 만에 인증 시스템 만들기",
      summary: "Supabase Auth를 활용하면 이메일/비밀번호, 소셜 로그인을 빠르게 구현할 수 있습니다.",
      content: "## Supabase Auth 시작하기\n\n### 1단계: 프로젝트 생성\n\nSupabase 대시보드에서 새 프로젝트를 생성합니다.\n\n### 2단계: 인증 설정\n\n```typescript\nimport { createClient } from '@supabase/supabase-js'\nconst supabase = createClient(url, key)\n```\n\n### 팁\n\n- Row Level Security(RLS)를 반드시 활성화하세요",
      source: "Dev.to",
      sourceUrl: "https://dev.to/supabase-auth-quickstart",
      category: "웹개발",
      tags: JSON.stringify(["Supabase", "인증", "Next.js"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 198,
      aiSummary: "Supabase Auth로 이메일/소셜 로그인을 빠르게 구현하는 방법. createClient로 인증 클라이언트 생성, 미들웨어로 라우트 보호 가능.",
      keyPoints: JSON.stringify(["Supabase Auth", "소셜 로그인", "RLS"]),
    },
    {
      title: "Deno 2.0: Node.js와의 완전한 호환 선언",
      summary: "Deno 2.0이 출시되면서 Node.js 패키지와의 완전한 호환을 달성했습니다.",
      content: "## Deno 2.0 주요 변경점\n\n### Node.js 호환성\n\nDeno 2.0부터는 npm 패키지를 직접 사용할 수 있습니다.\n\n### Deno vs Node.js\n\n| 항목 | Deno 2.0 | Node.js |\n|------|----------|--------|\n| 보안 | 기본 차단 | 기본 허용 |\n| TypeScript | 내장 지원 | 별도 설정 |",
      source: "HackerNews",
      sourceUrl: "https://deno.land/blog/v2.0",
      category: "웹개발",
      tags: JSON.stringify(["Deno", "Node.js", "런타임"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 156,
      aiSummary: "Deno 2.0이 Node.js 패키지와의 완전한 호환을 달성. npm 접두사 없이 직접 사용 가능, TypeScript 내장 지원.",
      keyPoints: JSON.stringify(["Deno 2.0", "Node.js 호환", "런타임"]),
    },
    {
      title: "LangChain으로 만드는 RAG 파이프라인 완벽 가이드",
      summary: "LangChain과 벡터 DB를 활용한 RAG 구현 방법을 단계별로 설명합니다.",
      content: "## RAG란?\n\nRAG는 검색 증강 생성의 약자로, LLM이 외부 문서를 검색한 후 답변하는 방식입니다.\n\n### 아키텍처\n\n```\n사용자 질문 → 문서 검색(벡터 DB) → 관련 문서 + 질문 → LLM → 답변\n```",
      source: "HackerNews",
      sourceUrl: "https://hackernews.com/item/rag-langchain-guide",
      category: "인공지능",
      tags: JSON.stringify(["RAG", "LangChain", "벡터DB"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 267,
      aiSummary: "LangChain + 벡터 DB로 RAG 파이프라인 구현 가이드. 문서 로드 → 청킹 → 벡터 저장 → 검색 → LLM 답변 흐름.",
      keyPoints: JSON.stringify(["RAG", "LangChain", "벡터DB"]),
    },
    {
      title: "Kubernetes 입문자를 위한 실전 클러스터 구성",
      summary: "Kubernetes의 핵심 개념을 실습 중심으로 설명하고, 로컬 환경에서 클러스터를 구성하는 방법을 안내합니다.",
      content: "## Kubernetes 핵심 개념\n\n### Pod\n\nPod은 Kubernetes에서 가장 작은 배포 단위입니다.\n\n### Deployment\n\nDeployment는 Pod의 복제와 업데이트를 관리합니다.\n\n### Service\n\nService는 Pod에 대한 네트워크 접근을 제공합니다.",
      source: "Dev.to",
      sourceUrl: "https://dev.to/kubernetes-beginners-guide",
      category: "웹개발",
      tags: JSON.stringify(["Kubernetes", "DevOps", "컨테이너"]),
      difficultyLevel: "중급",
      status: "approved",
      viewCount: 134,
      aiSummary: "Kubernetes 핵심 개념(Pod, Deployment, Service)을 YAML 예시로 설명. Minikube로 로컬 클러스터 구성 방법 안내.",
      keyPoints: JSON.stringify(["Kubernetes", "Pod", "Minikube"]),
    },
    {
      title: "Tailwind CSS 4.0: 성능 10배 향상의 비밀",
      summary: "Tailwind CSS 4.0이 Rust 기반 엔진으로 전환되면서 빌드 성능이 크게 개선되었습니다.",
      content: "## Tailwind CSS 4.0 주요 변경점\n\n### Rust 기반 엔진\n\n빌드 시간이 10배 이상 빨라졌습니다.\n\n### CSS-first 구성\n\n```css\n@import \"tailwindcss\";\n@theme {\n  --color-primary: #34D399;\n}\n```",
      source: "HackerNews",
      sourceUrl: "https://tailwindcss.com/blog/tailwindcss-v4",
      category: "웹개발",
      tags: JSON.stringify(["Tailwind CSS", "CSS", "성능"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 203,
      aiSummary: "Tailwind CSS 4.0이 Rust 기반 엔진으로 전환되어 빌드 10배 향상. CSS-first 구성 방식 도입.",
      keyPoints: JSON.stringify(["Tailwind CSS 4", "Rust 엔진", "CSS-first"]),
    },
    {
      title: "GitHub Copilot Workspace: AI 네이티브 개발 환경",
      summary: "GitHub가 Copilot Workspace를 출시하여, 이슈부터 PR까지 AI가 전체 워크플로우를 처리합니다.",
      content: "## Copilot Workspace란?\n\nGitHub Copilot Workspace는 이슈를 분석하고, 솔루션을 제안하며, 코드를 작성하는 AI 네이티브 개발 환경입니다.\n\n### 무료 사용\n\nCopilot Free 플랜에서 월 50회 사용 가능.",
      source: "GitHub Blog",
      sourceUrl: "https://github.blog/copilot-workspace",
      category: "오픈소스",
      tags: JSON.stringify(["GitHub", "Copilot", "AI"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 189,
      aiSummary: "GitHub Copilot Workspace가 이슈→코드→PR까지 AI가 처리하는 네이티브 개발 환경을 제공.",
      keyPoints: JSON.stringify(["Copilot Workspace", "AI 개발", "GitHub"]),
    },
    {
      title: "Linux 커널 6.12: Rust 드라이버 지원 본격화",
      summary: "Linux 커널 6.12에서 Rust로 작성된 드라이버가 메인라인에 포함되면서, 커널 개발 생태계가 변화하고 있습니다.",
      content: "## Rust in Linux\n\n### 왜 Rust인가?\n\nLinux 커널은 C로 작성되어왔지만, Rust의 메모리 안전성이 새로운 드라이버 개발에 유리합니다.\n\n### 주요 변경점\n\n- Rust 드라이버 프레임워크 안정화\n- 메모리 안전 사고 70% 감소 (구글 연구)",
      source: "HackerNews",
      sourceUrl: "https://lwn.net/Articles/linux-6.12-rust",
      category: "오픈소스",
      tags: JSON.stringify(["Linux", "Rust", "커널"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 178,
      aiSummary: "Linux 커널 6.12에서 Rust 드라이버가 메인라인 포함. 메모리 안전 사고 70% 감소 효과.",
      keyPoints: JSON.stringify(["Linux 커널", "Rust", "메모리 안전"]),
    },
    {
      title: "Transformer 아키텍처 7년: 여전히 유효한가?",
      summary: "2017년 구글이 제안한 Transformer가 7년이 지난 지금도 AI의 기본 아키텍처로 자리잡고 있습니다.",
      content: "## Transformer의 위력\n\n### 2017년 Attention Is All You Need\n\n구글이 Transformer를 제안한 이후, 거의 모든 AI 모델이 이 아키텍처를 기반으로 합니다.\n\n### 대안 연구\n\n- **State Space Models (Mamba)**: 선형 복잡도\n- **RWKV**: RNN + Transformer 혼합",
      source: "arXiv",
      sourceUrl: "https://arxiv.org/abs/transformer-7-years",
      category: "논문/리서치",
      tags: JSON.stringify(["Transformer", "Attention", "Deep Learning"]),
      difficultyLevel: "고급",
      status: "approved",
      viewCount: 245,
      aiSummary: "Transformer 아키텍처가 2017년 제안 이후 7년간 AI 기본 구조로 유지. Mamba, RWKV 같은 대안 연구가 효율성 문제 해결 중.",
      keyPoints: JSON.stringify(["Transformer", "Self-Attention", "Mamba"]),
    },
    {
      title: "2025년 개발자 연봉 트렌드 리포트",
      summary: "국내 개발자 연봉이 지속적으로 상승하고 있으며, AI 관련 포지션의 프리미엄이 두드러집니다.",
      content: "## 2025년 개발자 연봉 현황\n\n### 포지션별 평균 연봉\n\n| 포지션 | 신입 | 3년차 | 5년차 | 시니어 |\n|--------|------|-------|-------|--------|\n| 프론트엔드 | 3,800 | 5,200 | 6,800 | 9,000+ |\n| 백엔드 | 4,000 | 5,500 | 7,200 | 9,500+ |\n| AI/ML | 4,500 | 6,500 | 9,000 | 12,000+ |\n\n*(단위: 만원)*\n\n### 주목할 트렌드\n\n1. **AI 포지션 프리미엄**: 일반 개발자 대비 20-30% 높은 연봉",
      source: "기타",
      sourceUrl: "https://salary-report-2025.kr",
      category: "커리어",
      tags: JSON.stringify(["연봉", "커리어", "트렌드"]),
      difficultyLevel: "입문/초급",
      status: "approved",
      viewCount: 312,
      aiSummary: "2025년 개발자 연봉: AI/ML 포지션이 일반 대비 20-30% 프리미엄. 리모트 워크 45%, 스톡옵션 60%+ 제공.",
      keyPoints: JSON.stringify(["개발자 연봉", "AI 프리미엄", "리모트 워크"]),
    },
  ];

  for (const article of articles) {
    const existing = await prisma.article.findFirst({ where: { title: article.title } });
    if (!existing) {
      const now = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 7);
      const publishedAt = new Date(now.getTime() - randomDaysAgo * 86400000);
      await prisma.article.create({ data: { ...article, publishedAt } });
    }
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

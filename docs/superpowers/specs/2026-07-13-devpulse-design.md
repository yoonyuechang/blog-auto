# DevPulse — 주니어 개발자를 위한 AI 기반 IT 트렌드 블로그

## 개요

DevPulse는 무료 API(GitHub, HackerNews, Dev.to, arXiv, RSS)로 IT 뉴스를 자동 수집하고, NVIDIA Build API + Gemini + Groq로 한국어 요약·난이도 판별을 거쳐 주니어 개발자에게 제공하는 IT 블로그 플랫폼이다.

- 앱 이름: DevPulse (데브펄스)
- 기본 언어: 한국어 (영어 원문 병기)
- 디자인: 다크모드 전용, Emerald/Cyan 포인트 컬러

## 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | Next.js 14 (App Router) | React Server Components 활용 |
| 스타일링 | Tailwind CSS | 다크모드 전용 |
| ORM | Prisma | SQLite 연결 |
| DB | SQLite | 파일 기반, Vercel 배포 시 빌드 시 초기화 |
| LLM (메인) | NVIDIA Build API | OpenAI 호환 형식, 무료 |
| LLM (폴백 1) | Gemini 2.0 Flash | 무료 티어 |
| LLM (폴백 2) | Groq llama3-70b | 무료, 빠름 |
| 아이콘 | Lucide React | |
| 마크다운 | react-markdown + remark-gfm | 코드 하이라이팅 포함 |
| 배포 | Vercel 무료 티어 | |
| CI/CD | GitHub Actions | 자동 수집 + AI 분석 |

## 데이터베이스 스키마 (Prisma)

### Article
```prisma
model Article {
  id              Int      @id @default(autoincrement())
  title           String
  summary         String   // 원본 요약
  content         String   // 마크다운 본문
  source          String   // 출처명
  sourceUrl       String   // 원본 링크
  category        String   // 카테고리명
  tags            String   // JSON array of strings
  difficultyLevel String   // "입문/초급" | "중급" | "고급"
  publishedAt     DateTime
  status          String   @default("pending_approval") // "pending_approval" | "approved" | "rejected"
  viewCount       Int      @default(0)
  aiSummary       String   @default("") // AI 한국어 3줄 요약
  keyPoints       String   @default("[]") // JSON array of strings
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Source
```prisma
model Source {
  id              Int      @id @default(autoincrement())
  name            String
  type            String   // "rss" | "api" | "manual"
  url             String
  fetchInterval   String   // "hourly" | "daily"
  lastFetched     DateTime?
  isActive        Boolean  @default(true)
  category        String   // 기본 카테고리
  createdAt       DateTime @default(now())
}
```

### Newsletter
```prisma
model Newsletter {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  subscribedAt    DateTime @default(now())
  isActive        Boolean  @default(true)
  preferences     String   @default("[]") // JSON array of strings
}
```

### Tag
```prisma
model Tag {
  id              Int      @id @default(autoincrement())
  name            String   @unique
  slug            String   @unique
  color           String   // Hex color
  articleCount    Int      @default(0)
}
```

### Category
```prisma
model Category {
  id              Int      @id @default(autoincrement())
  name            String   @unique
  slug            String   @unique
  description     String
  color           String   // Hex color
  icon            String   // Lucide 아이콘명
}
```

## API 라우트

### Articles
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/articles | 목록 (category, status, difficulty 필터, pagination) |
| GET | /api/articles/[id] | 상세 (view_count 자동 증가) |
| POST | /api/articles | 신규 생성 |
| PATCH | /api/articles/[id] | 수정 (승인/반려) |
| DELETE | /api/articles/[id] | 삭제 |

### Sources
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/sources | 목록 |
| POST | /api/sources | 신규 추가 |
| PATCH | /api/sources/[id] | 수정 (is_active 토글) |

### Newsletter
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/newsletter | 구독 |
| GET | /api/newsletter | 목록 (관리자) |

### Automation
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/fetch | 콘텐츠 수집 트리거 |
| POST | /api/analyze | AI 분석 트리거 |

## 페이지 구성

### Page 1: 메인 홈 (/)

**Hero 섹션**:
- "주니어 개발자를 위한 일일 IT 기술 펄스" 대형 제목
- 부제목: "AI가 요약한 최신 기술 트렌드를 매일 받아보세요"
- 인라인 뉴스레터 구독 폼 (이메일 입력 + 구독 버튼)
- 통계 배지: 총 게시글 수, 오늘 수집된 글 수

**카테고리 필터 탭**:
- 상단 가로 스크롤 탭: [전체] [인공지능] [웹개발] [오픈소스] [논문/리서치] [커리어] [기타]
- 클라이언트 사이드 필터링 (상태 관리로 즉시 반영)

**트렌딩 섹션**:
- view_count 높고 최근 7일 이내 approved 글 3개를 대형 카드로 표시
- 카드: 카테고리 배지, 난이도 배지, 제목, AI 요약 2줄, 출처, 날짜

**최신 뉴스 피드**:
- approved 상태 글을 최신순으로 그리드 카드 (2열~3열 반응형)
- 각 카드: 소스 로고/이름, 제목, ai_summary 2줄, 난이도 배지, 태그 칩, 날짜
- 마우스 오버 시 카드 위로 이동 + 네온 border 효과
- "더보기" 버튼 (페이지네이션)

### Page 2: 글 상세 (/article/[id])

- 상단: 카테고리 경로, 발행일, 원문 출처 버튼 ("원문 보러가기" → source_url 아웃링크)
- 제목 대형 표시, 아래 난이도 배지
- AI 요약 패널: Cyan 반투명 그라데이션 박스, "AI 3줄 요약" 헤더, ai_summary 불릿, key_points 키워드 칩 3개
- 마크다운 본문 렌더링 (다크 테마, 코드 하이라이팅)
- 하단 관련 글 추천 3개 (같은 카테고리)
- 조회수 자동 증가 (진입 시 view_count +1)

### Page 3: 관리자 대시보드 (/admin)

- KPI 카드 4개: 총 게시글, 승인 대기 중, 총 구독자, 누적 조회수
- 승인 큐 테이블: status=="pending_approval" 글 목록
  - 컬럼: 제목, 소스, 난이도, AI요약 미리보기, 수집일
  - 각 행: [승인] / [반려] 버튼
  - 제목 클릭 시 인라인 편집 가능
- 소스 관리 탭: Source 목록, is_active 토글, 신규 소스 추가 폼
- 구독자 현황 탭: Newsletter 목록, 이메일 검색

### Page 4: 카테고리 페이지 (/category/[slug])

- 카테고리 이름, 아이콘, 설명 헤더
- 해당 카테고리 approved 글 최신순 그리드
- 난이도 필터 버튼 (전체/입문/중급/고급)

### Page 5: 뉴스레터 구독 (/subscribe)

- "매주 월요일 아침, 주니어 개발자를 위한 AI 요약 테크 뉴스레터를 받아보세요" 문구
- 이메일 입력 + 관심 카테고리 멀티 선택
- 구독 완료 후: 감사 메시지 + 인기 글 5개 추천

## 초기 데이터

### Source (7개)
1. HackerNews Top Stories - api, hourly
2. Dev.to Articles - api, daily
3. GitHub Trending - api, daily
4. arXiv AI Papers - api, daily
5. OpenAI Blog - rss, daily
6. Google AI Blog - rss, daily
7. Hugging Face Blog - rss, daily

### Category (6개)
1. 인공지능 (brain, cyan #22D3EE)
2. 웹개발 (code, emerald #34D399)
3. 오픈소스 (git-branch, indigo #818CF8)
4. 논문/리서치 (file-text, purple #A78BFA)
5. 커리어 (briefcase, orange #FB923C)
6. 기타 (layers, gray #94A3B8)

### Article (10개+ 샘플)
각 카테고리별로 2개 이상, status: "approved", ai_summary/key_points/difficulty_level 포함.

## LLM 통합

### 병렬 폴백 체인

```
summarize(title, content)
  ├─ Promise.race([
  │   NVIDIA Build API (primary),
  │   Gemini 2.0 Flash (fallback 1),
  │   Groq llama3-70b (fallback 2)
  │ ])
  └─ 가장 빠른 응답 채택, 실패 시 다음 API 시도
```

### 분석 프롬프트

```
당신은 IT 기술 뉴스를 분석하는 한국인 테크 라이터입니다.
다음 글을 분석하여 아래 형식으로 출력해주세요:

## 한국어 3줄 요약
(이 글의 핵심을 3줄로 요약)

## 핵심 키워드 3개
(쉼표로 구분)

## 난이도
(입문/초급 / 중급 / 고급 중 하나)
```

### API 설정

| LLM | 엔드포인트 | 모델 | 무료 티어 |
|-----|-----------|------|----------|
| NVIDIA Build | https://integrate.api.nvidia.com/v1/chat/completions | nvidia/llama-3.3-70b-instruct | 있음 |
| Gemini | https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent | gemini-2.0-flash | 있음 |
| Groq | https://api.groq.com/openai/v1/chat/completions | llama3-70b-8192 | 있음 |

## 자동화 (GitHub Actions)

### Workflow 1: daily-fetch.yml
- 트리거: cron (매일 오전 6시 KST) + 수동
- 작업: POST /api/fetch 호출

### Workflow 2: ai-analyze.yml
- 트리거: daily-fetch 완료 후
- 작업: POST /api/analyze 호출

## 디자인 시스템

### 색상 토큰
```css
--bg: #0B0F19;
--card: #1E293B;
--border: #334155;
--emerald: #34D399;
--cyan: #22D3EE;
--text-primary: #F8FAFC;
--text-secondary: #94A3B8;
--text-muted: #64748B;
```

### 난이도 배지
| 레벨 | 배경 | 텍스트 | 테두리 |
|------|------|--------|--------|
| 입문/초급 | #064E3B | #34D399 | #059669 |
| 중급 | #78350F | #FBBF24 | #D97706 |
| 고급 | #7F1D1D | #F87171 | #DC2626 |

### 호버 효과
- transform: translateY(-4px)
- box-shadow: 0 0 20px rgba(52, 211, 153, 0.15)
- border-color: #34D399

### 반응형
| 브레이크포인트 | 그리드 | 비고 |
|---------------|--------|------|
| ≥1024px | 3열 | 데스크톱 |
| 768-1023px | 2열 | 태블릿 |
| <768px | 1열 | 모바일 |

## 구현 순서

1. 프로젝트 초기화 (Next.js + Tailwind + Prisma)
2. DB 스키마 + 시드 데이터
3. 공용 컴포넌트 (Badge, Card, Skeleton, Input, Button, Toggle)
4. 메인 홈 페이지 (Hero, 카테고리 탭, 트렌딩, 피드)
5. 글 상세 페이지 (AI 요약 패널, 마크다운 렌더링)
6. 카테고리 페이지
7. 관리자 대시보드 (KPI, 승인 큐, 소스 관리, 구독자)
8. 뉴스레터 구독 페이지
9. API 라우트 (수집 + 분석 + CRUD)
10. GitHub Actions 자동화 + LLM 통합

## 관리자 접근 제어

- 환경변수 `ADMIN_EMAIL`로 관리자 이메일 지정
- /admin 페이지 진입 시 Newsletter 테이블에서 이메일 확인
- 로그인 없이 이메일 입력으로 관리자 인증 (간단한 세션 쿠키)
- 프로덕션 확장 시: NextAuth.js + 소셜 로그인 추가 가능

## 제약 조건

- 외부 유료 API 키 사용 금지 (무료 티어만 사용)
- 다크모드 전용 (라이트 모드 미지원)
- 한국어 기본, 영어 원문 병기
- 샘플 데이터로 앱 로드 시 바로 동작하는 모습 확인
- Skeleton UI 로딩 효과
- 모바일/태블릿/데스크톱 완전 반응형

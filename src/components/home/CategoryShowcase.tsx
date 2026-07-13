"use client";

import { useRouter } from "next/navigation";
import {
  Code2,
  Server,
  BrainCircuit,
  Cloud,
  Users,
  BookOpen,
} from "lucide-react";

interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  icon: typeof Code2;
  borderColor: string;
  count: number;
}

const CATEGORIES: CategoryInfo[] = [
  { name: "프론트엔드", slug: "프론트엔드", description: "UI/UX와 클라이언트 기술", icon: Code2, borderColor: "border-blue-400/40 hover:border-blue-400", count: 0 },
  { name: "백엔드", slug: "백엔드", description: "서버, API, 데이터베이스", icon: Server, borderColor: "border-violet-400/40 hover:border-violet-400", count: 0 },
  { name: "AI/ML", slug: "AI/ML", description: "인공지능과 머신러닝", icon: BrainCircuit, borderColor: "border-amber-400/40 hover:border-amber-400", count: 0 },
  { name: "인프라", slug: "인프라", description: "클라우드와 배포 전략", icon: Cloud, borderColor: "border-rose-400/40 hover:border-rose-400", count: 0 },
  { name: "개발문화", slug: "개발문화", description: "팀 워크플로우와 성장", icon: Users, borderColor: "border-cyan-400/40 hover:border-cyan-400", count: 0 },
  { name: "CS/이론", slug: "CS/이론", description: "컴퓨터 과학 기초", icon: BookOpen, borderColor: "border-emerald-400/40 hover:border-emerald-400", count: 0 },
];

export default function CategoryShowcase({ counts }: { counts?: Record<string, number> }) {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-text-primary">카테고리별 탐색</h2>
      <p className="mb-10 text-center text-sm text-text-muted">관심 분야를 선택하세요</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = counts?.[cat.name] ?? 0;
          return (
            <button
              key={cat.slug}
              onClick={() => router.push(`/category/${cat.slug}`)}
              className={`group rounded-xl border bg-card p-5 text-left transition-all hover:shadow-lg hover:shadow-emerald-950/20 ${cat.borderColor}`}
            >
              <div className="mb-3 flex items-center gap-3">
                <Icon size={22} className="text-text-muted transition-colors group-hover:text-emerald-400" />
                <h3 className="text-base font-bold text-text-primary">{cat.name}</h3>
              </div>
              <p className="mb-3 text-sm text-text-muted">{cat.description}</p>
              <span className="text-xs font-medium text-text-muted">{count}개 글</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

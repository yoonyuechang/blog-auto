"use client";

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

export default function ApprovalQueue({ articles, onApprove, onReject }: ApprovalQueueProps) {
  if (articles.length === 0) {
    return <div className="rounded-lg border border-border bg-card p-8 text-center text-text-muted">승인 대기 중인 글이 없습니다</div>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">제목</th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">소스</th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">난이도</th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">AI요약</th>
            <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">수집일</th>
            <th className="px-4 py-3 text-right font-mono text-xs uppercase text-text-muted">액션</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-border">
              <td className="px-4 py-3"><a href={`/article/${article.id}`} className="text-text-primary hover:text-emerald-400">{article.title}</a></td>
              <td className="px-4 py-3 text-text-muted">{article.source}</td>
              <td className="px-4 py-3"><Badge level={article.difficultyLevel as "입문/초급" | "중급" | "고급"} /></td>
              <td className="max-w-[200px] truncate px-4 py-3 text-text-secondary">{article.aiSummary}</td>
              <td className="px-4 py-3 text-text-muted">{article.createdAt}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => onApprove(article.id)}>승인</Button>
                  <Button size="sm" variant="danger" onClick={() => onReject(article.id)}>반려</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

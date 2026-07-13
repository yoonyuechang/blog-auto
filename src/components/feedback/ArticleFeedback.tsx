"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function ArticleFeedback({ articleId }: { articleId: number }) {
  const [feedback, setFeedback] = useState<"helpful" | "not" | null>(null);
  const handle = async (type: "helpful" | "not") => {
    setFeedback(type);
    await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ articleId, type }) });
  };
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      <span className="text-sm text-text-muted">이 글이 도움이 되었나요?</span>
      <button onClick={() => handle("helpful")} aria-label="도움이 됨" className={`p-2 rounded-lg ${feedback === "helpful" ? "bg-emerald-950 text-emerald-400" : "text-text-muted hover:text-text-primary"}`}><ThumbsUp size={18} /></button>
      <button onClick={() => handle("not")} aria-label="도움이 안 됨" className={`p-2 rounded-lg ${feedback === "not" ? "bg-red-950 text-red-400" : "text-text-muted hover:text-text-primary"}`}><ThumbsDown size={18} /></button>
    </div>
  );
}

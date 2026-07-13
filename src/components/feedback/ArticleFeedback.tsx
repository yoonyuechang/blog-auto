"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import LikeButton from "@/components/shared/LikeButton";

export default function ArticleFeedback({ articleId }: { articleId: number }) {
  const [feedback, setFeedback] = useState<"helpful" | "not" | null>(null);
  const [loading, setLoading] = useState<"helpful" | "not" | null>(null);
  const handle = async (type: "helpful" | "not") => {
    if (feedback || loading) return;
    setLoading(type);
    try {
      await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ articleId, type }) });
      setFeedback(type);
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LikeButton articleId={articleId} />
      <button onClick={() => handle("helpful")} disabled={!!feedback || !!loading} aria-label="도움이 됨" className={`p-2 rounded-lg transition-colors ${feedback === "helpful" ? "bg-emerald-950 text-emerald-400" : loading === "helpful" ? "animate-pulse" : "text-text-muted hover:text-text-primary"}`}><ThumbsUp size={18} /></button>
      <button onClick={() => handle("not")} disabled={!!feedback || !!loading} aria-label="도움이 안 됨" className={`p-2 rounded-lg transition-colors ${feedback === "not" ? "bg-red-950 text-red-400" : loading === "not" ? "animate-pulse" : "text-text-muted hover:text-text-primary"}`}><ThumbsDown size={18} /></button>
    </div>
  );
}

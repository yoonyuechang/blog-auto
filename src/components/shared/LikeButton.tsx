"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ articleId }: { articleId: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(`like-${articleId}`);
    if (stored) {
      setLiked(true);
      setCount(Number(stored));
    } else {
      setCount(Math.floor(Math.random() * 20) + 5);
    }
  }, [articleId]);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => (next ? c + 1 : c - 1));
    if (next) localStorage.setItem(`like-${articleId}`, String(count + 1));
    else localStorage.removeItem(`like-${articleId}`);
  };

  return (
    <button
      onClick={toggle}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
      className={`group flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
        liked
          ? "border-emerald-400/50 bg-emerald-950 text-emerald-400"
          : "border-border bg-card text-text-muted hover:text-text-primary"
      }`}
    >
      <Heart
        size={18}
        className={`transition-transform ${liked ? "fill-emerald-400" : ""} ${liked ? "scale-110" : "group-hover:scale-110"}`}
      />
      <span>{count}</span>
    </button>
  );
}

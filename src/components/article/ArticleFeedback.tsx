"use client";

import { useState, useEffect } from "react";

const REACTIONS = [
  { emoji: "👍", label: "유용해요" },
  { emoji: "🤔", label: "알아두면 좋겠어요" },
  { emoji: "❤️", label: "좋아요" },
] as const;

interface FeedbackState {
  total: number;
  reactions: Record<string, number>;
  userReaction: string | null;
}

function getStorageKey(articleId: string) {
  return `feedback:${articleId}`;
}

export default function ArticleFeedback({ articleId }: { articleId: string }) {
  const [state, setState] = useState<FeedbackState>({ total: 0, reactions: {}, userReaction: null });

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(articleId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({
          total: parsed.total ?? 0,
          reactions: parsed.reactions ?? {},
          userReaction: parsed.userReaction ?? null,
        });
      } catch {}
    } else {
      setState({
        total: 123,
        reactions: { "👍": 89, "🤔": 21, "❤️": 13 },
        userReaction: null,
      });
    }
  }, [articleId]);

  const handleReaction = (emoji: string) => {
    if (state.userReaction === emoji) return;

    const prev = state.userReaction;
    const nextReactions = { ...state.reactions };

    if (prev) {
      nextReactions[prev] = Math.max((nextReactions[prev] ?? 1) - 1, 0);
    }
    nextReactions[emoji] = (nextReactions[emoji] ?? 0) + 1;

    const next = {
      total: state.total + (prev ? 0 : 1),
      reactions: nextReactions,
      userReaction: emoji,
    };

    setState(next);
    localStorage.setItem(getStorageKey(articleId), JSON.stringify(next));
  };

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <p className="mb-3 text-sm text-text-secondary">
        이 아티클이 유용했나요? ({state.total}명)
      </p>
      <div className="flex gap-2">
        {REACTIONS.map(({ emoji, label }) => (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              state.userReaction === emoji
                ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-card/50 text-text-muted hover:border-border hover:text-text-secondary"
            }`}
          >
            <span>{emoji}</span>
            <span className="text-xs">{label}</span>
            <span className="text-xs text-text-muted">({state.reactions[emoji] ?? 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  articleId: number;
}

export default function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setSaved(bookmarks.includes(articleId));
    } catch {}
  }, [articleId]);

  const toggle = () => {
    try {
      const bookmarks: number[] = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      let next: number[];
      if (bookmarks.includes(articleId)) {
        next = bookmarks.filter((id) => id !== articleId);
        setSaved(false);
      } else {
        next = [...bookmarks, articleId];
        setSaved(true);
      }
      localStorage.setItem("bookmarks", JSON.stringify(next));

      fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={saved ? "북마크 해제" : "북마크 추가"}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-secondary transition-all hover:bg-border hover:text-text-primary"
      >
        <Bookmark
          size={16}
          className={`transition-transform duration-200 ${saved ? "fill-emerald-400 text-emerald-400 scale-110" : ""}`}
        />
        <span className="hidden sm:inline">{saved ? "북마크됨" : "북마크"}</span>
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-md">
          {saved ? "북마크됨" : "북마크 추가"}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import { Sparkles, Check } from "lucide-react";

interface Suggestion {
  tag: string;
  confidence: number;
}

export default function AISuggest({ onAdd }: { onAdd?: (tags: string[]) => void }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  async function fetchSuggestions() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setSelected(new Set());
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function toggle(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-text-primary">
        <Sparkles className="h-4 w-4 text-amber-400" />
        AI 태그 추천
      </h3>
      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"
      />
      <textarea
        placeholder="요약 (선택)"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={2}
        className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"
      />
      <Button onClick={fetchSuggestions} disabled={loading || !title.trim()} className="w-full">
        {loading ? "분석 중..." : "태그 추천 받기"}
      </Button>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s.tag}
              onClick={() => toggle(s.tag)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                selected.has(s.tag)
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                  : "border-border bg-slate-700/50 text-text-secondary hover:border-slate-500"
              }`}
            >
              {selected.has(s.tag) && <Check className="h-3 w-3" />}
              {s.tag}
              <span className="text-[10px] opacity-60">{Math.round(s.confidence * 100)}%</span>
            </button>
          ))}
        </div>
      )}

      {selected.size > 0 && onAdd && (
        <Button onClick={() => onAdd(Array.from(selected))} className="mt-3 w-full" variant="secondary">
          선택한 태그 추가 ({selected.size})
        </Button>
      )}
    </div>
  );
}

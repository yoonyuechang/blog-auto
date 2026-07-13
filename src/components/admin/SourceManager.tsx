"use client";

import { useState } from "react";
import Toggle from "@/components/shared/Toggle";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

interface Source {
  id: number;
  name: string;
  type: string;
  url: string;
  fetchInterval: string;
  isActive: boolean;
  category: string;
}

interface SourceManagerProps {
  sources: Source[];
  onToggle: (id: number, isActive: boolean) => void;
  onAdd: (source: Omit<Source, "id">) => void;
}

export default function SourceManager({ sources, onToggle, onAdd }: SourceManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"api" | "rss" | "manual">("api");
  const [category, setCategory] = useState("기타");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, url, type, fetchInterval: "daily", isActive: true, category });
    setName(""); setUrl(""); setShowForm(false);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">소스 관리</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? "취소" : "소스 추가"}</Button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="소스 이름" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">타입</label>
              <select value={type} onChange={(e) => setType(e.target.value as "api" | "rss" | "manual")}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-text-primary">
                <option value="api">API</option>
                <option value="rss">RSS</option>
                <option value="manual">수동</option>
              </select>
            </div>
            <Input label="카테고리" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="mt-4"><Button type="submit">추가하기</Button></div>
        </form>
      )}
      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <p className="font-medium text-text-primary">{source.name}</p>
              <p className="text-xs text-text-muted">{source.type} · {source.category} · {source.fetchInterval}</p>
            </div>
            <Toggle checked={source.isActive} onChange={(active) => onToggle(source.id, active)} />
          </div>
        ))}
      </div>
    </div>
  );
}

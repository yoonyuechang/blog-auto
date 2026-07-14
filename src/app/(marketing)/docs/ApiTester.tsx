"use client";

import { useState } from "react";
import { Play, Copy, Check, ChevronDown } from "lucide-react";

const ENDPOINTS = [
  { method: "GET", path: "/api/articles", label: "Articles 목록", params: [
    { name: "page", type: "number", placeholder: "1" },
    { name: "limit", type: "number", placeholder: "12" },
    { name: "category", type: "text", placeholder: "ai" },
    { name: "q", type: "text", placeholder: "search term" },
  ]},
  { method: "GET", path: "/api/articles/:id", label: "Article 상세", params: [
    { name: "id", type: "number", placeholder: "1" },
  ]},
  { method: "GET", path: "/api/search", label: "Search", params: [
    { name: "q", type: "text", placeholder: "TypeScript" },
    { name: "category", type: "text", placeholder: "web" },
    { name: "sort", type: "text", placeholder: "newest" },
  ]},
  { method: "GET", path: "/api/stats", label: "Stats", params: [] },
  { method: "GET", path: "/api/recommendations", label: "Recommendations", params: [
    { name: "articleId", type: "number", placeholder: "1" },
    { name: "limit", type: "number", placeholder: "5" },
    { name: "strategy", type: "text", placeholder: "trending" },
  ]},
  { method: "GET", path: "/api/health", label: "Health Check", params: [] },
];

export default function ApiTester() {
  const [selected, setSelected] = useState(0);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const endpoint = ENDPOINTS[selected];

  const handleTest = async () => {
    setLoading(true);
    setResponse("");
    setStatus(null);

    try {
      let url = endpoint.path;
      if (url.includes(":id")) {
        const id = params.id || "1";
        url = url.replace(":id", id);
      }

      const query = new URLSearchParams();
      for (const p of endpoint.params) {
        if (p.name === "id") continue;
        if (params[p.name]) query.set(p.name, params[p.name]);
      }
      const qs = query.toString();
      if (qs) url += `?${qs}`;

      const res = await fetch(url);
      setStatus(res.status);
      const text = await res.text();
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setResponse(text.slice(0, 2000));
      }
    } catch (e) {
      setResponse(`Error: ${e instanceof Error ? e.message : "Request failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-card/50 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary">API 테스터</h3>
        <div className="text-xs text-text-muted">{endpoint.method}</div>
      </div>

      <div className="p-4 space-y-3">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-primary"
          >
            <span>{endpoint.label}</span>
            <ChevronDown size={14} className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-card shadow-xl">
              {ENDPOINTS.map((ep, i) => (
                <button
                  key={i}
                  onClick={() => { setSelected(i); setParams({}); setOpen(false); setResponse(""); }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-border/50 ${i === selected ? "bg-emerald-500/10 text-emerald-400" : "text-text-secondary"}`}
                >
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${ep.method === "GET" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {ep.method}
                  </span>
                  {ep.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {endpoint.params.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {endpoint.params.map((p) => (
              <div key={p.name}>
                <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-text-muted">{p.name}</label>
                <input
                  type="text"
                  placeholder={p.placeholder}
                  value={params[p.name] || ""}
                  onChange={(e) => setParams({ ...params, [p.name]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleTest}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-bg transition-colors hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" /> : <Play size={14} />}
          {loading ? "요청 중..." : "테스트"}
        </button>

        {response && (
          <div className="relative">
            <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-bg/50 px-3 py-2">
              <span className={`text-xs font-bold ${status && status < 400 ? "text-emerald-400" : "text-red-400"}`}>
                {status} {status === 200 ? "OK" : status === 404 ? "Not Found" : ""}
              </span>
              <button onClick={copyResponse} className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-text-muted hover:bg-border/50 hover:text-text-secondary">
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
            <pre className="max-h-72 overflow-auto rounded-b-lg border border-border bg-[#1a1b26] p-3 text-xs text-text-secondary">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

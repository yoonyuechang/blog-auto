"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  className?: string;
}

function extractLanguage(className?: string): string {
  if (!className) return "";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "";
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lang = extractLanguage(className);
  const lines = children.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 group/code relative">
      {lang && (
        <span className="absolute left-3 top-2 z-10 rounded bg-slate-700/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
          {lang}
        </span>
      )}
      <button
        onClick={handleCopy}
        aria-label="코드 복사"
        className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-xs text-text-muted opacity-0 transition-opacity hover:bg-border hover:text-text-primary group-hover/code:opacity-100"
      >
        {copied ? <><Check size={12} /> 복사됨</> : <><Copy size={12} /> 복사</>}
      </button>
      <pre className="overflow-x-auto rounded-lg border border-border p-4 pr-20 text-sm" style={{ background: "#0d1117" }}>
        <code className={className}>
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="leading-relaxed">
                  <td className="select-none pr-4 text-right align-top text-text-muted/40" style={{ minWidth: "2.5rem" }}>
                    {i + 1}
                  </td>
                  <td className="whitespace-pre text-text-secondary">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </code>
      </pre>
    </div>
  );
}

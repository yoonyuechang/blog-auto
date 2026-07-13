"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownBodyProps {
  content: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-");
}

const components: Components = {
  h2: ({ children }) => {
    const text = String(children);
    const id = slugify(text);
    return (
      <h2 id={id} className="mb-4 mt-12 border-b border-border pb-2 text-xl font-bold text-text-primary group">
        <a href={`#${id}`} className="no-underline hover:underline text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mr-1">#</a>
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = String(children);
    const id = slugify(text);
    return (
      <h3 id={id} className="mb-3 mt-8 text-lg font-semibold text-text-primary">
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="mb-5 text-text-secondary leading-relaxed">{children}</p>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="rounded bg-border px-1.5 py-0.5 text-sm text-emerald-400">{children}</code>;
    }
    return (
      <code className={`block overflow-x-auto text-sm ${className}`}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <div className="mb-6 group/code relative">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={(e) => {
            const pre = e.currentTarget.closest("div")?.querySelector("pre");
            if (pre) navigator.clipboard.writeText(pre.textContent ?? "");
          }}
          aria-label="코드 복사"
          className="rounded border border-border bg-card px-2 py-1 text-xs text-text-muted opacity-0 transition-opacity hover:bg-border hover:text-text-primary group-hover/code:opacity-100"
        >
          복사
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 pr-16">
        {children}
      </pre>
    </div>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 list-disc space-y-1 pl-5 text-text-secondary marker:text-emerald-400/60">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-1 pl-5 text-text-secondary marker:text-emerald-400/60">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-2 hover:decoration-emerald-400 hover:text-emerald-300"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-lg border-l-4 border-emerald-400 bg-emerald-950/30 py-3 pl-5 pr-4 text-text-secondary italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border bg-card px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wider text-text-muted">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-4 py-2.5 text-text-secondary">{children}</td>
  ),
  hr: () => <hr className="my-10 border-border" />,
  img: ({ src, alt }) => (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        className="rounded-lg border border-border"
        loading="lazy"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-text-muted">{alt}</figcaption>
      )}
    </figure>
  ),
};

export default function MarkdownBody({ content }: MarkdownBodyProps) {
  return (
    <div className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

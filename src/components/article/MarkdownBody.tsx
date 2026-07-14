"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import { isCalloutBlockquote } from "./CalloutBlock";

interface MarkdownBodyProps {
  content: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-");
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if ((node as React.ReactElement)?.props?.children) return extractText((node as React.ReactElement).props.children);
  return "";
}

function CopyLink({ id }: { id: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`)}
      className="ml-1 text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100"
      aria-label="링크 복사"
    >
      #
    </button>
  );
}

const components: Components = {
  h2: ({ children }) => {
    const id = slugify(extractText(children));
    return (
      <h2 id={id} className="mb-4 mt-12 border-b border-border pb-2 text-xl font-bold text-text-primary group">
        <CopyLink id={id} />
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugify(extractText(children));
    return (
      <h3 id={id} className="mb-3 mt-8 text-lg font-semibold text-text-primary group">
        <CopyLink id={id} />
        {children}
      </h3>
    );
  },
  p: ({ children }) => <p className="mb-5 text-text-secondary leading-relaxed">{children}</p>,
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="rounded bg-border px-1.5 py-0.5 text-sm text-emerald-400">{children}</code>;
    }
    return <CodeBlock className={className}>{String(children).replace(/\n$/, "")}</CodeBlock>;
  },
  pre: ({ children }) => {
    // When code block is used, pre is just a wrapper — CodeBlock handles its own container
    return <>{children}</>;
  },
  ul: ({ children }) => (
    <ul className="mb-5 list-disc space-y-1 pl-5 text-text-secondary marker:text-emerald-400/60">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-1 pl-5 text-text-secondary marker:text-emerald-400/60">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-2 transition-colors hover:decoration-emerald-400 hover:text-emerald-300"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  blockquote: ({ children }) => {
    const callout = isCalloutBlockquote(children);
    if (callout) {
      return (
        <Callout type={callout.type} title={callout.title}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{callout.content}</ReactMarkdown>
        </Callout>
      );
    }
    return (
      <blockquote className="my-5 rounded-r-lg border-l-4 border-emerald-400 bg-emerald-950/30 py-3 pl-5 pr-4 text-text-secondary italic">
        {children}
      </blockquote>
    );
  },
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
        className="rounded-lg border border-border cursor-zoom-in"
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

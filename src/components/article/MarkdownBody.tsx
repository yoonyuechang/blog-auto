import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownBodyProps {
  content: string;
}

export default function MarkdownBody({ content }: MarkdownBodyProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className="mb-4 mt-12 border-b border-border pb-2 text-xl font-bold text-text-primary">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-3 mt-8 text-lg font-semibold text-text-primary">{children}</h3>,
          p: ({ children }) => <p className="mb-5 text-text-secondary leading-relaxed">{children}</p>,
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) return <code className="rounded bg-border px-1.5 py-0.5 text-sm text-emerald-400">{children}</code>;
            return <code className={`block overflow-x-auto text-sm ${className}`}>{children}</code>;
          },
          pre: ({ children }) => <pre className="mb-6 overflow-x-auto rounded-lg border border-border bg-card p-4">{children}</pre>,
          ul: ({ children }) => <ul className="mb-5 list-disc space-y-1 pl-5 text-text-secondary">{children}</ul>,
          ol: ({ children }) => <ol className="mb-5 list-decimal space-y-1 pl-5 text-text-secondary">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">{children}</a>,
          strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
          blockquote: ({ children }) => <blockquote className="my-4 border-l-4 border-emerald-400 pl-5 text-text-secondary">{children}</blockquote>,
          table: ({ children }) => <div className="my-6 overflow-x-auto"><table className="w-full text-sm">{children}</table></div>,
          th: ({ children }) => <th className="border-b border-border bg-card px-4 py-2 text-left font-mono text-xs font-medium uppercase text-text-muted">{children}</th>,
          td: ({ children }) => <td className="border-b border-border px-4 py-2 text-text-secondary">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

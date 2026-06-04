"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 mt-1 text-lg font-semibold tracking-tight text-foreground first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-base font-semibold tracking-tight text-foreground first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 text-sm font-semibold text-foreground first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 mt-2 text-sm font-medium text-foreground">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-3 text-[0.9375rem] leading-relaxed text-foreground/95 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-foreground/95 last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-foreground/95 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="[&>p]:mb-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-secondary underline decoration-secondary/40 underline-offset-2 hover:decoration-secondary"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-secondary/50 pl-3 text-sm italic text-muted-foreground">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
  code: (props) => {
    const { children, className, ...rest } = props;
    const inline = "inline" in props && (props as { inline?: boolean }).inline;
    if (inline) {
      return (
        <code
          className="rounded-md border border-border bg-muted/80 px-1.5 py-0.5 font-mono text-[0.8125rem] text-foreground"
          {...rest}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={`block font-mono text-sm leading-relaxed text-foreground ${className ?? ""}`} {...rest}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-xl border border-border bg-muted/40 p-3 text-sm leading-relaxed last:mb-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[280px] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border bg-muted/50">{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</th>
  ),
  td: ({ children }) => <td className="border-t border-border/80 px-3 py-2 text-foreground/90">{children}</td>,
};

export function CopilotMarkdown({ content }: { content: string }) {
  if (!content.trim()) {
    return <span className="text-muted-foreground">…</span>;
  }
  return (
    <div className="copilot-markdown max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

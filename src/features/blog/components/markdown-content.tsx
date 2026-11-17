import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/features/blog/components/code-block";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-od max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-10 text-3xl font-semibold tracking-tight first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 text-2xl font-semibold tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-xl font-medium tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
              {children}
            </ol>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline-offset-4 hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const text = String(children).replace(/\n$/, "");
            const isBlock = Boolean(className) || text.includes("\n");
            if (!isBlock) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            const language = className?.replace("language-", "") ?? "text";
            return <CodeBlock code={text} language={language} />;
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

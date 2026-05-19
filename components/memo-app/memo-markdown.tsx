"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MemoMarkdownProps = {
  markdown: string;
  className?: string;
};

export function MemoMarkdown({ markdown, className }: MemoMarkdownProps) {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return (
      <p className="text-muted-foreground text-xs leading-relaxed">
        미리보기: 마크다운으로 작성하면 제목·목록·링크·표 등이 자동으로
        스타일됩니다.
      </p>
    );
  }

  return (
    <div
      className={`memo-md text-foreground text-sm leading-relaxed ${className ?? ""}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => (
            <pre className="bg-muted my-2 overflow-x-auto rounded-md border p-2 text-xs">
              {children}
            </pre>
          ),
          img: (props) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...props}
              alt={props.alt ?? ""}
              className="my-2 max-h-28 max-w-full rounded-md border object-contain"
            />
          ),
          a: ({ className: aClass, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-primary font-medium underline underline-offset-2 ${aClass ?? ""}`}
            />
          ),
          code: ({ className: codeClass, children, ...props }) => {
            const isBlock = String(codeClass ?? "").includes("language-");
            if (isBlock) {
              return (
                <code
                  {...props}
                  className={`font-mono text-xs ${codeClass ?? ""}`}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                {...props}
                className="bg-muted rounded px-1 py-0.5 font-mono text-[0.8em]"
              >
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

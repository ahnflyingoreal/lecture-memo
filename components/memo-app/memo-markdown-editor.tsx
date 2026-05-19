"use client";

import { useCallback, useMemo, useRef } from "react";
import { MemoMarkdown } from "@/components/memo-app/memo-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";

type MemoMarkdownEditorProps = {
  value: string;
  onChange: (v: string) => void;
};

const TOOLBAR = [
  { icon: Bold, label: "굵게", before: "**", after: "**" },
  { icon: Italic, label: "기울임", before: "*", after: "*" },
  { icon: Strikethrough, label: "취소선", before: "~~", after: "~~" },
  { icon: Link2, label: "링크", before: "[", after: "](https://)" },
  { icon: Heading2, label: "제목", before: "## ", after: "" },
  { icon: List, label: "목록", before: "- ", after: "" },
  { icon: ListOrdered, label: "번호", before: "1. ", after: "" },
  { icon: Quote, label: "인용", before: "> ", after: "" },
] as const;

export function MemoMarkdownEditor({ value, onChange }: MemoMarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const lines = useMemo(() => {
    const n = value.split("\n").length;
    return Array.from({ length: Math.max(n, 12) }, (_, i) => i + 1);
  }, [value]);

  const applyFormat = useCallback(
    (before: string, after: string) => {
      const el = ref.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.slice(start, end);
      const wrapped = `${before}${selected || "텍스트"}${after}`;
      const next = value.slice(0, start) + wrapped + value.slice(end);
      onChange(next);
      const cursor = start + before.length + (selected || "텍스트").length;
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(cursor, cursor);
      });
    },
    [value, onChange],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border/80 flex flex-wrap gap-0.5 border-b bg-[var(--archive-wash)]/50 px-2 py-1.5">
        {TOOLBAR.map(({ icon: Icon, label, before, after }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={() => applyFormat(before, after)}
            aria-label={label}
          >
            <Icon className="size-3.5" />
          </Button>
        ))}
      </div>
      <div className="grid min-h-[min(32vh,360px)] flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="border-border/80 flex min-h-0 border-b lg:border-r lg:border-b-0">
          <div className="archive-editor-lines border-border/60 hidden w-9 shrink-0 border-r py-3 pr-2 text-right sm:block">
            {lines.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </div>
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-0 flex-1 resize-none rounded-none border-0 bg-[#faf8f3] font-mono text-xs leading-relaxed shadow-none focus-visible:ring-0 sm:text-sm"
            spellCheck={false}
            placeholder="## 강의 핵심&#10;- 첫 번째 요점"
          />
        </div>
        <div className="flex min-h-0 flex-col bg-card p-4">
          <p className="archive-caption mb-2">Preview</p>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <MemoMarkdown markdown={value} />
          </div>
        </div>
      </div>
    </div>
  );
}

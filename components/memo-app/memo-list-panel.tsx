"use client";

import type { LectureMemo } from "@/lib/memos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Pin, ImageIcon, Plus } from "lucide-react";

type MemoListPanelProps = {
  className?: string;
  filtered: LectureMemo[];
  totalMemos: number;
  selectedId: string | null;
  onSelect: (m: LectureMemo) => void;
  onNew: () => void;
  formatDate: (ts: number) => string;
};

export function MemoListPanel({
  className,
  filtered,
  totalMemos,
  selectedId,
  onSelect,
  onNew,
  formatDate,
}: MemoListPanelProps) {
  return (
    <aside
      className={cn(
        "archive-panel archive-stagger-2 flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg",
        className,
      )}
    >
      <div className="border-border/80 flex shrink-0 items-center justify-between gap-2 border-b px-3 py-3">
        <div>
          <p className="archive-label">Index</p>
          <p className="font-heading text-sm font-semibold">
            기록 목록{" "}
            <span className="text-muted-foreground font-sans font-normal">
              {filtered.length}
            </span>
          </p>
        </div>
        <Button type="button" size="sm" className="h-8 gap-1 text-xs" onClick={onNew}>
          <Plus className="size-3.5" />
          새 기록
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <ul className="space-y-1 p-2">
          {filtered.length === 0 ? (
            <li className="text-muted-foreground px-3 py-10 text-center text-xs leading-relaxed">
              {totalMemos === 0 ? (
                <>
                  아직 기록이 없습니다.
                  <br />
                  <span className="text-primary">새 기록</span>으로 첫 강의를
                  남겨 보세요.
                </>
              ) : (
                "검색 결과가 없습니다."
              )}
            </li>
          ) : (
            filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  data-active={m.id === selectedId}
                  onClick={() => onSelect(m)}
                  className={cn(
                    "archive-index-item flex w-full gap-2 rounded-md px-2 py-2 text-left transition-colors",
                    m.id === selectedId
                      ? "bg-accent/90 shadow-sm"
                      : "hover:bg-muted/70",
                  )}
                >
                  <div
                    className={cn(
                      "relative size-10 shrink-0 overflow-hidden rounded-sm ring-1",
                      m.id === selectedId
                        ? "ring-primary/40"
                        : "ring-border/60",
                    )}
                  >
                    {m.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.images[0]}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex size-full items-center justify-center">
                        <ImageIcon className="text-muted-foreground size-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-start gap-1">
                      {m.pinned && (
                        <Pin
                          className="mt-0.5 size-3 shrink-0 text-primary"
                          aria-label="고정됨"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-heading truncate text-sm leading-tight font-medium">
                          {m.title}
                        </div>
                        <div className="text-muted-foreground truncate font-mono text-[10px]">
                          {m.organization || "—"}
                          {m.sessionDate ? ` · ${m.sessionDate}` : ""}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <span className="text-muted-foreground text-[10px]">
                            {formatDate(m.updatedAt)}
                          </span>
                          {m.topic && (
                            <Badge
                              variant="outline"
                              className="border-secondary/40 text-secondary-foreground h-4 px-1 text-[9px]"
                            >
                              {m.topic}
                            </Badge>
                          )}
                          {m.images.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="h-4 px-1 text-[9px]"
                            >
                              {m.images.length}장
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </ScrollArea>
    </aside>
  );
}

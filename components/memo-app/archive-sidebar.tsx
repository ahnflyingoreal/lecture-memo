"use client";

import type { LectureMemo } from "@/lib/memos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Download,
  HardDriveUpload,
  Plus,
  Search,
  TreeDeciduous,
  Upload,
} from "lucide-react";

type ArchiveSidebarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  filtered: LectureMemo[];
  totalMemos: number;
  selectedId: string | null;
  onSelect: (m: LectureMemo) => void;
  onNew: () => void;
  onExport: () => void;
  onImportPick: () => void;
  onImportLocalStorage?: () => void;
  listLimit?: number;
  onShowMore?: () => void;
};

function memoSerial(index: number): string {
  return String(index + 1).padStart(3, "0");
}

export function ArchiveSidebar({
  search,
  onSearchChange,
  filtered,
  totalMemos,
  selectedId,
  onSelect,
  onNew,
  onExport,
  onImportPick,
  onImportLocalStorage,
  listLimit = 12,
  onShowMore,
}: ArchiveSidebarProps) {
  const visible = filtered.slice(0, listLimit);
  const hasMore = filtered.length > listLimit;

  return (
    <aside className="archive-sidebar">
      <div className="flex flex-col gap-5 px-5 pt-10 pb-4 pl-9">
        <div className="flex items-center gap-2">
          <TreeDeciduous
            className="size-5 shrink-0 text-[var(--archive-green)]"
            strokeWidth={1.5}
          />
          <span className="archive-caption text-[11px] tracking-[0.28em]">
            Field Archive
          </span>
        </div>

        <div>
          <h1 className="archive-title-serif text-[2rem] leading-[1.15] font-semibold">
            강의 기록실
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            외부에서 들은 강의의 통찰과 지식을
            <br />
            한 권의 아카이브처럼 남깁니다.
          </p>
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="기록 검색…"
            className="h-8 border-border/80 bg-card/70 pl-8 text-xs"
            aria-label="검색"
          />
        </div>
      </div>

      <div className="border-border/80 flex items-center justify-between border-y px-5 py-2.5">
        <span className="archive-caption">Index</span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 gap-1 border-dashed text-xs"
          onClick={onNew}
        >
          <Plus className="size-3.5" />
          새 메모
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <ul className="space-y-0.5 p-2">
          {visible.length === 0 ? (
            <li className="text-muted-foreground px-3 py-8 text-center text-xs leading-relaxed">
              {totalMemos === 0
                ? "첫 강의 기록을 남겨 보세요."
                : "검색 결과가 없습니다."}
            </li>
          ) : (
            visible.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onSelect(m)}
                  className={cn(
                    "flex w-full gap-2.5 rounded-md px-2 py-2.5 text-left transition-colors",
                    m.id === selectedId
                      ? "archive-index-active"
                      : "hover:bg-card/60",
                  )}
                >
                  <div className="size-11 shrink-0 overflow-hidden rounded-sm border border-border/60 bg-muted">
                    {m.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.images[0]}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex size-full items-center justify-center text-[9px]">
                        —
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-foreground truncate text-sm leading-tight font-medium">
                      {memoSerial(i)}. {m.title || "제목 없음"}
                    </p>
                    <p className="text-muted-foreground mt-0.5 font-mono text-[10px]">
                      {m.sessionDate || "날짜 미정"} ·{" "}
                      {m.organization || "기관 미입력"}
                    </p>
                    {m.topic && (
                      <span className="archive-tag mt-1.5 inline-block">
                        {m.topic}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </ScrollArea>

      {hasMore && onShowMore && (
        <div className="border-border/80 border-t px-4 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-8 w-full text-xs"
            onClick={onShowMore}
          >
            더 많은 메모 보기 ({filtered.length - listLimit}건)
          </Button>
        </div>
      )}

      <div className="border-border/80 mt-auto flex flex-wrap gap-1.5 border-t p-3">
        {onImportLocalStorage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 flex-1 text-[10px]"
            onClick={onImportLocalStorage}
          >
            <HardDriveUpload className="size-3" />
            로컬
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 flex-1 text-[10px]"
          onClick={onExport}
        >
          <Download className="size-3" />
          보내기
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 flex-1 text-[10px]"
          onClick={onImportPick}
        >
          <Upload className="size-3" />
          가져오기
        </Button>
      </div>
    </aside>
  );
}

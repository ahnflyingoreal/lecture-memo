"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, HardDriveUpload, Search, Upload } from "lucide-react";

type MemoAppHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onImportPick: () => void;
  onImportLocalStorage?: () => void;
  memoCount?: number;
};

export function MemoAppHeader({
  search,
  onSearchChange,
  onExport,
  onImportPick,
  onImportLocalStorage,
  memoCount = 0,
}: MemoAppHeaderProps) {
  return (
    <header className="archive-enter archive-stagger-1 relative z-10 shrink-0 pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2 sm:max-w-md">
          <p className="archive-label">Field Archive · 외부 강의</p>
          <h1 className="font-heading text-foreground text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            강의
            <span className="text-primary"> 기록</span>
            <span className="text-muted-foreground font-normal">실</span>
          </h1>
          <div className="archive-rule w-full max-w-xs" aria-hidden />
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            기관·일자·현장 사진과 마크다운 메모를 한 권의 아카이브처럼 정리합니다.
            {memoCount > 0 && (
              <span className="text-foreground font-medium">
                {" "}
                · 기록 {memoCount}건
              </span>
            )}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[280px]">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              id="memo-search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="제목, 기관, 주제, 본문…"
              className="h-9 border-border/80 bg-card/80 pl-9 text-sm shadow-sm"
              aria-label="메모 검색"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {onImportLocalStorage && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 text-xs"
                onClick={onImportLocalStorage}
              >
                <HardDriveUpload className="size-3.5" data-icon="inline-start" />
                예전 로컬
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-border/80 bg-card/60 text-xs"
              onClick={onExport}
            >
              <Download className="size-3.5" data-icon="inline-start" />
              보내기
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-border/80 bg-card/60 text-xs"
              onClick={onImportPick}
            >
              <Upload className="size-3.5" data-icon="inline-start" />
              가져오기
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

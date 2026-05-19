"use client";

import type { LectureMemo } from "@/lib/memos";
import { MemoMarkdownEditor } from "@/components/memo-app/memo-markdown-editor";
import { MemoPolaroid } from "@/components/memo-app/memo-polaroid";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ExternalLink,
  MapPin,
  Pin,
  Trash2,
  Users,
} from "lucide-react";

type Draft = Omit<LectureMemo, "id" | "createdAt" | "updatedAt">;

type MemoEditorPanelProps = {
  serial: string;
  draft: Draft;
  patchDraft: (p: Partial<Draft>) => void;
  tab: "editor" | "info";
  onTabChange: (t: "editor" | "info") => void;
  activeSrc?: string;
  safeCarouselIndex: number;
  addingImages: boolean;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onCarouselPrev: () => void;
  onCarouselNext: () => void;
  onCarouselSelect: (i: number) => void;
  onRemoveImage: (i: number) => void;
  onPickImages: () => void;
  onImageFiles: (files: FileList | null) => void;
  onSave: () => void;
  onPin: () => void;
  onDelete?: () => void;
  onOpenLink: () => void;
  isEditing: boolean;
};

export function MemoEditorPanel({
  serial,
  draft,
  patchDraft,
  tab,
  onTabChange,
  activeSrc,
  safeCarouselIndex,
  addingImages,
  imageInputRef,
  onCarouselPrev,
  onCarouselNext,
  onCarouselSelect,
  onRemoveImage,
  onPickImages,
  onImageFiles,
  onSave,
  onPin,
  onDelete,
  onOpenLink,
  isEditing,
}: MemoEditorPanelProps) {
  const tags = [draft.topic, draft.organization]
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="archive-sheet">
      <div className="border-border/80 flex shrink-0 flex-wrap items-start justify-between gap-4 border-b px-6 py-5">
        <div className="min-w-0 flex-1">
          <p className="archive-caption mb-1">
            Lecture Memo · {serial}
          </p>
          <Input
            value={draft.title}
            onChange={(e) => patchDraft({ title: e.target.value })}
            placeholder="강의 제목"
            className="font-heading h-auto border-0 bg-transparent p-0 text-2xl font-semibold shadow-none focus-visible:ring-0 sm:text-3xl"
          />
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs"
            onClick={onPin}
          >
            <Pin className="size-3.5" />
            보관하기
          </Button>
          <Button
            type="button"
            size="sm"
            className="btn-archive-save h-9 gap-1.5 px-5 text-xs"
            onClick={onSave}
          >
            저장하기
          </Button>
        </div>
      </div>

      <div className="border-border/80 flex shrink-0 flex-wrap gap-6 border-b px-6 py-4">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetaField
            icon={Calendar}
            label="날짜"
            type="date"
            value={draft.sessionDate}
            onChange={(v) => patchDraft({ sessionDate: v })}
          />
          <MetaField
            icon={Users}
            label="강사·기관"
            value={draft.organization}
            onChange={(v) => patchDraft({ organization: v })}
            placeholder="기관명"
          />
          <MetaField
            icon={MapPin}
            label="장소·챕터"
            value={draft.positionNote}
            onChange={(v) => patchDraft({ positionNote: v })}
            placeholder="장소 또는 구간"
          />
          <div className="space-y-1">
            <Label className="archive-caption text-[9px]">과정·주제</Label>
            <Input
              value={draft.topic}
              onChange={(e) => patchDraft({ topic: e.target.value })}
              placeholder="과정명"
              className="h-8 text-xs"
            />
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.length ? (
                tags.map((t) => (
                  <span key={t} className="archive-tag">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-[10px]">
                  태그 없음
                </span>
              )}
            </div>
          </div>
        </div>

        <MemoPolaroid
          captionTitle={draft.title || "새 기록"}
          sessionDate={draft.sessionDate || "날짜 미정"}
          locationNote={draft.positionNote}
          images={draft.images}
          safeIndex={safeCarouselIndex}
          activeSrc={activeSrc}
          addingImages={addingImages}
          onPrev={onCarouselPrev}
          onNext={onCarouselNext}
          onSelect={onCarouselSelect}
          onRemove={onRemoveImage}
          onPick={onPickImages}
          imageInputRef={imageInputRef}
          onFiles={onImageFiles}
        />
      </div>

      <div className="border-border/80 flex shrink-0 gap-6 border-b px-6">
        <button
          type="button"
          onClick={() => onTabChange("editor")}
          className={cn(
            "py-3 text-sm transition-colors",
            tab === "editor"
              ? "archive-tab-active"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          에디터
        </button>
        <button
          type="button"
          onClick={() => onTabChange("info")}
          className={cn(
            "py-3 text-sm transition-colors",
            tab === "info"
              ? "archive-tab-active"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          정보
        </button>
        {isEditing && onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive ml-auto h-8 text-xs"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" />
            삭제
          </Button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === "editor" ? (
          <MemoMarkdownEditor
            value={draft.content}
            onChange={(v) => patchDraft({ content: v })}
          />
        ) : (
          <div className="grid gap-4 overflow-y-auto p-6 sm:grid-cols-2">
            <InfoBlock label="참석 인원" value={draft.attendeeCount} />
            <InfoBlock label="강의 URL">
              <div className="flex gap-2">
                <Input
                  value={draft.lectureUrl}
                  onChange={(e) =>
                    patchDraft({ lectureUrl: e.target.value })
                  }
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenLink}
                >
                  <ExternalLink className="size-3.5" />
                </Button>
              </div>
            </InfoBlock>
            <InfoBlock label="참고사항" wide>
              <Textarea
                value={draft.remarks}
                onChange={(e) => patchDraft({ remarks: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </InfoBlock>
            <InfoBlock label="기타" wide>
              <Textarea
                value={draft.misc}
                onChange={(e) => patchDraft({ misc: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </InfoBlock>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="pinned"
                checked={draft.pinned}
                onCheckedChange={(v) => patchDraft({ pinned: Boolean(v) })}
              />
              <Label htmlFor="pinned" className="text-sm font-normal">
                목록 상단 고정
              </Label>
            </div>
          </div>
        )}
      </div>

      <footer className="border-border/80 shrink-0 border-t px-6 py-5">
        <p className="archive-footer-quote">
          기록은 사라지지 않습니다. 다른 시간의 나를 위한 선물입니다.
        </p>
      </footer>
    </div>
  );
}

function MetaField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="archive-caption flex items-center gap-1 text-[9px]">
        <Icon className="size-3 opacity-60" />
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-xs"
      />
    </div>
  );
}

function InfoBlock({
  label,
  value,
  children,
  wide,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("space-y-1", wide && "sm:col-span-2")}>
      <Label className="archive-caption text-[9px]">{label}</Label>
      {children ??
        (value ? (
          <p className="text-sm">{value}</p>
        ) : (
          <p className="text-muted-foreground text-sm">—</p>
        ))}
    </div>
  );
}

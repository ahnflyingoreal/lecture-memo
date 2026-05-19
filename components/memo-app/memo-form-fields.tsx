"use client";

import type { LectureMemo } from "@/lib/memos";
import { MemoMarkdown } from "@/components/memo-app/memo-markdown";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type Draft = Omit<LectureMemo, "id" | "createdAt" | "updatedAt">;

type MemoFormFieldsProps = {
  draft: Draft;
  patchDraft: (p: Partial<Draft>) => void;
};

export function MemoFormFields({ draft, patchDraft }: MemoFormFieldsProps) {
  return (
    <div className="grid min-h-0 gap-4 sm:grid-cols-6">
      <div className="sm:col-span-6">
        <p className="archive-label mb-3">기록 양식</p>
      </div>

      <div className="space-y-1.5 sm:col-span-4">
        <Label htmlFor="memo-title" className="font-mono text-[10px] uppercase tracking-wider">
          강의 제목 <span className="text-primary">*</span>
        </Label>
        <Input
          id="memo-title"
          value={draft.title}
          onChange={(e) => patchDraft({ title: e.target.value })}
          placeholder="예: 데이터 거버넌스 워크숍"
          className="font-heading h-9 border-border/80 bg-card/50 text-base"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="memo-date" className="font-mono text-[10px] uppercase tracking-wider">
          강의 날짜
        </Label>
        <Input
          id="memo-date"
          type="date"
          value={draft.sessionDate}
          onChange={(e) => patchDraft({ sessionDate: e.target.value })}
          className="h-9 border-border/80 bg-card/50 font-mono text-sm"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-3">
        <Label htmlFor="memo-org" className="font-mono text-[10px] uppercase tracking-wider">
          외부 강의 기관
        </Label>
        <Input
          id="memo-org"
          value={draft.organization}
          onChange={(e) => patchDraft({ organization: e.target.value })}
          placeholder="기관·회사명"
          className="h-8 border-border/80 bg-card/50 text-sm"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="memo-topic" className="font-mono text-[10px] uppercase tracking-wider">
          주제
        </Label>
        <Input
          id="memo-topic"
          value={draft.topic}
          onChange={(e) => patchDraft({ topic: e.target.value })}
          placeholder="차시 주제"
          className="h-8 border-border/80 bg-card/50 text-sm"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-1">
        <Label htmlFor="memo-attendees" className="font-mono text-[10px] uppercase tracking-wider">
          참석
        </Label>
        <Input
          id="memo-attendees"
          value={draft.attendeeCount}
          onChange={(e) => patchDraft({ attendeeCount: e.target.value })}
          placeholder="12명"
          className="h-8 border-border/80 bg-card/50 text-sm"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-3">
        <Label htmlFor="memo-url" className="font-mono text-[10px] uppercase tracking-wider">
          강의 URL
        </Label>
        <Input
          id="memo-url"
          value={draft.lectureUrl}
          onChange={(e) => patchDraft({ lectureUrl: e.target.value })}
          placeholder="https://…"
          className="h-8 border-border/80 bg-card/50 font-mono text-sm"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-3">
        <Label htmlFor="memo-position" className="font-mono text-[10px] uppercase tracking-wider">
          재생 위치·챕터
        </Label>
        <Input
          id="memo-position"
          value={draft.positionNote}
          onChange={(e) => patchDraft({ positionNote: e.target.value })}
          placeholder="12:34, 3강"
          className="h-8 border-border/80 bg-card/50 font-mono text-sm"
        />
      </div>

      <div className="space-y-1.5 sm:col-span-3">
        <Label htmlFor="memo-remarks" className="font-mono text-[10px] uppercase tracking-wider">
          참고사항
        </Label>
        <Textarea
          id="memo-remarks"
          value={draft.remarks}
          onChange={(e) => patchDraft({ remarks: e.target.value })}
          rows={2}
          placeholder="자료 링크, 사전 과제 등"
          className="min-h-0 resize-none border-border/80 bg-card/50 text-sm"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-3">
        <Label htmlFor="memo-misc" className="font-mono text-[10px] uppercase tracking-wider">
          기타
        </Label>
        <Textarea
          id="memo-misc"
          value={draft.misc}
          onChange={(e) => patchDraft({ misc: e.target.value })}
          rows={2}
          placeholder="비용, 담당자, 후속 일정"
          className="min-h-0 resize-none border-border/80 bg-card/50 text-sm"
        />
      </div>

      <Separator className="sm:col-span-6" />

      <div className="flex min-h-0 flex-col gap-3 sm:col-span-6 lg:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-1.5">
          <Label htmlFor="memo-content" className="font-mono text-[10px] uppercase tracking-wider">
            수업 메모 · 마크다운
          </Label>
          <Textarea
            id="memo-content"
            value={draft.content}
            onChange={(e) => patchDraft({ content: e.target.value })}
            placeholder={"## 핵심\n- 요점\n\n> 인용"}
            className="font-mono min-h-[min(24vh,220px)] flex-1 resize-none border-border/80 bg-[oklch(0.97_0.01_85)] text-xs leading-relaxed shadow-inner sm:text-sm"
            spellCheck={false}
          />
        </div>
        <div className="border-border/80 bg-card/90 ring-border/50 flex min-h-[min(24vh,220px)] min-w-0 flex-1 flex-col rounded-md border p-3 shadow-sm ring-1 lg:max-w-[48%]">
          <p className="archive-label mb-2">미리보기</p>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <MemoMarkdown markdown={draft.content} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-dashed border-border/60 pt-3 sm:col-span-6">
        <Checkbox
          id="memo-pinned"
          checked={draft.pinned}
          onCheckedChange={(v) => patchDraft({ pinned: Boolean(v) })}
        />
        <Label htmlFor="memo-pinned" className="text-muted-foreground text-xs font-normal">
          목록 상단에 고정
        </Label>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Plus,
  X,
} from "lucide-react";

const MAX_IMAGES = 8;

type MemoPolaroidProps = {
  captionTitle: string;
  sessionDate: string;
  locationNote: string;
  images: string[];
  safeIndex: number;
  activeSrc?: string;
  addingImages: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  onRemove: (i: number) => void;
  onPick: () => void;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onFiles: (files: FileList | null) => void;
};

export function MemoPolaroid({
  captionTitle,
  sessionDate,
  locationNote,
  images,
  safeIndex,
  activeSrc,
  addingImages,
  onPrev,
  onNext,
  onSelect,
  onRemove,
  onPick,
  imageInputRef,
  onFiles,
}: MemoPolaroidProps) {
  return (
    <div className="shrink-0">
      <div className="archive-polaroid w-[min(100%,220px)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#2a2622]">
          {activeSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeSrc} alt="" className="size-full object-cover" />
          ) : (
            <button
              type="button"
              onClick={onPick}
              disabled={addingImages}
              className="flex size-full flex-col items-center justify-center gap-2 text-white/50 hover:text-white/80 disabled:opacity-50"
            >
              <ImagePlus className="size-10" strokeWidth={1.25} />
              <span className="font-mono text-[10px]">사진 붙이기</span>
            </button>
          )}
          {images.length > 1 && (
            <>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute left-1 top-1/2 size-7 -translate-y-1/2 rounded-full bg-black/40 text-white"
                onClick={onPrev}
                aria-label="이전"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-full bg-black/40 text-white"
                onClick={onNext}
                aria-label="다음"
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          )}
        </div>
        <p className="font-heading mt-3 text-center text-sm leading-snug text-[var(--archive-brown)]">
          {captionTitle.slice(0, 24)}
        </p>
        <p className="text-muted-foreground text-center font-mono text-[10px] italic">
          {sessionDate}
          {locationNote ? ` · ${locationNote}` : ""}
        </p>
      </div>

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {images.map((src, i) => (
            <div key={`${i}-${src.slice(0, 16)}`} className="relative">
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={cn(
                  "block size-10 overflow-hidden rounded border",
                  i === safeIndex && "ring-2 ring-[var(--archive-red)]",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[var(--archive-red)] text-[10px] text-white"
                aria-label="삭제"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10 border-dashed"
              onClick={onPick}
              disabled={addingImages}
            >
              <Plus className="size-4" />
            </Button>
          )}
        </div>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}

export { MAX_IMAGES };

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

type MemoImageCardProps = {
  igHeader: string;
  sessionDateLabel: string;
  imageCount: number;
  images: string[];
  safeCarouselIndex: number;
  activeSrc: string | undefined;
  addingImages: boolean;
  onCarouselPrev: () => void;
  onCarouselNext: () => void;
  onDotClick: (index: number) => void;
  onThumbClick: (index: number) => void;
  onRemoveImage: (index: number) => void;
  onPickImages: () => void;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onImageInputChange: (files: FileList | null) => void;
};

export function MemoImageCard({
  igHeader,
  sessionDateLabel,
  imageCount,
  images,
  safeCarouselIndex,
  activeSrc,
  addingImages,
  onCarouselPrev,
  onCarouselNext,
  onDotClick,
  onThumbClick,
  onRemoveImage,
  onPickImages,
  imageInputRef,
  onImageInputChange,
}: MemoImageCardProps) {
  return (
    <div className="w-full max-w-sm shrink-0">
      <p className="archive-label mb-2">현장 기록</p>
      <div className="archive-polaroid">
        <div className="border-border/60 mb-2 flex items-baseline justify-between gap-2 border-b border-dashed pb-2">
          <div className="min-w-0">
            <p className="font-heading truncate text-sm font-semibold">
              {igHeader}
            </p>
            <p className="text-muted-foreground font-mono text-[10px]">
              {sessionDateLabel}
              {imageCount > 0 ? ` · ${imageCount}컷` : ""}
            </p>
          </div>
          <span className="text-primary font-mono text-[9px] tracking-widest">
            No.{String(safeCarouselIndex + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-[oklch(0.18_0.02_55)]">
          {activeSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeSrc}
              alt=""
              className="size-full object-contain"
            />
          ) : (
            <button
              type="button"
              onClick={onPickImages}
              disabled={addingImages}
              className="flex size-full flex-col items-center justify-center gap-2 text-[oklch(0.75_0.02_85)] transition-colors hover:text-[oklch(0.92_0.01_90)] disabled:opacity-50"
            >
              <ImagePlus className="size-10 opacity-90" strokeWidth={1.25} />
              <span className="font-mono text-xs tracking-wide">
                {addingImages ? "처리 중…" : "사진 붙이기"}
              </span>
            </button>
          )}

          {images.length > 1 && (
            <>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="이전 사진"
                onClick={onCarouselPrev}
                className="absolute left-1 top-1/2 size-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="다음 사진"
                onClick={onCarouselNext}
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="size-4" />
              </Button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1}번째 사진`}
                    onClick={() => onDotClick(i)}
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      i === safeCarouselIndex
                        ? "bg-white"
                        : "bg-white/35 hover:bg-white/60",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {images.length > 0 && (
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <div key={`${i}-${src.slice(0, 24)}`} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => onThumbClick(i)}
                  className={cn(
                    "block overflow-hidden rounded-sm ring-1",
                    i === safeCarouselIndex
                      ? "ring-primary ring-offset-2 ring-offset-card"
                      : "ring-border/50 opacity-80 hover:opacity-100",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="size-12 object-cover" />
                </button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="destructive"
                  className="absolute -right-1 -top-1 size-4 rounded-full p-0"
                  aria-label="사진 삭제"
                  onClick={() => onRemoveImage(i)}
                >
                  <X className="size-2.5" />
                </Button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-12 shrink-0 rounded-sm border-dashed"
                onClick={onPickImages}
                disabled={addingImages}
                aria-label="사진 추가"
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
          onChange={(e) => onImageInputChange(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 h-8 w-full border-dashed text-xs"
          onClick={onPickImages}
          disabled={addingImages || images.length >= MAX_IMAGES}
        >
          {images.length >= MAX_IMAGES
            ? `한도 ${MAX_IMAGES}장`
            : addingImages
              ? "처리 중…"
              : "갤러리에서 추가"}
        </Button>
      </div>
    </div>
  );
}

export { MAX_IMAGES };

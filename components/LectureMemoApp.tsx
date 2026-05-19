"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  deleteMemoFromDb,
  fetchMemosFromDb,
  mergeMemosIntoDb,
  upsertMemoInDb,
} from "@/app/actions/memos";
import {
  type LectureMemo,
  createMemoId,
  exportMemosJson,
  importMemosJson,
  loadMemos,
  sortMemos,
} from "@/lib/memos";
import { fileToResizedJpegDataUrl } from "@/lib/imageResize";
import { ArchiveSidebar } from "@/components/memo-app/archive-sidebar";
import { MemoEditorPanel } from "@/components/memo-app/memo-editor-panel";
import { MAX_IMAGES } from "@/components/memo-app/memo-polaroid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function emptyForm(): Omit<LectureMemo, "id" | "createdAt" | "updatedAt"> {
  return {
    title: "",
    lectureUrl: "",
    content: "",
    positionNote: "",
    pinned: false,
    organization: "",
    sessionDate: "",
    attendeeCount: "",
    topic: "",
    remarks: "",
    misc: "",
    images: [],
  };
}

export default function LectureMemoApp() {
  const [memos, setMemos] = useState<LectureMemo[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyForm());
  const [isEditing, setIsEditing] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [addingImages, setAddingImages] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<LectureMemo[] | null>(
    null,
  );
  const [tab, setTab] = useState<"editor" | "info">("editor");
  const [listLimit, setListLimit] = useState(12);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef(draft);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const refreshFromDb = useCallback(async () => {
    try {
      const list = await fetchMemosFromDb();
      setMemos(sortMemos(list));
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "메모를 불러오지 못했습니다.",
      );
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await refreshFromDb();
      setHydrated(true);
    })();
  }, [refreshFromDb]);

  const sorted = useMemo(() => sortMemos(memos), [memos]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((m) => {
      const hay = [
        m.title,
        m.content,
        m.lectureUrl,
        m.positionNote,
        m.organization,
        m.sessionDate,
        m.attendeeCount,
        m.topic,
        m.remarks,
        m.misc,
      ]
        .join("\n")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [sorted, search]);

  const selected = useMemo(
    () => memos.find((m) => m.id === selectedId) ?? null,
    [memos, selectedId],
  );

  const serial = useMemo(() => {
    const idx = filtered.findIndex((m) => m.id === selectedId);
    const n = idx >= 0 ? idx + 1 : filtered.length + 1;
    return String(n).padStart(3, "0");
  }, [filtered, selectedId]);

  const imageCount = draft.images.length;
  const safeCarouselIndex = useMemo(
    () => (imageCount === 0 ? 0 : Math.min(carouselIndex, imageCount - 1)),
    [imageCount, carouselIndex],
  );
  const activeSrc = draft.images[safeCarouselIndex];

  const resetForm = useCallback(() => {
    setDraft(emptyForm());
    setIsEditing(false);
    setSelectedId(null);
    setCarouselIndex(0);
    setTab("editor");
  }, []);

  const openNew = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const openMemo = useCallback((m: LectureMemo) => {
    setSelectedId(m.id);
    setDraft({
      title: m.title,
      lectureUrl: m.lectureUrl,
      content: m.content,
      positionNote: m.positionNote,
      pinned: m.pinned,
      organization: m.organization,
      sessionDate: m.sessionDate,
      attendeeCount: m.attendeeCount,
      topic: m.topic,
      remarks: m.remarks,
      misc: m.misc,
      images: [...m.images],
    });
    setIsEditing(true);
    setCarouselIndex(0);
    setTab("editor");
  }, []);

  const patchDraft = useCallback(
    (p: Partial<Omit<LectureMemo, "id" | "createdAt" | "updatedAt">>) => {
      setDraft((d) => ({ ...d, ...p }));
    },
    [],
  );

  const addImagesFromFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      toast.error("이미지 파일만 추가할 수 있습니다.");
      return;
    }
    setAddingImages(true);
    try {
      const room = MAX_IMAGES - draftRef.current.images.length;
      if (room <= 0) {
        toast.error(`이미지는 최대 ${MAX_IMAGES}장까지 넣을 수 있습니다.`);
        return;
      }
      const urls: string[] = [];
      for (const file of list.slice(0, room)) {
        if (urls.length >= room) break;
        try {
          urls.push(await fileToResizedJpegDataUrl(file));
        } catch {
          toast.error(`처리하지 못한 파일: ${file.name}`);
        }
      }
      if (urls.length) {
        setDraft((d) => ({
          ...d,
          images: [...d.images, ...urls].slice(0, MAX_IMAGES),
        }));
      }
    } finally {
      setAddingImages(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }, []);

  const removeImageAt = useCallback((index: number) => {
    setDraft((d) => ({
      ...d,
      images: d.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    const title = draft.title.trim();
    if (!title) {
      toast.error("강의 제목을 입력해 주세요.");
      return;
    }
    const now = Date.now();
    const payload = {
      ...draft,
      title,
      lectureUrl: draft.lectureUrl.trim(),
      content: draft.content,
      positionNote: draft.positionNote.trim(),
      organization: draft.organization.trim(),
      sessionDate: draft.sessionDate,
      attendeeCount: draft.attendeeCount.trim(),
      topic: draft.topic.trim(),
      remarks: draft.remarks,
      misc: draft.misc,
      images: draft.images,
    };
    try {
      if (isEditing && selectedId) {
        const prev = memos.find((m) => m.id === selectedId);
        await upsertMemoInDb({
          id: selectedId,
          ...payload,
          createdAt: prev?.createdAt ?? now,
          updatedAt: now,
        });
        toast.success("저장했습니다.");
      } else {
        const id = createMemoId();
        await upsertMemoInDb({
          id,
          ...payload,
          createdAt: now,
          updatedAt: now,
        });
        setSelectedId(id);
        setIsEditing(true);
        toast.success("새 기록을 저장했습니다.");
      }
      await refreshFromDb();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "저장에 실패했습니다.");
    }
  }, [draft, isEditing, selectedId, memos, refreshFromDb]);

  const handlePin = useCallback(() => {
    patchDraft({ pinned: !draft.pinned });
    toast.message(draft.pinned ? "고정을 해제했습니다." : "목록 상단에 고정합니다.");
  }, [draft.pinned, patchDraft]);

  const confirmDelete = useCallback(async () => {
    if (!selectedId) return;
    try {
      await deleteMemoFromDb(selectedId);
      resetForm();
      setDeleteOpen(false);
      await refreshFromDb();
      toast.success("기록을 삭제했습니다.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  }, [selectedId, resetForm, refreshFromDb]);

  const handleExport = useCallback(() => {
    const blob = new Blob([exportMemosJson(memos)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lecture-memos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON 파일을 내려받았습니다.");
  }, [memos]);

  const handleImportFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      setPendingImport(importMemosJson(text));
      setImportOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "가져오기에 실패했습니다.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const confirmImport = useCallback(async () => {
    if (!pendingImport?.length) {
      setImportOpen(false);
      setPendingImport(null);
      return;
    }
    try {
      await mergeMemosIntoDb(pendingImport);
      toast.success(`${pendingImport.length}개 기록을 합쳤습니다.`);
      setImportOpen(false);
      setPendingImport(null);
      await refreshFromDb();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "합치기에 실패했습니다.");
    }
  }, [pendingImport, refreshFromDb]);

  const handleImportLocalStorage = useCallback(async () => {
    const legacy = loadMemos();
    if (!legacy.length) {
      toast.message("브라우저에 예전 로컬 메모가 없습니다.");
      return;
    }
    try {
      await mergeMemosIntoDb(legacy);
      toast.success(`로컬 ${legacy.length}개를 DB에 합쳤습니다.`);
      await refreshFromDb();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "가져오기에 실패했습니다.");
    }
  }, [refreshFromDb]);

  const openLecture = useCallback(() => {
    const url = draft.lectureUrl.trim();
    if (!url) {
      toast.error("강의 URL이 비어 있습니다.");
      return;
    }
    let href = url;
    if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }, [draft.lectureUrl]);

  const onCarouselPrev = useCallback(() => {
    setCarouselIndex((i) => {
      const n = draftRef.current.images.length;
      if (n <= 1) return 0;
      const cur = Math.min(i, n - 1);
      return cur <= 0 ? n - 1 : cur - 1;
    });
  }, []);

  const onCarouselNext = useCallback(() => {
    setCarouselIndex((i) => {
      const n = draftRef.current.images.length;
      if (n <= 1) return 0;
      const cur = Math.min(i, n - 1);
      return cur >= n - 1 ? 0 : cur + 1;
    });
  }, []);

  if (!hydrated) {
    return (
      <div className="archive-app items-center justify-center">
        <p className="archive-caption">기록실을 여는 중…</p>
      </div>
    );
  }

  return (
    <div className="archive-app">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleImportFile(f);
        }}
      />

      <ArchiveSidebar
        search={search}
        onSearchChange={setSearch}
        filtered={filtered}
        totalMemos={memos.length}
        selectedId={selectedId}
        onSelect={openMemo}
        onNew={openNew}
        onExport={handleExport}
        onImportPick={() => fileInputRef.current?.click()}
        onImportLocalStorage={handleImportLocalStorage}
        listLimit={listLimit}
        onShowMore={() => setListLimit((n) => n + 12)}
      />

      <main className="archive-main">
        <MemoEditorPanel
          serial={serial}
          draft={draft}
          patchDraft={patchDraft}
          tab={tab}
          onTabChange={setTab}
          activeSrc={activeSrc}
          safeCarouselIndex={safeCarouselIndex}
          addingImages={addingImages}
          imageInputRef={imageInputRef}
          onCarouselPrev={onCarouselPrev}
          onCarouselNext={onCarouselNext}
          onCarouselSelect={setCarouselIndex}
          onRemoveImage={removeImageAt}
          onPickImages={() => imageInputRef.current?.click()}
          onImageFiles={(files) => void addImagesFromFiles(files)}
          onSave={() => void handleSave()}
          onPin={handlePin}
          onDelete={isEditing && selected ? () => setDeleteOpen(true) : undefined}
          onOpenLink={openLecture}
          isEditing={isEditing}
        />
      </main>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>기록을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              SQLite에서 해당 기록이 제거됩니다. 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void confirmDelete()}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={importOpen}
        onOpenChange={(open) => {
          setImportOpen(open);
          if (!open) setPendingImport(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>가져온 기록을 합칠까요?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingImport
                ? `${pendingImport.length}개를 DB에 합칩니다.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmImport()}>
              합치기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

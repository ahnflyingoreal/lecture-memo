export type LectureMemo = {
  id: string;
  title: string;
  lectureUrl: string;
  content: string;
  /** 재생 위치·챕터 등 짧은 메모 (예: 12:34, 3강) */
  positionNote: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  /** 외부 강의 기관 */
  organization: string;
  /** 강의 일자 (YYYY-MM-DD) */
  sessionDate: string;
  /** 참석 인원 */
  attendeeCount: string;
  /** 주제 */
  topic: string;
  /** 참고사항 */
  remarks: string;
  /** 기타 */
  misc: string;
  /** 이미지 data URL (로컬 저장용, 용량 주의) */
  images: string[];
};

const STORAGE_KEY = "lecture-memos-v1";

function migrateRow(o: Record<string, unknown>): LectureMemo | null {
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  const imagesRaw = o.images;
  const images =
    Array.isArray(imagesRaw) &&
    imagesRaw.every((x): x is string => typeof x === "string")
      ? imagesRaw
      : [];
  return {
    id: o.id,
    title: o.title,
    lectureUrl: typeof o.lectureUrl === "string" ? o.lectureUrl : "",
    content: typeof o.content === "string" ? o.content : "",
    positionNote: typeof o.positionNote === "string" ? o.positionNote : "",
    pinned: typeof o.pinned === "boolean" ? o.pinned : false,
    createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
    updatedAt: typeof o.updatedAt === "number" ? o.updatedAt : Date.now(),
    organization: typeof o.organization === "string" ? o.organization : "",
    sessionDate: typeof o.sessionDate === "string" ? o.sessionDate : "",
    attendeeCount: typeof o.attendeeCount === "string" ? o.attendeeCount : "",
    topic: typeof o.topic === "string" ? o.topic : "",
    remarks: typeof o.remarks === "string" ? o.remarks : "",
    misc: typeof o.misc === "string" ? o.misc : "",
    images,
  };
}

export function loadMemos(): LectureMemo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) =>
        typeof x === "object" && x !== null
          ? migrateRow(x as Record<string, unknown>)
          : null,
      )
      .filter((m): m is LectureMemo => m !== null);
  } catch {
    return [];
  }
}

export function saveMemos(memos: LectureMemo[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

export function createMemoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function sortMemos(list: LectureMemo[]): LectureMemo[] {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}

export function exportMemosJson(memos: LectureMemo[]): string {
  return JSON.stringify(
    { version: 2, exportedAt: Date.now(), memos },
    null,
    2,
  );
}

export function importMemosJson(text: string): LectureMemo[] {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("잘못된 형식입니다.");
  }
  const o = parsed as Record<string, unknown>;
  const arr = Array.isArray(o.memos) ? o.memos : Array.isArray(parsed) ? parsed : null;
  if (!arr) throw new Error("memos 배열을 찾을 수 없습니다.");
  const memos = arr
    .map((x) =>
      typeof x === "object" && x !== null
        ? migrateRow(x as Record<string, unknown>)
        : null,
    )
    .filter((m): m is LectureMemo => m !== null);
  if (memos.length === 0) throw new Error("가져올 메모가 없습니다.");
  return memos;
}

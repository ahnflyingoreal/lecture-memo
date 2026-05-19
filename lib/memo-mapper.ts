import type { LectureMemo as MemoRow, Prisma } from "@prisma/client";
import type { LectureMemo } from "@/lib/memos";

function parseImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string");
}

export function rowToClient(row: MemoRow): LectureMemo {
  return {
    id: row.id,
    title: row.title,
    lectureUrl: row.lectureUrl,
    content: row.content,
    positionNote: row.positionNote,
    pinned: row.pinned,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
    organization: row.organization,
    sessionDate: row.sessionDate,
    attendeeCount: row.attendeeCount,
    topic: row.topic,
    remarks: row.remarks,
    misc: row.misc,
    images: parseImages(row.images),
  };
}

export function clientToCreateInput(
  m: LectureMemo,
): Prisma.LectureMemoUncheckedCreateInput {
  return {
    id: m.id,
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
    images: m.images as Prisma.InputJsonValue,
    createdAt: new Date(m.createdAt),
    updatedAt: new Date(m.updatedAt),
  };
}

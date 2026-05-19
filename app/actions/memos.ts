"use server";

import { prisma } from "@/lib/prisma";
import { clientToCreateInput, rowToClient } from "@/lib/memo-mapper";
import type { LectureMemo } from "@/lib/memos";

export async function fetchMemosFromDb(): Promise<LectureMemo[]> {
  const rows = await prisma.lectureMemo.findMany({
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });
  return rows.map(rowToClient);
}

export async function upsertMemoInDb(memo: LectureMemo): Promise<void> {
  const data = clientToCreateInput(memo);
  await prisma.lectureMemo.upsert({
    where: { id: memo.id },
    create: data,
    update: {
      title: data.title,
      lectureUrl: data.lectureUrl,
      content: data.content,
      positionNote: data.positionNote,
      pinned: data.pinned,
      organization: data.organization,
      sessionDate: data.sessionDate,
      attendeeCount: data.attendeeCount,
      topic: data.topic,
      remarks: data.remarks,
      misc: data.misc,
      images: data.images,
      updatedAt: data.updatedAt,
    },
  });
}

export async function deleteMemoFromDb(id: string): Promise<void> {
  await prisma.lectureMemo.deleteMany({ where: { id } });
}

export async function mergeMemosIntoDb(memos: LectureMemo[]): Promise<void> {
  for (const m of memos) {
    await upsertMemoInDb(m);
  }
}

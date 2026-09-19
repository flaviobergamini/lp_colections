import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { CoverStorage } from "@/domain/repositories/cover-storage";
import type { VinylRecord } from "@/domain/entities/record";

export type RecordWithCover = { record: VinylRecord; coverUrl: string | null };

export type GetRecordDeps = {
  repository: RecordRepository;
  storage: CoverStorage;
};

export async function getRecordWithCover(
  deps: GetRecordDeps,
  id: string
): Promise<RecordWithCover | null> {
  const record = await deps.repository.getById(id);
  if (!record) return null;

  const coverUrl = await deps.storage.getSignedUrl(record.coverPath);
  return { record, coverUrl };
}

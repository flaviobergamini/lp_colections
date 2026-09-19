import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { CoverStorage } from "@/domain/repositories/cover-storage";

export type DeleteRecordDeps = {
  repository: RecordRepository;
  storage: CoverStorage;
};

export async function deleteRecord(
  deps: DeleteRecordDeps,
  id: string,
  coverPath: string
): Promise<void> {
  await deps.storage.remove(coverPath);
  await deps.repository.remove(id);
}

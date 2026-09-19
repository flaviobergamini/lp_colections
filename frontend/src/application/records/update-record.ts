import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { RecordUpdate } from "@/domain/entities/record";

export function updateRecord(
  repository: RecordRepository,
  id: string,
  changes: RecordUpdate
): Promise<void> {
  return repository.update(id, changes);
}

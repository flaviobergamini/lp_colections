import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { VinylRecord } from "@/domain/entities/record";

export function listRecords(repository: RecordRepository): Promise<VinylRecord[]> {
  return repository.list();
}

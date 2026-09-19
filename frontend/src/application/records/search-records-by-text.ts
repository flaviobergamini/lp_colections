import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { VinylRecord } from "@/domain/entities/record";

export function searchRecordsByText(
  repository: RecordRepository,
  query: string
): Promise<VinylRecord[]> {
  return repository.searchByText(query.trim());
}

import type { NewVinylRecord, RecordMatch, RecordUpdate, VinylRecord } from "@/domain/entities/record";

/**
 * Porta do domínio para persistência de discos. A implementação concreta
 * (Supabase) vive em infrastructure/supabase — o resto do app depende só
 * desta interface, nunca do cliente do Supabase diretamente.
 */
export interface RecordRepository {
  list(): Promise<VinylRecord[]>;
  searchByText(query: string): Promise<VinylRecord[]>;
  searchByEmbedding(embedding: number[], limit: number): Promise<RecordMatch[]>;
  getById(id: string): Promise<VinylRecord | null>;
  create(input: NewVinylRecord): Promise<VinylRecord>;
  update(id: string, changes: RecordUpdate): Promise<void>;
  remove(id: string): Promise<void>;
}

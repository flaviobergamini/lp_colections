import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { CoverStorage } from "@/domain/repositories/cover-storage";
import type { EmbeddingService } from "@/domain/services/embedding-service";
import type { AuthProvider } from "@/domain/repositories/auth-provider";
import type { VinylRecord } from "@/domain/entities/record";

export type AddRecordInput = {
  file: File;
  artist: string;
  title: string;
  year: number | null;
  label: string | null;
  genre: string | null;
  notes: string | null;
};

export type AddRecordDeps = {
  repository: RecordRepository;
  storage: CoverStorage;
  embedding: EmbeddingService;
  auth: AuthProvider;
};

export async function addRecord(deps: AddRecordDeps, input: AddRecordInput): Promise<VinylRecord> {
  const userId = await deps.auth.getCurrentUserId();
  if (!userId) throw new Error("Sessão expirada, faça login novamente.");

  const [embedding, coverPath] = await Promise.all([
    deps.embedding.embed(input.file),
    deps.storage.upload(userId, input.file),
  ]);

  return deps.repository.create({
    artist: input.artist,
    title: input.title,
    year: input.year,
    label: input.label,
    genre: input.genre,
    notes: input.notes,
    coverPath,
    embedding,
  });
}

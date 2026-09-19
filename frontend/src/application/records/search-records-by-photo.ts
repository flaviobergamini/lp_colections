import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { EmbeddingService } from "@/domain/services/embedding-service";
import type { RecordMatch } from "@/domain/entities/record";

// Regra de negócio: a partir de que similaridade consideramos que o usuário
// provavelmente já tem o disco. Calibrado empiricamente para embeddings CLIP
// de capas de álbum; ajuste aqui se o modelo mudar.
const HIGH_CONFIDENCE = 0.92;
const MAYBE_CONFIDENCE = 0.85;

export type MatchConfidence = "high" | "maybe" | "none";

export type PhotoSearchResult = {
  matches: RecordMatch[];
  confidence: MatchConfidence;
};

export type SearchRecordsByPhotoDeps = {
  repository: RecordRepository;
  embedding: EmbeddingService;
};

export async function searchRecordsByPhoto(
  deps: SearchRecordsByPhotoDeps,
  file: File,
  matchCount = 5
): Promise<PhotoSearchResult> {
  const vector = await deps.embedding.embed(file);
  const matches = await deps.repository.searchByEmbedding(vector, matchCount);
  const best = matches[0];

  let confidence: MatchConfidence = "none";
  if (best && best.similarity >= HIGH_CONFIDENCE) confidence = "high";
  else if (best && best.similarity >= MAYBE_CONFIDENCE) confidence = "maybe";

  return { matches, confidence };
}

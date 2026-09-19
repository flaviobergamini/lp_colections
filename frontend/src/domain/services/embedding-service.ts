/**
 * Porta do domínio para geração de embeddings de imagem. A implementação
 * concreta chama o backend Python (CLIP) via HTTP — ver infrastructure/embedding.
 */
export interface EmbeddingService {
  embed(file: File): Promise<number[]>;
}

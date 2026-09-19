import type { EmbeddingService } from "@/domain/services/embedding-service";

export class HttpEmbeddingService implements EmbeddingService {
  async embed(file: File): Promise<number[]> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/py/embed", { method: "POST", body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.detail || "Falha ao processar a imagem.");
    }

    const data = await res.json();
    return data.embedding as number[];
  }
}

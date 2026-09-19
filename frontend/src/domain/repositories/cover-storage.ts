/**
 * Porta do domínio para armazenamento das fotos de capa.
 */
export interface CoverStorage {
  upload(userId: string, file: File): Promise<string>;
  remove(path: string): Promise<void>;
  getSignedUrl(path: string, expiresInSeconds?: number): Promise<string | null>;
}

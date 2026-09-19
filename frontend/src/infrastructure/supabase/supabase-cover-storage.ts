import type { SupabaseClient } from "@supabase/supabase-js";
import type { CoverStorage } from "@/domain/repositories/cover-storage";

const BUCKET = "covers";

export class SupabaseCoverStorage implements CoverStorage {
  constructor(private readonly supabase: SupabaseClient) {}

  async upload(userId: string, file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await this.supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });
    if (error) throw error;

    return path;
  }

  async remove(path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
  }

  async getSignedUrl(path: string, expiresInSeconds = 3600): Promise<string | null> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, expiresInSeconds);
    if (error || !data) return null;
    return data.signedUrl;
  }
}

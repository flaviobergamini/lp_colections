import type { SupabaseClient } from "@supabase/supabase-js";
import type { RecordRepository } from "@/domain/repositories/record-repository";
import type { NewVinylRecord, RecordMatch, RecordUpdate, VinylRecord } from "@/domain/entities/record";
import { toRecordMatch, toVinylRecord } from "./mappers";

/**
 * Implementação da porta RecordRepository usando o Postgres do Supabase.
 * `user_id` não é setado no insert: a coluna tem default auth.uid() e RLS
 * garante isolamento por usuário (ver supabase/migrations/0001_init.sql).
 */
export class SupabaseRecordRepository implements RecordRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async list(): Promise<VinylRecord[]> {
    const { data, error } = await this.supabase
      .from("records")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toVinylRecord);
  }

  async searchByText(query: string): Promise<VinylRecord[]> {
    const { data, error } = await this.supabase.rpc("search_records", { query });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toVinylRecord);
  }

  async searchByEmbedding(embedding: number[], limit: number): Promise<RecordMatch[]> {
    const { data, error } = await this.supabase.rpc("match_records", {
      query_embedding: embedding,
      match_count: limit,
    });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toRecordMatch);
  }

  async getById(id: string): Promise<VinylRecord | null> {
    const { data, error } = await this.supabase.from("records").select("*").eq("id", id).single();
    if (error || !data) return null;
    return toVinylRecord(data);
  }

  async create(input: NewVinylRecord): Promise<VinylRecord> {
    const { data, error } = await this.supabase
      .from("records")
      .insert({
        artist: input.artist,
        title: input.title,
        year: input.year,
        label: input.label,
        genre: input.genre,
        notes: input.notes,
        cover_path: input.coverPath,
        embedding: input.embedding,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toVinylRecord(data);
  }

  async update(id: string, changes: RecordUpdate): Promise<void> {
    const { error } = await this.supabase
      .from("records")
      .update({
        artist: changes.artist,
        title: changes.title,
        year: changes.year,
        label: changes.label,
        genre: changes.genre,
        notes: changes.notes,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase.from("records").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

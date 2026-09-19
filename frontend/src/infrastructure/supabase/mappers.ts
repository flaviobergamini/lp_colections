import type { RecordMatch, VinylRecord } from "@/domain/entities/record";

type RecordRow = {
  id: string;
  artist: string;
  title: string;
  year: number | null;
  label: string | null;
  genre: string | null;
  notes: string | null;
  cover_path: string;
  created_at: string;
};

type MatchRow = RecordRow & { similarity: number };

export function toVinylRecord(row: RecordRow): VinylRecord {
  return {
    id: row.id,
    artist: row.artist,
    title: row.title,
    year: row.year,
    label: row.label,
    genre: row.genre,
    notes: row.notes,
    coverPath: row.cover_path,
    createdAt: row.created_at,
  };
}

export function toRecordMatch(row: MatchRow): RecordMatch {
  return { ...toVinylRecord(row), similarity: row.similarity };
}

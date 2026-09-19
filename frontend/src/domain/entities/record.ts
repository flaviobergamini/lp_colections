export type VinylRecord = {
  id: string;
  artist: string;
  title: string;
  year: number | null;
  label: string | null;
  genre: string | null;
  notes: string | null;
  coverPath: string;
  createdAt: string;
};

export type NewVinylRecord = Omit<VinylRecord, "id" | "createdAt"> & {
  embedding: number[];
};

export type RecordUpdate = Partial<
  Pick<VinylRecord, "artist" | "title" | "year" | "label" | "genre" | "notes">
>;

export type RecordMatch = VinylRecord & { similarity: number };

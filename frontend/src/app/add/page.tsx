"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContainer } from "@/infrastructure/container";
import { addRecord } from "@/application/records/add-record";
import CameraCapture from "@/components/CameraCapture";
import NavBar from "@/components/NavBar";

export default function AddRecordPage() {
  const router = useRouter();
  const { recordRepository, coverStorage, embeddingService, authProvider } = useAppContainer();

  const [file, setFile] = useState<File | null>(null);
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [label, setLabel] = useState("");
  const [genre, setGenre] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Tire uma foto da capa do disco.");
      return;
    }

    setSaving(true);
    try {
      await addRecord(
        {
          repository: recordRepository,
          storage: coverStorage,
          embedding: embeddingService,
          auth: authProvider,
        },
        {
          file,
          artist,
          title,
          year: year ? Number(year) : null,
          label: label || null,
          genre: genre || null,
          notes: notes || null,
        }
      );

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar o disco.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen pb-16">
      <NavBar />
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4 p-4">
        <h1 className="text-lg font-semibold text-vinyl-accent">Adicionar disco</h1>

        <CameraCapture onSelect={setFile} label="Tirar foto da capa" />

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Artista"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            required
            placeholder="Título do álbum"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            placeholder="Ano"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            placeholder="Gravadora"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            placeholder="Gênero"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <textarea
            placeholder="Notas (estado de conservação, edição, etc.)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-vinyl-accent py-2 font-medium text-vinyl-bg disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar na coleção"}
        </button>
      </form>
    </main>
  );
}

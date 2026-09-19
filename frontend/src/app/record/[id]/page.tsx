"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContainer } from "@/infrastructure/container";
import { getRecordWithCover } from "@/application/records/get-record";
import { updateRecord } from "@/application/records/update-record";
import { deleteRecord } from "@/application/records/delete-record";
import NavBar from "@/components/NavBar";
import type { VinylRecord } from "@/domain/entities/record";

export default function RecordDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { recordRepository, coverStorage } = useAppContainer();

  const [record, setRecord] = useState<VinylRecord | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const result = await getRecordWithCover(
        { repository: recordRepository, storage: coverStorage },
        params.id
      );

      if (!result) {
        setError("Disco não encontrado.");
        setLoading(false);
        return;
      }

      setRecord(result.record);
      setCoverUrl(result.coverUrl);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!record) return;
    setSaving(true);
    setError(null);

    try {
      await updateRecord(recordRepository, record.id, {
        artist: record.artist,
        title: record.title,
        year: record.year,
        label: record.label,
        genre: record.genre,
        notes: record.notes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!record) return;
    if (!confirm("Remover este disco da coleção?")) return;

    try {
      await deleteRecord(
        { repository: recordRepository, storage: coverStorage },
        record.id,
        record.coverPath
      );
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover o disco.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <p className="p-4 text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <p className="p-4 text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-16">
      <NavBar />
      <form onSubmit={handleSave} className="mx-auto max-w-xl space-y-4 p-4">
        {coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={record.title}
            className="mx-auto max-h-72 rounded-xl object-contain bg-black"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            value={record.artist}
            onChange={(e) => setRecord({ ...record, artist: e.target.value })}
            placeholder="Artista"
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            required
            value={record.title}
            onChange={(e) => setRecord({ ...record, title: e.target.value })}
            placeholder="Título"
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            value={record.year ?? ""}
            onChange={(e) =>
              setRecord({ ...record, year: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="Ano"
            inputMode="numeric"
            className="rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            value={record.label ?? ""}
            onChange={(e) => setRecord({ ...record, label: e.target.value })}
            placeholder="Gravadora"
            className="rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <input
            value={record.genre ?? ""}
            onChange={(e) => setRecord({ ...record, genre: e.target.value })}
            placeholder="Gênero"
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
          <textarea
            value={record.notes ?? ""}
            onChange={(e) => setRecord({ ...record, notes: e.target.value })}
            placeholder="Notas"
            rows={3}
            className="col-span-2 rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-vinyl-accent py-2 font-medium text-vinyl-bg disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-500 px-4 py-2 text-red-400"
          >
            Remover
          </button>
        </div>
      </form>
    </main>
  );
}

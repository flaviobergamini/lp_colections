"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppContainer } from "@/infrastructure/container";
import { listRecords } from "@/application/records/list-records";
import { searchRecordsByText } from "@/application/records/search-records-by-text";
import RecordCard from "@/components/RecordCard";
import NavBar from "@/components/NavBar";
import type { VinylRecord } from "@/domain/entities/record";

export default function HomePage() {
  const { recordRepository } = useAppContainer();
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const trimmed = query.trim();
        const result = trimmed
          ? await searchRecordsByText(recordRepository, trimmed)
          : await listRecords(recordRepository);
        setRecords(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar a coleção.");
      } finally {
        setLoading(false);
      }
    }, query ? 300 : 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <main className="min-h-screen pb-24">
      <NavBar />

      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <input
          type="search"
          placeholder="Buscar por artista, título, gravadora..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-white px-3 py-2"
        />

        {loading && <p className="text-sm text-gray-500">Carregando...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {!loading && !error && records.length === 0 && (
          <div className="rounded-xl bg-vinyl-surface p-6 text-center text-gray-400">
            <p>Nenhum disco encontrado.</p>
            <Link href="/add" className="mt-2 inline-block text-vinyl-accent underline">
              Adicionar o primeiro disco
            </Link>
          </div>
        )}

        <div className="space-y-2">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      </div>

      <Link
        href="/add"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-vinyl-accent text-2xl font-bold text-vinyl-bg shadow-lg"
        aria-label="Adicionar disco"
      >
        +
      </Link>
    </main>
  );
}

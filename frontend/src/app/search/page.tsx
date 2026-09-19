"use client";

import { useState } from "react";
import { useAppContainer } from "@/infrastructure/container";
import { searchRecordsByPhoto, type MatchConfidence } from "@/application/records/search-records-by-photo";
import CameraCapture from "@/components/CameraCapture";
import MatchCard from "@/components/MatchCard";
import NavBar from "@/components/NavBar";
import type { RecordMatch } from "@/domain/entities/record";

export default function SearchByPhotoPage() {
  const { recordRepository, embeddingService } = useAppContainer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<RecordMatch[] | null>(null);
  const [confidence, setConfidence] = useState<MatchConfidence>("none");

  async function handleSelect(file: File) {
    setLoading(true);
    setError(null);
    setMatches(null);
    try {
      const result = await searchRecordsByPhoto(
        { repository: recordRepository, embedding: embeddingService },
        file
      );
      setMatches(result.matches);
      setConfidence(result.confidence);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar disco.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-16">
      <NavBar />
      <div className="mx-auto max-w-xl space-y-4 p-4">
        <h1 className="text-lg font-semibold text-vinyl-accent">
          Já tenho esse disco?
        </h1>
        <p className="text-sm text-gray-400">
          Tire uma foto da capa na loja e veja se ela já está na sua coleção.
        </p>

        <CameraCapture onSelect={handleSelect} label="Fotografar disco" />

        {loading && <p className="text-sm text-gray-500">Comparando com sua coleção...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        {matches && (
          <div className="space-y-3">
            {confidence === "high" && (
              <p className="rounded-lg bg-green-900/40 p-3 text-green-300">
                Você provavelmente já tem esse disco.
              </p>
            )}
            {confidence === "maybe" && (
              <p className="rounded-lg bg-yellow-900/40 p-3 text-yellow-300">
                Encontramos uma capa parecida. Confira antes de comprar de novo.
              </p>
            )}
            {confidence === "none" && (
              <p className="rounded-lg bg-vinyl-surface p-3 text-gray-300">
                Não encontramos esse disco na sua coleção.
              </p>
            )}

            {matches.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase text-gray-500">Mais parecidos</p>
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

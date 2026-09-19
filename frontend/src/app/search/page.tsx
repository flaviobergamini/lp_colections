"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
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
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Stack spacing={2.5}>
          <Typography variant="h6" color="primary">
            Já tenho esse disco?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tire uma foto da capa na loja e veja se ela já está na sua coleção.
          </Typography>

          <CameraCapture onSelect={handleSelect} label="Fotografar disco" />

          {loading && <LinearProgress />}
          {error && <Alert severity="error">{error}</Alert>}

          {matches && (
            <Stack spacing={2}>
              {confidence === "high" && <Alert severity="success">Você provavelmente já tem esse disco.</Alert>}
              {confidence === "maybe" && (
                <Alert severity="warning">Encontramos uma capa parecida. Confira antes de comprar de novo.</Alert>
              )}
              {confidence === "none" && <Alert severity="info">Não encontramos esse disco na sua coleção.</Alert>}

              {matches.length > 0 && (
                <Stack spacing={1}>
                  <Typography variant="overline" color="text.secondary">
                    Mais parecidos
                  </Typography>
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
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
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ py: 3, pb: 12 }}>
        <Stack spacing={2}>
          <TextField
            type="search"
            placeholder="Buscar por artista, título, gravadora..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          {loading && (
            <Stack sx={{ alignItems: "center", py: 2 }}>
              <CircularProgress size={28} />
            </Stack>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && records.length === 0 && (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">Nenhum disco encontrado.</Typography>
              <Button component={Link} href="/add" sx={{ mt: 1 }}>
                Adicionar o primeiro disco
              </Button>
            </Paper>
          )}

          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </Stack>
      </Container>

      <Fab component={Link} href="/add" color="primary" aria-label="Adicionar disco" sx={{ position: "fixed", bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
    </>
  );
}

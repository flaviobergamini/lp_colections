"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
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
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          <Typography variant="h6" color="primary">
            Adicionar disco
          </Typography>

          <CameraCapture onSelect={setFile} label="Tirar foto da capa" />

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label="Artista" required fullWidth value={artist} onChange={(e) => setArtist(e.target.value)} />
            </Grid>
            <Grid size={12}>
              <TextField label="Título do álbum" required fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
            </Grid>
            <Grid size={6}>
              <TextField label="Ano" fullWidth value={year} onChange={(e) => setYear(e.target.value)} slotProps={{ htmlInput: { inputMode: "numeric" } }} />
            </Grid>
            <Grid size={6}>
              <TextField label="Gravadora" fullWidth value={label} onChange={(e) => setLabel(e.target.value)} />
            </Grid>
            <Grid size={12}>
              <TextField label="Gênero" fullWidth value={genre} onChange={(e) => setGenre(e.target.value)} />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Notas (estado de conservação, edição, etc.)"
                fullWidth
                multiline
                minRows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" size="large" disabled={saving}>
            {saving ? "Salvando..." : "Salvar na coleção"}
          </Button>
        </Stack>
      </Container>
    </>
  );
}

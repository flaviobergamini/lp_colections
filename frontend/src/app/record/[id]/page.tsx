"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
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
      try {
        const result = await getRecordWithCover(
          { repository: recordRepository, storage: coverStorage },
          params.id
        );

        if (!result) {
          setError("Disco não encontrado.");
        } else {
          setRecord(result.record);
          setCoverUrl(result.coverUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar o disco.");
      } finally {
        setLoading(false);
      }
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
      <>
        <NavBar />
        <Stack sx={{ alignItems: "center", py: 6 }}>
          <CircularProgress />
        </Stack>
      </>
    );
  }

  if (!record) {
    return (
      <>
        <NavBar />
        <Container maxWidth="sm" sx={{ py: 3 }}>
          <Alert severity="error">{error ?? "Disco não encontrado."}</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Stack component="form" onSubmit={handleSave} spacing={2.5}>
          {coverUrl && (
            <Box
              component="img"
              src={coverUrl}
              alt={record.title}
              sx={{ width: "100%", maxHeight: 288, objectFit: "contain", bgcolor: "black", borderRadius: 3 }}
            />
          )}

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label="Artista" required fullWidth value={record.artist} onChange={(e) => setRecord({ ...record, artist: e.target.value })} />
            </Grid>
            <Grid size={12}>
              <TextField label="Título" required fullWidth value={record.title} onChange={(e) => setRecord({ ...record, title: e.target.value })} />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Ano"
                fullWidth
                value={record.year ?? ""}
                onChange={(e) => setRecord({ ...record, year: e.target.value ? Number(e.target.value) : null })}
                slotProps={{ htmlInput: { inputMode: "numeric" } }}
              />
            </Grid>
            <Grid size={6}>
              <TextField label="Gravadora" fullWidth value={record.label ?? ""} onChange={(e) => setRecord({ ...record, label: e.target.value })} />
            </Grid>
            <Grid size={12}>
              <TextField label="Gênero" fullWidth value={record.genre ?? ""} onChange={(e) => setRecord({ ...record, genre: e.target.value })} />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Notas"
                fullWidth
                multiline
                minRows={3}
                value={record.notes ?? ""}
                onChange={(e) => setRecord({ ...record, notes: e.target.value })}
              />
            </Grid>
          </Grid>

          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={saving} sx={{ flex: 1 }}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={handleDelete}>
              Remover
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

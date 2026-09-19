"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

type Props = {
  onSelect: (file: File) => void;
  label?: string;
};

export default function CameraCapture({ onSelect, label = "Tirar foto" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    onSelect(file);
  }

  return (
    <Stack spacing={2}>
      {previewUrl ? (
        <Box
          component="img"
          src={previewUrl}
          alt="Pré-visualização"
          sx={{ width: "100%", maxHeight: 288, objectFit: "contain", bgcolor: "black", borderRadius: 3 }}
        />
      ) : (
        <Box
          sx={{
            height: 224,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: 2,
            borderStyle: "dashed",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Typography color="text.secondary">Nenhuma foto selecionada</Typography>
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        hidden
      />

      <Button variant="contained" size="large" startIcon={<CameraAltIcon />} onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
    </Stack>
  );
}

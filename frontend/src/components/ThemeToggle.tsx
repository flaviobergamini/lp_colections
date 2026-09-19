"use client";

import { useColorScheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();

  // No primeiro render (SSR) o modo ainda é desconhecido: não renderiza para evitar hydration mismatch.
  if (!mode) return null;

  const active = mode === "system" ? systemMode : mode;

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={active}
      onChange={(_, value) => value && setMode(value)}
      aria-label="Tema"
    >
      <Tooltip title="Tema claro">
        <ToggleButton value="light" aria-label="Tema claro">
          <LightModeIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Tema escuro">
        <ToggleButton value="dark" aria-label="Tema escuro">
          <DarkModeIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}

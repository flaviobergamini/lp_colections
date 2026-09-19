"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
  colorSchemes: {
    dark: {
      palette: {
        primary: { main: "#e0b34d", contrastText: "#111113" },
        background: { default: "#111113", paper: "#1b1b1f" },
      },
    },
    light: {
      palette: {
        primary: { main: "#9a6b00", contrastText: "#ffffff" },
        background: { default: "#faf7f0", paper: "#ffffff" },
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif" },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlbumIcon from "@mui/icons-material/Album";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppContainer } from "@/infrastructure/container";
import { signIn } from "@/application/auth/sign-in";
import { signUp } from "@/application/auth/sign-up";

export default function LoginPage() {
  const router = useRouter();
  const { authProvider } = useAppContainer();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const { error } =
      mode === "signin"
        ? await signIn(authProvider, email, password)
        : await signUp(authProvider, email, password);

    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    if (mode === "signup") {
      setInfo("Conta criada. Verifique seu e-mail se a confirmação estiver ativada, ou faça login.");
      setMode("signin");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, position: "relative" }}>
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
      <Paper component="form" onSubmit={handleSubmit} elevation={4} sx={{ width: "100%", maxWidth: 400, p: 4 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <AlbumIcon color="primary" fontSize="large" />
            <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
              Berga Records
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {mode === "signin" ? "Entre para acessar sua coleção." : "Crie sua conta."}
          </Typography>

          <TextField label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField
            label="Senha"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{ htmlInput: { minLength: 6 } }}
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}
          {info && <Alert severity="success">{info}</Alert>}

          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </Button>
          <Button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} color="inherit" size="small">
            {mode === "signin" ? "Não tem conta? Criar uma" : "Já tenho conta"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

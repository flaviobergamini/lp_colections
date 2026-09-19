"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-vinyl-surface p-6 shadow-xl"
      >
        <h1 className="text-xl font-semibold text-vinyl-accent">
          Coleção de LPs
        </h1>
        <p className="text-sm text-gray-400">
          {mode === "signin" ? "Entre para acessar sua coleção." : "Crie sua conta."}
        </p>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-white px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-green-400">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-vinyl-accent py-2 font-medium text-vinyl-bg disabled:opacity-60"
        >
          {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-sm text-gray-400 underline"
        >
          {mode === "signin" ? "Não tem conta? Criar uma" : "Já tenho conta"}
        </button>
      </form>
    </main>
  );
}

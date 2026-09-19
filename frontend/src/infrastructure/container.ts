"use client";

import { useMemo } from "react";
import { createClient } from "./supabase/browser-client";
import { SupabaseRecordRepository } from "./supabase/supabase-record-repository";
import { SupabaseCoverStorage } from "./supabase/supabase-cover-storage";
import { SupabaseAuthProvider } from "./supabase/supabase-auth-provider";
import { HttpEmbeddingService } from "./embedding/http-embedding-service";

/**
 * Raiz de composição do lado do cliente: monta as implementações concretas
 * (infraestrutura) e as expõe atrás das portas do domínio. Páginas e
 * componentes só devem importar isto — nunca o cliente do Supabase direto.
 */
export function createAppContainer() {
  const supabase = createClient();
  return {
    recordRepository: new SupabaseRecordRepository(supabase),
    coverStorage: new SupabaseCoverStorage(supabase),
    authProvider: new SupabaseAuthProvider(supabase),
    embeddingService: new HttpEmbeddingService(),
  };
}

export type AppContainer = ReturnType<typeof createAppContainer>;

export function useAppContainer(): AppContainer {
  return useMemo(() => createAppContainer(), []);
}

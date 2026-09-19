import type { AuthProvider, AuthResult } from "@/domain/repositories/auth-provider";

export function signIn(auth: AuthProvider, email: string, password: string): Promise<AuthResult> {
  return auth.signInWithPassword(email, password);
}

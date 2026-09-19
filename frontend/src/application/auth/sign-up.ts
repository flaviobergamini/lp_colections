import type { AuthProvider, AuthResult } from "@/domain/repositories/auth-provider";

export function signUp(auth: AuthProvider, email: string, password: string): Promise<AuthResult> {
  return auth.signUp(email, password);
}

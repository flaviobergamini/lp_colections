import type { AuthProvider } from "@/domain/repositories/auth-provider";

export function signOut(auth: AuthProvider): Promise<void> {
  return auth.signOut();
}

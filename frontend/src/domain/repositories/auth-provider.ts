export type AuthResult = { error: string | null };

/**
 * Porta do domínio para autenticação do usuário.
 */
export interface AuthProvider {
  getCurrentUserId(): Promise<string | null>;
  signInWithPassword(email: string, password: string): Promise<AuthResult>;
  signUp(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
}

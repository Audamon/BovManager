export interface AuthUser {
  id: number;
  name: string;
  email: string;
  farm: string;
}

/**
 * Contrato de autenticação independente de onde os dados realmente moram.
 * Hoje só existe `localAuthRepository` (SQLite no aparelho). Quando o
 * backend em .NET existir, basta criar um `remoteAuthRepository` que
 * implemente essa mesma interface (chamando a API em vez do SQLite) e
 * trocar a linha em `index.ts` — nenhum componente que usa `authRepository`
 * precisa mudar.
 */
export interface AuthRepository {
  createUser(data: {
    name: string;
    email: string;
    farm: string;
    password: string;
  }): Promise<AuthUser>;
  authenticate(email: string, password: string): Promise<AuthUser | null>;
  resetPassword(email: string, newPassword: string): Promise<boolean>;
  changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

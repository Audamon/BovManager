export interface AuthUser {
  id: number;
  name: string;
  email: string;
  farm: string;
}

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

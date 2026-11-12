import { localAuthRepository } from "./localAuthRepository";
import type { AuthRepository } from "./types";

export const authRepository: AuthRepository = localAuthRepository;

export type { AuthRepository, AuthUser } from "./types";

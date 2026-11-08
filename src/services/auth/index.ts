import { localAuthRepository } from "./localAuthRepository";
import type { AuthRepository } from "./types";

/**
 * Único ponto de verdade de qual implementação está em uso. Quando o
 * backend em .NET existir, cria-se um `remoteAuthRepository.ts` com a
 * mesma interface `AuthRepository` e troca-se só esta linha.
 */
export const authRepository: AuthRepository = localAuthRepository;

export type { AuthRepository, AuthUser } from "./types";

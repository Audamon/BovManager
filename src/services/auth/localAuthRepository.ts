import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { AuthRepository, AuthUser } from "./types";

const SESSION_KEY = "bovmanager_session_user_id";

const hashPassword = (password: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);

const toAuthUser = (user: typeof users.$inferSelect): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  farm: user.farm,
});

export const localAuthRepository: AuthRepository = {
  async createUser(data) {
    const passwordHash = await hashPassword(data.password);
    const createdAt = Date.now();
    const result = db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        farm: data.farm,
        passwordHash,
        createdAt,
      })
      .run();
    return {
      id: Number(result.lastInsertRowId),
      name: data.name,
      email: data.email,
      farm: data.farm,
    };
  },

  async authenticate(email, password) {
    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user) return null;
    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) return null;
    await SecureStore.setItemAsync(SESSION_KEY, String(user.id));
    return toAuthUser(user);
  },

  async resetPassword(email, newPassword) {
    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user) return false;
    const passwordHash = await hashPassword(newPassword);
    db.update(users).set({ passwordHash }).where(eq(users.id, user.id)).run();
    return true;
  },

  async changePassword(email, currentPassword, newPassword) {
    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user) return false;
    const currentHash = await hashPassword(currentPassword);
    if (currentHash !== user.passwordHash) return false;
    const passwordHash = await hashPassword(newPassword);
    db.update(users).set({ passwordHash }).where(eq(users.id, user.id)).run();
    return true;
  },

  async logout() {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },

  async getCurrentUser() {
    const value = await SecureStore.getItemAsync(SESSION_KEY);
    if (!value) return null;
    const user = db
      .select()
      .from(users)
      .where(eq(users.id, Number(value)))
      .get();
    return user ? toAuthUser(user) : null;
  },
};

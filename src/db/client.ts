import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const expoDb = openDatabaseSync("bovmanager.db");
export const db = drizzle(expoDb, { schema });

export const initDb = () => {
  // Simulação de migração: até existir um fluxo real com drizzle-kit, o
  // schema é garantido com um CREATE TABLE IF NOT EXISTS direto.
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS animals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ear_ring TEXT NOT NULL UNIQUE,
      name TEXT,
      breed TEXT NOT NULL,
      sex TEXT NOT NULL,
      birth_date TEXT,
      weight REAL,
      status TEXT NOT NULL DEFAULT 'semPendencias',
      photo_uri TEXT,
      created_at INTEGER NOT NULL
    );
  `);
  // Campo adicionado depois da primeira versão da tabela: instalações
  // existentes não ganham a coluna sozinhas com o CREATE TABLE IF NOT
  // EXISTS acima, então tenta um ALTER TABLE e ignora o erro de "coluna já
  // existe" (instalações novas já nascem com a coluna, pelo CREATE acima).
  try {
    expoDb.execSync(`ALTER TABLE animals ADD COLUMN location TEXT;`);
  } catch {
    // coluna já existe, nada a fazer
  }
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_id INTEGER NOT NULL REFERENCES animals(id),
      old_ear_ring TEXT NOT NULL,
      new_ear_ring TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      farm TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS vaccines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_id INTEGER NOT NULL REFERENCES animals(id),
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      applied INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
};

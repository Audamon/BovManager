import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { Animalstatus } from "@/components/RebanhoCard/RebanhoCard";

export const animals = sqliteTable("animals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  earRing: text("ear_ring").notNull().unique(),
  name: text("name"),
  breed: text("breed").notNull(),
  sex: text("sex").$type<"macho" | "femea">().notNull(),
  birthDate: text("birth_date"),
  weight: real("weight"),
  status: text("status").$type<Animalstatus>().notNull().default("semPendencias"),
  photoUri: text("photo_uri"),
  location: text("location"),
  createdAt: integer("created_at").notNull(),
});

export type Animal = typeof animals.$inferSelect;

export const transfers = sqliteTable("transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animalId: integer("animal_id")
    .notNull()
    .references(() => animals.id),
  oldEarRing: text("old_ear_ring").notNull(),
  newEarRing: text("new_ear_ring").notNull(),
  reason: text("reason").notNull(),
  createdAt: integer("created_at").notNull(),
});

export type Transfer = typeof transfers.$inferSelect;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  farm: text("farm").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at").notNull(),
});

export type User = typeof users.$inferSelect;

export const vaccines = sqliteTable("vaccines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  animalId: integer("animal_id")
    .notNull()
    .references(() => animals.id),
  name: text("name").notNull(),
  date: text("date").notNull(),
  applied: integer("applied", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at").notNull(),
});

export type Vaccine = typeof vaccines.$inferSelect;

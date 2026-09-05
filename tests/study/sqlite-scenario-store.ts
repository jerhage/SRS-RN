import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-sqlite";

import type { SrsDataStore } from "@/infrastructure/database/srs-data-store";
import { SqliteCardRepository } from "@/infrastructure/sqlite/sqlite-card-repository";
import { SqliteDeckRepository } from "@/infrastructure/sqlite/sqlite-deck-repository";
import { SqliteNoteRepository } from "@/infrastructure/sqlite/sqlite-note-repository";
import { SqliteReviewLogRepository } from "@/infrastructure/sqlite/sqlite-review-log-repository";

interface SqliteScenarioStore extends SrsDataStore {
  close(): void;
}

function createSqliteScenarioStore(): SqliteScenarioStore {
  const client = new DatabaseSync(":memory:");
  client.exec("PRAGMA foreign_keys = ON;");
  applyMigrations(client);

  const database = drizzle({ client });
  return {
    decks: new SqliteDeckRepository(database),
    notes: new SqliteNoteRepository(database),
    cards: new SqliteCardRepository(database),
    reviewLogs: new SqliteReviewLogRepository(database),
    close: () => client.close(),
  };
}

function applyMigrations(client: DatabaseSync): void {
  const migrationsDirectory = join(process.cwd(), "drizzle");
  const migrationDirectories = readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const directory of migrationDirectories) {
    const migrationPath = join(migrationsDirectory, directory, "migration.sql");
    client.exec(readFileSync(migrationPath, "utf8"));
  }
}

export { createSqliteScenarioStore };
export type { SqliteScenarioStore };

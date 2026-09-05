import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

import type { CardRepository } from "@/features/study/card/card-repository";
import { SqliteCardRepository } from "@/infrastructure/sqlite/sqlite-card-repository";
import type { DeckRepository } from "@/features/study/deck/deck-repository";
import { SqliteDeckRepository } from "@/infrastructure/sqlite/sqlite-deck-repository";
import type { NoteRepository } from "@/features/study/note/note-repository";
import { SqliteNoteRepository } from "@/infrastructure/sqlite/sqlite-note-repository";
import type { ReviewLogRepository } from "@/features/study/review/review-log-repository";
import { SqliteReviewLogRepository } from "@/infrastructure/sqlite/sqlite-review-log-repository";

interface SrsDataStore {
  readonly decks: DeckRepository;
  readonly notes: NoteRepository;
  readonly cards: CardRepository;
  readonly reviewLogs: ReviewLogRepository;
}

/** Opens the app database and supplies repository capability implementations. */
function createSrsDataStore(database: SQLite.SQLiteDatabase): SrsDataStore {
  const db = drizzle(database);
  return {
    decks: new SqliteDeckRepository(db),
    notes: new SqliteNoteRepository(db),
    cards: new SqliteCardRepository(db),
    reviewLogs: new SqliteReviewLogRepository(db),
  };
}

export { createSrsDataStore };
export type { SrsDataStore };

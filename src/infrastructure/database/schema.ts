import {
  type AnySQLiteColumn,
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

const decks = sqliteTable(
  'deck',
  {
    id: text().primaryKey(),
    name: text().notNull(),
    parentId: text('parent_id').references((): AnySQLiteColumn => decks.id),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
    isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  },
  (table) => [uniqueIndex('deck_parent_name').on(table.parentId, table.name)],
);

const notes = sqliteTable(
  'note',
  {
    id: text().primaryKey(),
    deckId: text('deck_id').notNull().references(() => decks.id),
    fields: text('fields_json', { mode: 'json' }).$type<Record<string, string>>().notNull(),
    tags: text('tags_json', { mode: 'json' }).$type<string[]>().notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
    isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  },
  (table) => [index('note_deck_id').on(table.deckId)],
);

const cards = sqliteTable(
  'card',
  {
    id: text().primaryKey(),
    noteId: text('note_id').notNull().references(() => notes.id),
    deckId: text('deck_id').notNull().references(() => decks.id),
    ordinal: integer().notNull(),
    prompt: text().notNull(),
    answer: text().notNull(),
    phase: text().notNull(),
    dueAt: integer('due_at').notNull(),
    intervalDays: integer('interval_days').notNull(),
    easeFactor: real('ease_factor').notNull(),
    repetitions: integer().notNull(),
    lapses: integer().notNull(),
    isSuspended: integer('is_suspended', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    uniqueIndex('card_note_ordinal').on(table.noteId, table.ordinal),
    index('card_due').on(table.deckId, table.isSuspended, table.dueAt),
    index('card_note_id').on(table.noteId),
  ],
);

const reviewLogs = sqliteTable(
  'review_log',
  {
    id: text().primaryKey(),
    cardId: text('card_id').notNull().references(() => cards.id),
    reviewedAt: integer('reviewed_at').notNull(),
    rating: text().notNull(),
    elapsedMilliseconds: integer('elapsed_milliseconds').notNull(),
    previousPhase: text('previous_phase').notNull(),
    previousDueAt: integer('previous_due_at').notNull(),
    previousIntervalDays: integer('previous_interval_days').notNull(),
    previousEaseFactor: real('previous_ease_factor').notNull(),
    previousRepetitions: integer('previous_repetitions').notNull(),
    previousLapses: integer('previous_lapses').notNull(),
  },
  (table) => [index('review_log_card_reviewed_at').on(table.cardId, table.reviewedAt)],
);

export { cards, decks, notes, reviewLogs };

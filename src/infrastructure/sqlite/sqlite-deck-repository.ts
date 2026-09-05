import { asc, eq } from 'drizzle-orm';
import { decks } from '@/infrastructure/database/schema';

import { assertDeck, type Deck } from '@/features/study/deck/deck';
import type { DeckRepository } from '@/features/study/deck/deck-repository';
import type { SqliteDatabase } from './sqlite-database';

class SqliteDeckRepository implements DeckRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async get(id: string): Promise<Deck | null> {
    const [row] = await this.db.select().from(decks).where(eq(decks.id, id)).limit(1);
    return row ? toDeck(row) : null;
  }

  async getAll(options: { includeArchived?: boolean } = {}): Promise<readonly Deck[]> {
    const query = this.db.select().from(decks).orderBy(asc(decks.name));
    const rows = options.includeArchived ? await query : await query.where(eq(decks.isArchived, false));
    return rows.map(toDeck);
  }

  async save(deck: Deck): Promise<void> {
    assertDeck(deck);
    await this.db.insert(decks).values(toDeckRow(deck)).onConflictDoUpdate({ target: decks.id, set: toDeckRow(deck) });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(decks).where(eq(decks.id, id));
  }
}

function toDeck(row: typeof decks.$inferSelect): Deck {
  const deck: Deck = {
    id: row.id,
    name: row.name,
    ...(row.parentId === null ? {} : { parentId: row.parentId }),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isArchived: row.isArchived,
  };
  assertDeck(deck);
  return deck;
}

function toDeckRow(deck: Deck): typeof decks.$inferInsert {
  return { ...deck, parentId: deck.parentId ?? null };
}

export { SqliteDeckRepository };

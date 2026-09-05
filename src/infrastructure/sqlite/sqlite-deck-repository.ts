import { asc, eq } from 'drizzle-orm';

import type { Deck } from '@/features/study/deck/deck';
import type { DeckRepository } from '@/features/study/deck/deck-repository';
import { decks } from '@/infrastructure/database/schema';

import { toDomainDeck, toPersistenceDeck } from './deck-mapper';
import type { SqliteDatabase } from './sqlite-database';

class SqliteDeckRepository implements DeckRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async get(id: string): Promise<Deck | null> {
    const [row] = await this.db.select().from(decks).where(eq(decks.id, id)).limit(1);
    return row ? toDomainDeck(row) : null;
  }

  async getAll(options: { includeArchived?: boolean } = {}): Promise<readonly Deck[]> {
    const query = this.db.select().from(decks).orderBy(asc(decks.name));
    const rows = options.includeArchived ? await query : await query.where(eq(decks.isArchived, false));
    return rows.map(toDomainDeck);
  }

  async save(deck: Deck): Promise<void> {
    const row = toPersistenceDeck(deck);
    await this.db.insert(decks).values(row).onConflictDoUpdate({ target: decks.id, set: row });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(decks).where(eq(decks.id, id));
  }
}

export { SqliteDeckRepository };

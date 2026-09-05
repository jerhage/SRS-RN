import { and, asc, eq, lte } from 'drizzle-orm';

import type { Card } from '@/features/study/card/card';
import type { CardRepository } from '@/features/study/card/card-repository';
import { cards } from '@/infrastructure/database/schema';

import { toDomainCard, toPersistenceCard } from './card-mapper';
import type { SqliteDatabase } from './sqlite-database';

class SqliteCardRepository implements CardRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async get(id: string): Promise<Card | null> {
    const [row] = await this.db.select().from(cards).where(eq(cards.id, id)).limit(1);
    return row ? toDomainCard(row) : null;
  }

  async getByNote(noteId: string): Promise<readonly Card[]> {
    return (await this.db.select().from(cards).where(eq(cards.noteId, noteId)).orderBy(asc(cards.ordinal))).map(toDomainCard);
  }

  async getDue(deckId: string, at: number, limit: number): Promise<readonly Card[]> {
    if (limit <= 0) throw new Error('Due-card limit must be positive.');
    const rows = await this.db.select().from(cards).where(and(
      eq(cards.deckId, deckId),
      eq(cards.isSuspended, false),
      lte(cards.dueAt, at),
    )).orderBy(asc(cards.dueAt), asc(cards.ordinal)).limit(limit);
    return rows.map(toDomainCard);
  }

  async save(card: Card): Promise<void> {
    const row = toPersistenceCard(card);
    await this.db.insert(cards).values(row).onConflictDoUpdate({ target: cards.id, set: row });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(cards).where(eq(cards.id, id));
  }
}

export { SqliteCardRepository };

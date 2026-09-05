import { and, asc, eq, lte } from 'drizzle-orm';
import { cards } from '@/infrastructure/database/schema';

import { assertCard, type Card, type CardPhase } from '@/features/study/card/card';
import type { CardRepository } from '@/features/study/card/card-repository';
import type { SqliteDatabase } from './sqlite-database';

class SqliteCardRepository implements CardRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async get(id: string): Promise<Card | null> {
    const [row] = await this.db.select().from(cards).where(eq(cards.id, id)).limit(1);
    return row ? toCard(row) : null;
  }

  async getByNote(noteId: string): Promise<readonly Card[]> {
    return (await this.db.select().from(cards).where(eq(cards.noteId, noteId)).orderBy(asc(cards.ordinal))).map(toCard);
  }

  async getDue(deckId: string, at: number, limit: number): Promise<readonly Card[]> {
    if (limit <= 0) throw new Error('Due-card limit must be positive.');
    return (await this.db.select().from(cards).where(and(eq(cards.deckId, deckId), eq(cards.isSuspended, false), lte(cards.dueAt, at)))
      .orderBy(asc(cards.dueAt), asc(cards.ordinal)).limit(limit)).map(toCard);
  }

  async save(card: Card): Promise<void> {
    assertCard(card);
    await this.db.insert(cards).values(toCardRow(card)).onConflictDoUpdate({ target: cards.id, set: toCardRow(card) });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(cards).where(eq(cards.id, id));
  }
}

function toCard(row: typeof cards.$inferSelect): Card {
  const card: Card = {
    id: row.id, noteId: row.noteId, deckId: row.deckId, ordinal: row.ordinal, prompt: row.prompt, answer: row.answer,
    scheduling: { phase: asCardPhase(row.phase), dueAt: row.dueAt, intervalDays: row.intervalDays, easeFactor: row.easeFactor, repetitions: row.repetitions, lapses: row.lapses },
    createdAt: row.createdAt, updatedAt: row.updatedAt, isSuspended: row.isSuspended,
  };
  assertCard(card);
  return card;
}

function toCardRow(card: Card): typeof cards.$inferInsert {
  return { id: card.id, noteId: card.noteId, deckId: card.deckId, ordinal: card.ordinal, prompt: card.prompt, answer: card.answer, phase: card.scheduling.phase, dueAt: card.scheduling.dueAt, intervalDays: card.scheduling.intervalDays, easeFactor: card.scheduling.easeFactor, repetitions: card.scheduling.repetitions, lapses: card.scheduling.lapses, isSuspended: card.isSuspended, createdAt: card.createdAt, updatedAt: card.updatedAt };
}

function asCardPhase(value: string): CardPhase {
  if (value === 'new' || value === 'learning' || value === 'review' || value === 'relearning') return value;
  throw new Error(`Unknown card phase: ${value}`);
}

export { SqliteCardRepository };

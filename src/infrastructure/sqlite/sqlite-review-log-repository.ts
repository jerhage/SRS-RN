import { asc, eq } from 'drizzle-orm';
import { reviewLogs } from '@/infrastructure/database/schema';

import { assertReviewLog, type ReviewLog, type ReviewRating } from '@/features/study/review/review-log';
import type { ReviewLogRepository } from '@/features/study/review/review-log-repository';
import type { CardPhase } from '@/features/study/card/card';
import type { SqliteDatabase } from './sqlite-database';

class SqliteReviewLogRepository implements ReviewLogRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async getByCard(cardId: string): Promise<readonly ReviewLog[]> {
    return (await this.db.select().from(reviewLogs).where(eq(reviewLogs.cardId, cardId))
      .orderBy(asc(reviewLogs.reviewedAt), asc(reviewLogs.id))).map(toReviewLog);
  }

  async append(log: ReviewLog): Promise<void> {
    assertReviewLog(log);
    await this.db.insert(reviewLogs).values(toReviewLogRow(log));
  }
}

function toReviewLog(row: typeof reviewLogs.$inferSelect): ReviewLog {
  const log: ReviewLog = {
    id: row.id, cardId: row.cardId, reviewedAt: row.reviewedAt, rating: asReviewRating(row.rating), elapsedMilliseconds: row.elapsedMilliseconds,
    previousScheduling: { phase: asCardPhase(row.previousPhase), dueAt: row.previousDueAt, intervalDays: row.previousIntervalDays, easeFactor: row.previousEaseFactor, repetitions: row.previousRepetitions, lapses: row.previousLapses },
  };
  assertReviewLog(log);
  return log;
}

function toReviewLogRow(log: ReviewLog): typeof reviewLogs.$inferInsert {
  return { id: log.id, cardId: log.cardId, reviewedAt: log.reviewedAt, rating: log.rating, elapsedMilliseconds: log.elapsedMilliseconds, previousPhase: log.previousScheduling.phase, previousDueAt: log.previousScheduling.dueAt, previousIntervalDays: log.previousScheduling.intervalDays, previousEaseFactor: log.previousScheduling.easeFactor, previousRepetitions: log.previousScheduling.repetitions, previousLapses: log.previousScheduling.lapses };
}

function asCardPhase(value: string): CardPhase {
  if (value === 'new' || value === 'learning' || value === 'review' || value === 'relearning') return value;
  throw new Error(`Unknown card phase: ${value}`);
}

function asReviewRating(value: string): ReviewRating {
  if (value === 'again' || value === 'hard' || value === 'good' || value === 'easy') return value;
  throw new Error(`Unknown review rating: ${value}`);
}

export { SqliteReviewLogRepository };

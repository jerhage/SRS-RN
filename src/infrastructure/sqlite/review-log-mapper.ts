import { parseReviewLog, type ReviewLog } from '@/features/study/review/review-log';
import { reviewLogInsertSchema, reviewLogSelectSchema } from '@/infrastructure/database/persistence-schemas';
import { reviewLogs } from '@/infrastructure/database/schema';

function toDomainReviewLog(row: unknown): ReviewLog {
  const persisted = reviewLogSelectSchema.parse(row);
  return parseReviewLog({
    id: persisted.id,
    cardId: persisted.cardId,
    reviewedAt: persisted.reviewedAt,
    rating: persisted.rating,
    elapsedMilliseconds: persisted.elapsedMilliseconds,
    previousScheduling: {
      phase: persisted.previousPhase,
      dueAt: persisted.previousDueAt,
      intervalDays: persisted.previousIntervalDays,
      easeFactor: persisted.previousEaseFactor,
      repetitions: persisted.previousRepetitions,
      lapses: persisted.previousLapses,
    },
  });
}

function toPersistenceReviewLog(log: ReviewLog): typeof reviewLogs.$inferInsert {
  const valid = parseReviewLog(log);
  const persisted = reviewLogInsertSchema.parse({
    id: valid.id,
    cardId: valid.cardId,
    reviewedAt: valid.reviewedAt,
    rating: valid.rating,
    elapsedMilliseconds: valid.elapsedMilliseconds,
    previousPhase: valid.previousScheduling.phase,
    previousDueAt: valid.previousScheduling.dueAt,
    previousIntervalDays: valid.previousScheduling.intervalDays,
    previousEaseFactor: valid.previousScheduling.easeFactor,
    previousRepetitions: valid.previousScheduling.repetitions,
    previousLapses: valid.previousScheduling.lapses,
  });
  return persisted as typeof reviewLogs.$inferInsert;
}

export { toDomainReviewLog, toPersistenceReviewLog };

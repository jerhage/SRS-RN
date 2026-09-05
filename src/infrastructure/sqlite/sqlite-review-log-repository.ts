import { asc, eq } from 'drizzle-orm';

import type { ReviewLog } from '@/features/study/review/review-log';
import type { ReviewLogRepository } from '@/features/study/review/review-log-repository';
import { reviewLogs } from '@/infrastructure/database/schema';

import { toDomainReviewLog, toPersistenceReviewLog } from './review-log-mapper';
import type { SqliteDatabase } from './sqlite-database';

class SqliteReviewLogRepository implements ReviewLogRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async getByCard(cardId: string): Promise<readonly ReviewLog[]> {
    const rows = await this.db.select().from(reviewLogs).where(eq(reviewLogs.cardId, cardId))
      .orderBy(asc(reviewLogs.reviewedAt), asc(reviewLogs.id));
    return rows.map(toDomainReviewLog);
  }

  async append(log: ReviewLog): Promise<void> {
    await this.db.insert(reviewLogs).values(toPersistenceReviewLog(log));
  }
}

export { SqliteReviewLogRepository };

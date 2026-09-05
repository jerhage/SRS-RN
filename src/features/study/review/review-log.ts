import { assertSchedulingState, type CardId, type SchedulingState } from '../card/card';
import type { Timestamp } from '../time/timestamp';

type ReviewLogId = string;
type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

/** Immutable record of an answer and the scheduling state that preceded it. */
interface ReviewLog {
  readonly id: ReviewLogId;
  readonly cardId: CardId;
  readonly reviewedAt: Timestamp;
  readonly rating: ReviewRating;
  readonly elapsedMilliseconds: number;
  readonly previousScheduling: SchedulingState;
}

function assertReviewLog(log: ReviewLog): void {
  if (log.elapsedMilliseconds < 0) throw new Error('Review time cannot be negative.');
  assertSchedulingState(log.previousScheduling);
}

export { assertReviewLog };
export type { ReviewLog, ReviewLogId, ReviewRating };

import { z } from 'zod/v4';

import { cardIdSchema, schedulingStateSchema } from '../card/card';

const reviewLogIdSchema = z.string().min(1);
const reviewRatingSchema = z.enum(['again', 'hard', 'good', 'easy']);
const reviewLogSchema = z.object({
  id: reviewLogIdSchema,
  cardId: cardIdSchema,
  reviewedAt: z.number().int().nonnegative(),
  rating: reviewRatingSchema,
  elapsedMilliseconds: z.number().int().nonnegative('Review time cannot be negative.'),
  previousScheduling: schedulingStateSchema,
});

function parseReviewLog(value: unknown): ReviewLog {
  return reviewLogSchema.parse(value);
}

type ReviewLogId = z.output<typeof reviewLogIdSchema>;
type ReviewRating = z.output<typeof reviewRatingSchema>;
type ReviewLog = z.output<typeof reviewLogSchema>;

export { parseReviewLog, reviewLogIdSchema, reviewLogSchema, reviewRatingSchema };
export type { ReviewLog, ReviewLogId, ReviewRating };

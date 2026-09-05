import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod';
import { z } from 'zod/v4';

import { cardPhaseSchema } from '@/features/study/card/card';
import { reviewRatingSchema } from '@/features/study/review/review-log';

import { cards, decks, notes, reviewLogs } from './schema';

const deckSelectSchema = createSelectSchema(decks);
const deckInsertSchema = createInsertSchema(decks, {
  name: (schema) => schema.trim().min(1),
});
const noteSelectSchema = createSelectSchema(notes, {
  fields: z.record(z.string(), z.string()),
  tags: z.array(z.string()),
});
const noteInsertSchema = createInsertSchema(notes, {
  fields: z.record(z.string(), z.string()),
  tags: z.array(z.string()),
});
const cardSelectSchema = createSelectSchema(cards, { phase: cardPhaseSchema });
const cardInsertSchema = createInsertSchema(cards, { phase: cardPhaseSchema });
const reviewLogSelectSchema = createSelectSchema(reviewLogs, { rating: reviewRatingSchema, previousPhase: cardPhaseSchema });
const reviewLogInsertSchema = createInsertSchema(reviewLogs, { rating: reviewRatingSchema, previousPhase: cardPhaseSchema });

export {
  cardInsertSchema,
  cardSelectSchema,
  deckInsertSchema,
  deckSelectSchema,
  noteInsertSchema,
  noteSelectSchema,
  reviewLogInsertSchema,
  reviewLogSelectSchema,
};

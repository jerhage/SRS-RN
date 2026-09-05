import { z } from "zod/v4";

import { deckIdSchema } from "../deck/deck";
import { noteIdSchema } from "../note/note";

const cardIdSchema = z.string().min(1);
const cardPhaseSchema = z.enum(["new", "learning", "review", "relearning"]);
const schedulingStateSchema = z.object({
  phase: cardPhaseSchema,
  dueAt: z.number().int().nonnegative(),
  intervalDays: z.number().int().nonnegative("Interval cannot be negative."),
  easeFactor: z.number().min(1.3, "Ease factor is below its minimum."),
  repetitions: z.number().int().nonnegative("Repetitions cannot be negative."),
  lapses: z.number().int().nonnegative("Lapses cannot be negative."),
});
const cardSchema = z.object({
  id: cardIdSchema,
  noteId: noteIdSchema,
  deckId: deckIdSchema,
  ordinal: z.number().int().nonnegative("Card ordinal cannot be negative."),
  prompt: z.string().trim().min(1, "A card must have a prompt."),
  answer: z.string().trim().min(1, "A card must have an answer."),
  scheduling: schedulingStateSchema,
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
  isSuspended: z.boolean(),
});

function parseSchedulingState(value: unknown): SchedulingState {
  return schedulingStateSchema.parse(value);
}

function parseCard(value: unknown): Card {
  return cardSchema.parse(value);
}

const INITIAL_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;
type CardId = z.output<typeof cardIdSchema>;
type CardPhase = z.output<typeof cardPhaseSchema>;
type SchedulingState = z.output<typeof schedulingStateSchema>;
type Card = z.output<typeof cardSchema>;

export {
  cardIdSchema,
  cardPhaseSchema,
  cardSchema,
  INITIAL_EASE_FACTOR,
  MINIMUM_EASE_FACTOR,
  parseCard,
  parseSchedulingState,
  schedulingStateSchema,
};
export type { Card, CardId, CardPhase, SchedulingState };

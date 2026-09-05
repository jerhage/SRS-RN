import { parseCard, type Card } from '@/features/study/card/card';
import { cardInsertSchema, cardSelectSchema } from '@/infrastructure/database/persistence-schemas';
import { cards } from '@/infrastructure/database/schema';

function toDomainCard(row: unknown): Card {
  const persisted = cardSelectSchema.parse(row);
  return parseCard({
    id: persisted.id,
    noteId: persisted.noteId,
    deckId: persisted.deckId,
    ordinal: persisted.ordinal,
    prompt: persisted.prompt,
    answer: persisted.answer,
    scheduling: {
      phase: persisted.phase,
      dueAt: persisted.dueAt,
      intervalDays: persisted.intervalDays,
      easeFactor: persisted.easeFactor,
      repetitions: persisted.repetitions,
      lapses: persisted.lapses,
    },
    createdAt: persisted.createdAt,
    updatedAt: persisted.updatedAt,
    isSuspended: persisted.isSuspended,
  });
}

function toPersistenceCard(card: Card): typeof cards.$inferInsert {
  const valid = parseCard(card);
  const persisted = cardInsertSchema.parse({
    id: valid.id,
    noteId: valid.noteId,
    deckId: valid.deckId,
    ordinal: valid.ordinal,
    prompt: valid.prompt,
    answer: valid.answer,
    phase: valid.scheduling.phase,
    dueAt: valid.scheduling.dueAt,
    intervalDays: valid.scheduling.intervalDays,
    easeFactor: valid.scheduling.easeFactor,
    repetitions: valid.scheduling.repetitions,
    lapses: valid.scheduling.lapses,
    isSuspended: valid.isSuspended,
    createdAt: valid.createdAt,
    updatedAt: valid.updatedAt,
  });
  return persisted as typeof cards.$inferInsert;
}

export { toDomainCard, toPersistenceCard };

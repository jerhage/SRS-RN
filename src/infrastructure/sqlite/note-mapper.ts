import { parseNote, type Note } from '@/features/study/note/note';
import { noteInsertSchema, noteSelectSchema } from '@/infrastructure/database/persistence-schemas';
import { notes } from '@/infrastructure/database/schema';

function toDomainNote(row: unknown): Note {
  const persisted = noteSelectSchema.parse(row);
  return parseNote({
    id: persisted.id,
    deckId: persisted.deckId,
    fields: persisted.fields,
    tags: new Set(persisted.tags),
    createdAt: persisted.createdAt,
    updatedAt: persisted.updatedAt,
    isArchived: persisted.isArchived,
  });
}

function toPersistenceNote(note: Note): typeof notes.$inferInsert {
  const valid = parseNote(note);
  const persisted = noteInsertSchema.parse({ ...valid, fields: { ...valid.fields }, tags: [...valid.tags] });
  return persisted as typeof notes.$inferInsert;
}

export { toDomainNote, toPersistenceNote };

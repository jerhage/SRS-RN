import { and, asc, eq } from 'drizzle-orm';
import { notes } from '@/infrastructure/database/schema';

import { assertNote, type Note } from '@/features/study/note/note';
import type { NoteRepository } from '@/features/study/note/note-repository';
import type { SqliteDatabase } from './sqlite-database';

class SqliteNoteRepository implements NoteRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async get(id: string): Promise<Note | null> {
    const [row] = await this.db.select().from(notes).where(eq(notes.id, id)).limit(1);
    return row ? toNote(row) : null;
  }

  async getByDeck(deckId: string, options: { includeArchived?: boolean } = {}): Promise<readonly Note[]> {
    const where = options.includeArchived
      ? eq(notes.deckId, deckId)
      : and(eq(notes.deckId, deckId), eq(notes.isArchived, false));
    return (await this.db.select().from(notes).where(where).orderBy(asc(notes.createdAt))).map(toNote);
  }

  async save(note: Note): Promise<void> {
    assertNote(note);
    await this.db.insert(notes).values(toNoteRow(note)).onConflictDoUpdate({ target: notes.id, set: toNoteRow(note) });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(notes).where(eq(notes.id, id));
  }
}

function toNote(row: typeof notes.$inferSelect): Note {
  const note: Note = { ...row, fields: row.fields, tags: new Set(row.tags) };
  assertNote(note);
  return note;
}

function toNoteRow(note: Note): typeof notes.$inferInsert {
  return { ...note, fields: { ...note.fields }, tags: [...note.tags] };
}

export { SqliteNoteRepository };

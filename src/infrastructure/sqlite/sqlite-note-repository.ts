import { and, asc, eq } from 'drizzle-orm';

import type { Note } from '@/features/study/note/note';
import type { NoteRepository } from '@/features/study/note/note-repository';
import { notes } from '@/infrastructure/database/schema';

import { toDomainNote, toPersistenceNote } from './note-mapper';
import type { SqliteDatabase } from './sqlite-database';

class SqliteNoteRepository implements NoteRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async get(id: string): Promise<Note | null> {
    const [row] = await this.db.select().from(notes).where(eq(notes.id, id)).limit(1);
    return row ? toDomainNote(row) : null;
  }

  async getByDeck(deckId: string, options: { includeArchived?: boolean } = {}): Promise<readonly Note[]> {
    const where = options.includeArchived
      ? eq(notes.deckId, deckId)
      : and(eq(notes.deckId, deckId), eq(notes.isArchived, false));
    return (await this.db.select().from(notes).where(where).orderBy(asc(notes.createdAt))).map(toDomainNote);
  }

  async save(note: Note): Promise<void> {
    const row = toPersistenceNote(note);
    await this.db.insert(notes).values(row).onConflictDoUpdate({ target: notes.id, set: row });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(notes).where(eq(notes.id, id));
  }
}

export { SqliteNoteRepository };

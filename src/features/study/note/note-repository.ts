import type { DeckId } from '../deck/deck';
import type { Note, NoteId } from './note';

interface NoteRepository {
  get(id: NoteId): Promise<Note | null>;
  getByDeck(deckId: DeckId, options?: { includeArchived?: boolean }): Promise<readonly Note[]>;
  save(note: Note): Promise<void>;
  delete(id: NoteId): Promise<void>;
}

export type { NoteRepository };

import type { DeckId } from '../deck/deck';
import type { Timestamp } from '../time/timestamp';

type NoteId = string;

/** Editable source material; cards are scheduled prompts derived from notes. */
interface Note {
  readonly id: NoteId;
  readonly deckId: DeckId;
  readonly fields: Readonly<Record<string, string>>;
  readonly tags: ReadonlySet<string>;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
  readonly isArchived: boolean;
}

function assertNote(note: Note): void {
  const fieldNames = Object.keys(note.fields);
  if (fieldNames.length === 0) throw new Error('A note must contain at least one field.');
  if (fieldNames.some((name) => name.trim().length === 0)) throw new Error('Note field names cannot be blank.');
  if ([...note.tags].some((tag) => tag.trim().length === 0)) throw new Error('Tags cannot be blank.');
}

export { assertNote };
export type { Note, NoteId };

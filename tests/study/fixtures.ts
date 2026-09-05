import type { Card } from '@/features/study/card/card';
import type { Deck, DeckId } from '@/features/study/deck/deck';
import type { Note } from '@/features/study/note/note';

function deck(
  id: string,
  name: string,
  options: { parentId?: DeckId; isArchived?: boolean } = {},
): Deck {
  return {
    id,
    name,
    ...(options.parentId === undefined ? {} : { parentId: options.parentId }),
    createdAt: 1_000,
    updatedAt: 2_000,
    isArchived: options.isArchived ?? false,
  };
}

function note(id: string, deckId: DeckId, options: Partial<Pick<Note, 'fields' | 'tags'>> = {}): Note {
  return {
    id,
    deckId,
    fields: options.fields ?? { front: 'Question', back: 'Answer' },
    tags: options.tags ?? new Set(['test', 'basic']),
    createdAt: 1_000,
    updatedAt: 2_000,
    isArchived: false,
  };
}

function card(
  id: string,
  deckId: DeckId,
  noteId: string,
  dueAt: number,
  options: { ordinal?: number; isSuspended?: boolean } = {},
): Card {
  return {
    id,
    noteId,
    deckId,
    ordinal: options.ordinal ?? 0,
    prompt: `Prompt ${id}`,
    answer: `Answer ${id}`,
    scheduling: {
      phase: 'new',
      dueAt,
      intervalDays: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lapses: 0,
    },
    createdAt: 1_000,
    updatedAt: 2_000,
    isSuspended: options.isSuspended ?? false,
  };
}

export { card, deck, note };

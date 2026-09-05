import type { Timestamp } from '../time/timestamp';

type DeckId = string;

/** A user-owned collection of notes and cards. */
interface Deck {
  readonly id: DeckId;
  readonly name: string;
  readonly parentId?: DeckId;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
  readonly isArchived: boolean;
}

function assertDeck(deck: Deck): void {
  if (deck.name.trim().length === 0) throw new Error('A deck must have a name.');
  if (deck.parentId === deck.id) throw new Error('A deck cannot be its own parent.');
}

export { assertDeck };
export type { Deck, DeckId };

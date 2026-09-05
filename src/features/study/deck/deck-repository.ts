import type { Deck, DeckId } from './deck';

/** Product-facing capability for persistent decks. */
interface DeckRepository {
  get(id: DeckId): Promise<Deck | null>;
  getAll(options?: { includeArchived?: boolean }): Promise<readonly Deck[]>;
  save(deck: Deck): Promise<void>;
  delete(id: DeckId): Promise<void>;
}

export type { DeckRepository };

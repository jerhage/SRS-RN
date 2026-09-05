import type { Deck } from "./deck";

/** Lists active persisted decks. */
interface DeckLister {
  getAll(): Promise<readonly Deck[]>;
}

export type { DeckLister };

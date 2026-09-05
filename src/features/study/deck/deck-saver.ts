import type { Deck } from "./deck";

/** Saves a deck to persistent storage. */
interface DeckSaver {
  save(deck: Deck): Promise<void>;
}

export type { DeckSaver };

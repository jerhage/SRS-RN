import type { Deck, DeckId } from "./deck";

/** Finds an individual persisted deck. */
interface DeckFinder {
  get(id: DeckId): Promise<Deck | null>;
}

export type { DeckFinder };

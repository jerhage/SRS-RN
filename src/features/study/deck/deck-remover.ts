import type { DeckId } from "./deck";

/** Removes a persisted deck. */
interface DeckRemover {
  delete(id: DeckId): Promise<void>;
}

export type { DeckRemover };

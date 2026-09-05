import type { Clock } from "../../time/timestamp";
import { parseDeck, type Deck, type DeckId } from "../deck";
import type { DeckFinder } from "../deck-finder";
import type { DeckSaver } from "../deck-saver";

interface ArchiveDeckCapabilities {
  readonly deckFinder: DeckFinder;
  readonly deckSaver: DeckSaver;
  readonly clock: Clock;
}

type ArchiveDeckResult =
  | { readonly type: "success"; readonly deck: Deck }
  | { readonly type: "deckNotFound" }
  | { readonly type: "saveFailed" };

async function archiveDeck(
  id: DeckId,
  { deckFinder, deckSaver, clock }: ArchiveDeckCapabilities,
): Promise<ArchiveDeckResult> {
  try {
    const deck = await deckFinder.get(id);
    if (!deck) return { type: "deckNotFound" };

    const archivedDeck = parseDeck({
      ...deck,
      isArchived: true,
      updatedAt: clock.now(),
    });
    await deckSaver.save(archivedDeck);
    return { type: "success", deck: archivedDeck };
  } catch {
    return { type: "saveFailed" };
  }
}

export { archiveDeck };
export type { ArchiveDeckCapabilities, ArchiveDeckResult };

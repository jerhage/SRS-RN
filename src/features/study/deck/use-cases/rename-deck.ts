import { match } from "ts-pattern";

import type { Clock } from "../../time/timestamp";
import { deckNameSchema, parseDeck, type Deck, type DeckId } from "../deck";
import type { DeckFinder } from "../deck-finder";
import type { DeckSaver } from "../deck-saver";

interface RenameDeckInput {
  readonly id: DeckId;
  readonly name: string;
}

interface RenameDeckCapabilities {
  readonly deckFinder: DeckFinder;
  readonly deckSaver: DeckSaver;
  readonly clock: Clock;
}

type RenameDeckResult =
  | { readonly type: "success"; readonly deck: Deck }
  | { readonly type: "invalidName"; readonly message: string }
  | { readonly type: "deckNotFound" }
  | { readonly type: "saveFailed" };

async function renameDeck(
  input: RenameDeckInput,
  { deckFinder, deckSaver, clock }: RenameDeckCapabilities,
): Promise<RenameDeckResult> {
  const parsedName = deckNameSchema.safeParse(input.name);

  return match(parsedName)
    .with({ success: false }, ({ error }) => ({
      type: "invalidName" as const,
      message: error.issues[0]?.message ?? "Enter a deck name.",
    }))
    .with({ success: true }, async ({ data: name }) => {
      try {
        const deck = await deckFinder.get(input.id);
        if (!deck) return { type: "deckNotFound" as const };

        const renamedDeck = parseDeck({ ...deck, name, updatedAt: clock.now() });
        await deckSaver.save(renamedDeck);
        return { type: "success" as const, deck: renamedDeck };
      } catch {
        return { type: "saveFailed" as const };
      }
    })
    .exhaustive();
}

export { renameDeck };
export type { RenameDeckCapabilities, RenameDeckInput, RenameDeckResult };

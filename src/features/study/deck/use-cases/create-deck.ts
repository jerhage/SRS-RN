import { match } from "ts-pattern";

import type { IdGenerator } from "../../identity/id-generator";
import type { Clock } from "../../time/timestamp";
import { deckNameSchema, parseDeck, type Deck } from "../deck";
import type { DeckSaver } from "../deck-saver";

interface CreateDeckInput {
  readonly name: string;
}

interface CreateDeckCapabilities {
  readonly deckSaver: DeckSaver;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}

type CreateDeckResult =
  | { readonly type: "success"; readonly deck: Deck }
  | { readonly type: "invalidName"; readonly message: string }
  | { readonly type: "saveFailed" };

async function createDeck(
  input: CreateDeckInput,
  { deckSaver, clock, idGenerator }: CreateDeckCapabilities,
): Promise<CreateDeckResult> {
  const parsedName = deckNameSchema.safeParse(input.name);

  return match(parsedName)
    .with({ success: false }, ({ error }) => ({
      type: "invalidName" as const,
      message: error.issues[0]?.message ?? "Enter a deck name.",
    }))
    .with({ success: true }, async ({ data: name }) => {
      const deck = newDeck(name, clock, idGenerator);

      try {
        await deckSaver.save(deck);
        return { type: "success" as const, deck };
      } catch {
        return { type: "saveFailed" as const };
      }
    })
    .exhaustive();
}

function newDeck(name: string, clock: Clock, idGenerator: IdGenerator): Deck {
  const now = clock.now();

  return parseDeck({
    id: idGenerator.generate(),
    name,
    createdAt: now,
    updatedAt: now,
    isArchived: false,
  });
}

export { createDeck };
export type { CreateDeckCapabilities, CreateDeckInput, CreateDeckResult };

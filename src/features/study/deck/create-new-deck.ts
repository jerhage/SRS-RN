import type { IdGenerator } from '../identity/id-generator';
import type { Clock } from '../time/timestamp';
import { assertDeck, type Deck } from './deck';
import type { DeckRepository } from './deck-repository';

function createNewDeck(
  name: string,
  dependencies: { readonly clock: Clock; readonly idGenerator: IdGenerator },
): Deck {
  const now = dependencies.clock.now();
  const deck: Deck = {
    id: dependencies.idGenerator.generate(),
    name,
    createdAt: now,
    updatedAt: now,
    isArchived: false,
  };
  assertDeck(deck);
  return deck;
}

async function createAndSaveDeck(
  name: string,
  dependencies: { readonly decks: DeckRepository; readonly clock: Clock; readonly idGenerator: IdGenerator },
): Promise<Deck> {
  const deck = createNewDeck(name, dependencies);
  await dependencies.decks.save(deck);
  return deck;
}

export { createAndSaveDeck, createNewDeck };

import { parseDeck, type Deck } from '@/features/study/deck/deck';
import { deckInsertSchema, deckSelectSchema } from '@/infrastructure/database/persistence-schemas';
import { decks } from '@/infrastructure/database/schema';

function toDomainDeck(row: unknown): Deck {
  const persisted = deckSelectSchema.parse(row);
  return parseDeck({
    id: persisted.id,
    name: persisted.name,
    ...(persisted.parentId === null ? {} : { parentId: persisted.parentId }),
    createdAt: persisted.createdAt,
    updatedAt: persisted.updatedAt,
    isArchived: persisted.isArchived,
  });
}

function toPersistenceDeck(deck: Deck): typeof decks.$inferInsert {
  const persisted = deckInsertSchema.parse({ ...parseDeck(deck), parentId: deck.parentId ?? null });
  return persisted as typeof decks.$inferInsert;
}

export { toDomainDeck, toPersistenceDeck };

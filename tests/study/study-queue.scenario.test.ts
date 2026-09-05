import { card, deck, note } from './fixtures';
import { createSqliteScenarioStore } from './sqlite-scenario-store';

describe('study queue scenarios', () => {
  it('shows cards from a deck when they are due', async () => {
    const store = createSqliteScenarioStore();
    const languages = deck('languages', 'Languages');
    const spanishBasics = note('spanish-basics', languages.id);
    const dueCard = card('hola', languages.id, spanishBasics.id, 5_000);
    const futureCard = card('adios', languages.id, spanishBasics.id, 15_000, { ordinal: 1 });
    await store.decks.save(languages);
    await store.notes.save(spanishBasics);
    await store.cards.save(dueCard);
    await store.cards.save(futureCard);

    await expect(store.cards.get(dueCard.id)).resolves.toEqual(dueCard);
    await expect(store.cards.getDue(languages.id, 10_000, 10)).resolves.toEqual([dueCard]);
    store.close();
  });

  it('does not show suspended cards in the study queue', async () => {
    const store = createSqliteScenarioStore();
    const science = deck('science', 'Science');
    const atoms = note('atoms', science.id);
    const suspendedCard = card('atom', science.id, atoms.id, 5_000, { isSuspended: true });
    await store.decks.save(science);
    await store.notes.save(atoms);
    await store.cards.save(suspendedCard);

    await expect(store.cards.getDue(science.id, 10_000, 10)).resolves.toEqual([]);
    store.close();
  });
});

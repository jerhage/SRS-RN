import { deck } from './fixtures';
import { createSqliteScenarioStore } from './sqlite-scenario-store';

describe('deck management scenarios', () => {
  it('lets a user create a deck and open it later', async () => {
    const store = createSqliteScenarioStore();
    const languages = deck('languages', 'Languages');

    await store.decks.save(languages);

    await expect(store.decks.get(languages.id)).resolves.toEqual(languages);
    store.close();
  });

  it('lets a user organize a deck beneath a parent deck', async () => {
    const store = createSqliteScenarioStore();
    const parent = deck('languages', 'Languages');
    const child = deck('languages-spanish', 'Spanish', { parentId: parent.id });

    await store.decks.save(parent);
    await store.decks.save(child);

    await expect(store.decks.get(child.id)).resolves.toEqual(child);
    store.close();
  });

  it('hides archived decks from the active deck list', async () => {
    const store = createSqliteScenarioStore();
    const active = deck('active', 'Active');
    const archived = deck('archived', 'Archived', { isArchived: true });
    await store.decks.save(active);
    await store.decks.save(archived);

    await expect(store.decks.getAll()).resolves.toEqual([active]);
    await expect(store.decks.getAll({ includeArchived: true })).resolves.toEqual([active, archived]);
    store.close();
  });

  it('deletes a deck', async () => {
    const store = createSqliteScenarioStore();
    const temporary = deck('temporary', 'Temporary');
    await store.decks.save(temporary);

    await store.decks.delete(temporary.id);

    await expect(store.decks.get(temporary.id)).resolves.toBeNull();
    store.close();
  });
});

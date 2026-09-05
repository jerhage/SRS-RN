import { archiveDeck } from "@/features/study/deck/use-cases/archive-deck";
import { createDeck } from "@/features/study/deck/use-cases/create-deck";
import { deleteDeck } from "@/features/study/deck/use-cases/delete-deck";
import { listDecks } from "@/features/study/deck/use-cases/list-decks";
import { renameDeck } from "@/features/study/deck/use-cases/rename-deck";

import { deck } from "./fixtures";
import { createSqliteScenarioStore } from "./sqlite-scenario-store";

describe("deck management scenarios", () => {
  it("lets a user create a deck and open it later", async () => {
    const store = createSqliteScenarioStore();
    const result = await createDeck(
      { name: "Languages" },
      {
        deckSaver: store.decks,
        clock: { now: () => 1_000 },
        idGenerator: { generate: () => "languages" },
      },
    );
    const languages = { ...deck("languages", "Languages"), updatedAt: 1_000 };

    expect(result).toEqual({ type: "success", deck: languages });
    await expect(store.decks.get(languages.id)).resolves.toEqual(languages);
    store.close();
  });

  it("does not save a deck with an invalid name", async () => {
    const store = createSqliteScenarioStore();

    await expect(
      createDeck(
        { name: " " },
        {
          deckSaver: store.decks,
          clock: { now: () => 1_000 },
          idGenerator: { generate: () => "unused" },
        },
      ),
    ).resolves.toEqual({ type: "invalidName", message: "A deck must have a name." });
    await expect(store.decks.getAll()).resolves.toEqual([]);
    store.close();
  });

  it("lets a user organize a deck beneath a parent deck", async () => {
    const store = createSqliteScenarioStore();
    const parent = deck("languages", "Languages");
    const child = deck("languages-spanish", "Spanish", { parentId: parent.id });

    await store.decks.save(parent);
    await store.decks.save(child);

    await expect(store.decks.get(child.id)).resolves.toEqual(child);
    store.close();
  });

  it("hides archived decks from the active deck list", async () => {
    const store = createSqliteScenarioStore();
    const active = deck("active", "Active");
    const archived = deck("archived", "Archived");
    await store.decks.save(active);
    await store.decks.save(archived);

    await expect(
      archiveDeck(archived.id, {
        deckFinder: store.decks,
        deckSaver: store.decks,
        clock: { now: () => 3_000 },
      }),
    ).resolves.toEqual({
      type: "success",
      deck: { ...archived, isArchived: true, updatedAt: 3_000 },
    });
    await expect(listDecks({ deckLister: store.decks })).resolves.toEqual({
      type: "success",
      decks: [active],
    });
    store.close();
  });

  it("lets a user rename a deck", async () => {
    const store = createSqliteScenarioStore();
    const languages = deck("languages", "Languages");
    await store.decks.save(languages);

    await expect(
      renameDeck(
        { id: languages.id, name: "Language learning" },
        {
          deckFinder: store.decks,
          deckSaver: store.decks,
          clock: { now: () => 3_000 },
        },
      ),
    ).resolves.toEqual({
      type: "success",
      deck: { ...languages, name: "Language learning", updatedAt: 3_000 },
    });
    await expect(store.decks.get(languages.id)).resolves.toEqual({
      ...languages,
      name: "Language learning",
      updatedAt: 3_000,
    });
    store.close();
  });

  it("deletes a deck", async () => {
    const store = createSqliteScenarioStore();
    const temporary = deck("temporary", "Temporary");
    await store.decks.save(temporary);

    await expect(deleteDeck(temporary.id, { deckRemover: store.decks })).resolves.toEqual({
      type: "success",
    });

    await expect(store.decks.get(temporary.id)).resolves.toBeNull();
    store.close();
  });
});

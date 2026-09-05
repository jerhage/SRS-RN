import { deck, note } from "./fixtures";
import { createSqliteScenarioStore } from "./sqlite-scenario-store";

describe("note management scenarios", () => {
  it("creates a note in a deck with fields and tags", async () => {
    const store = createSqliteScenarioStore();
    const languages = deck("languages", "Languages");
    const spanishBasics = note("spanish-basics", languages.id);
    await store.decks.save(languages);

    await store.notes.save(spanishBasics);

    await expect(store.notes.get(spanishBasics.id)).resolves.toEqual(spanishBasics);
    await expect(store.notes.getByDeck(languages.id)).resolves.toEqual([spanishBasics]);
    store.close();
  });

  it("edits a note fields and tags", async () => {
    const store = createSqliteScenarioStore();
    const languages = deck("languages", "Languages");
    const original = note("spanish-basics", languages.id);
    const edited = {
      ...original,
      fields: { front: "Hola", back: "Hello" },
      tags: new Set(["spanish", "greetings"]),
      updatedAt: 3_000,
    };
    await store.decks.save(languages);
    await store.notes.save(original);

    await store.notes.save(edited);

    await expect(store.notes.get(original.id)).resolves.toEqual(edited);
    store.close();
  });

  it("deletes a note from a deck", async () => {
    const store = createSqliteScenarioStore();
    const languages = deck("languages", "Languages");
    const spanishBasics = note("spanish-basics", languages.id);
    await store.decks.save(languages);
    await store.notes.save(spanishBasics);

    await store.notes.delete(spanishBasics.id);

    await expect(store.notes.get(spanishBasics.id)).resolves.toBeNull();
    await expect(store.notes.getByDeck(languages.id)).resolves.toEqual([]);
    store.close();
  });
});

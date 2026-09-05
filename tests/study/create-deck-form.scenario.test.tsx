import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { CreateDeckForm } from "@/features/study/deck/create-deck-form";

import { createSqliteScenarioStore } from "./sqlite-scenario-store";

describe("create deck form", () => {
  it("creates a deck and notifies its parent to refresh", async () => {
    const store = createSqliteScenarioStore();
    const onCreated = jest.fn(async () => {});
    const screen = await render(
      <CreateDeckForm
        clock={{ now: () => 1_000 }}
        decks={store.decks}
        idGenerator={{ generate: () => "spanish" }}
        onCreated={onCreated}
      />,
    );

    await fireEvent.changeText(screen.getByLabelText("Deck name"), "Spanish");
    await fireEvent.press(screen.getByText("Create deck"));

    await waitFor(() => {
      expect(onCreated).toHaveBeenCalledTimes(1);
    });
    expect((await store.decks.getAll()).map((storedDeck) => storedDeck.name)).toEqual(["Spanish"]);

    await screen.unmount();
    store.close();
  });
});

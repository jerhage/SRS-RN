import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { View } from "react-native";

import { DeleteDeckButton } from "@/features/study/deck/delete-deck-button";
import { RenameDeckForm } from "@/features/study/deck/rename-deck-form";

import { deck } from "./fixtures";
import { createSqliteScenarioStore } from "./sqlite-scenario-store";

describe("deck actions", () => {
  it("lets a user rename and then delete a deck", async () => {
    const store = createSqliteScenarioStore();
    const spanish = deck("spanish", "Spanish");
    await store.decks.save(spanish);
    const onRenamed = jest.fn(async () => {});
    const onDeleted = jest.fn(async () => {});
    const screen = await render(
      <View>
        <RenameDeckForm
          clock={{ now: () => 3_000 }}
          deck={spanish}
          deckFinder={store.decks}
          deckSaver={store.decks}
          onRenamed={onRenamed}
        />
        <DeleteDeckButton deckId={spanish.id} deckRemover={store.decks} onDeleted={onDeleted} />
      </View>,
    );

    await fireEvent.changeText(screen.getByLabelText("Deck name for Spanish"), "Spanish verbs");
    await fireEvent.press(screen.getByText("Rename deck"));

    await waitFor(() => {
      expect(onRenamed).toHaveBeenCalledTimes(1);
    });
    await expect(store.decks.get(spanish.id)).resolves.toEqual({
      ...spanish,
      name: "Spanish verbs",
      updatedAt: 3_000,
    });

    await fireEvent.press(screen.getByText("Delete deck"));

    await waitFor(() => {
      expect(onDeleted).toHaveBeenCalledTimes(1);
    });
    await expect(store.decks.get(spanish.id)).resolves.toBeNull();

    await screen.unmount();
    store.close();
  });
});

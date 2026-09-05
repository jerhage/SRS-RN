import { render } from "@testing-library/react-native";
import { Text } from "react-native";

import { DecksData } from "@/features/study/deck/decks-data";

import { deck } from "./fixtures";
import { createSqliteScenarioStore } from "./sqlite-scenario-store";

describe("decks data", () => {
  it("provides loaded decks to its success children", async () => {
    const store = createSqliteScenarioStore();
    await store.decks.save(deck("spanish", "Spanish"));

    const screen = await render(
      <DecksData deckLister={store.decks}>
        {({ decks }) => <Text>{decks.map((loadedDeck) => loadedDeck.name).join(", ")}</Text>}
      </DecksData>,
    );

    expect(await screen.findByText("Spanish")).toBeTruthy();
    await screen.unmount();
    store.close();
  });
});

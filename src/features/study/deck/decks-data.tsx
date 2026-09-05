import { type ReactNode, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { match } from "ts-pattern";

import type { Deck } from "./deck";
import type { DeckLister } from "./deck-lister";
import { listDecks } from "./use-cases/list-decks";

type DecksDataState =
  | { readonly type: "loading" }
  | { readonly type: "error" }
  | { readonly type: "success"; readonly decks: readonly Deck[] };

interface DecksDataProps {
  readonly deckLister: DeckLister;
  readonly children: (data: DecksDataValue) => ReactNode;
}

interface DecksDataValue {
  readonly decks: readonly Deck[];
  readonly refresh: () => Promise<void>;
}

function DecksData({ deckLister, children }: DecksDataProps) {
  const [state, setState] = useState<DecksDataState>({ type: "loading" });

  const load = useCallback(async () => {
    const result = await listDecks({ deckLister });
    match(result)
      .with({ type: "success" }, ({ decks: loadedDecks }) => {
        setState({ type: "success", decks: loadedDecks });
      })
      .with({ type: "listFailed" }, () => {
        setState({ type: "error" });
      })
      .exhaustive();
  }, [deckLister]);

  const refresh = useCallback(async () => {
    setState({ type: "loading" });
    await load();
  }, [load]);

  useEffect(() => {
    void load();
  }, [load]);

  return match(state)
    .with({ type: "loading" }, () => (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    ))
    .with({ type: "error" }, () => (
      <View style={styles.centered}>
        <Text>Could not load decks.</Text>
        <Button onPress={() => void refresh()} title="Try again" />
      </View>
    ))
    .with({ type: "success" }, ({ decks: loadedDecks }) =>
      children({ decks: loadedDecks, refresh }),
    )
    .exhaustive();
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
});

export { DecksData };
export type { DecksDataProps, DecksDataState, DecksDataValue };

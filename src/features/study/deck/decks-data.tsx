import { type ReactNode, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { match } from "ts-pattern";

import type { Deck } from "./deck";
import type { DeckRepository } from "./deck-repository";

type DecksDataState =
  | { readonly type: "loading" }
  | { readonly type: "error" }
  | { readonly type: "data"; readonly decks: readonly Deck[] };

interface DecksDataProps {
  readonly decks: DeckRepository;
  readonly children: (data: DecksDataValue) => ReactNode;
}

interface DecksDataValue {
  readonly decks: readonly Deck[];
  readonly refresh: () => Promise<void>;
}

function DecksData({ decks, children }: DecksDataProps) {
  const [state, setState] = useState<DecksDataState>({ type: "loading" });

  const refresh = useCallback(async () => {
    setState({ type: "loading" });

    try {
      setState({ type: "data", decks: await decks.getAll() });
    } catch {
      setState({ type: "error" });
    }
  }, [decks]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
    .with({ type: "data" }, ({ decks: loadedDecks }) => children({ decks: loadedDecks, refresh }))
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

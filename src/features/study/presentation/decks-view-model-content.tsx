import { Button, StyleSheet, TextInput } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import type { StudyState } from "./study-state";

interface DecksViewModelContentProps {
  readonly state: StudyState;
  readonly onDeckNameChanged: (name: string) => void;
  readonly onCreateDeck: () => Promise<void>;
}

function DecksViewModelContent({ state, onDeckNameChanged, onCreateDeck }: DecksViewModelContentProps) {
  return (
    <>
      <ThemedText type="title" style={styles.title}>Decks</ThemedText>
      <ThemedView type="backgroundElement" style={styles.createDeck}>
        <TextInput
          accessibilityLabel="Deck name"
          editable={!state.isCreatingDeck}
          onChangeText={onDeckNameChanged}
          onSubmitEditing={() => void onCreateDeck()}
          placeholder="New deck name"
          style={styles.deckNameInput}
          value={state.deckName}
        />
        {state.deckNameError ? <ThemedText type="small">{state.deckNameError}</ThemedText> : null}
        <Button disabled={state.isCreatingDeck} onPress={() => void onCreateDeck()} title="Create deck" />
      </ThemedView>
      {state.errorMessage ? <ThemedText type="small">{state.errorMessage}</ThemedText> : null}
      {state.decks.map((deck) => (
        <ThemedView key={deck.id} style={styles.deckRow}>
          <ThemedText>{deck.name}</ThemedText>
        </ThemedView>
      ))}
      {!state.isLoading && state.decks.length === 0 ? <ThemedText>No decks yet.</ThemedText> : null}
    </>
  );
}

const styles = StyleSheet.create({
  title: { alignSelf: "flex-start" },
  createDeck: {
    alignSelf: "stretch",
    borderRadius: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  deckNameInput: {
    borderColor: "#888",
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  deckRow: {
    alignSelf: "stretch",
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
});

export { DecksViewModelContent };
export type { DecksViewModelContentProps };

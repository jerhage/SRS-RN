import { Button, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import { CreateDeckForm } from "../deck/create-deck-form";
import { DeleteDeckButton } from "../deck/delete-deck-button";
import { DecksData } from "../deck/decks-data";
import type { DeckFinder } from "../deck/deck-finder";
import type { DeckLister } from "../deck/deck-lister";
import type { DeckRemover } from "../deck/deck-remover";
import type { DeckSaver } from "../deck/deck-saver";
import { RenameDeckForm } from "../deck/rename-deck-form";
import type { IdGenerator } from "../identity/id-generator";
import type { Clock } from "../time/timestamp";

interface DecksDataContentProps {
  readonly deckFinder: DeckFinder;
  readonly deckLister: DeckLister;
  readonly deckRemover: DeckRemover;
  readonly deckSaver: DeckSaver;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}

function DecksDataContent({
  deckFinder,
  deckLister,
  deckRemover,
  deckSaver,
  clock,
  idGenerator,
}: DecksDataContentProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <ThemedText type="subtitle">DecksData comparison</ThemedText>
      <DecksData decks={deckLister}>
        {({ decks, refresh }) => (
          <>
            <CreateDeckForm
              clock={clock}
              deckSaver={deckSaver}
              idGenerator={idGenerator}
              onCreated={refresh}
            />
            <Button onPress={() => void refresh()} title="Refresh DecksData" />
            {decks.map((deck) => (
              <ThemedView key={deck.id} style={styles.deckRow}>
                <ThemedText>{deck.name}</ThemedText>
                <RenameDeckForm
                  clock={clock}
                  deck={deck}
                  deckFinder={deckFinder}
                  deckSaver={deckSaver}
                  onRenamed={refresh}
                />
                <DeleteDeckButton deckId={deck.id} deckRemover={deckRemover} onDeleted={refresh} />
              </ThemedView>
            ))}
            {decks.length === 0 ? <ThemedText>No decks yet.</ThemedText> : null}
          </>
        )}
      </DecksData>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    borderRadius: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  deckRow: {
    alignSelf: "stretch",
    borderRadius: Spacing.two,
    gap: Spacing.two,
    padding: Spacing.three,
  },
});

export { DecksDataContent };
export type { DecksDataContentProps };

import { useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

import type { DeckRepository } from "../deck/deck-repository";
import type { IdGenerator } from "../identity/id-generator";
import type { Clock } from "../time/timestamp";
import { DecksDataContent } from "./decks-data-content";
import { DecksViewModelContent } from "./decks-view-model-content";
import { useStudyViewModel } from "./use-study-view-model";

interface DecksComparisonScreenProps {
  readonly decks: DeckRepository;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}

function DecksComparisonScreen({ decks, clock, idGenerator }: DecksComparisonScreenProps) {
  const viewModel = useStudyViewModel({ decks, clock, idGenerator });

  useEffect(() => {
    void viewModel.refresh();
  }, [viewModel.refresh]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl onRefresh={() => void viewModel.refresh()} refreshing={viewModel.state.isLoading} />}>
          <DecksViewModelContent
            onCreateDeck={viewModel.createDeck}
            onDeckNameChanged={viewModel.onDeckNameChanged}
            state={viewModel.state}
          />
          <DecksDataContent
            clock={clock}
            deckFinder={decks}
            deckLister={decks}
            deckRemover={decks}
            deckSaver={decks}
            idGenerator={idGenerator}
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: "center" },
  safeArea: {
    alignSelf: "center",
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingBottom: BottomTabInset + Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  content: { alignSelf: "stretch", gap: Spacing.three, paddingVertical: Spacing.two },
});

export { DecksComparisonScreen };
export type { DecksComparisonScreenProps };

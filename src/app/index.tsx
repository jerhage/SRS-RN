import { useEffect } from 'react';
import { Button, RefreshControl, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDependencies } from '@/composition/app-dependencies-provider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useStudyViewModel } from '@/features/study/presentation/use-study-view-model';

function HomeScreen() {
  const { study } = useAppDependencies();
  const { state, createDeck, onDeckNameChanged, refresh } = useStudyViewModel(study);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>Decks</ThemedText>
        <ThemedView type="backgroundElement" style={styles.createDeck}>
          <TextInput
            accessibilityLabel="Deck name"
            editable={!state.isCreatingDeck}
            onChangeText={onDeckNameChanged}
            onSubmitEditing={() => void createDeck()}
            placeholder="New deck name"
            style={styles.deckNameInput}
            value={state.deckName}
          />
          {state.deckNameError ? <ThemedText type="small">{state.deckNameError}</ThemedText> : null}
          <Button disabled={state.isCreatingDeck} onPress={() => void createDeck()} title="Create deck" />
        </ThemedView>
        {state.errorMessage ? <ThemedText type="small">{state.errorMessage}</ThemedText> : null}
        <ScrollView
          contentContainerStyle={styles.deckList}
          refreshControl={<RefreshControl onRefresh={() => void refresh()} refreshing={state.isLoading} />}>
          {state.decks.map((deck) => (
            <ThemedView key={deck.id} style={styles.deckRow}>
              <ThemedText>{deck.name}</ThemedText>
            </ThemedView>
          ))}
          {!state.isLoading && state.decks.length === 0 ? <ThemedText>No decks yet.</ThemedText> : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    alignSelf: 'center',
    flex: 1,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingBottom: BottomTabInset + Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  title: {
    alignSelf: 'flex-start',
  },
  createDeck: {
    alignSelf: 'stretch',
    borderRadius: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.three,
  },
  deckNameInput: {
    borderColor: '#888',
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  deckList: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  deckRow: {
    alignSelf: 'stretch',
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
});

export default HomeScreen;

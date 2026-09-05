import { act, renderHook } from '@testing-library/react-native';

import { useStudyViewModel } from '@/features/study/presentation/use-study-view-model';

import { deck } from './fixtures';
import { createSqliteScenarioStore } from './sqlite-scenario-store';

describe('study view model', () => {
  it('loads active decks into study state', async () => {
    const store = createSqliteScenarioStore();
    const spanish = deck('spanish', 'Spanish');
    await store.decks.save(spanish);
    const { result } = await renderHook(() => useStudyViewModel({
      decks: store.decks,
      clock: { now: () => 1_000 },
      idGenerator: { generate: () => 'new-deck' },
    }));

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.state.decks).toEqual([spanish]);
    expect(result.current.state.isLoading).toBe(false);
    store.close();
  });

  it('creates a named deck and clears the input', async () => {
    const store = createSqliteScenarioStore();
    const { result } = await renderHook(() => useStudyViewModel({
      decks: store.decks,
      clock: { now: () => 1_000 },
      idGenerator: { generate: () => 'spanish' },
    }));

    await act(() => {
      result.current.onDeckNameChanged('Spanish');
    });
    await act(async () => {
      await result.current.createDeck();
    });

    expect(result.current.state.decks.map((storedDeck) => storedDeck.name)).toEqual(['Spanish']);
    expect(result.current.state.deckName).toBe('');
    store.close();
  });

  it('shows a schema validation error for an invalid deck name', async () => {
    const store = createSqliteScenarioStore();
    const { result } = await renderHook(() => useStudyViewModel({
      decks: store.decks,
      clock: { now: () => 1_000 },
      idGenerator: { generate: () => 'unused' },
    }));

    await act(() => {
      result.current.onDeckNameChanged(' ');
    });
    await act(async () => {
      await result.current.createDeck();
    });

    expect(result.current.state.deckNameError).toBe('A deck must have a name.');
    expect(result.current.state.decks).toEqual([]);
    store.close();
  });
});

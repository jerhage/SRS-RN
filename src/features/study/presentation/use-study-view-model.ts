import { useCallback, useState } from "react";

import { createAndSaveDeck } from "../deck/create-new-deck";
import { deckNameSchema } from "../deck/deck";
import type { DeckRepository } from "../deck/deck-repository";
import type { IdGenerator } from "../identity/id-generator";
import type { Clock } from "../time/timestamp";
import { initialStudyState, type StudyState } from "./study-state";

interface StudyViewModelDependencies {
  readonly decks: DeckRepository;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}

function useStudyViewModel(dependencies: StudyViewModelDependencies) {
  const [state, setState] = useState<StudyState>(initialStudyState);

  const onDeckNameChanged = useCallback((deckName: string) => {
    setState((current) => ({ ...current, deckName, deckNameError: null }));
  }, []);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, errorMessage: null }));
    try {
      const decks = await dependencies.decks.getAll();
      setState((current) => ({ ...current, decks, isLoading: false }));
    } catch {
      setState((current) => ({
        ...current,
        isLoading: false,
        errorMessage: "Could not load decks.",
      }));
    }
  }, [dependencies.decks]);

  const createDeck = useCallback(async () => {
    const parsedName = deckNameSchema.safeParse(state.deckName);
    if (!parsedName.success) {
      setState((current) => ({
        ...current,
        deckNameError: parsedName.error.issues[0]?.message ?? "Enter a deck name.",
      }));
      return;
    }

    setState((current) => ({
      ...current,
      isCreatingDeck: true,
      deckNameError: null,
      errorMessage: null,
    }));

    try {
      await createAndSaveDeck(parsedName.data, dependencies);
      const decks = await dependencies.decks.getAll();
      setState((current) => ({ ...current, decks, deckName: "", isCreatingDeck: false }));
    } catch {
      setState((current) => ({
        ...current,
        isCreatingDeck: false,
        errorMessage: "Could not create deck.",
      }));
    }
  }, [dependencies, state.deckName]);

  return { state, onDeckNameChanged, refresh, createDeck };
}

export { useStudyViewModel };
export type { StudyViewModelDependencies };

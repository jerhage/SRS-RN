import { useCallback, useState } from "react";
import { match } from "ts-pattern";

import {
  createDeck,
  type CreateDeckCapabilities,
} from "../deck/use-cases/create-deck";
import type { DeckLister } from "../deck/deck-lister";
import { listDecks } from "../deck/use-cases/list-decks";
import { initialStudyState, type StudyState } from "./study-state";

interface StudyViewModelDependencies extends Omit<CreateDeckCapabilities, "deckSaver"> {
  readonly decks: CreateDeckCapabilities["deckSaver"] & DeckLister;
}

function useStudyViewModel(dependencies: StudyViewModelDependencies) {
  const [state, setState] = useState<StudyState>(initialStudyState);

  const onDeckNameChanged = useCallback((deckName: string) => {
    setState((current) => ({ ...current, deckName, deckNameError: null }));
  }, []);

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, errorMessage: null }));
    const result = await listDecks({ deckLister: dependencies.decks });

    match(result)
      .with({ type: "success" }, ({ decks }) => {
        setState((current) => ({ ...current, decks, isLoading: false }));
      })
      .with({ type: "listFailed" }, () => {
        setState((current) => ({
          ...current,
          isLoading: false,
          errorMessage: "Could not load decks.",
        }));
      })
      .exhaustive();
  }, [dependencies.decks]);

  const handleCreateDeck = useCallback(async () => {
    setState((current) => ({
      ...current,
      isCreatingDeck: true,
      deckNameError: null,
      errorMessage: null,
    }));

    try {
      const result = await createDeck({ name: state.deckName }, {
        deckSaver: dependencies.decks,
        clock: dependencies.clock,
        idGenerator: dependencies.idGenerator,
      });

      return match(result)
        .with({ type: "success" }, async () => {
          const listResult = await listDecks({ deckLister: dependencies.decks });
          match(listResult)
            .with({ type: "success" }, ({ decks }) => {
              setState((current) => ({ ...current, decks, deckName: "", isCreatingDeck: false }));
            })
            .with({ type: "listFailed" }, () => {
              setState((current) => ({
                ...current,
                isCreatingDeck: false,
                errorMessage: "Could not load decks.",
              }));
            })
            .exhaustive();
        })
        .with({ type: "invalidName" }, ({ message }) => {
          setState((current) => ({
            ...current,
            isCreatingDeck: false,
            deckNameError: message,
          }));
        })
        .with({ type: "saveFailed" }, () => {
          setState((current) => ({
            ...current,
            isCreatingDeck: false,
            errorMessage: "Could not create deck.",
          }));
        })
        .exhaustive();
    } catch {
      setState((current) => ({
        ...current,
        isCreatingDeck: false,
        errorMessage: "Could not create deck.",
      }));
    }
  }, [dependencies, state.deckName]);

  return { state, onDeckNameChanged, refresh, createDeck: handleCreateDeck };
}

export { useStudyViewModel };
export type { StudyViewModelDependencies };

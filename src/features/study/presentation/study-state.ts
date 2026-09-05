import type { Deck } from '../deck/deck';

interface StudyState {
  readonly decks: readonly Deck[];
  readonly isLoading: boolean;
  readonly deckName: string;
  readonly isCreatingDeck: boolean;
  readonly deckNameError: string | null;
  readonly errorMessage: string | null;
}

const initialStudyState: StudyState = {
  decks: [],
  isLoading: false,
  deckName: '',
  isCreatingDeck: false,
  deckNameError: null,
  errorMessage: null,
};

export { initialStudyState };
export type { StudyState };

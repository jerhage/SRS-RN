import type { DeckId } from '../deck/deck';
import type { Timestamp } from '../time/timestamp';
import type { Card, CardId } from './card';

interface CardRepository {
  get(id: CardId): Promise<Card | null>;
  getByNote(noteId: string): Promise<readonly Card[]>;
  getDue(deckId: DeckId, at: Timestamp, limit: number): Promise<readonly Card[]>;
  save(card: Card): Promise<void>;
  delete(id: CardId): Promise<void>;
}

export type { CardRepository };

import type { DeckId } from '../deck/deck';
import type { NoteId } from '../note/note';
import type { Timestamp } from '../time/timestamp';

type CardId = string;
type CardPhase = 'new' | 'learning' | 'review' | 'relearning';

interface SchedulingState {
  readonly phase: CardPhase;
  readonly dueAt: Timestamp;
  readonly intervalDays: number;
  readonly easeFactor: number;
  readonly repetitions: number;
  readonly lapses: number;
}

/** A single reviewable prompt. Multiple cards may be produced from one note. */
interface Card {
  readonly id: CardId;
  readonly noteId: NoteId;
  readonly deckId: DeckId;
  readonly ordinal: number;
  readonly prompt: string;
  readonly answer: string;
  readonly scheduling: SchedulingState;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
  readonly isSuspended: boolean;
}

const INITIAL_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;

function assertSchedulingState(scheduling: SchedulingState): void {
  if (scheduling.intervalDays < 0) throw new Error('Interval cannot be negative.');
  if (scheduling.easeFactor < MINIMUM_EASE_FACTOR) throw new Error('Ease factor is below its minimum.');
  if (scheduling.repetitions < 0) throw new Error('Repetitions cannot be negative.');
  if (scheduling.lapses < 0) throw new Error('Lapses cannot be negative.');
}

function assertCard(card: Card): void {
  if (card.ordinal < 0) throw new Error('Card ordinal cannot be negative.');
  if (card.prompt.trim().length === 0) throw new Error('A card must have a prompt.');
  if (card.answer.trim().length === 0) throw new Error('A card must have an answer.');
  assertSchedulingState(card.scheduling);
}

export { assertCard, assertSchedulingState, INITIAL_EASE_FACTOR, MINIMUM_EASE_FACTOR };
export type { Card, CardId, CardPhase, SchedulingState };

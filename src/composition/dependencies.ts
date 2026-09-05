import * as Crypto from "expo-crypto";

import type { CardRepository } from "@/features/study/card/card-repository";
import type { DeckRepository } from "@/features/study/deck/deck-repository";
import type { IdGenerator } from "@/features/study/identity/id-generator";
import type { NoteRepository } from "@/features/study/note/note-repository";
import type { ReviewLogRepository } from "@/features/study/review/review-log-repository";
import type { Clock } from "@/features/study/time/timestamp";
import { openSrsDataStore } from "@/infrastructure/database/open-srs-data-store";

interface StudyDependencies {
  readonly decks: DeckRepository;
  readonly notes: NoteRepository;
  readonly cards: CardRepository;
  readonly reviewLogs: ReviewLogRepository;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}

interface AppDependencies {
  readonly study: StudyDependencies;
}

async function createAppDependencies(): Promise<AppDependencies> {
  const store = await openSrsDataStore();
  return {
    study: {
      decks: store.decks,
      notes: store.notes,
      cards: store.cards,
      reviewLogs: store.reviewLogs,
      clock: { now: () => Date.now() },
      idGenerator: { generate: () => Crypto.randomUUID() },
    },
  };
}

export { createAppDependencies };
export type { AppDependencies, StudyDependencies };

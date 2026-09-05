import type { ReviewLog } from "@/features/study/review/review-log";

import { card, deck, note } from "./fixtures";
import { createSqliteScenarioStore } from "./sqlite-scenario-store";

describe("review history scenarios", () => {
  it("retains the scheduling snapshot from a completed review", async () => {
    const store = createSqliteScenarioStore();
    const languages = deck("languages", "Languages");
    const spanishBasics = note("spanish-basics", languages.id);
    const hola = card("hola", languages.id, spanishBasics.id, 5_000);
    const reviewLog: ReviewLog = {
      id: "review-1",
      cardId: hola.id,
      reviewedAt: 10_000,
      rating: "hard",
      elapsedMilliseconds: 3_200,
      previousScheduling: {
        phase: "review",
        dueAt: 5_000,
        intervalDays: 21,
        easeFactor: 2.35,
        repetitions: 8,
        lapses: 2,
      },
    };
    await store.decks.save(languages);
    await store.notes.save(spanishBasics);
    await store.cards.save(hola);

    await store.reviewLogs.append(reviewLog);

    await expect(store.reviewLogs.getByCard(hola.id)).resolves.toEqual([reviewLog]);
    store.close();
  });
});

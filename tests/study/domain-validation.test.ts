import { parseCard } from "@/features/study/card/card";
import { parseDeck } from "@/features/study/deck/deck";
import { parseNote } from "@/features/study/note/note";
import { parseReviewLog } from "@/features/study/review/review-log";

describe("study domain validation", () => {
  it("rejects a blank deck name and a self-parenting deck", () => {
    expect(() =>
      parseDeck({
        id: "languages",
        name: " ",
        createdAt: 1_000,
        updatedAt: 2_000,
        isArchived: false,
      }),
    ).toThrow();
    expect(() =>
      parseDeck({
        id: "languages",
        name: "Languages",
        parentId: "languages",
        createdAt: 1_000,
        updatedAt: 2_000,
        isArchived: false,
      }),
    ).toThrow();
  });

  it("rejects notes without fields or with blank tags", () => {
    expect(() =>
      parseNote({
        id: "spanish-basics",
        deckId: "languages",
        fields: {},
        tags: new Set(["spanish"]),
        createdAt: 1_000,
        updatedAt: 2_000,
        isArchived: false,
      }),
    ).toThrow();
    expect(() =>
      parseNote({
        id: "spanish-basics",
        deckId: "languages",
        fields: { front: "Hola" },
        tags: new Set([""]),
        createdAt: 1_000,
        updatedAt: 2_000,
        isArchived: false,
      }),
    ).toThrow();
  });

  it("rejects invalid scheduling and review values", () => {
    expect(() =>
      parseCard({
        id: "hola",
        noteId: "spanish-basics",
        deckId: "languages",
        ordinal: 0,
        prompt: "Hola",
        answer: "Hello",
        scheduling: {
          phase: "review",
          dueAt: 1_000,
          intervalDays: -1,
          easeFactor: 2.5,
          repetitions: 0,
          lapses: 0,
        },
        createdAt: 1_000,
        updatedAt: 1_000,
        isSuspended: false,
      }),
    ).toThrow();
    expect(() =>
      parseReviewLog({
        id: "review-1",
        cardId: "hola",
        reviewedAt: 2_000,
        rating: "good",
        elapsedMilliseconds: -1,
        previousScheduling: {
          phase: "review",
          dueAt: 1_000,
          intervalDays: 1,
          easeFactor: 2.5,
          repetitions: 1,
          lapses: 0,
        },
      }),
    ).toThrow();
  });
});
